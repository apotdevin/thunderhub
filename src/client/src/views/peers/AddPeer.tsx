import { useState } from 'react';
import { X, ChevronRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAddPeerMutation } from '../../graphql/mutations/__generated__/addPeer.generated';
import { Input } from '@/components/ui/input';
import {
  CardWithTitle,
  SubTitle,
  Card,
  SingleLine,
  DarkSubTitle,
  NoWrapTitle,
  Separation,
} from '../../components/generic/Styled';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { getErrorContent } from '../../utils/error';

export const AddPeer = () => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [temp, setTemp] = useState<boolean>(false);
  const [separate, setSeparate] = useState<boolean>(false);
  const [url, setUrl] = useState<string>('');
  const [key, setKey] = useState<string>('');
  const [socket, setSocket] = useState<string>('');

  const [addPeer, { loading }] = useAddPeerMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: () => {
      toast.success('Peer Added');
      setIsAdding(false);
      setTemp(false);
      setUrl('');
      setKey('');
      setSocket('');
    },
    refetchQueries: ['GetPeers'],
  });

  const renderButton = (
    onClick: () => void,
    text: string,
    selected: boolean
  ) => (
    <Button
      variant={selected ? 'default' : 'ghost'}
      onClick={() => onClick()}
      className={cn('grow', !selected && 'text-foreground')}
    >
      {text}
    </Button>
  );

  const renderAdding = () => (
    <>
      <Separation />
      <SingleLine>
        <NoWrapTitle>Type:</NoWrapTitle>
        <div className="flex justify-center items-center rounded-md p-1 bg-secondary flex-wrap">
          {renderButton(
            () => {
              setKey('');
              setSocket('');
              setSeparate(false);
            },
            'Joined',
            !separate
          )}
          {renderButton(
            () => {
              setUrl('');
              setSeparate(true);
            },
            'Separate',
            separate
          )}
        </div>
      </SingleLine>
      <Separation />
      {!separate && (
        <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
          <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
            <span>Url</span>
          </div>
          <Input
            className="ml-0 md:ml-2"
            style={{ maxWidth: '500px' }}
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder={'public_key@socket'}
          />
        </div>
      )}
      {separate && (
        <>
          <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
            <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
              <span>Public Key</span>
            </div>
            <Input
              className="ml-0 md:ml-2"
              style={{ maxWidth: '500px' }}
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder={'Public Key'}
            />
          </div>
          <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
            <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
              <span>Socket</span>
            </div>
            <Input
              className="ml-0 md:ml-2"
              style={{ maxWidth: '500px' }}
              value={socket}
              onChange={e => setSocket(e.target.value)}
              placeholder={'Socket'}
            />
          </div>
        </>
      )}
      <SingleLine>
        <NoWrapTitle>Is Temporary:</NoWrapTitle>
        <Switch checked={temp} onCheckedChange={setTemp} />
      </SingleLine>
      <Button
        variant="outline"
        onClick={() =>
          addPeer({
            variables: { url, publicKey: key, socket, isTemporary: temp },
          })
        }
        disabled={(url === '' && (socket === '' || key === '')) || loading}
        style={{ margin: '16px 0 0' }}
        className="w-full"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <>
            Add <ChevronRight size={18} />
          </>
        )}
      </Button>
    </>
  );

  return (
    <CardWithTitle>
      <SubTitle>Peer Management</SubTitle>
      <Card>
        <SingleLine>
          <DarkSubTitle>Add Peer</DarkSubTitle>
          <Button
            variant="outline"
            style={{ margin: '4px 0' }}
            onClick={() => setIsAdding(prev => !prev)}
          >
            {isAdding ? <X size={18} /> : 'Add'}
          </Button>
        </SingleLine>
        {isAdding && renderAdding()}
      </Card>
    </CardWithTitle>
  );
};
