export const getVersion = (
  version: string
): {
  mayor: number;
  minor: number;
  revision: number;
  version: string;
  versionWithPatch: string;
} => {
  const versionNumber = version.split(' ');
  const onlyVersion = versionNumber[0].split('-');
  const numbers = onlyVersion[0].split('.');

  return {
    mayor: Number(numbers[0]) || 0,
    minor: Number(numbers[1]) || 0,
    revision: Number(numbers[2]) || 0,
    version: onlyVersion[0] || '',
    versionWithPatch: versionNumber[0] || '',
  };
};
