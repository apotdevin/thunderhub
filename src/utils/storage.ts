export const getStorageSaved = (): { index: number; name: string }[] => {
    let savedSpaces = [];
    for (let i = 1; i < 11; i++) {
        const name = localStorage.getItem(`auth${i}-name`);
        if (name) {
            savedSpaces.push({ index: i, name });
        }
    }
    return savedSpaces;
};

export const getNextAvailable = (): number => {
    let available = 0;
    let counter = 1;
    while (available === 0 && counter < 11) {
        const element = localStorage.getItem(`auth${counter}-name`);
        if (!element) {
            available = counter;
        } else {
            counter++;
        }
    }
    return available;
};

export const getAvailable = (): number => {
    let available = 0;
    let counter = 1;
    while (available === 0 && counter < 11) {
        const element = localStorage.getItem(`auth${counter}-name`);
        if (element) {
            available = counter;
        } else {
            counter++;
        }
    }
    return available;
};

export const deleteStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
};
