// djb2a hash → hue angle, following the spirit of XEP-0392
function stringToHue(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (((hash << 5) + hash) ^ input.charCodeAt(i)) >>> 0;
  }
  return hash % 360;
}

export function colorFromString(input: string): string {
  const hue = stringToHue(input);
  return `hsl(${hue}, 70%, 55%)`;
}
