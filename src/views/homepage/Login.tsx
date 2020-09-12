import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { appendBasePath } from 'src/utils/basePath';
import { useGetCanConnectLazyQuery } from 'src/graphql/queries/__generated__/getNodeInfo.generated';
import { useGetSessionTokenLazyQuery } from 'src/graphql/queries/__generated__/getSessionToken.generated';
import { getErrorContent } from 'src/utils/error';
import { Lock } from 'react-feather';
import { ServerAccountType } from 'src/graphql/types';
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
  account: ServerAccountType;
};

export const Login = ({ account }: LoginProps) => {
  const { push } = useRouter();

  const [pass, setPass] = useState('');

  const [getCanConnect, { data, loading }] = useGetCanConnectLazyQuery({
    fetchPolicy: 'network-only',
    onError: err => {
      toast.error(getErrorContent(err));
    },
  });

  const [
    getSessionToken,
    { data: sData, loading: sLoading },
  ] = useGetSessionTokenLazyQuery({
    fetchPolicy: 'network-only',
    onError: err => {
      toast.error(getErrorContent(err));
    },
  });

  useEffect(() => {
    if (!sLoading && sData && sData.getSessionToken) {
      account && getCanConnect();
    }
  }, [sLoading, sData, push, getCanConnect, account]);

  useEffect(() => {
    if (!loading && data && data.getNodeInfo) {
      push(appendBasePath('/home'));
    }
  }, [data, loading, pass, account, push]);

  if (!account) return null;

  const handleEnter = () => {
    if (pass === '' || loading) return;
    getSessionToken({
      variables: { id: account.id, password: pass },
    });
  };

  return (
    <Section color={'transparent'}>
      <StyledTitle>
        {`Login to ${account.name}`}
        <IconPadding>
          <Lock size={18} color={chartColors.green} />
        </IconPadding>
      </StyledTitle>
      <Card cardPadding={'32px'} mobileCardPadding={'16px'}>
        <SingleLine>
          <Sub4Title>Password:</Sub4Title>
          <Input
            type={'password'}
            withMargin={'0 0 0 16px'}
            onChange={e => setPass(e.target.value)}
            onEnter={() => handleEnter()}
          />
        </SingleLine>
        <ColorButton
          disabled={pass === '' || loading}
          onClick={() => handleEnter()}
          withMargin={'16px 0 0'}
          fullWidth={true}
          loading={loading || sLoading}
        >
          Connect
        </ColorButton>
      </Card>
    </Section>
  );
};
