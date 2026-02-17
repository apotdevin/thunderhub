import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { X, Copy } from 'lucide-react';
import { useVerifyMessageLazyQuery } from '../../../graphql/queries/__generated__/verifyMessage.generated';
import { Input } from '../../../components/input';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';
import {
  SingleLine,
  DarkSubTitle,
  Separation,
} from '../../../components/generic/Styled';
import { getErrorContent } from '../../../utils/error';
import { Column, WrapRequest } from '../Tools.styled';
import { getNodeLink } from '../../../components/generic/helpers';
import { NoWrap } from './Messages';

export const VerifyMessage = () => {
  const [message, setMessage] = useState<string>('');
  const [signature, setSignature] = useState<string>('');
  const [isPasting, setIsPasting] = useState<boolean>(false);
  const [signedBy, setSignedBy] = useState<string>('');

  const [signMessage, { data, loading }] = useVerifyMessageLazyQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  useEffect(() => {
    if (!loading && data && data.verifyMessage) {
      setSignedBy(data.verifyMessage);
    }
  }, [loading, data]);

  const renderInput = () => (
    <>
      <SingleLine>
        <NoWrap>
          <DarkSubTitle>Message: </DarkSubTitle>
        </NoWrap>
        <Input
          withMargin={'8px 0 0'}
          onChange={e => setMessage(e.target.value)}
        />
      </SingleLine>
      <SingleLine>
        <NoWrap>
          <DarkSubTitle>Signature: </DarkSubTitle>
        </NoWrap>
        <Input
          withMargin={'8px 0 0'}
          onChange={e => setSignature(e.target.value)}
        />
      </SingleLine>
      <ColorButton
        fullWidth={true}
        withMargin={'8px 0 4px'}
        disabled={message === '' || signature === ''}
        loading={loading}
        onClick={() => signMessage({ variables: { message, signature } })}
      >
        Verify
      </ColorButton>
      <Separation />
    </>
  );

  const renderMessage = () => (
    <Column>
      <WrapRequest>{getNodeLink(signedBy)}</WrapRequest>
      <ColorButton
        onClick={() =>
          navigator.clipboard
            .writeText(signedBy)
            .then(() => toast.success('Public Node Key Copied'))
        }
      >
        <Copy size={18} />
        Copy
      </ColorButton>
    </Column>
  );

  return (
    <>
      <SingleLine>
        <DarkSubTitle>Verify Message</DarkSubTitle>
        <ColorButton
          withMargin={'4px 0'}
          disabled={loading}
          arrow={!isPasting}
          onClick={() => setIsPasting(prev => !prev)}
        >
          {isPasting ? <X size={18} /> : 'Verify'}
        </ColorButton>
      </SingleLine>
      {isPasting && renderInput()}
      {signedBy !== '' && isPasting && renderMessage()}
    </>
  );
};
