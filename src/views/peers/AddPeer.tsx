import React, { useState } from 'react';
import { X } from 'react-feather';
import { toast } from 'react-toastify';
import {
  CardWithTitle,
  SubTitle,
  Card,
  SingleLine,
  DarkSubTitle,
  NoWrapTitle,
  Separation,
  ResponsiveLine,
  Sub4Title,
} from '../../components/generic/Styled';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import {
  MultiButton,
  SingleButton,
} from '../../components/buttons/multiButton/MultiButton';
import { Input } from '../../components/input/Input';
import { getErrorContent } from '../../utils/error';
import { SecureButton } from '../../components/buttons/secureButton/SecureButton';
import { useAddPeerMutation } from '../../generated/graphql';

export const AddPeer = () => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [temp, setTemp] = useState<boolean>(false);
  const [key, setKey] = useState<string>('');
  const [socket, setSocket] = useState<string>('');

  const [addPeer, { loading }] = useAddPeerMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: () => {
      toast.success('Peer Added');
      setIsAdding(false);
      setTemp(false);
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
      <ResponsiveLine>
        <Sub4Title style={{ whiteSpace: 'nowrap' }}>Peer Public Key:</Sub4Title>
        <Input
          placeholder={'Peer Public Key'}
          withMargin={'0 0 0 24px'}
          mobileMargin={'0 0 16px'}
          onChange={e => setKey(e.target.value)}
        />
      </ResponsiveLine>
      <ResponsiveLine>
        <Sub4Title style={{ whiteSpace: 'nowrap' }}>Peer Socket:</Sub4Title>
        <Input
          placeholder={'Socket'}
          withMargin={'0 0 0 24px'}
          mobileMargin={'0 0 16px'}
          onChange={e => setSocket(e.target.value)}
        />
      </ResponsiveLine>
      <SingleLine>
        <NoWrapTitle>Is Temporary:</NoWrapTitle>
        <MultiButton>
          {renderButton(() => setTemp(true), 'Yes', temp)}
          {renderButton(() => setTemp(false), 'No', !temp)}
        </MultiButton>
      </SingleLine>
      <SecureButton
        callback={addPeer}
        variables={{ publicKey: key, socket, isTemporary: temp }}
        disabled={socket === '' || key === ''}
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
