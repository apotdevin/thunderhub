import { useEffect } from 'react';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import { useGetLnMarketsUrlLazyQuery } from '../../graphql/queries/__generated__/getLnMarketsUrl.generated';

export const GoToLnMarkets = () => {
  const [getUrl, { data, loading }] = useGetLnMarketsUrlLazyQuery();

  useEffect(() => {
    if (loading || !data?.getLnMarketsUrl) return;
    window.open(data.getLnMarketsUrl, '_blank');
  }, [loading, data]);

  return (
    <ColorButton onClick={getUrl} fullWidth={true}>
      Go To LnMarkets
    </ColorButton>
  );
};
