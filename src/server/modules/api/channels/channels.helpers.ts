export const getChannelAge = (id: string, currentHeight: number): number => {
  const info = getChannelIdInfo(id);
  if (!info) return 0;
  return currentHeight - info.blockHeight;
};

export const getChannelIdInfo = (
  id: string
): { blockHeight: number; transaction: number; output: number } | null => {
  const format = /^\d*x\d*x\d*$/;

  if (!format.test(id)) return null;

  const separate = id.split('x');

  return {
    blockHeight: Number(separate[0]),
    transaction: Number(separate[1]),
    output: Number(separate[2]),
  };
};
