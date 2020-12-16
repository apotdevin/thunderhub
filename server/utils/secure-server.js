/* eslint-disable */
const { createServer: createSecureServer } = require('https');
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { existsSync, readFileSync, writeFile, mkdirSync } = require('fs');
const express = require('express');
const qs = require('qs');
const forge = require('node-forge');
const dev = process.env.NODE_ENV !== 'production';
if (dev) {
  throw new Error('Running a secure server can only be done in production');
}
const app = next({ dev });
const publicUrl = app.nextConfig.serverRuntimeConfig.publicUrl;
const sslPort = app.nextConfig.serverRuntimeConfig.sslPort || 80;
const sslSave = app.nextConfig.serverRuntimeConfig.sslSave;
const logLevel = app.nextConfig.serverRuntimeConfig.logLevel;
const apiUrl = 'https://api.zerossl.com';
const handle = app.getRequestHandler();

const requestAttempts = 20;

runServer();

async function runServer() {
  var certData = await getCertificate(publicUrl, sslPort, sslSave);
  var credentials = {
    key: certData?.privateKey.toString(),
    ca: certData?.caBundle,
    cert: certData?.certificate,
  };
  runRedirectServer();
  app.prepare().then(() => {
    createSecureServer(credentials, (req, res) => {
      const parsedUrl = parse(req.url, true);
      if (parsedUrl.path == '/health') {
        res.writeHead(200, {
          'Content-Type': 'application/json',
        });
        res.write('{"status":"ok"}');
        res.end();
      } else {
        if (
          logLevel !== 'info' &&
          logLevel !== 'warn' &&
          logLevel !== 'error'
        ) {
          console.log(`${req.method} ${parsedUrl.path}`);
        }
        handle(req, res, parsedUrl);
      }
    }).listen(3000, err => {
      if (err) throw err;
      console.log('ready - started server on http://localhost:3000');
    });
  });
}

async function runRedirectServer() {
  app.prepare().then(() => {
    createServer((req, res) => {
      res.writeHead(301, {
        Location: 'https://' + req.headers['host'].replace(80, 3000) + req.url,
      });
      res.end();
    }).listen(sslPort, err => {
      if (err) throw err;
      console.log(
        `ready - started redirect server on http://localhost:${sslPort}`
      );
    });
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateCsr(keys, endpoint) {
  var csr = forge.pki.createCertificationRequest();
  csr.publicKey = keys.publicKey;
  csr.setSubject([
    {
      name: 'commonName',
      value: endpoint,
    },
  ]);
  csr.sign(keys.privateKey);
  if (!csr.verify()) {
    throw new Error('=> [ssl] Verification of CSR failed.');
  }
  csr = forge.pki.certificationRequestToPem(csr);
  return csr.trim();
}

async function requestCert(endpoint, csr, apiKey) {
  let res = await fetch(`${apiUrl}/certificates?access_key=${apiKey}`, {
    method: 'post',
    body: qs.stringify({
      certificate_domains: endpoint,
      certificate_validity_days: '90',
      certificate_csr: csr,
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  });
  const json = await res.json();
  if (json.success === false) {
    console.log(json);
    throw new Error('=> [ssl] Failed to provision ssl certificate');
  }
  return json;
}

async function validateCert(port, data, endpoint, apiKey) {
  const app = express();
  var validationObject = data.validation.other_methods[endpoint];
  var replacement = new RegExp(`http://${endpoint}`, 'g');
  var path = validationObject.file_validation_url_http.replace(replacement, '');
  await app.get(path, (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send(validationObject.file_validation_content.join('\n'));
  });
  let server = await app.listen(port, () => {
    console.log(`=> [ssl] validation server started at http://0.0.0.0:${port}`);
  });
  await requestValidation(data.id, apiKey);
  console.log('=> [ssl] waiting for certificate to be issued');

  var checking = requestAttempts;
  while (checking > 0) {
    let certData = await getCert(data.id, apiKey);
    if (certData.status === 'issued') {
      console.log('=> [ssl] certificate was issued');
      checking = 0;
    }
    checking -= 1;
    console.log('=> [ssl] checking certificate again...');
    await sleep(2000);
  }
  await server.close(() => {
    console.log('=> [ssl] validation server stopped.');
  });
  return;
}

async function requestValidation(id, apiKey) {
  let res = await fetch(
    `${apiUrl}/certificates/${id}/challenges?access_key=${apiKey}`,
    {
      method: 'post',
      body: qs.stringify({
        validation_method: 'HTTP_CSR_HASH',
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    }
  );
  const json = await res.json();
  if (json.success === false) {
    console.log('=> [ssl] Failed to request certificate validation');
    console.log(json);
    throw new Error('=> [ssl] Failing to provision ssl certificate');
  }
  return json;
}

async function getCert(id, apiKey) {
  let res = await fetch(`${apiUrl}/certificates/${id}?access_key=${apiKey}`, {
    method: 'get',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  });
  return await res.json();
}

async function downloadCert(id, apiKey) {
  let res = await fetch(
    `${apiUrl}/certificates/${id}/download/return?access_key=${apiKey}`,
    {
      method: 'get',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return await res.json();
}

async function getCertificate(endpoint, port, save_ssl) {
  if (
    existsSync(__dirname + '/zerossl/tls.cert') &&
    existsSync(__dirname + '/zerossl/tls.key')
  ) {
    var certificate = readFileSync(
      __dirname + '/zerossl/tls.cert',
      'utf-8'
    ).toString();
    var caBundle = readFileSync(
      __dirname + '/zerossl/ca.cert',
      'utf-8'
    ).toString();
    var privateKey = readFileSync(
      __dirname + '/zerossl/tls.key',
      'utf-8'
    ).toString();
    return {
      privateKey: privateKey,
      certificate: certificate,
      caBundle: caBundle,
    };
  }
  var apiKey = process.env.ZEROSSL_API_KEY;
  if (!apiKey) {
    throw new Error('=> [ssl] ZEROSSL_API_KEY is not set');
  }
  var keys = forge.pki.rsa.generateKeyPair(2048);
  var csr = generateCsr(keys, endpoint);
  console.log('=> [ssl] Generated CSR');
  var res = await requestCert(endpoint, csr, apiKey);
  console.log('=> [ssl] Requested certificate');
  await validateCert(port, res, endpoint, apiKey);
  var certData = await downloadCert(res.id, apiKey);
  if (save_ssl === true) {
    if (!existsSync(__dirname + '/zerossl')) {
      await mkdirSync(__dirname + '/zerossl');
    }
    await writeFile(
      __dirname + '/zerossl/tls.cert',
      certData['certificate.crt'],
      function (err) {
        if (err) {
          return console.log(err);
        }
        console.log('=> [ssl] wrote tls certificate');
      }
    );
    await writeFile(
      __dirname + '/zerossl/ca.cert',
      certData['ca_bundle.crt'],
      function (err) {
        if (err) {
          return console.log(err);
        }
        console.log('=> [ssl] wrote tls ca bundle');
      }
    );
    await writeFile(
      __dirname + '/zerossl/tls.key',
      forge.pki.privateKeyToPem(keys.privateKey),
      function (err) {
        if (err) {
          return console.log(err);
        }
        console.log('=> [ssl] wrote tls key');
      }
    );
  }
  return {
    privateKey: forge.pki.privateKeyToPem(keys.privateKey),
    certificate: certData['certificate.crt'],
    caBundle: certData['ca_bundle.crt'],
  };
}
