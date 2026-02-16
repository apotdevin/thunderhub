import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { getErrorContent } from '../../utils/error';
import { Lock } from 'react-feather';
import { getVersion } from '../../utils/version';
import { useGetSessionTokenMutation } from '../../graphql/mutations/__generated__/getSessionToken.generated';
import { SingleLine, Sub4Title, Card } from '../../components/generic/Styled';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import { Input } from '../../components/input';
import { Section } from '../../components/section/Section';
import { Title } from '../../components/typography/Styled';
import {
  inverseTextColor,
  mediaWidths,
  chartColors,
} from '../../styles/Themes';
import { config } from '../../config/thunderhubConfig';
import { GetServerAccountsQuery } from '../../graphql/queries/__generated__/getServerAccounts.generated';

type ServerAccount = GetServerAccountsQuery['getServerAccounts'][0];

const StyledTitle = styled(Title)`
  font-size: 24px;
  color: ${inverseTextColor};

  @media (${mediaWidths.mobile}) {
    font-size: 18px;
  }
`;

const IconPadding = styled.span`
  margin-left: 4px;
`;

type LoginProps = {
  account: ServerAccount;
};

export const Login = ({ account }: LoginProps) => {
  const [pass, setPass] = useState('');
  const [token, setToken] = useState('');

  const [getSessionToken, { data, loading }] = useGetSessionTokenMutation({
    refetchQueries: ['GetNodeInfo'],
    onError: err => {
      toast.error(getErrorContent(err));
    },
  });

  useEffect(() => {
    if (loading || !data?.getSessionToken) return;
    const { mayor, minor } = getVersion(data.getSessionToken);
    if (mayor <= 0 && minor < 11) {
      toast.error(
        'ThunderHub supports LND version 0.11.0 and higher. Please update your node, you are in risk of losing funds.'
      );
    } else {
      window.location.href = `${config.basePath}/`;
    }
  }, [data, loading]);

  if (!account) return null;

  const handleEnter = () => {
    if (pass === '' || loading) return;
    getSessionToken({
      variables: { id: account.id, password: pass, token },
    });
  };

  return (
    <Section fixedWidth={true} color={'transparent'}>
      <StyledTitle>
        {`Login to ${account.name}`}
        <IconPadding>
          <Lock size={18} color={chartColors.green} />
        </IconPadding>
      </StyledTitle>
      <Card cardPadding={'32px'} mobileCardPadding={'16px'}>
        <SingleLine>
          <Sub4Title>Password</Sub4Title>
          <Input
            autoFocus
            maxWidth="800px"
            type={'password'}
            withMargin={'0 0 8px 16px'}
            onChange={e => setPass(e.target.value)}
            onEnter={() => handleEnter()}
          />
        </SingleLine>
        {config.disable2FA ? null : (
          <SingleLine>
            <Sub4Title>{'2FA (if enabled)'}</Sub4Title>
            <Input
              maxWidth="800px"
              withMargin={'0 0 0 16px'}
              onChange={e => setToken(e.target.value)}
              onEnter={() => handleEnter()}
            />
          </SingleLine>
        )}
        <ColorButton
          disabled={pass === '' || loading}
          onClick={() => handleEnter()}
          withMargin={'16px 0 0'}
          fullWidth={true}
          loading={loading}
        >
          Connect
        </ColorButton>
      </Card>
    </Section>
  );
};
