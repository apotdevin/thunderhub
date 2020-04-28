const MESSAGE_TYPE = '34349334';
const SIGNATURE_TYPE = '34349337';
const SENDER_TYPE = '34349339';
const ALIAS_TYPE = '34349340';
const CONTENT_TYPE = '34349345';
const REQUEST_TYPE = '34349347';
const KEYSEND_TYPE = '5482373484';

const bufferHexToUtf = (value: string) =>
  Buffer.from(value, 'hex').toString('utf8');

const bufferUtfToHex = (value: string) =>
  Buffer.from(value, 'utf8').toString('hex');

interface CreateCustomRecordsProps {
  message: string;
  sender: string;
  alias: string;
  contentType: string;
  requestType: string;
  secret: string;
  signature: string;
}

interface CustomRecordsProps {
  type: string;
  value: string;
}

export const createCustomRecords = ({
  message,
  sender,
  alias,
  contentType,
  requestType,
  secret,
  signature,
}: CreateCustomRecordsProps): CustomRecordsProps[] => {
  return [
    {
      type: KEYSEND_TYPE,
      value: secret,
    },
    {
      type: MESSAGE_TYPE,
      value: bufferUtfToHex(message),
    },
    {
      type: SENDER_TYPE,
      value: sender,
    },
    {
      type: ALIAS_TYPE,
      value: bufferUtfToHex(alias),
    },
    {
      type: CONTENT_TYPE,
      value: bufferUtfToHex(contentType),
    },
    {
      type: REQUEST_TYPE,
      value: bufferUtfToHex(requestType),
    },
    {
      type: SIGNATURE_TYPE,
      value: bufferUtfToHex(signature),
    },
  ];
};

export const decodeMessage = ({
  type,
  value,
}): { [key: string]: string } | {} => {
  switch (type) {
    case MESSAGE_TYPE:
      return { message: bufferHexToUtf(value) };
    case SIGNATURE_TYPE:
      return { signature: bufferHexToUtf(value) };
    case SENDER_TYPE:
      return { sender: value };
    case ALIAS_TYPE:
      return { alias: bufferHexToUtf(value) };
    case CONTENT_TYPE:
      return { contentType: bufferHexToUtf(value) };
    case REQUEST_TYPE:
      return { requestType: bufferHexToUtf(value) };
    // case KEYSEND_TYPE:
    //   return Buffer.from(value, 'hex').toString('utf8');
    default:
      return {};
  }
};
