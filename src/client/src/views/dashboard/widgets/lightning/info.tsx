import { useGetLiquidReportQuery } from '../../../../graphql/queries/__generated__/getChannelReport.generated';
import { useNodeInfo } from '../../../../hooks/UseNodeInfo';

export const AliasWidget = () => {
  const { alias } = useNodeInfo();

  return (
    <div className="overflow-auto flex flex-col justify-center items-center w-full h-full">
      <span className="text-sm font-semibold">{alias}</span>
    </div>
  );
};

export const BalanceWidget = () => {
  const { data } = useGetLiquidReportQuery({ errorPolicy: 'ignore' });

  if (!data?.getChannelReport) {
    return (
      <div className="overflow-auto flex flex-col justify-center items-center w-full h-full">
        <span className="text-sm font-semibold text-muted-foreground">-</span>
      </div>
    );
  }

  const { local, remote } = data.getChannelReport;
  const balance = Math.round(((local || 0) / (remote || 1)) * 100);

  return (
    <div className="overflow-auto flex flex-col justify-center items-center w-full h-full gap-0.5">
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        Balance
      </span>
      <span className="text-sm font-semibold tabular-nums">{balance}%</span>
    </div>
  );
};
