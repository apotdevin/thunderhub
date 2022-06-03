export const to = async <T>(promise: Promise<T>) => {
  return promise
    .then(data => data)
    .catch(err => {
      throw new Error(getErrorMsg(err));
    });
};

export const getErrorMsg = (error: any[] | string): string => {
  if (!error) return 'Unknown Error';
  if (typeof error === 'string') return error;

  if (error[2]) {
    const errorTitle = error[1] || '';
    const errorObject = error[2]?.err;

    let errorString = '';
    if (typeof errorObject === 'string') {
      errorString = `${errorTitle}. ${errorObject}`;
    } else {
      errorString = `${errorTitle}. ${errorObject?.details || ''}`;
    }

    return errorString;
  }

  if (error[1] && typeof error[1] === 'string') {
    return error[1];
  }

  console.log('Unknown Error:', error);
  return 'Unknown Error';
};
