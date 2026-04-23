import { GridWrapper } from '../components/gridWrapper/GridWrapper';
import { MintAsset } from '../views/assets/MintAsset';
import { BurnAsset } from '../views/assets/BurnAsset';
import { UniverseManager } from '../views/assets/UniverseManager';
import { TapDaemonInfo } from '../views/assets/TapDaemonInfo';

const AssetToolsPage = () => (
  <GridWrapper centerContent={false}>
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Asset Tools</h2>
      <div className="flex flex-col gap-6">
        <MintAsset />
        <div className="h-px bg-border" />
        <BurnAsset />
        <div className="h-px bg-border" />
        <UniverseManager />
        <div className="h-px bg-border" />
        <TapDaemonInfo />
      </div>
    </div>
  </GridWrapper>
);

export default AssetToolsPage;
