import { GridWrapper } from '../components/gridWrapper/GridWrapper';
import { AmbossLoginButton } from '../views/amboss/LoginButton';
import { Backups } from '../views/amboss/Backups';
import { Healthchecks } from '../views/amboss/Healthchecks';
import { Balances } from '../views/amboss/Balances';
import { Billboard } from '../views/amboss/Billboard';

const AmbossPage = () => (
  <GridWrapper centerContent={false}>
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Amboss</h2>
        <AmbossLoginButton />
      </div>
      <Backups />
      <Healthchecks />
      <Balances />
      <Billboard />
    </div>
  </GridWrapper>
);

export default AmbossPage;
