import { useState, useReducer, useEffect, useMemo } from 'react';
import {
  CardWithTitle,
  SubTitle,
  Card,
  SingleLine,
  DarkSubTitle,
  Separation,
} from '../../../components/generic/Styled';
import { useGetAccountingReportLazyQuery } from '../../../graphql/queries/__generated__/getAccountingReport.generated';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';
import {
  MultiButton,
  SingleButton,
} from '../../../components/buttons/multiButton/MultiButton';
import { X } from 'lucide-react';
import { saveToPc } from '../../../utils/helpers';
import { ToolsResponsiveLine } from '../Tools.styled';

type ReportType =
  | 'chain-fees'
  | 'chain-receives'
  | 'chain-sends'
  | 'forwards'
  | 'invoices'
  | 'payments';
// type FiatType = 'eur' | 'usd';
type MonthType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | null;

type StateType = {
  type: ReportType;
  // fiat?: FiatType;
  year?: number;
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
      year: number;
    }
  | {
      type: 'month';
      month: MonthType;
    };

const initialState: StateType = {
  type: 'invoices',
  // fiat: 'eur',
  year: 2021,
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
  const [showDetails, setShowDetails] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);

  const [getReport, { data, loading }] = useGetAccountingReportLazyQuery();

  useEffect(() => {
    if (!loading && data && data.getAccountingReport) {
      saveToPc(
        data.getAccountingReport,
        `accounting-${state.type}-${state.year || ''}-${state.month || ''}`,
        true
      );
    }
  }, [data, loading, state.type, state.year, state.month]);

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

  const yearButton = (year: number) => (
    <SingleButton
      selected={state.year === year}
      onClick={() => !loading && dispatch({ type: 'year', year })}
    >
      {year}
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

  const years: number[] = useMemo(() => {
    return [];
  }, []);
  const currentYear = new Date().getFullYear();

  useMemo(() => {
    for (let index = 2017; index <= currentYear; index++) {
      years.push(index);
    }
  }, [years, currentYear]);

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
        <MultiButton>{years.map(year => yearButton(year))}</MultiButton>
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
              // fiat: state.fiat,
              category: state.type,
              ...(state.year && { year: state.year.toString() }),
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
