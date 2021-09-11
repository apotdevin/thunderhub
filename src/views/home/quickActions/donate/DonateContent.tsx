import * as React from 'react';
import { SubTitle, Separation, Sub4Title } from 'src/components/generic/Styled';
import { InputWithDeco } from 'src/components/input/InputWithDeco';
import { ColorButton } from 'src/components/buttons/colorButton/ColorButton';
import Modal from 'src/components/modal/ReactModal';
import { Emoji } from 'src/components/emoji/Emoji';
import { useCreateBaseInvoiceMutation } from 'src/graphql/mutations/__generated__/createBaseInvoice.generated';
import {
  SingleButton,
  MultiButton,
} from 'src/components/buttons/multiButton/MultiButton';
import styled from 'styled-components';
import { chartColors, mediaWidths } from 'src/styles/Themes';
import { useGetNodeInfoQuery } from 'src/graphql/queries/__generated__/getNodeInfo.generated';
import { useCreateThunderPointsMutation } from 'src/graphql/mutations/__generated__/createThunderPoints.generated';
import { toast } from 'react-toastify';
import { useBaseConnect } from 'src/hooks/UseBaseConnect';
import { Pay } from '../../account/pay/Pay';

const StyledText = styled.div`
  text-align: center;
  font-size: 14px;
  margin: 16px 40px 0;

  @media (${mediaWidths.mobile}) {
    margin: 16px 0 0;
  }
`;

const Warning = styled(StyledText)`
  color: ${chartColors.orange};
`;

export const SupportBar = () => {
  const [modalOpen, modalOpenSet] = React.useState<boolean>(false);
  const [amount, amountSet] = React.useState<number>(0);
  const [invoice, invoiceSet] = React.useState<string>('');
  const [id, idSet] = React.useState<string>('');

  const { connected } = useBaseConnect();

  const [withPoints, setWithPoints] = React.useState<boolean>(false);

  const [getInvoice, { data, loading }] = useCreateBaseInvoiceMutation();

  const [createPoints, { data: pointsData, called, loading: pointsLoading }] =
    useCreateThunderPointsMutation({ refetchQueries: ['GetBasePoints'] });
  const { data: info } = useGetNodeInfoQuery({ ssr: false });

  React.useEffect(() => {
    if (data?.createBaseInvoice) {
      const { request, id } = data.createBaseInvoice;
      invoiceSet(request);
      idSet(id);
      modalOpenSet(true);
    }
  }, [data]);

  React.useEffect(() => {
    if (!pointsLoading && called) {
      if (pointsData?.createThunderPoints) {
        toast.success('Points Created');
      } else {
        toast.error('Error creating points. Write to us on telegram!');
      }
    }
  }, [pointsData, pointsLoading, called]);

  if (!connected)
    return (
      <div style={{ textAlign: 'center' }}>
        <SubTitle>Unable to connect to donation server.</SubTitle>
        <Sub4Title>
          Please check back later.Thanks for wanting to donate
          <Emoji symbol={'❤️'} label={'heart'} />
        </Sub4Title>
      </div>
    );

  const handleReset = () => {
    modalOpenSet(false);
    amountSet(0);
    invoiceSet('');
    idSet('');
  };

  const handlePaidReset = () => {
    if (withPoints && info?.getNodeInfo) {
      const { alias, public_key, uris } = info.getNodeInfo;
      createPoints({ variables: { id, alias, public_key, uris } });
    }
    handleReset();
  };

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
      <div style={{ textAlign: 'center' }}>
        <SubTitle>This project is completely free and open-source.</SubTitle>
        <Sub4Title>
          If you have enjoyed it, please consider supporting ThunderHub with
          some sats <Emoji symbol={'❤️'} label={'heart'} />
        </Sub4Title>
      </div>
      <Separation />
      <InputWithDeco
        title={'Amount'}
        value={amount}
        amount={amount}
        inputType={'number'}
        inputCallback={value => amountSet(Number(value))}
      />
      <Separation />
      <InputWithDeco title={'With Points'} noInput={true}>
        <MultiButton>
          {renderButton(() => setWithPoints(true), 'Yes', withPoints)}
          {renderButton(() => setWithPoints(false), 'No', !withPoints)}
        </MultiButton>
      </InputWithDeco>
      {withPoints && (
        <>
          <StyledText>
            This means your node will appear in the ThunderHub donation
            leaderboard. If you want to remain anonymous, do not enable this
            option. Your node alias and public key will be stored if you enable
            it.
          </StyledText>
          <Warning>
            Due to the increasing price of Bitcoin, to incentivize development
            and to give everyone an opportunity to be in the top of the
            leaderboard, points have a half life of 6 months. This means that
            every 6 months they are halved.
          </Warning>
        </>
      )}
      <Separation />
      <ColorButton
        onClick={() => getInvoice({ variables: { amount } })}
        loading={loading}
        disabled={amount <= 0 || loading}
        fullWidth={true}
        withMargin={'8px 0 0 0'}
      >
        Send
      </ColorButton>
      <Modal isOpen={modalOpen} closeCallback={handleReset}>
        <Pay predefinedRequest={invoice} payCallback={handlePaidReset} />
      </Modal>
    </>
  );
};
