import { useLocalStorage } from '../../../../hooks/UseLocalStorage';
import { Separation, Sub4Title } from '../../../../components/generic/Styled';
import { FC } from 'react';

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
      <div className="flex flex-wrap">
        {savedAddresses.map((a, index) => (
          <button
            className="text-sm py-1 px-2 m-0.5 border border-[#e1e6ed] dark:border-[#4a5669] bg-white dark:bg-[#151727] rounded cursor-pointer text-inherit hover:bg-[#e1e6ed] hover:dark:bg-[#4a5669]"
            onClick={() => handleClick(a)}
            key={`${index}${a}`}
          >
            {a}
          </button>
        ))}
      </div>
    </>
  );
};
