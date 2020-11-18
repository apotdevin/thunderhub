import { GridWrapper } from 'src/components/gridWrapper/GridWrapper';
import { NextPageContext } from 'next';
import { getProps } from 'src/utils/ssr';
import {
  MultiButton,
  SingleButton,
} from 'src/components/buttons/multiButton/MultiButton';
import { ForwardsList } from 'src/views/forwards/index';
import {
  ForwardProvider,
  useForwardDispatch,
  useForwardState,
} from 'src/views/forwards/context';
import {
  ForwardReport,
  ReportType,
} from 'src/views/home/reports/forwardReport/ForwardReport';
import { ForwardChannelsReport } from 'src/views/home/reports/forwardReport/ForwardChannelReport';
import { useState } from 'react';
import { ColorButton } from 'src/components/buttons/colorButton/ColorButton';
import { BarChart2, List } from 'react-feather';
import { ForwardChord } from 'src/views/forwards/forwardChord';
import { ForwardTable } from 'src/views/forwards/ForwardTable';
import {
  SubTitle,
  Card,
  CardWithTitle,
  CardTitle,
  Separation,
  SingleLine,
  ResponsiveLine,
} from '../src/components/generic/Styled';

const ForwardsView = () => {
  const [isTable, setIsTable] = useState<boolean>(false);
  const { days, infoType } = useForwardState();
  const dispatch = useForwardDispatch();

  const renderButton = (selectedTime: number, title: string) => (
    <SingleButton
      selected={selectedTime === days}
      onClick={() => dispatch({ type: 'day', days: selectedTime })}
    >
      {title}
    </SingleButton>
  );

  const renderTypeButton = (type: ReportType, title: string) => (
    <SingleButton
      selected={infoType === type}
      onClick={() => dispatch({ type: 'infoType', infoType: type })}
    >
      {title}
    </SingleButton>
  );

  return (
    <>
      <CardWithTitle>
        <CardTitle>
          <SubTitle>Forwards</SubTitle>
          <SingleLine>
            <ColorButton
              withMargin={'0 4px 0 0'}
              selected={!isTable}
              onClick={() => setIsTable(false)}
            >
              <BarChart2 size={18} />
            </ColorButton>
            <ColorButton selected={isTable} onClick={() => setIsTable(true)}>
              <List size={18} />
            </ColorButton>
          </SingleLine>
        </CardTitle>
        <ResponsiveLine>
          <MultiButton margin={'8px 0'}>
            {renderButton(1, 'D')}
            {renderButton(7, '1W')}
            {renderButton(30, '1M')}
            {renderButton(90, '3M')}
            {renderButton(180, '6M')}
            {renderButton(360, '1Y')}
          </MultiButton>
          {!isTable && (
            <MultiButton margin={'8px 0'}>
              {renderTypeButton('amount', 'Count')}
              {renderTypeButton('tokens', 'Tokens')}
              {renderTypeButton('fee', 'Fees')}
            </MultiButton>
          )}
        </ResponsiveLine>

        {isTable ? (
          <Card mobileCardPadding={'0'} mobileNoBackground={true}>
            <ForwardsList days={days} />
          </Card>
        ) : (
          <>
            <Card mobileCardPadding={'0'} mobileNoBackground={true}>
              <ForwardReport days={days} order={infoType} />
              <Separation />
              <ForwardChannelsReport days={days} order={infoType} />
            </Card>
            <SubTitle>Grouped by Peer</SubTitle>
            <Card>
              <ForwardTable days={days} order={infoType} />
            </Card>
            <SubTitle>Chord Graph</SubTitle>
            <Card>
              <ForwardChord days={days} order={infoType} />
            </Card>
          </>
        )}
      </CardWithTitle>
    </>
  );
};

const Wrapped = () => (
  <GridWrapper>
    <ForwardProvider>
      <ForwardsView />
    </ForwardProvider>
  </GridWrapper>
);

export default Wrapped;

export async function getServerSideProps(context: NextPageContext) {
  return await getProps(context);
}
