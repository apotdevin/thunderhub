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
// import { getWithCopy } from '../../../components/generic/helpers';
// import { toast } from 'react-toastify';
// import { getErrorContent } from '../../../utils/error';
// import { useKeysQuery } from '../../../graphql/queries/__generated__/getKeys.generated';
// import { useLocalStorage } from '../../../hooks/UseLocalStorage';

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
// const defaultSettings = {
//   followOption: 'peers',
//   nsec: null,
// };

export const Settings = () => {
  const [showDetails, setShowDetails] = React.useState(false);
  // const { data, loading, error } = useGetNostrAccountQuery({
  //   onError: error => toast.error(getErrorContent(error)),
  // });
  // const [settings, setSettings] = useLocalStorage(
  //   'nostrSettings',
  //   defaultSettings
  // );
  // const { data, loading } = useKeysQuery({
  //   onError: error => toast.error(getErrorContent(error)),
  // });
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const loading = false;

  // const [getReport, { data, loading }] = useGetAccountingReportLazyQuery();

  // React.useEffect(() => {
  //   if (!loading && data && data.getKeys) {
  //     console.log(data.getKeys);
  //   }
  // }, [data, loading]);

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
          <Subtitle>Forget Secret Key</Subtitle>
          <ColorButton
            fullWidth={false}
            withMargin={'0 0 0 8px'}
            // onClick={() => handleDeleteSecretKey()}
          >
            Delete
          </ColorButton>
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
            // DO SAVE INFO
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
          Save
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
            {showDetails ? <X size={18} /> : 'Edit'}
          </ColorButton>
        </SingleLine>
        {showDetails && renderDetails()}
      </Card>
    </CardWithTitle>
  );
};
