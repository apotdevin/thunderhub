import React, { useState } from 'react';
import { X } from 'react-feather';
import { toast } from 'react-toastify';
import { useAddPeerMutation } from 'src/graphql/mutations/__generated__/addPeer.generated';
import { InputWithDeco } from 'src/components/input/InputWithDeco';
import {
  CardWithTitle,
  SubTitle,
  Card,
  SingleLine,
  DarkSubTitle,
  NoWrapTitle,
  Separation,
} from '../../components/generic/Styled';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import {
  MultiButton,
  SingleButton,
} from '../../components/buttons/multiButton/MultiButton';
import { getErrorContent } from '../../utils/error';
import { SecureButton } from '../../components/buttons/secureButton/SecureButton';

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
    <SingleButton selected={selected} onClick={onClick}>
      {text}
    </SingleButton>
  );

  const renderAdding = () => (
    <>
      <Separation />
      <SingleLine>
        <NoWrapTitle>Type:</NoWrapTitle>
        <MultiButton>
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
        </MultiButton>
      </SingleLine>
      <Separation />
      {!separate && (
        <InputWithDeco
          title={'Url'}
          inputCallback={value => setUrl(value)}
          placeholder={'public_key@socket'}
        />
      )}
      {separate && (
        <>
          <InputWithDeco
            title={'Public Key'}
            inputCallback={value => setKey(value)}
            placeholder={'Public Key'}
          />
          <InputWithDeco
            title={'Socket'}
            inputCallback={value => setSocket(value)}
            placeholder={'Socket'}
          />
        </>
      )}
      <SingleLine>
        <NoWrapTitle>Is Temporary:</NoWrapTitle>
        <MultiButton>
          {renderButton(() => setTemp(true), 'Yes', temp)}
          {renderButton(() => setTemp(false), 'No', !temp)}
        </MultiButton>
      </SingleLine>
      <SecureButton
        callback={addPeer}
        variables={{ url, publicKey: key, socket, isTemporary: temp }}
        disabled={url === '' && (socket === '' || key === '')}
        withMargin={'16px 0 0'}
        loading={loading}
        arrow={true}
        fullWidth={true}
      >
        Add
      </SecureButton>
    </>
  );

  return (
    <CardWithTitle>
      <SubTitle>Peer Management</SubTitle>
      <Card>
        <SingleLine>
          <DarkSubTitle>Add Peer</DarkSubTitle>
          <ColorButton
            withMargin={'4px 0'}
            onClick={() => setIsAdding(prev => !prev)}
          >
            {isAdding ? <X size={18} /> : 'Add'}
          </ColorButton>
        </SingleLine>
        {isAdding && renderAdding()}
      </Card>
    </CardWithTitle>
  );
};
