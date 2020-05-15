export const getUrlParam = (params: string | string[] | undefined): string => {
  if (!params) {
    return null;
  }
  const typeOfQuery = typeof params;
  if (typeOfQuery === 'string') {
    return params as string;
  }
  if (typeOfQuery === 'object') {
    return params[0];
  }
};
