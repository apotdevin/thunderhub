const fs = require('fs');
const path = require('path');

const targetDir = process.argv[2];

if (!targetDir) {
  console.log('Please provide a directory path.');
  process.exit(1);
}

/**
 * Give a file path, replace all {{REACT_APP_ENV}} in its contents with
 * their actual environment variable value.
 */
function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const envVariableRegex = /\{\{REACT_APP_([^}]+)\}\}/g;
  const matches = content.match(envVariableRegex);

  if (!matches) {
    return;
  }

  let replacedContent = content;
  matches.forEach((match) => {
    // Trim off {{ and }} from match
    const variableName = match.slice(2, -2);
    const envValue = process.env[variableName] || '';
    replacedContent = replacedContent.replace(match, envValue);
  });

  fs.writeFileSync(filePath, replacedContent, 'utf8');
}

function processDirectory(directoryPath) {
  const files = fs.readdirSync(directoryPath);

  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      processDirectory(filePath);
    } else {
      processFile(filePath);
    }
  });
}

try {
  processDirectory(targetDir);
  console.log('Environment variables replaced successfully.');
} catch (error) {
  console.error(
    'An error occurred while replacing environment variables:',
    error
  );
  process.exit(1);
}
