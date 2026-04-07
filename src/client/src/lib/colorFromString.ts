export function colorFromString(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) hash = (hash * 33) ^ str.charCodeAt(i);
  return `hsl(${Math.abs(hash) % 360}, 65%, 55%)`;
}
