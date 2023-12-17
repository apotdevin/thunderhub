import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useLoginAmbossMutation } from '../../../../graphql/mutations/__generated__/loginAmboss.generated';
import { useGetAmbossLoginTokenLazyQuery } from '../../../../graphql/queries/__generated__/getAmbossLoginToken.generated';
import { useAmbossUser } from '../../../../hooks/UseAmbossUser';
import {
  cardBorderColor,
  cardColor,
  mediaWidths,
  unSelectedNavButton,
} from '../../../../styles/Themes';
import styled from 'styled-components';
import Image from 'next/image';
import { appendBasePath } from '../../../../utils/basePath';

const QuickTitle = styled.div`
  font-size: 12px;
  color: ${unSelectedNavButton};
  margin-top: 10px;
`;

const QuickCard = styled.button`
  background: ${cardColor};
  box-shadow: 0 8px 16px -8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: 1px solid ${cardBorderColor};
  height: 100px;
  width: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  color: #69c0ff;

  @media (${mediaWidths.mobile}) {
    padding: 4px;
    height: 80px;
    width: 80px;
  }

  &:hover {
    background-color: #ff0080;
    color: white;

    img {
      filter: brightness(0) invert(1);
    }

    & ${QuickTitle} {
      color: white;
    }
  }
`;

export const AmbossCard = () => {
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
    const url = `https://amboss.space/token?key=${data.getAmbossLoginToken}`;
    (window as any).open(url, '_blank').focus();
  }, [data, tokenLoading]);

  if (!user) {
    return (
      <QuickCard
        onClick={() => {
          if (loading) return;
          login();
        }}
        disabled={loading}
      >
        <Image
          src={appendBasePath('/assets/amboss_icon.png')}
          width={32}
          height={32}
          alt={'Amboss Logo'}
        />
        <QuickTitle>{loading ? 'Loading...' : 'Login'}</QuickTitle>
      </QuickCard>
    );
  }

  return (
    <QuickCard
      onClick={() => {
        if (tokenLoading) return;
        getToken();
      }}
      disabled={tokenLoading}
    >
      <Image
        src={appendBasePath('/assets/amboss_icon.png')}
        width={32}
        height={32}
        alt={'Amboss Logo'}
      />
      <QuickTitle>{tokenLoading ? 'Loading...' : 'Go To'}</QuickTitle>
    </QuickCard>
  );
};
