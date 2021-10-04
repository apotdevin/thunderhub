import { FC } from 'react';
import { renderLine } from 'src/components/generic/helpers';
import { DarkSubTitle, SmallLink } from 'src/components/generic/Styled';
import { useGetNodeSocialInfoQuery } from 'src/graphql/queries/__generated__/getNodeSocialInfo.generated';
import { useAmbossUser } from 'src/hooks/UseAmbossUser';

export const NodePeerSocials: FC<{ pubkey: string }> = ({ pubkey }) => {
  const { user } = useAmbossUser();

  const { data } = useGetNodeSocialInfoQuery({
    variables: { pubkey },
    errorPolicy: 'ignore',
  });

  if (!data?.getNodeSocialInfo.socials?.info) {
    return <DarkSubTitle>Partner social info not found on Amboss</DarkSubTitle>;
  }

  const {
    email,
    private: is_private,
    telegram,
    twitter,
    twitter_verified,
    website,
  } = data.getNodeSocialInfo.socials.info;

  if (!email && !telegram && !twitter && !website) {
    return <DarkSubTitle>Partner social info not found on Amboss</DarkSubTitle>;
  }

  if (is_private && !user) {
    return (
      <DarkSubTitle>
        Partner social info is private. You need to login to Amboss to see it.
      </DarkSubTitle>
    );
  }

  const cleanUrl = (website || '')
    .replace('http://', '')
    .replace('https://', '');

  return (
    <>
      {renderLine(
        'Twitter',
        twitter ? (
          <SmallLink href={`https://twitter.com/${twitter}`} target="_blank">
            {twitter}
          </SmallLink>
        ) : null
      )}
      {renderLine('Twitter Verified', twitter_verified ? 'Yes' : undefined)}
      {renderLine(
        'Telegram',
        telegram ? (
          <SmallLink href={`https://t.me/${telegram}`} target="_blank">
            {telegram}
          </SmallLink>
        ) : null
      )}
      {renderLine(
        'Email',
        email ? (
          <SmallLink href={`mailto:${email}`} target="_blank">
            {email}
          </SmallLink>
        ) : null
      )}
      {renderLine(
        'Website',
        website ? (
          <SmallLink href={`http://${cleanUrl}`} target="_blank">
            {cleanUrl}
          </SmallLink>
        ) : null
      )}
    </>
  );
};
