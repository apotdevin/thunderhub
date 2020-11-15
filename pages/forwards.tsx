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
import {
  SubTitle,
  Card,
  CardWithTitle,
  CardTitle,
  Separation,
  SingleLine,
} from '../src/components/generic/Styled';

const ForwardsView = () => {
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
        </CardTitle>
        <SingleLine>
          <MultiButton margin={'8px 0'}>
            {renderButton(1, 'D')}
            {renderButton(7, '1W')}
            {renderButton(30, '1M')}
            {renderButton(90, '3M')}
            {renderButton(180, '6M')}
            {renderButton(360, '1Y')}
          </MultiButton>
          <MultiButton margin={'8px 0'}>
            {renderTypeButton('amount', 'Amount')}
            {renderTypeButton('tokens', 'Tokens')}
            {renderTypeButton('fee', 'Fees')}
          </MultiButton>
        </SingleLine>
        <Card mobileCardPadding={'0'} mobileNoBackground={true}>
          <ForwardReport days={days} order={infoType} />
          <Separation />
          <ForwardChannelsReport days={days} order={infoType} />
        </Card>
        <Card mobileCardPadding={'0'} mobileNoBackground={true}>
          <ForwardsList days={days} />
        </Card>
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
