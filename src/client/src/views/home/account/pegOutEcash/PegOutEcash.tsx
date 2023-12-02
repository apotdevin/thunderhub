import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { InputWithDeco } from '../../../../components/input/InputWithDeco';
import {
  Separation,
  SingleLine,
  SubTitle,
} from '../../../../components/generic/Styled';
import {
  MultiButton,
  SingleButton,
} from '../../../../components/buttons/multiButton/MultiButton';
import { Price } from '../../../../components/price/Price';
import Modal from '../../../../components/modal/ReactModal';
import { ColorButton } from '../../../../components/buttons/colorButton/ColorButton';
import { renderLine } from '../../../../components/generic/helpers';
import { Federation } from '../../../../api/types';
import { SmallSelectWithValue } from '../../../../components/select';
import { useGatewayFederations } from '../../../../hooks/UseGatewayFederations';
import { gatewayApi } from '../../../../api/GatewayApi';

export const PegOutEcashCard = ({ setOpen }: { setOpen: () => void }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const [address, setAddress] = useState('');
  const [tokens, setTokens] = useState(0);
  const [sendAll, setSendAll] = useState(false);
  const [selectedFederation, setSelectedFederation] = useState<number>(0);
  const federations: Federation[] = useGatewayFederations();

  const canSend = address !== '' && (sendAll || tokens > 0);

  const handlePegOut = (
    federationIdx: number,
    tokenAmount: { sendAll?: boolean; tokens?: number },
    address: string
  ) => {
    const amountSat = sendAll ? 'all' : tokenAmount.tokens || 0;
    gatewayApi
      .requestWithdrawal(
        federations[federationIdx].federation_id,
        amountSat,
        address
      )
      .then(() => {
        toast.success('Withdrawal request sent');
        setOpen();
      })
      .catch(e => {
        toast.error('Error sending withdrawal request', e);
      });
  };

  const tokenAmount = sendAll ? { sendAll } : { tokens };

  const renderButton = (
    onClick: () => void,
    text: string,
    selected: boolean
  ) => (
    <SingleButton selected={selected} onClick={onClick}>
      {text}
    </SingleButton>
  );

  return (
    <>
      <InputWithDeco
        title={'Peg Out to Address'}
        value={address}
        placeholder={'Address'}
        inputCallback={value => setAddress(value)}
      />
      <Separation />
      <InputWithDeco title={'From Federation'} noInput={true}>
        <SmallSelectWithValue
          callback={e => setSelectedFederation(Number(e))}
          options={federations.map(f => ({
            label: f.config.meta.federation_name || 'No connected Federations',
            value: f.federation_id || 'No connected Federations',
          }))}
          value={{
            label:
              federations[0].config.meta.federation_name ||
              'No connected Federations',
            value: federations[0].federation_id || 'No connected Federations',
          }}
          isClearable={false}
          maxWidth={'500px'}
        />
      </InputWithDeco>
      <Separation />
      <InputWithDeco title={'Send All'} noInput={true}>
        <MultiButton>
          {renderButton(() => setSendAll(true), 'Yes', sendAll)}
          {renderButton(() => setSendAll(false), 'No', !sendAll)}
        </MultiButton>
      </InputWithDeco>
      {!sendAll && (
        <InputWithDeco
          title={'Amount'}
          value={tokens}
          placeholder={'Sats'}
          amount={tokens}
          inputType={'number'}
          inputCallback={value => setTokens(Number(value))}
        />
      )}
      <ColorButton
        disabled={!canSend}
        withMargin={'16px 0 0'}
        loading={false}
        fullWidth={true}
        onClick={() => {
          setModalOpen(true);
        }}
      >
        Send
      </ColorButton>
      <Modal isOpen={modalOpen} closeCallback={() => setModalOpen(false)}>
        <SingleLine>
          <SubTitle>Send to Address</SubTitle>
        </SingleLine>
        {renderLine('Amount:', sendAll ? 'all' : <Price amount={tokens} />)}
        {renderLine('Address:', address)}
        <ColorButton
          onClick={() => handlePegOut(selectedFederation, tokenAmount, address)}
          disabled={!canSend}
          withMargin={'16px 0 0'}
          fullWidth={true}
          arrow={true}
          loading={false}
        >
          Send To Address
        </ColorButton>
      </Modal>
    </>
  );
};
