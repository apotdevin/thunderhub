import { useGetInvoiceStatusChangeQuery } from 'src/graphql/queries/__generated__/getInvoiceStatusChange.generated';
import { useEffect } from 'react';
type InvoiceProps = {
  id: string;
  callback: (state: string) => void;
};

export const InvoiceStatus: React.FC<InvoiceProps> = ({ id, callback }) => {
  const { data, loading } = useGetInvoiceStatusChangeQuery({
    variables: { id },
  });

  useEffect(() => {
    if (!loading && data?.getInvoiceStatusChange) {
      callback(data.getInvoiceStatusChange);
    }
  }, [loading, data, callback]);

  return null;
};
