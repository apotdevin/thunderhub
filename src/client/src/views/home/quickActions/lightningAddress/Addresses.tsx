import { useLocalStorage } from '../../../../hooks/UseLocalStorage';
import { Separation, Sub4Title } from '../../../../components/generic/Styled';
import styled from 'styled-components';
import { cardBorderColor, subCardColor } from '../../../../styles/Themes';
import { FC } from 'react';
import { useGetLightningAddressesQuery } from '../../../../graphql/queries/__generated__/getLightningAddresses.generated';

const S = {
  wrapper: styled.div`
    display: flex;
    flex-wrap: wrap;
  `,
  address: styled.button`
    font-size: 14px;
    padding: 4px 8px;
    margin: 2px;
    border: 1px solid ${cardBorderColor};
    background-color: ${subCardColor};
    border-radius: 4px;
    cursor: pointer;
    color: inherit;

    :hover {
      background-color: ${cardBorderColor};
    }
  `,
};

type AddressProps = {
  handleClick: (address: string) => void;
};

export const PreviousAddresses: FC<AddressProps> = ({ handleClick }) => {
  const [savedAddresses] = useLocalStorage<string[]>(
    'saved_lightning_address',
    []
  );

  if (!savedAddresses.length) {
    return null;
  }

  return (
    <>
      <Separation />
      <Sub4Title>Previously Used Addresses:</Sub4Title>
      <S.wrapper>
        {savedAddresses.map((a, index) => (
          <S.address onClick={() => handleClick(a)} key={`${index}${a}`}>
            {a}
          </S.address>
        ))}
      </S.wrapper>
    </>
  );
};

export const AmbossAddresses: FC<AddressProps> = ({ handleClick }) => {
  const { data, loading, error } = useGetLightningAddressesQuery();

  if (loading || error || !data?.getLightningAddresses.length) {
    return null;
  }

  const addresses = data?.getLightningAddresses || [];
  const mapped = addresses.map(a => a.lightning_address);

  return (
    <>
      <Separation />
      <Sub4Title>Amboss Addresses:</Sub4Title>
      <S.wrapper>
        {mapped.map((a, index) => (
          <S.address onClick={() => handleClick(a)} key={`${index}${a}`}>
            {a}
          </S.address>
        ))}
      </S.wrapper>
    </>
  );
};
