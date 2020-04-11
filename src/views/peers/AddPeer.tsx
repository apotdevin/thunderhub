import React, { useState } from 'react';
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
import { XSvg } from '../../components/generic/Icons';
import {
  MultiButton,
  SingleButton,
} from '../../components/buttons/multiButton/MultiButton';
import { Input } from '../../components/input/Input';
import { mediaDimensions } from '../../styles/Themes';
import { useSize } from '../../hooks/UseSize';
import { useMutation } from '@apollo/react-hooks';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';
import { ADD_PEER } from '../../graphql/mutation';
import { SecureButton } from '../../components/buttons/secureButton/SecureButton';

export const AddPeer = () => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [temp, setTemp] = useState<boolean>(false);
  const [key, setKey] = useState<string>('');
  const [socket, setSocket] = useState<string>('');

  const { width } = useSize();

  const [addPeer, { loading }] = useMutation(ADD_PEER, {
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
          withMargin={
            width <= mediaDimensions.mobile ? '0 0 16px' : '0 0 0 24px'
          }
          onChange={e => setKey(e.target.value)}
        />
      </ResponsiveLine>
      <ResponsiveLine>
        <Sub4Title style={{ whiteSpace: 'nowrap' }}>Peer Socket:</Sub4Title>
        <Input
          placeholder={'Socket'}
          withMargin={
            width <= mediaDimensions.mobile ? '0 0 16px' : '0 0 0 24px'
          }
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
            {isAdding ? <XSvg /> : 'Add'}
          </ColorButton>
        </SingleLine>
        {isAdding && renderAdding()}
      </Card>
    </CardWithTitle>
  );
};
