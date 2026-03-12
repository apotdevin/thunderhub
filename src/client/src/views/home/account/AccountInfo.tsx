import { Zap, Anchor, Pocket } from 'lucide-react';
import { useNodeBalances } from '../../../hooks/UseNodeBalances';
import Big from 'big.js';
import { renderLine } from '../../../components/generic/helpers';
import {
  Card,
  CardWithTitle,
  SubTitle,
  Separation,
  DarkSubTitle,
  ResponsiveLine,
  SingleLine,
} from '../../../components/generic/Styled';
import { Price } from '../../../components/price/Price';

const Tile = ({
  children,
  startTile,
}: {
  children: React.ReactNode;
  startTile?: boolean;
}) => (
  <div
    className={`flex justify-between w-full flex-row items-end mb-2 md:w-auto md:flex-col md:mb-0 ${startTile ? 'md:items-start' : 'md:items-end'}`}
  >
    {children}
  </div>
);

const sectionColor = '#FFD300';

export const AccountInfo = () => {
  const { onchain, lightning } = useNodeBalances();

  const totalAmount = new Big(onchain.confirmed)
    .add(onchain.pending)
    .add(onchain.closing)
    .add(lightning.confirmed)
    .add(lightning.pending)
    .toString();

  const totalChain = new Big(onchain.confirmed).add(onchain.pending).toString();
  const totalLightning = new Big(lightning.confirmed)
    .add(lightning.pending)
    .toString();

  const activeLightning = new Big(lightning.active)
    .sub(lightning.commit)
    .toString();

  const inactiveLightning = new Big(lightning.confirmed)
    .sub(lightning.active)
    .add(lightning.commit)
    .toString();

  const chainPending = Number(onchain.pending) + Number(onchain.closing);
  const channelPending = Number(lightning.pending);

  return (
    <>
      <CardWithTitle>
        <SubTitle>Resume</SubTitle>
        <Card>
          <ResponsiveLine>
            <Pocket
              size={18}
              color={
                chainPending === 0 && channelPending === 0
                  ? '#2bbc54'
                  : '#652EC7'
              }
            />
            <Tile>
              <DarkSubTitle>Total</DarkSubTitle>
              <div>
                <Price amount={totalAmount} />
              </div>
            </Tile>
            <Tile>
              <DarkSubTitle>Bitcoin</DarkSubTitle>
              <div>
                <Price amount={totalChain} />
              </div>
            </Tile>
            <Tile>
              <DarkSubTitle>Lightning</DarkSubTitle>
              <div>
                <Price amount={totalLightning} />
              </div>
            </Tile>
          </ResponsiveLine>
        </Card>
      </CardWithTitle>
      <div className="block md:grid md:gap-4 md:grid-cols-2">
        <CardWithTitle>
          <Card>
            <SingleLine>
              <Zap
                size={18}
                color={channelPending === 0 ? sectionColor : '#652EC7'}
              />
              <SubTitle>Lightning</SubTitle>
            </SingleLine>
            <Separation />
            {renderLine('Available', <Price amount={activeLightning} />)}
            {renderLine('Not Available', <Price amount={inactiveLightning} />)}
            {renderLine('Pending', <Price amount={lightning.pending} />)}
          </Card>
        </CardWithTitle>
        <CardWithTitle>
          <Card>
            <SingleLine>
              <Anchor
                size={18}
                color={chainPending === 0 ? sectionColor : '#652EC7'}
              />
              <SubTitle>Bitcoin</SubTitle>
            </SingleLine>
            <Separation />
            {renderLine('Available', <Price amount={onchain.confirmed} />)}
            {renderLine('Pending', <Price amount={onchain.pending} />)}
            {renderLine('Force Closures', <Price amount={onchain.closing} />)}
          </Card>
        </CardWithTitle>
      </div>
    </>
  );
};
