import { GridWrapper } from '../components/gridWrapper/GridWrapper';
import { AmbossLoginButton } from '../views/amboss/LoginButton';
import { Backups } from '../views/amboss/Backups';
import { Healthchecks } from '../views/amboss/Healthchecks';
import { Balances } from '../views/amboss/Balances';
import { Billboard } from '../views/amboss/Billboard';
import { appendBasePath } from '../utils/basePath';

const AmbossPage = () => (
  <GridWrapper>
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={appendBasePath('/assets/amboss_icon.png')}
            width={28}
            height={28}
            alt="Amboss"
          />
          <div>
            <h2 className="text-lg font-semibold text-foreground">Amboss</h2>
            <p className="text-sm text-muted-foreground">
              Monitor your node and store backups.
            </p>
          </div>
        </div>
        <AmbossLoginButton />
      </div>
      <div className="grid gap-4">
        <Backups />
        <Healthchecks />
        <Balances />
        <Billboard />
      </div>
    </div>
  </GridWrapper>
);

export default AmbossPage;
