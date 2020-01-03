interface AdminSwitchProps {
    children: any;
}

export const AdminSwitch = ({ children }: AdminSwitchProps) => {
    const currentAuth = localStorage.getItem('account') || 'auth1';
    const adminMacaroon = localStorage.getItem(`${currentAuth}-admin`) || '';
    const sessionAdmin = sessionStorage.getItem('session') || '';

    if (!adminMacaroon && !sessionAdmin) {
        return null;
    }

    return children;
};
