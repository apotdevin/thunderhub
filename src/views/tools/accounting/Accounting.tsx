import * as React from 'react';
import {
  CardWithTitle,
  SubTitle,
  Card,
  SingleLine,
  DarkSubTitle,
  Separation,
} from 'src/components/generic/Styled';
import { useGetAccountingReportLazyQuery } from 'src/graphql/queries/__generated__/getAccountingReport.generated';
import { useAccountState } from 'src/context/AccountContext';
import { ColorButton } from 'src/components/buttons/colorButton/ColorButton';
import {
  MultiButton,
  SingleButton,
} from 'src/components/buttons/multiButton/MultiButton';
import { X } from 'react-feather';
import { saveToPc } from 'src/utils/helpers';
import { ToolsResponsiveLine } from '../Tools.styled';

type ReportType =
  | 'chain-fees'
  | 'chain-receives'
  | 'chain-sends'
  | 'forwards'
  | 'invoices'
  | 'payments';
// type FiatType = 'eur' | 'usd';
type YearType = 2017 | 2018 | 2019 | 2020;
type MonthType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | null;

type StateType = {
  type: ReportType;
  // fiat?: FiatType;
  year?: YearType;
  month?: MonthType;
};

export type ActionType =
  | {
      type: 'type';
      report: ReportType;
    }
  // | {
  //     type: 'fiat';
  //     fiat: FiatType;
  //   }
  | {
      type: 'year';
      year: YearType;
    }
  | {
      type: 'month';
      month: MonthType;
    };

const initialState: StateType = {
  type: 'invoices',
  // fiat: 'eur',
  year: 2020,
  month: null,
};

const reducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case 'type':
      return { ...state, type: action.report };
    // case 'fiat':
    //   return { ...state, fiat: action.fiat };
    case 'year':
      return { ...state, year: action.year };
    case 'month':
      return { ...state, month: action.month };
    default:
      return state;
  }
};

export const Accounting = () => {
  const { auth } = useAccountState();
  const [showDetails, setShowDetails] = React.useState(false);
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const [getReport, { data, loading }] = useGetAccountingReportLazyQuery();

  console.log({ data, loading });

  React.useEffect(() => {
    if (!loading && data && data.getAccountingReport) {
      saveToPc(
        data.getAccountingReport,
        `accounting-${state.type}-${state.year || ''}-${state.month || ''}`,
        true
      );
    }
  }, [data, loading]);

  const reportButton = (report: ReportType, title: string) => (
    <SingleButton
      selected={state.type === report}
      onClick={() => !loading && dispatch({ type: 'type', report })}
    >
      {title}
    </SingleButton>
  );

  // const fiatButton = (fiat: FiatType, title: string) => (
  //   <SingleButton
  //     selected={state.fiat === fiat}
  //     onClick={() => !loading && dispatch({ type: 'fiat', fiat })}
  //   >
  //     {title}
  //   </SingleButton>
  // );

  const yearButton = (year: YearType) => (
    <SingleButton
      selected={state.year === year}
      onClick={() => !loading && dispatch({ type: 'year', year })}
    >
      {year ? year : 'None'}
    </SingleButton>
  );

  const monthButton = (month: MonthType) => (
    <SingleButton
      selected={state.month === month}
      onClick={() => !loading && dispatch({ type: 'month', month })}
    >
      {month ? month : 'All'}
    </SingleButton>
  );

  const renderDetails = () => (
    <>
      <Separation />
      <ToolsResponsiveLine>
        <DarkSubTitle>Type</DarkSubTitle>
        <MultiButton>
          {reportButton('chain-fees', 'Chain Fees')}
          {reportButton('chain-receives', 'Chain Received')}
          {reportButton('chain-sends', 'Chain Sent')}
          {reportButton('forwards', 'Forwards')}
          {reportButton('payments', 'Payments')}
          {reportButton('invoices', 'Invoices')}
        </MultiButton>
      </ToolsResponsiveLine>
      {/* <ToolsResponsiveLine>
        <DarkSubTitle>Fiat</DarkSubTitle>
        <MultiButton>
          {fiatButton('eur', 'Euro')}
          {fiatButton('usd', 'US Dollar')}
        </MultiButton>
      </ToolsResponsiveLine> */}
      <ToolsResponsiveLine>
        <DarkSubTitle>Year</DarkSubTitle>
        <MultiButton>
          {yearButton(null)}
          {yearButton(2017)}
          {yearButton(2018)}
          {yearButton(2019)}
          {yearButton(2020)}
        </MultiButton>
      </ToolsResponsiveLine>
      <ToolsResponsiveLine>
        <DarkSubTitle>Month</DarkSubTitle>
        <MultiButton>
          {monthButton(null)}
          {monthButton(1)}
          {monthButton(2)}
          {monthButton(3)}
          {monthButton(4)}
          {monthButton(5)}
          {monthButton(6)}
          {monthButton(7)}
          {monthButton(8)}
          {monthButton(9)}
          {monthButton(10)}
          {monthButton(11)}
          {monthButton(12)}
        </MultiButton>
      </ToolsResponsiveLine>
      <ColorButton
        loading={loading}
        disabled={loading}
        onClick={() =>
          getReport({
            variables: {
              auth,
              // fiat: state.fiat,
              category: state.type,
              year: state.year.toString(),
              ...(state.month && { month: state.month.toString() }),
            },
          })
        }
        fullWidth={true}
        withMargin={'16px 0 0'}
      >
        Generate
      </ColorButton>
    </>
  );

  return (
    <CardWithTitle>
      <SubTitle>Accounting</SubTitle>
      <Card>
        <SingleLine>
          <DarkSubTitle>Report</DarkSubTitle>
          <ColorButton
            arrow={!showDetails}
            onClick={() =>
              showDetails ? setShowDetails(false) : setShowDetails(true)
            }
          >
            {showDetails ? <X size={18} /> : 'Create'}
          </ColorButton>
        </SingleLine>
        {showDetails && renderDetails()}
      </Card>
    </CardWithTitle>
  );
};
