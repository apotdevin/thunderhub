export const getHodlParams = (params: any): string => {
    let paramString = '?';

    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            const element = params[key];

            for (const subKey in element) {
                if (element.hasOwnProperty(subKey)) {
                    const subElement = element[subKey];
                    paramString = `${paramString}&${key}[${subKey}]=${subElement}`;
                }
            }
        }
    }

    return paramString;
};
