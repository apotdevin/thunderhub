export const shorten = (text: string): string => {
  if (!text) return '';
  const amount = 6;
  const beginning = text.slice(0, amount);
  const end = text.slice(text.length - amount);

  return `${beginning}...${end}`;
};

export const reversedBytes = hex =>
  Buffer.from(hex, 'hex').reverse().toString('hex');
