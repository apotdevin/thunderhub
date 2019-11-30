export const getStorageSaved = (): { index: number; name: string }[] => {
    let savedSpaces = [];
    for (let i = 1; i < 11; i++) {
        const element = localStorage.getItem(`auth${i}`);
        if (element) {
            const url = new URL(element);
            const name = url.searchParams.get('name') || 'NoName';
            savedSpaces.push({ index: i, name });
        }
    }
    return savedSpaces;
};

export const getNextAvailable = (): number => {
    let available = 0;
    let counter = 1;
    while (available === 0 && counter < 11) {
        const element = localStorage.getItem(`auth${counter}`);
        if (!element) {
            available = counter;
        } else {
            counter++;
        }
    }
    return available;
};
