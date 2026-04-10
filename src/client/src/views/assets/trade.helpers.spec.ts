import { atomicToDisplay, displayAssetToSats } from './trade.helpers';

describe('atomicToDisplay', () => {
  it('returns atomic value unchanged when precision is 0', () => {
    expect(atomicToDisplay('1000', 0)).toBe('1000');
  });

  it('converts atomic units to display with correct decimal places', () => {
    expect(atomicToDisplay('100000000', 8)).toBe('1.00000000');
  });

  it('handles values that would lose precision with Number()', () => {
    // 2^53 + 1 cannot be represented exactly as a JS number
    const large = (BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1)).toString();
    const result = atomicToDisplay(large, 8);
    expect(result).toBe('90071992.54740992');
  });

  it('pads trailing zeros to match precision', () => {
    expect(atomicToDisplay('500000', 8)).toBe('0.00500000');
  });

  it('handles zero', () => {
    expect(atomicToDisplay('0', 8)).toBe('0.00000000');
  });
});

describe('displayAssetToSats', () => {
  it('returns 0 when rate is empty', () => {
    expect(displayAssetToSats('100', '', 8)).toBe('0');
  });

  it('returns 0 when rate is zero', () => {
    expect(displayAssetToSats('100', '0', 8)).toBe('0');
  });

  it('converts display units to sats correctly', () => {
    // 1 display unit at rate 100_000_000 atomic/BTC, precision 8
    // 1 * 10^8 * 10^8 / 10^8 = 10^8 sats = 1 BTC
    expect(displayAssetToSats('1', '100000000', 8)).toBe('100000000');
  });

  it('truncates sub-sat remainder via integer division', () => {
    // rate = 3 * 10^8 atomic/BTC, 1 display unit
    // 1 * 10^8 * 10^8 / (3 * 10^8) = 10^8 / 3 = 33_333_333.33... → 33_333_333
    expect(displayAssetToSats('1', '300000000', 8)).toBe('33333333');
  });
});
