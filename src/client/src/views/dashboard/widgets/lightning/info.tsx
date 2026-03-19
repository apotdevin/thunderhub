import { useGetLiquidReportQuery } from '../../../../graphql/queries/__generated__/getChannelReport.generated';
import { useNodeInfo } from '../../../../hooks/UseNodeInfo';

export const AliasWidget = () => {
  const { alias } = useNodeInfo();

  return (
    <div className="overflow-auto flex flex-col justify-center items-center w-full h-full">
      <h2 className="m-0">{alias}</h2>
    </div>
  );
};

export const BalanceWidget = () => {
  const { data } = useGetLiquidReportQuery({ errorPolicy: 'ignore' });

  if (!data?.getChannelReport) {
    return (
      <div className="overflow-auto flex flex-col justify-center items-center w-full h-full">
        <h2 className="m-0">-</h2>
      </div>
    );
  }

  const { local, remote } = data.getChannelReport;

  const balance = Math.round(((local || 0) / (remote || 1)) * 100);

  return (
    <div className="overflow-auto flex flex-col justify-center items-center w-full h-full">
      <h2 className="m-0">{`${balance}%`}</h2>
    </div>
  );
};
