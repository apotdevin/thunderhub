import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { CHANNEL_FEES } from '../../graphql/query';
import {
    Card,
    CardWithTitle,
    SubTitle,
    SingleLine,
    Sub4Title,
    Separation,
    ColorButton,
    DarkSubTitle,
    Input,
} from '../../components/generic/Styled';
import { useAccount } from '../../context/AccountContext';
import { getAuthString } from '../../utils/auth';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';
import { LoadingCard } from '../../components/loading/LoadingCard';
import { FeeCard } from './FeeCard';
import { UPDATE_FEES } from '../../graphql/mutation';
import { XSvg, ChevronRight } from '../../components/generic/Icons';
import styled from 'styled-components';
import { SecureButton } from '../../components/secureButton/SecureButton';
import { AdminSwitch } from '../../components/adminSwitch/AdminSwitch';
import { textColorMap } from '../../styles/Themes';
import { useSettings } from '../../context/SettingsContext';

const SmallInput = styled(Input)`
    max-width: 150px;
`;

export const FeesView = () => {
    const [indexOpen, setIndexOpen] = useState(0);
    const [isEdit, setIsEdit] = useState(false);
    const [baseFee, setBaseFee] = useState(0);
    const [feeRate, setFeeRate] = useState(0);

    const { theme } = useSettings();
    const { host, read, cert } = useAccount();
    const auth = getAuthString(host, read, cert);

    const { loading, data } = useQuery(CHANNEL_FEES, {
        variables: { auth },
        onError: error => toast.error(getErrorContent(error)),
    });

    const [updateFees] = useMutation(UPDATE_FEES, {
        onError: error => toast.error(getErrorContent(error)),
        onCompleted: data => {
            setIsEdit(false);
            data.updateFees
                ? toast.success('Fees updated')
                : toast.error('Error updating fees');
        },
        refetchQueries: ['GetChannelFees'],
    });

    if (loading || !data || !data.getChannelFees) {
        return <LoadingCard title={'Fees'} />;
    }

    return (
        <>
            <AdminSwitch>
                <CardWithTitle>
                    <SubTitle>Update Channel Fees</SubTitle>
                    <Card>
                        <SingleLine>
                            <Sub4Title>Channel Fees</Sub4Title>
                            <ColorButton
                                color={textColorMap[theme]}
                                onClick={() => setIsEdit(prev => !prev)}
                            >
                                {isEdit ? <XSvg /> : 'Update'}
                            </ColorButton>
                        </SingleLine>
                        {isEdit && (
                            <>
                                <Separation />
                                <SingleLine>
                                    <DarkSubTitle>{`Base Fee (Sats):`}</DarkSubTitle>
                                    <SmallInput
                                        color={textColorMap[theme]}
                                        type={'number'}
                                        onChange={e =>
                                            setBaseFee(parseInt(e.target.value))
                                        }
                                    />
                                </SingleLine>
                                <SingleLine>
                                    <DarkSubTitle>{`Fee Rate (Sats/Million):`}</DarkSubTitle>
                                    <SmallInput
                                        color={textColorMap[theme]}
                                        type={'number'}
                                        onChange={e =>
                                            setFeeRate(parseInt(e.target.value))
                                        }
                                    />
                                </SingleLine>
                                <SingleLine>
                                    <SecureButton
                                        callback={updateFees}
                                        variables={{
                                            ...(baseFee !== 0 && { baseFee }),
                                            ...(feeRate !== 0 && { feeRate }),
                                        }}
                                        color={textColorMap[theme]}
                                        enabled={baseFee >= 0 || feeRate >= 0}
                                        disabled={
                                            baseFee === 0 && feeRate === 0
                                        }
                                    >
                                        Update Fees
                                        <ChevronRight />
                                    </SecureButton>
                                </SingleLine>
                            </>
                        )}
                    </Card>
                </CardWithTitle>
            </AdminSwitch>
            <CardWithTitle>
                <SubTitle>Channel Fees</SubTitle>
                <Card>
                    {data.getChannelFees.map((channel: any, index: number) => (
                        <FeeCard
                            channelInfo={channel}
                            index={index + 1}
                            setIndexOpen={setIndexOpen}
                            indexOpen={indexOpen}
                            key={index}
                        />
                    ))}
                </Card>
            </CardWithTitle>
        </>
    );
};
