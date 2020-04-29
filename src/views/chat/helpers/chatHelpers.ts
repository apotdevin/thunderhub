const formatMessage = (message: string, type: string): [string, number] => {
  const newMessage = message.replace(type, '').trim();
  const split = newMessage.split(' ').filter(t => t);

  let amount = 0;

  if (split.length > 0) {
    amount = Number(split[0]);
  } else {
    return ['', 0];
  }

  if (isNaN(amount)) {
    return ['', 0];
  }

  return [newMessage.replace(`${amount}`, '').trim(), amount];
};

export const handleMessage = (
  message: string
): [string, string, number, boolean] => {
  if (message.indexOf('/pay') === 0) {
    const [finalMessage, amount] = formatMessage(message, '/pay');

    if (finalMessage === '' && amount === 0) {
      return ['', '', 0, false];
    }

    return [finalMessage || 'payment', 'payment', amount, true];
  }
  if (message.indexOf('/request') === 0) {
    const [finalMessage, amount] = formatMessage(message, '/request');

    if (finalMessage === '' && amount === 0) {
      return ['', '', 0, false];
    }
    return [finalMessage || 'paymentrequest', 'paymentrequest', amount, true];
  }
  return [message, '', 0, true];
};
