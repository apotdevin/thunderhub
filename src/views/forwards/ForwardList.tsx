import React, { useState } from 'react';
import {
    SubTitle,
    Card,
    CardWithTitle,
    CardTitle,
    ColorButton,
    SingleLine,
} from '../../components/generic/Styled';
import { useAccount } from '../../context/AccountContext';
import { getAuthString } from '../../utils/auth';
import { GET_FORWARDS } from '../../graphql/query';
import { useQuery } from '@apollo/react-hooks';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';
import { LoadingCard } from '../../components/loading/LoadingCard';
import { ForwardCard } from './ForwardsCard';
import { textColorMap } from '../../styles/Themes';
import { useSettings } from '../../context/SettingsContext';

export const ForwardsList = () => {
    const [time, setTime] = useState('week');
    const [indexOpen, setIndexOpen] = useState(0);

    const { theme } = useSettings();
    const { host, read, cert, sessionAdmin } = useAccount();
    const auth = getAuthString(host, read !== '' ? read : sessionAdmin, cert);

    const { loading, data } = useQuery(GET_FORWARDS, {
        variables: { auth, time },
        onError: error => toast.error(getErrorContent(error)),
    });

    if (loading || !data || !data.getForwards) {
        return <LoadingCard title={'Forwards'} />;
    }

    const renderButton = (selectedTime: string, title: string) => (
        <ColorButton
            color={textColorMap[theme]}
            onClick={() => setTime(selectedTime)}
            selected={time === selectedTime}
        >
            {title}
        </ColorButton>
    );

    return (
        <CardWithTitle>
            <CardTitle>
                <SubTitle>Forwards</SubTitle>
                <SingleLine>
                    {renderButton('day', 'D')}
                    {renderButton('week', '1W')}
                    {renderButton('month', '1M')}
                    {renderButton('threeMonths', '3M')}
                </SingleLine>
            </CardTitle>
            <Card>
                {data.getForwards.forwards.map(
                    (forward: any, index: number) => (
                        <ForwardCard
                            forward={forward}
                            key={index}
                            index={index + 1}
                            setIndexOpen={setIndexOpen}
                            indexOpen={indexOpen}
                        />
                    ),
                )}
            </Card>
        </CardWithTitle>
    );
};
