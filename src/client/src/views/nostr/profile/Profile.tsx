import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Radio, X } from 'react-feather';
import styled from 'styled-components';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';
import {
  getWithCopyFull,
  renderLine,
} from '../../../components/generic/helpers';
import { useGetNodeInfoQuery } from '../../../graphql/queries/__generated__/getNodeInfo.generated';
import { getErrorContent } from '../../../utils/error';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import { Input } from '../../../components/input';
import {
  CardWithTitle,
  CardTitle,
  SubTitle,
  Card,
  SingleLine,
  DarkSubTitle,
  Separation,
} from '../../../components/generic/Styled';
import { mediaWidths, themeColors } from '../../../styles/Themes';
import { useNostrDispatch, useNostrState } from '../../../context/NostrContext';
import { useNostrKeysLazyQuery } from '../../../graphql/queries/__generated__/getNostrKeys.generated';
import { useNostrProfileQuery } from '../../../graphql/queries/__generated__/getNostrProfile.generated';
import { useGenerateNostrProfileMutation } from '../../../graphql/mutations/__generated__/generateNostrProfile.generated';

const Key = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 400px;

  overflow-wrap: break-word;
  word-wrap: break-word;

  -ms-word-break: break-all;
  word-break: break-all;
`;

const Responsive = styled(SingleLine)`
  @media (${mediaWidths.mobile}) {
    flex-direction: column;
  }
`;

const Tile = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: ${({ startTile }: { startTile?: boolean }) =>
    startTile ? 'flex-start' : 'flex-end'};

  @media (${mediaWidths.mobile}) {
    margin: 16px 0;
  }
`;

// const TextPadding = styled.span`
//   margin-left: 5px;
// `;

const ButtonRow = styled.div`
  display: flex;

  @media (${mediaWidths.mobile}) {
    width: 100%;
  }
`;

export const Profile = () => {
  const { initialized, nsec, npub, pub, sec, attestation } = useNostrState();
  const dispatch = useNostrDispatch();
  const [open, openSet] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');

  const [willSend, setWillSend] = React.useState(false);
  setWillSend(false);

  const { loading, data } = useGetNodeInfoQuery({
    ssr: false,
    onError: error => toast.error(getErrorContent(error)),
  });
  // useGenerateNostrProfile -- from pubkey, get rest
  //useGetkeys ==> give sec key, then gen pubkey
  const [getKeys, { loading: keysLoading }] = useNostrKeysLazyQuery({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: data => {
      dispatch({
        type: 'createdKeys',
        sec: data.getNostrKeys.privkey,
        pub: data.getNostrKeys.pubkey,
      });
      toast.success('Generated nostr keys.');
      generateProfile();
    },
  });

  const [
    generateProfile,
    { data: genProfileData, loading: genProfileLoading },
  ] = useGenerateNostrProfileMutation({
    variables: { privateKey: sec || '' },
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: () => {
      toast.success('Generated nostr profile and created node announcement.');
    },
  });

  const {
    data: profileData,
    loading: profileLoading,
    // refetch: profileRefetch,
  } = useNostrProfileQuery({
    variables: { pubkey: pub },
    onError: error => {
      toast.error(getErrorContent(error));
      // generateProfile();
    },
    onCompleted: () => {
      toast.success('Retrieved nostr profile.');
      // profileRefetch();
      // dispatch({ type: 'loaded', nsec: profile });
    },
  });
  // useEffect(() => {
  //   if (!nsec) return;
  //   if (!npub) {
  //     getProfile();
  //     dispatch({ type: 'loaded', nsec });
  //     return;
  //   } else {
  //   }
  // }, [nsec, npub, pub, sec, dispatch, setNostrCache, getProfile]);

  useEffect(() => {
    console.log('profile', profileData);
    console.log('attestation', attestation);
  }, [profileData, attestation]);

  useEffect(() => {
    if (!profileData && !genProfileData) return;
    console.log('PROFILE LOADED', profileData, genProfileData);
    const profileBlob =
      profileData?.getNostrProfile?.attestation?.content ||
      genProfileData?.generateNostrProfile.announcement?.content;

    const profileObject = profileBlob ? JSON.parse(profileBlob) : {};
    const sig = profileObject['s'] || 'sig failed';

    dispatch({
      type: 'profileFetched',
      attestation: sig,
    });
  }, [profileData, genProfileData, dispatch]);

  useEffect(() => {
    if (!initialized) {
      dispatch({ type: 'initialized' });
    }
  }, [initialized, dispatch]);

  if (!data || loading) {
    return <LoadingCard title={'Nostr'} />;
  }

  const { public_key } = data.getNodeInfo || {};

  if (nsec === '') {
    return (
      <CardWithTitle>
        <CardTitle>Load Nostr Profile</CardTitle>
        <SingleLine>
          <Input
            value={input}
            placeholder={'nsec'}
            onChange={e => setInput(e.target?.value ?? '')}
          />

          <ColorButton
            withMargin={'0 0 0 8px'}
            onClick={() => {
              dispatch({ type: 'loadedKeys', nsec: input });
            }}
            arrow={willSend ? false : true}
            disabled={
              keysLoading || profileLoading || genProfileLoading || input === ''
            }
          >
            {willSend ? <X size={18} /> : 'Set'}
          </ColorButton>
        </SingleLine>
        <SingleLine>
          <ColorButton
            withMargin={'0 0 0 8px'}
            onClick={() => getKeys()}
            arrow={willSend ? false : true}
          >
            Generate new key pair.
          </ColorButton>
        </SingleLine>
      </CardWithTitle>
    );
  }
  return (
    <CardWithTitle>
      <CardTitle>
        <SubTitle>Nostr Profile</SubTitle>
      </CardTitle>
      <Card>
        <Responsive>
          <Radio size={18} color={themeColors.blue2} />
          <Tile startTile={true}>
            <DarkSubTitle>npub</DarkSubTitle>
            <Key>{npub}</Key>
          </Tile>
          <ButtonRow>
            <ColorButton
              fullWidth={true}
              withMargin={'0 0 0 8px'}
              onClick={() => openSet(s => !s)}
            >
              {open ? <X size={18} /> : 'Details'}
            </ColorButton>
          </ButtonRow>
        </Responsive>
        {open && (
          <>
            <Separation />
            {renderLine('npub', getWithCopyFull(npub))}
            {renderLine('hex pubkey', getWithCopyFull(pub))}
            {renderLine('nsec', getWithCopyFull(nsec))}
            {renderLine('Signature', getWithCopyFull(attestation))}
            {renderLine('Identity Pubkey', getWithCopyFull(public_key))}
          </>
        )}
      </Card>
    </CardWithTitle>
  );
};
