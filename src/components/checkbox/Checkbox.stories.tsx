import React, { useState } from 'react';
import { Checkbox } from './Checkbox';

export default {
    title: 'Checkbox',
};

export const Default = () => {
    const [checked, set] = useState<boolean>(false);

    return (
        <Checkbox checked={checked} onChange={set}>
            This is a checkbox
        </Checkbox>
    );
};
