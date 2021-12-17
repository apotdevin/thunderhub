import { handleMessage } from './chatHelpers';

describe('handleMessage function', () => {
  describe('should handle payment', () => {
    test('/pay', () => {
      const testMessage = '/pay';
      const [message, type, amount, canSend] = handleMessage(testMessage);

      expect(canSend).toBeFalsy();
      expect(message).toBe('');
      expect(type).toBe('');
      expect(amount).toBe(0);
    });

    test('/pay 532', () => {
      const testMessage = '/pay 532';
      const [message, type, amount, canSend] = handleMessage(testMessage);

      expect(canSend).toBeTruthy();
      expect(message).toBe('payment');
      expect(type).toBe('payment');
      expect(amount).toBe(532);
    });

    test('/pay500', () => {
      const testMessage = '/pay500';
      const [message, type, amount, canSend] = handleMessage(testMessage);

      expect(canSend).toBeTruthy();
      expect(message).toBe('payment');
      expect(type).toBe('payment');
      expect(amount).toBe(500);
    });

    test('/pay 123 A small donation for you!', () => {
      const testMessage = '/pay 123 A small donation for you!';
      const [message, type, amount, canSend] = handleMessage(testMessage);

      expect(canSend).toBeTruthy();
      expect(message).toBe('A small donation for you!');
      expect(type).toBe('payment');
      expect(amount).toBe(123);
    });

    test('/pay 12$3 hi!', () => {
      const testMessage = '/pay 12$3 hi!';
      const [message, type, amount, canSend] = handleMessage(testMessage);

      expect(canSend).toBeFalsy();
      expect(message).toBe('');
      expect(type).toBe('');
      expect(amount).toBe(0);
    });
  });

  describe('should handle payment requests', () => {
    test('/request', () => {
      const testMessage = '/request';
      const [message, type, amount, canSend] = handleMessage(testMessage);

      expect(canSend).toBeFalsy();
      expect(message).toBe('');
      expect(type).toBe('');
      expect(amount).toBe(0);
    });

    test('/request 1450', () => {
      const testMessage = '/request 1450';
      const [message, type, amount, canSend] = handleMessage(testMessage);

      expect(canSend).toBeTruthy();
      expect(message).toBe('paymentrequest');
      expect(type).toBe('paymentrequest');
      expect(amount).toBe(1450);
    });

    test('/request834', () => {
      const testMessage = '/request834';
      const [message, type, amount, canSend] = handleMessage(testMessage);

      expect(canSend).toBeTruthy();
      expect(message).toBe('paymentrequest');
      expect(type).toBe('paymentrequest');
      expect(amount).toBe(834);
    });

    test('/request 4567 For the Beers!🍻', () => {
      const testMessage = '/request 4567 For the Beers!🍻';
      const [message, type, amount, canSend] = handleMessage(testMessage);

      expect(canSend).toBeTruthy();
      expect(message).toBe('For the Beers!🍻');
      expect(type).toBe('paymentrequest');
      expect(amount).toBe(4567);
    });

    test('/request 45.67 For the Beers!🍻', () => {
      const testMessage = '/pay 12$3 hi!';
      const [message, type, amount, canSend] = handleMessage(testMessage);

      expect(canSend).toBeFalsy();
      expect(message).toBe('');
      expect(type).toBe('');
      expect(amount).toBe(0);
    });
  });
  describe('should handle normal messages', () => {
    test('Hey! Hows it going Mr. ThunderHub?', () => {
      const testMessage = 'Hey! Hows it going Mr. ThunderHub?';
      const [message, type, amount, canSend] = handleMessage(testMessage);

      expect(canSend).toBeTruthy();
      expect(message).toBe('Hey! Hows it going Mr. ThunderHub?');
      expect(type).toBe('');
      expect(amount).toBe(0);
    });
  });
});
