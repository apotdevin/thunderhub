import * as React from 'react';
import {
  CardWithTitle,
  SubTitle,
  Card,
  SingleLine,
  DarkSubTitle,
  Separation,
} from '../../../components/generic/Styled';
// import { useGetAccountingReportLazyQuery } from '../../../graphql/queries/__generated__/getAccountingReport.generated';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';
import {
  MultiButton,
  SingleButton,
} from '../../../components/buttons/multiButton/MultiButton';
import { X } from 'react-feather';
import { ToolsResponsiveLine } from '../../tools/Tools.styled';
import { Subtitle } from '../../../components/typography/Styled';
import { getWithCopy } from '../../../components/generic/helpers';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../utils/error';
import { useGetAccountQuery } from '../../../graphql/queries/__generated__/getAccount.generated';

type ReportType =
  | 'chain-fees'
  | 'chain-receives'
  | 'chain-sends'
  | 'forwards'
  | 'invoices'
  | 'payments';
type FollowOption = 'disabled' | 'peers' | 'channels' | '2nd degree peers';

type StateType = {
  type: ReportType;
  followOption?: FollowOption;
};

export type ActionType =
  | {
      type: 'type';
      report: ReportType;
    }
  | {
      type: 'followOption';
      followOption: FollowOption;
    };

const initialState: StateType = {
  type: 'invoices',
  // fiat: 'eur',
  followOption: 'peers',
};

const reducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case 'type':
      return { ...state, type: action.report };
    case 'followOption':
      return { ...state, followOption: action.followOption };
    default:
      return state;
  }
};

export const Settings = () => {
  const [showDetails, setShowDetails] = React.useState(false);
  // const { data, loading, error } = useGetNostrAccountQuery({
  //   onError: error => toast.error(getErrorContent(error)),
  // });
  const { data, loading, error } = useGetAccountQuery({
    onError: error => toast.error(getErrorContent(error)),
  });
  data;
  error;
  const [state, dispatch] = React.useReducer(reducer, initialState);

  // const [getReport, { data, loading }] = useGetAccountingReportLazyQuery();

  // React.useEffect(() => {
  // if (!loading && data && data.getAccountingReport) {
  //   saveToPc(
  //     data.getAccountingReport,
  //     `accounting-${state.type}-${state.year || ''}-${state.month || ''}`,
  //     true
  //   );
  // }
  // }, [data, loading, state.type]);

  // const reportButton = (report: ReportType, title: string) => (
  //   <SingleButton
  //     selected={state.type === report}
  //     onClick={() => !loading && dispatch({ type: 'type', report })}
  //   >
  //     {title}
  //   </SingleButton>
  // );

  const followToggle = (option: FollowOption) => (
    <SingleButton
      selected={state.followOption === option}
      onClick={() =>
        !loading && dispatch({ type: 'followOption', followOption: option })
      }
    >
      {option ? option : 'All'}
    </SingleButton>
  );

  const renderDetails = () => {
    return (
      <>
        <Separation />
        <ToolsResponsiveLine>
          <Subtitle>Pubkey</Subtitle>
          {getWithCopy('thisismypubkey')}
        </ToolsResponsiveLine>
        <ToolsResponsiveLine>
          <Subtitle>Attestation</Subtitle>
          {getWithCopy('thisismysignature')}
        </ToolsResponsiveLine>
        <ToolsResponsiveLine>
          <DarkSubTitle>Automatically Follow Peers</DarkSubTitle>
          <MultiButton>
            {followToggle('disabled')}
            {followToggle('peers')}
            {followToggle('2nd degree peers')}
            {followToggle('channels')}
          </MultiButton>
        </ToolsResponsiveLine>
        <ColorButton
          loading={loading}
          disabled={loading}
          onClick={() =>
            // getReport({
            //   variables: {
            //     fiat: state.fiat,
            //     category: state.type,
            //     ...(state.year && { year: state.year.toString() }),
            //     ...(state.month && { month: state.month.toString() }),
            //   },
            // })
            {
              console.log('clickyclick');
            }
          }
          fullWidth={true}
          withMargin={'16px 0 0'}
        >
          Generate
        </ColorButton>
      </>
    );
  };

  return (
    <CardWithTitle>
      <SubTitle>Settings</SubTitle>
      <Card>
        <SingleLine>
          <Subtitle>npub12342131243123124</Subtitle>
          <ColorButton
            arrow={!showDetails}
            onClick={() =>
              showDetails ? setShowDetails(false) : setShowDetails(true)
            }
          >
            {showDetails ? <X size={18} /> : 'Details'}
          </ColorButton>
        </SingleLine>
        {showDetails && renderDetails()}
      </Card>
    </CardWithTitle>
  );
};
