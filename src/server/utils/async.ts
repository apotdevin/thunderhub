export const to = async <T>(promise: Promise<T>) => {
  return promise
    .then(data => data)
    .catch(err => {
      throw new Error(err);
    });
};

/*
 * This is hard/impossible to type correctly. What we are describing
 * here is a set of two states: either we have a result and no error,
 * _or_ we have no result and an error. Unfortunately TypeScript is
 * not able to infer this correctly...
 * https://github.com/microsoft/TypeScript/issues/12184
 */
export const toWithError = async <T>(promise: Promise<T>) => {
  return promise
    .then(data => [data, undefined] as const)
    .catch(err => [undefined, err] as const);
};
