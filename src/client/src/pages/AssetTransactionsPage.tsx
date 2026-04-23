import { GridWrapper } from '../components/gridWrapper/GridWrapper';
import { AssetTransfers } from '../views/assets/AssetTransfers';

const AssetTransactionsPage = () => (
  <GridWrapper centerContent={false}>
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Asset Transactions</h2>
      <AssetTransfers />
    </div>
  </GridWrapper>
);

export default AssetTransactionsPage;
