import * as React from 'react';
import styled from 'styled-components';
import { useGetNodeQuery } from 'src/graphql/queries/__generated__/getNode.generated';
import { useAccountState } from 'src/context/AccountContext';
import { useKeysendMutation } from 'src/graphql/mutations/__generated__/keysend.generated';
import { toast } from 'react-toastify';
import { getErrorContent } from 'src/utils/error';
import { SecureButton } from 'src/components/buttons/secureButton/SecureButton';
import { InputWithDeco } from 'src/components/input/InputWithDeco';
import {
  SingleLine,
  SubTitle,
  Separation,
  DarkSubTitle,
} from '../../../../components/generic/Styled';
import { LoadingCard } from '../../../../components/loading/LoadingCard';

export const WithMargin = styled.div`
  margin-right: 4px;
`;

export const Centered = styled.div`
  text-align: center;
`;

interface KeysendProps {
  publicKey: string;
  handleReset: () => void;
}

export const KeysendModal: React.FC<KeysendProps> = ({
  publicKey,
  handleReset,
}) => {
  const [tokens, setTokens] = React.useState(0);
  const { auth } = useAccountState();

  const { data, loading, error } = useGetNodeQuery({
    variables: { auth, publicKey },
  });

  const [keysend, { loading: keysendLoading }] = useKeysendMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: () => {
      toast.success('Payment Sent');
      handleReset();
    },
    refetchQueries: ['GetInOut', 'GetNodeInfo', 'GetBalances'],
  });

  if (error) {
    return (
      <Centered>
        <SubTitle>Error getting node with that public key.</SubTitle>
        <DarkSubTitle>
          Please verify you copied the public key correctly.
        </DarkSubTitle>
      </Centered>
    );
  }
  if (loading || !data || !data.getNode) {
    return <LoadingCard noCard={true} />;
  }

  const { alias } = data.getNode.node;

  return (
    <>
      <SingleLine>
        <SubTitle>Pay Node</SubTitle>
        <div>{alias}</div>
      </SingleLine>
      <Separation />
      <InputWithDeco
        title={'Sats'}
        amount={tokens}
        inputType={'number'}
        inputCallback={amount => setTokens(Number(amount))}
      />
      <DarkSubTitle withMargin={'16px 0'}>
        Remember keysend is an experimental feature. Use at your own risk.
      </DarkSubTitle>
      <SecureButton
        callback={keysend}
        variables={{ destination: publicKey, tokens }}
        disabled={loading || keysendLoading}
        withMargin={'16px 0 0'}
        loading={keysendLoading}
        fullWidth={true}
      >
        Send
      </SecureButton>
    </>
  );
};
