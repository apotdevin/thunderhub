import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import {
  Card,
  CardWithTitle,
  SingleLine,
  SubTitle,
} from '../../components/generic/Styled';
import { Text } from '../../components/typography/Styled';
import { useToggleConfigMutation } from '../../graphql/mutations/__generated__/toggleConfig.generated';
import { useGetConfigStateQuery } from '../../graphql/queries/__generated__/getConfigState.generated';
import { ConfigFields } from '../../graphql/types';
import { getErrorContent } from '../../utils/error';

export const Healthchecks = () => {
  const { data, loading } = useGetConfigStateQuery({
    onError: err => toast.error(getErrorContent(err)),
  });

  const [toggle, { loading: toggleLoading }] = useToggleConfigMutation({
    refetchQueries: ['GetConfigState'],
    onError: err => toast.error(getErrorContent(err)),
  });

  const isEnabled = data?.getConfigState.healthcheck_ping_state || false;
  const isLoading = loading || toggleLoading;

  return (
    <CardWithTitle>
      <SubTitle>Healthchecks</SubTitle>
      <Card>
        <SingleLine>
          <Text>
            {isEnabled
              ? 'By disabling automatic healthcheck pings to Amboss, ThunderHub will no longer ping Amboss.'
              : 'By enabling automatic healthcheck pings to Amboss, ThunderHub will consistently ping Amboss to show the liveliness of your node.'}
          </Text>
          <Button
            variant="outline"
            disabled={isLoading}
            style={{ margin: '0 0 0 16px' }}
            onClick={() =>
              toggle({ variables: { field: ConfigFields.Healthchecks } })
            }
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <>{isEnabled ? 'Disable' : 'Enable'}</>
            )}
          </Button>
        </SingleLine>
      </Card>
    </CardWithTitle>
  );
};
