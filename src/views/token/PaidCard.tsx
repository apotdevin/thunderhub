import { FC, useEffect } from 'react';
import { toast } from 'react-toastify';
import { renderLine } from 'src/components/generic/helpers';
import { Card, DarkSubTitle, Separation } from 'src/components/generic/Styled';
import { LoadingCard } from 'src/components/loading/LoadingCard';
import { useBaseDispatch } from 'src/context/BaseContext';
import { useCreateBaseTokenMutation } from 'src/graphql/mutations/__generated__/createBaseToken.generated';
import { chartColors } from 'src/styles/Themes';
import { getErrorContent } from 'src/utils/error';
import styled from 'styled-components';

const S = {
  title: styled.div`
    color: ${chartColors.green};
    width: 100%;
    text-align: center;
    font-size: 24px;
  `,
  center: styled.div`
    width: 100%;
    text-align: center;
  `,
};

export const PaidCard: FC<{ id: string }> = ({ id }) => {
  const dispatch = useBaseDispatch();
  const [getToken, { data, loading }] = useCreateBaseTokenMutation({
    onError: err => toast.error(getErrorContent(err)),
    variables: { id },
  });

  useEffect(() => {
    if (!id) return;
    getToken();
  }, [id, getToken]);

  useEffect(() => {
    if (loading || !data?.createBaseToken) return;
    dispatch({ type: 'change', hasToken: true });
  }, [loading, data, dispatch]);

  if (loading) {
    return <LoadingCard noTitle={true} />;
  }

  return (
    <Card>
      <S.title>Thank you for the purchase!</S.title>
      <Separation />
      <S.center>
        <DarkSubTitle>
          This is your payment backup id you can use to recover the token in
          case it gets deleted.
        </DarkSubTitle>
        <DarkSubTitle>
          You can also get it from the transaction in the Transaction View.
        </DarkSubTitle>
      </S.center>
      <Separation />
      {renderLine('Backup Id', id)}
    </Card>
  );
};
