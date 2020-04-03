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
    DarkSubTitle,
    RightAlign,
    ResponsiveLine,
} from 'components/generic/Styled';
import { useAccount } from '../../context/AccountContext';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';
import { LoadingCard } from 'components/loading/LoadingCard';
import { FeeCard } from './FeeCard';
import { UPDATE_FEES } from '../../graphql/mutation';
import { XSvg, ChevronRight } from 'components/generic/Icons';
import { SecureButton } from 'components/buttons/secureButton/SecureButton';
import { AdminSwitch } from 'components/adminSwitch/AdminSwitch';
import { ColorButton } from 'components/buttons/colorButton/ColorButton';
import { Input } from 'components/input/Input';

export const FeesView = () => {
    const [indexOpen, setIndexOpen] = useState(0);
    const [isEdit, setIsEdit] = useState(false);
    const [baseFee, setBaseFee] = useState(0);
    const [feeRate, setFeeRate] = useState(0);

    const { host, viewOnly, cert, sessionAdmin } = useAccount();
    const auth = {
        host,
        macaroon: viewOnly !== '' ? viewOnly : sessionAdmin,
        cert,
    };

    const { loading, data } = useQuery(CHANNEL_FEES, {
        variables: { auth },
        onError: (error) => toast.error(getErrorContent(error)),
    });

    const [updateFees] = useMutation(UPDATE_FEES, {
        onError: (error) => toast.error(getErrorContent(error)),
        onCompleted: (data) => {
            setIsEdit(false);
            data.updateFees
                ? toast.success('Fees Updated')
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
                                onClick={() => setIsEdit((prev) => !prev)}
                            >
                                {isEdit ? <XSvg /> : 'Update'}
                            </ColorButton>
                        </SingleLine>
                        {isEdit && (
                            <>
                                <Separation />
                                <ResponsiveLine>
                                    <DarkSubTitle>{`Base Fee (Sats):`}</DarkSubTitle>
                                    <Input
                                        placeholder={'Sats'}
                                        type={'number'}
                                        onChange={(e) =>
                                            setBaseFee(parseInt(e.target.value))
                                        }
                                    />
                                </ResponsiveLine>
                                <ResponsiveLine>
                                    <DarkSubTitle>{`Fee Rate (Sats/Million):`}</DarkSubTitle>
                                    <Input
                                        placeholder={'Sats/Million'}
                                        type={'number'}
                                        onChange={(e) =>
                                            setFeeRate(parseInt(e.target.value))
                                        }
                                    />
                                </ResponsiveLine>
                                <RightAlign>
                                    <SecureButton
                                        callback={updateFees}
                                        variables={{
                                            ...(baseFee !== 0 && { baseFee }),
                                            ...(feeRate !== 0 && { feeRate }),
                                        }}
                                        disabled={
                                            baseFee === 0 && feeRate === 0
                                        }
                                        fullWidth={true}
                                        withMargin={'16px 0 0'}
                                    >
                                        Update Fees
                                        <ChevronRight />
                                    </SecureButton>
                                </RightAlign>
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
