import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ColorButton } from 'src/components/buttons/colorButton/ColorButton';
import { Card, CardWithTitle, SubTitle } from 'src/components/generic/Styled';
import { InputWithDeco } from 'src/components/input/InputWithDeco';
import { useBaseDispatch } from 'src/context/BaseContext';
import { useCreateBaseTokenMutation } from 'src/graphql/mutations/__generated__/createBaseToken.generated';
import { getErrorContent } from 'src/utils/error';

export const RecoverToken = () => {
  const { push } = useRouter();
  const [id, setId] = useState<string>('');

  const dispatch = useBaseDispatch();
  const [getToken, { data, loading }] = useCreateBaseTokenMutation({
    onError: err => toast.error(getErrorContent(err)),
  });

  useEffect(() => {
    if (loading || !data?.createBaseToken) return;
    dispatch({ type: 'change', hasToken: true });
    toast.success('Succesfully recovered token');
    push('/scores');
  }, [loading, data, dispatch, push]);

  return (
    <CardWithTitle>
      <SubTitle>Recover a paid token</SubTitle>
      <Card>
        <InputWithDeco
          title={'Backup Id'}
          value={id}
          placeholder={'Transaction Id'}
          inputCallback={setId}
        />
        <ColorButton
          loading={loading}
          disabled={loading || !id}
          fullWidth={true}
          withMargin={'16px 0 0'}
          onClick={() => getToken({ variables: { id } })}
        >
          Recover Token
        </ColorButton>
      </Card>
    </CardWithTitle>
  );
};
