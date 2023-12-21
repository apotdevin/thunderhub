import styled from 'styled-components';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import {
  Card,
  CardWithTitle,
  Separation,
  SingleLine,
  SubTitle,
} from '../../components/generic/Styled';
import { Link } from '../../components/link/Link';
import { Text } from '../../components/typography/Styled';
import { useAmbossUser } from '../../hooks/UseAmbossUser';
import { AmbossLoginButton } from './LoginButton';
import { mediaWidths } from '../../styles/Themes';
import { useClaimGhostAddressMutation } from '../../graphql/mutations/__generated__/claimGhostAddress.generated';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';
import { renderLine } from '../../components/generic/helpers';
import { useState } from 'react';
import { Input } from '../../components/input';

const S = {
  row: styled.div`
    display: flex;
    gap: 8px;

    @media (${mediaWidths.mobile}) {
      flex-direction: column;
    }
  `,
};

const Buttons = () => {
  const { user } = useAmbossUser();

  const isSubscribed = !!user?.subscription.subscribed;
  const hasClaimedAddress = !!user?.ghost.username;

  const [savedUsername, setUsername] = useState(user?.ghost.username || '');

  const [claimAddress, { loading }] = useClaimGhostAddressMutation({
    onCompleted: () => toast.success('Address claimed'),
    onError: error => toast.error(getErrorContent(error)),
    refetchQueries: ['GetAmbossUser'],
  });

  if (!user) {
    return (
      <SingleLine>
        <Text style={{ margin: '0' }}>Login to claim an address</Text>
        <AmbossLoginButton />
      </SingleLine>
    );
  }

  if (!isSubscribed) {
    if (!!hasClaimedAddress) {
      return (
        <ColorButton fullWidth loading={loading}>
          <Link href="https://amboss.space/pricing" newTab>
            Subscribe to claim a custom address
          </Link>
        </ColorButton>
      );
    }

    return (
      <S.row>
        <ColorButton fullWidth loading={loading} onClick={() => claimAddress()}>
          Claim free random address
        </ColorButton>
        <ColorButton fullWidth loading={loading}>
          <Link href="https://amboss.space/pricing" newTab>
            Subscribe to claim a custom address
          </Link>
        </ColorButton>
      </S.row>
    );
  }

  return (
    <SingleLine>
      <Input
        value={savedUsername}
        placeholder={`Custom alias`}
        onChange={e => setUsername(e.target.value)}
        onEnter={() => claimAddress({ variables: { address: savedUsername } })}
      />
      <ColorButton
        loading={loading}
        disabled={loading || savedUsername === '' || !savedUsername}
        withMargin={'0 0 0 8px'}
        onClick={() => claimAddress({ variables: { address: savedUsername } })}
      >
        Claim
      </ColorButton>
    </SingleLine>
  );
};

const CurrentAddress = () => {
  const { user } = useAmbossUser();

  if (!user) return null;

  return (
    <>
      <Separation />
      {renderLine(
        'Your Ghost address',
        user.ghost.username
          ? `${user.ghost.username}@ghst.to`
          : `Has not been claimed!`
      )}
    </>
  );
};

export const Ghost = () => {
  return (
    <CardWithTitle>
      <SubTitle>Ghost Address</SubTitle>
      <Card>
        <Text>
          With a Ghost address you can have your very own
          <Link href="https://lightningaddress.com/" newTab>
            {' Lightning Address '}
          </Link>
          for you to receive payments directly to your node.
        </Text>
        <CurrentAddress />
        <Separation />
        <Buttons />
      </Card>
    </CardWithTitle>
  );
};
