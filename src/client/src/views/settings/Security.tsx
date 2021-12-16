import { FC, useState } from 'react';
import styled from 'styled-components';
import { SettingsLine } from '../../../pages/settings';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import {
  Card,
  CardWithTitle,
  Separation,
  Sub4Title,
  SubTitle,
} from '../../components/generic/Styled';
import { useGetTwofaSecretQuery } from '../../graphql/queries/__generated__/getTwofaSecret.generated';
import { useAccount } from '../../hooks/UseAccount';
import QRCode from 'qrcode.react';
import { LoadingCard } from '../../components/loading/LoadingCard';
import { useRemoveTwofaSecretMutation } from '../../graphql/mutations/__generated__/removeTwofaSecret.generated';
import { InputWithDeco } from '../../components/input/InputWithDeco';
import { toast } from 'react-toastify';
import { useUpdateTwofaSecretMutation } from '../../graphql/mutations/__generated__/updateTwofaSecret.generated';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const { disable2FA } = publicRuntimeConfig;

const S = {
  QRWrapper: styled.div`
    width: 280px;
    height: 280px;
    margin: 16px;
    background: white;
    padding: 16px;
  `,
  center: styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
};

const Enable: FC<{ callback: () => void }> = ({ callback }) => {
  const [token, setToken] = useState<string>('');
  const { data, loading, error } = useGetTwofaSecretQuery();

  const [update, { loading: updateLoading }] = useUpdateTwofaSecretMutation({
    onCompleted: () => {
      callback();
      toast.success('Updated 2FA for account');
    },
    refetchQueries: ['GetAccount'],
    onError: ({ graphQLErrors }) => {
      const messages = graphQLErrors.map(e => (
        <div key={e.message}>{e.message}</div>
      ));
      toast.error(<div>{messages}</div>);
    },
  });

  if (loading) {
    return <LoadingCard noCard={true} />;
  }

  if (error?.message) {
    return <S.center>{error.message}</S.center>;
  }

  if (!data?.getTwofaSecret.url) {
    return <S.center>Unable to get secret to enable 2FA.</S.center>;
  }

  const handleClick = () => {
    update({ variables: { token, secret: data.getTwofaSecret.secret } });
  };

  return (
    <>
      <Separation />
      <S.center>
        <S.QRWrapper>
          <QRCode value={data.getTwofaSecret.url} renderAs={'svg'} size={248} />
        </S.QRWrapper>
        {data.getTwofaSecret.secret}
      </S.center>
      <Separation />
      <InputWithDeco
        title="2FA"
        inputType="number"
        placeholder="2FA Token"
        value={token}
        inputCallback={v => setToken(v)}
        onEnter={handleClick}
      />
      <ColorButton
        withMargin="16px 0 0"
        width="100%"
        loading={updateLoading}
        disabled={!token || updateLoading}
        onClick={handleClick}
      >
        Enable
      </ColorButton>
    </>
  );
};

const Disable: FC<{ callback: () => void }> = ({ callback }) => {
  const [token, setToken] = useState<string>('');
  const [remove, { loading }] = useRemoveTwofaSecretMutation({
    onCompleted: () => {
      callback();
      toast.success('Removed 2FA for account');
    },
    refetchQueries: ['GetAccount'],
    onError: ({ graphQLErrors }) => {
      const messages = graphQLErrors.map(e => (
        <div key={e.message}>{e.message}</div>
      ));
      toast.error(<div>{messages}</div>);
    },
  });

  const handleClick = () => {
    remove({ variables: { token } });
  };

  return (
    <>
      <Separation />
      <InputWithDeco
        title="2FA"
        inputType="number"
        placeholder="2FA Token"
        value={token}
        inputCallback={v => setToken(v)}
        onEnter={handleClick}
      />
      <ColorButton
        withMargin="16px 0 0"
        width="100%"
        loading={loading}
        disabled={!token || loading}
        onClick={handleClick}
      >
        Disable
      </ColorButton>
    </>
  );
};

export const Security = () => {
  const user = useAccount();
  const [enable, setEnabled] = useState<boolean>(false);

  if (!user || disable2FA) {
    return null;
  }

  const renderContent = () => {
    if (user.twofaEnabled) {
      return (
        <>
          <SettingsLine>
            <Sub4Title>Disable 2FA</Sub4Title>
            <ColorButton arrow={!enable} onClick={() => setEnabled(p => !p)}>
              {enable ? 'Cancel' : 'Disable'}
            </ColorButton>
          </SettingsLine>
          {enable ? <Disable callback={() => setEnabled(false)} /> : null}
        </>
      );
    }
    return (
      <>
        <SettingsLine>
          <Sub4Title>Enable 2FA</Sub4Title>
          <ColorButton arrow={!enable} onClick={() => setEnabled(p => !p)}>
            {enable ? 'Cancel' : 'Enable'}
          </ColorButton>
        </SettingsLine>
        {enable ? <Enable callback={() => setEnabled(false)} /> : null}
      </>
    );
  };

  return (
    <CardWithTitle>
      <SubTitle>Security</SubTitle>
      <Card>{renderContent()}</Card>
    </CardWithTitle>
  );
};
