import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BOLTZ_STATUS_URL } from './boltzDisabled';

export const BoltzDisabledNotice = () => (
  <Alert>
    <AlertTriangle />
    <AlertTitle>Boltz swaps are disabled</AlertTitle>
    <AlertDescription>
      <p>
        Boltz has taken their swap service offline until further notice, so new
        swaps cannot be created here.
      </p>
      <p>
        Swaps you already started are not affected. Boltz is non custodial, so
        no funds are at risk. Their API is still up to refund cooperatively, and
        unilateral refunds work without them. Any pending swap below can still
        be claimed.
      </p>
      <p>
        <a href={BOLTZ_STATUS_URL} target="_blank" rel="noreferrer noopener">
          Check the official status on boltz.exchange
          <ExternalLink className="ml-1 inline size-3 align-[-0.1em]" />
        </a>
      </p>
    </AlertDescription>
  </Alert>
);
