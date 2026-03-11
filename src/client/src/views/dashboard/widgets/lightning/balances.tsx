import { Price } from '../../../../components/price/Price';
import { useNodeBalances } from '../../../../hooks/UseNodeBalances';
import Big from 'big.js';

export const TotalBalance = () => {
  const { onchain, lightning } = useNodeBalances();

  const total = new Big(onchain.confirmed).add(lightning.confirmed).toString();
  const pending = new Big(onchain.pending).add(lightning.pending).toString();

  return (
    <div className="overflow-auto flex flex-col justify-center items-center w-full h-full">
      <div className="text-gray-500 text-sm">Total Balance</div>
      <h2 className="m-0">
        <Price amount={total} />
      </h2>
      {Number(pending) > 0 ? (
        <div className="text-gray-500 text-sm">
          <Price amount={pending} />
        </div>
      ) : null}
    </div>
  );
};

export const ChannelBalance = () => {
  const { lightning } = useNodeBalances();

  return (
    <div className="overflow-auto flex flex-col justify-center items-center w-full h-full">
      <div className="text-gray-500 text-sm">Channel Balance</div>
      <h3 className="m-0">
        <Price amount={lightning.confirmed} />
      </h3>
      {Number(lightning.pending) > 0 ? (
        <div className="text-gray-500 text-sm">
          <Price amount={lightning.pending} />
        </div>
      ) : null}
    </div>
  );
};

export const ChainBalance = () => {
  const { onchain } = useNodeBalances();

  return (
    <div className="overflow-auto flex flex-col justify-center items-center w-full h-full">
      <div className="text-gray-500 text-sm">Chain Balance</div>
      <h3 className="m-0">
        <Price amount={onchain.confirmed} />
      </h3>
      {Number(onchain.pending) > 0 ? (
        <div className="text-gray-500 text-sm">
          <Price amount={onchain.pending} />
        </div>
      ) : null}
    </div>
  );
};
