export const saveAccounts = (accounts: any[]) => {
    localStorage.setItem('accounts', JSON.stringify(accounts));
};

export const deleteAccountPermissions = (
    name: string,
    accounts: any[],
    admin?: boolean,
): void => {
    const changedAccounts = [...accounts];
    changedAccounts.find((account, index) => {
        if (account.name === name) {
            if (admin) {
                changedAccounts[index] = { ...account, viewOnly: '' };
            } else {
                changedAccounts[index] = { ...account, admin: '' };
            }
            return true;
        }
        return false;
    });
    saveAccounts(changedAccounts);
};

export const deleteStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
};
