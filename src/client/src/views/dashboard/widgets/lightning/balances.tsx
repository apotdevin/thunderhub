import { Price } from '../../../../components/price/Price';
import { useNodeBalances } from '../../../../hooks/UseNodeBalances';
import Big from 'big.js';

export const TotalBalance = () => {
  const { onchain, lightning } = useNodeBalances();

  const total = new Big(onchain.confirmed).add(lightning.confirmed).toString();
  const pending = new Big(onchain.pending).add(lightning.pending).toString();

  return (
    <div className="overflow-auto flex flex-col justify-center items-center w-full h-full gap-0.5">
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        Total Balance
      </span>
      <span className="text-lg font-semibold tabular-nums">
        <Price amount={total} />
      </span>
      {Number(pending) > 0 ? (
        <span className="text-xs text-muted-foreground tabular-nums">
          <Price amount={pending} /> pending
        </span>
      ) : null}
    </div>
  );
};

export const ChannelBalance = () => {
  const { lightning } = useNodeBalances();

  return (
    <div className="overflow-auto flex flex-col justify-center items-center w-full h-full gap-0.5">
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        Channel Balance
      </span>
      <span className="text-base font-semibold tabular-nums">
        <Price amount={lightning.confirmed} />
      </span>
      {Number(lightning.pending) > 0 ? (
        <span className="text-xs text-muted-foreground tabular-nums">
          <Price amount={lightning.pending} /> pending
        </span>
      ) : null}
    </div>
  );
};

export const ChainBalance = () => {
  const { onchain } = useNodeBalances();

  return (
    <div className="overflow-auto flex flex-col justify-center items-center w-full h-full gap-0.5">
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        Chain Balance
      </span>
      <span className="text-base font-semibold tabular-nums">
        <Price amount={onchain.confirmed} />
      </span>
      {Number(onchain.pending) > 0 ? (
        <span className="text-xs text-muted-foreground tabular-nums">
          <Price amount={onchain.pending} /> pending
        </span>
      ) : null}
    </div>
  );
};
