import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { X, Copy, ChevronRight, Loader2 } from 'lucide-react';
import { useVerifyMessageLazyQuery } from '../../../graphql/queries/__generated__/verifyMessage.generated';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  SingleLine,
  DarkSubTitle,
  Separation,
} from '../../../components/generic/Styled';
import { getErrorContent } from '../../../utils/error';
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
          style={{ margin: '8px 0 0' }}
          onChange={e => setMessage(e.target.value)}
        />
      </SingleLine>
      <SingleLine>
        <NoWrap>
          <DarkSubTitle>Signature: </DarkSubTitle>
        </NoWrap>
        <Input
          style={{ margin: '8px 0 0' }}
          onChange={e => setSignature(e.target.value)}
        />
      </SingleLine>
      <Button
        variant="outline"
        className="w-full"
        style={{ margin: '8px 0 4px' }}
        disabled={message === '' || signature === '' || loading}
        onClick={() => signMessage({ variables: { message, signature } })}
      >
        {loading ? <Loader2 className="animate-spin" size={16} /> : <>Verify</>}
      </Button>
      <Separation />
    </>
  );

  const renderMessage = () => (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="break-words m-6 text-sm">{getNodeLink(signedBy)}</div>
      <Button
        variant="outline"
        onClick={() =>
          navigator.clipboard
            .writeText(signedBy)
            .then(() => toast.success('Public Node Key Copied'))
        }
      >
        <Copy size={18} />
        Copy
      </Button>
    </div>
  );

  return (
    <>
      <SingleLine>
        <DarkSubTitle>Verify Message</DarkSubTitle>
        <Button
          variant="outline"
          style={{ margin: '4px 0' }}
          disabled={loading}
          onClick={() => setIsPasting(prev => !prev)}
        >
          {isPasting ? (
            <X size={18} />
          ) : (
            <>Verify {!isPasting && <ChevronRight size={18} />}</>
          )}
        </Button>
      </SingleLine>
      {isPasting && renderInput()}
      {signedBy !== '' && isPasting && renderMessage()}
    </>
  );
};
