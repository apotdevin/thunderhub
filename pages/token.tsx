import React, { useEffect } from 'react';
import { NextPageContext } from 'next';
import { getProps } from 'src/utils/ssr';
import { GridWrapper } from 'src/components/gridWrapper/GridWrapper';
import { Card } from 'src/components/generic/Styled';
import { useAmbossUser } from 'src/hooks/UseAmbossUser';
import Image from 'next/image';
import styled from 'styled-components';
import { Link } from 'src/components/link/Link';
import { fontColors } from 'src/styles/Themes';
import { useLoginAmbossMutation } from 'src/graphql/mutations/__generated__/loginAmboss.generated';
import { toast } from 'react-toastify';
import { ColorButton } from 'src/components/buttons/colorButton/ColorButton';
import { useGetAmbossLoginTokenLazyQuery } from 'src/graphql/queries/__generated__/getAmbossLoginToken.generated';
import ambossLogo from '../src/views/token/AmbossLogo.png';

const S = {
  center: styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 16px 0 32px;
  `,
  highlight: styled.span`
    color: ${fontColors.blue2};
  `,
  text: styled.div`
    font-weight: bold;
    text-align: center;
    margin-bottom: 16px;
  `,
  subtitle: styled.div`
    font-weight: 600;
  `,
  paragraph: styled.p`
    max-width: 480px;
    text-align: center;
    font-size: 14px;
    margin: 16px auto;
  `,
};

const TokenView = () => {
  const { user } = useAmbossUser();

  const [login, { loading }] = useLoginAmbossMutation({
    onCompleted: () => toast.success('Logged in'),
    onError: () => toast.error('Error logging in'),
    refetchQueries: ['GetAmbossUser', 'GetChannels'],
  });

  const [getToken, { data, loading: tokenLoading }] =
    useGetAmbossLoginTokenLazyQuery({
      fetchPolicy: 'network-only',
      onError: () => toast.error('Error getting auth token'),
    });

  useEffect(() => {
    if (!data?.getAmbossLoginToken || tokenLoading) {
      return;
    }
    if (!window?.open) return;
    const url = `https://amboss.space/token?key=${data.getAmbossLoginToken}&redirect=L293bmVyL3VwZ3JhZGU=`;
    (window as any).open(url, '_blank').focus();
  }, [data, tokenLoading]);

  const renderLogin = () => {
    if (!user) {
      return (
        <>
          <S.paragraph>
            By logging into Amboss and having a subscription you get a nodes
            historical BOS score information directly in ThunderHub.
          </S.paragraph>
          <ColorButton
            loading={loading}
            disabled={loading}
            onClick={() => login()}
            fullWidth={true}
            withMargin={'16px 0 0'}
          >
            Login
          </ColorButton>
        </>
      );
    }

    if (!user.subscribed) {
      return (
        <>
          <S.paragraph>
            To see historical BOS information and more benefits you need an
            Amboss Subscription.
          </S.paragraph>
          <S.paragraph>
            If you had previously purchased a Thunderbase token and it is still
            valid, reach out to @ambossTech on twitter for a free one month
            subscription or to @thunderhubio on twitter for a refund.
          </S.paragraph>
          <ColorButton
            loading={tokenLoading}
            disabled={tokenLoading}
            onClick={() => getToken()}
            fullWidth={true}
            withMargin={'16px 0 0'}
          >
            See Subscription Info
          </ColorButton>
        </>
      );
    }
    if (user.subscribed) {
      return (
        <S.paragraph>You already have an Amboss subscription!</S.paragraph>
      );
    }

    return null;
  };

  return (
    <Card>
      <S.center>
        <Image src={ambossLogo} width={320} height={42} alt={'Amboss Logo'} />
      </S.center>
      <S.text>
        In collaboration with
        <Link href={'https://amboss.space/'} newTab={true}>
          <S.highlight> Amboss </S.highlight>
        </Link>
        we are integrating its API into ThunderHub!
      </S.text>
      {renderLogin()}
    </Card>
  );
};

const Wrapped = () => (
  <GridWrapper>
    <TokenView />
  </GridWrapper>
);

export default Wrapped;

export async function getServerSideProps(context: NextPageContext) {
  return await getProps(context);
}
