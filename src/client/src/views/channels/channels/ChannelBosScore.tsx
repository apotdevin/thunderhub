import { FC, useEffect } from 'react';
import {
  getDateDif,
  getFormatDate,
  renderLine,
} from '../../../components/generic/helpers';
import { DarkSubTitle, Separation } from '../../../components/generic/Styled';
import { Link } from '../../../components/link/Link';
import { BosScore } from '../../../graphql/types';
import numeral from 'numeral';
import { useAmbossUser } from '../../../hooks/UseAmbossUser';
import { useLoginAmbossMutation } from '../../../graphql/mutations/__generated__/loginAmboss.generated';
import { toast } from 'react-toastify';
import { useGetAmbossLoginTokenLazyQuery } from '../../../graphql/queries/__generated__/getAmbossLoginToken.generated';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';

export const ChannelBosScore: FC<{ score?: BosScore | null }> = ({ score }) => {
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

  if (!user) {
    return (
      <>
        <Separation />
        BOS Score
        <DarkSubTitle withMargin={'16px 0'}>
          Login to Amboss and get a subscription to see this nodes historical
          BOS score information
        </DarkSubTitle>
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
        <Separation />
        BOS Score
        <DarkSubTitle withMargin={'16px 0'}>
          To see historical BOS information and more benefits you need an Amboss
          Subscription.
        </DarkSubTitle>
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

  if (!score) {
    return (
      <>
        <Separation />
        <DarkSubTitle>This node has not appeared in the BOS list</DarkSubTitle>
      </>
    );
  }

  return (
    <>
      <Separation />
      BOS Score
      {renderLine('Score', numeral(score.score).format('0,0'))}
      {renderLine('Position', score.position)}
      {renderLine('Last Time on List', `${getDateDif(score.updated)} ago`)}
      {renderLine('Last Time Date', getFormatDate(score.updated))}
      {renderLine(
        'Historical',
        <Link to={`/scores/${score.public_key}`}>View History</Link>
      )}
    </>
  );
};
