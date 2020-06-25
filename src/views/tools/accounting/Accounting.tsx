import * as React from 'react';
import { CardWithTitle, SubTitle, Card } from 'src/components/generic/Styled';
import { useGetAccountingReportQuery } from 'src/graphql/queries/__generated__/getAccountingReport.generated';
import { useAccountState } from 'src/context/AccountContext';
// import { saveToPc } from 'src/utils/helpers';

export const Accounting = () => {
  const { auth } = useAccountState();

  const { data, loading } = useGetAccountingReportQuery({
    variables: { auth },
  });

  console.log({ data, loading });

  React.useEffect(() => {
    if (!loading && data && data.getAccountingReport) {
      console.log('downnnnn');
      // saveToPc(data.getAccountingReport, 'Accounting', true);
    }
  }, [data, loading]);

  return (
    <CardWithTitle>
      <SubTitle>Accounting</SubTitle>
      <Card>Hello</Card>
    </CardWithTitle>
  );
};
