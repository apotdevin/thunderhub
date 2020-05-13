export const getHodlParams = (params: any): string => {
  let paramString = '?';

  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const element = params[key];

      for (const subKey in element) {
        if (Object.prototype.hasOwnProperty.call(element, subKey)) {
          const subElement = element[subKey];
          paramString = `${paramString}&${key}[${subKey}]=${subElement}`;
        }
      }
    }
  }

  return paramString;
};
