import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useCreateAddressMutation } from '../../../../graphql/mutations/__generated__/createAddress.generated';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, ChevronRight, Loader2 } from 'lucide-react';
import { getErrorContent } from '../../../../utils/error';
import { Button } from '@/components/ui/button';
import { SmallSelectWithValue } from '../../../../components/select';

const options = [
  { label: 'p2tr (Default)', value: 'p2tr' },
  { label: 'p2wpkh (Segwit)', value: 'p2wpkh' },
  { label: 'np2wpkh (Nested Segwit)', value: 'np2wpkh' },
];

export const ReceiveOnChainCard = () => {
  const [type, setType] = useState(options[0]);
  const [received, setReceived] = useState(false);

  const [createAddress, { data, loading }] = useCreateAddressMutation({
    onError: error => toast.error(getErrorContent(error)),
  });

  useEffect(() => {
    if (data?.createAddress) setReceived(true);
  }, [data]);

  return (
    <>
      {data && data.createAddress ? (
        <div className="flex flex-col justify-between items-center md:flex-row">
          <div className="w-70 h-70 m-4 bg-white p-4">
            <QRCodeSVG value={data.createAddress} size={248} />
          </div>
          <div className="w-full h-full flex flex-col justify-center items-center">
            <div className="break-all m-6 text-sm">{data.createAddress}</div>
            <Button
              variant="outline"
              onClick={() =>
                navigator.clipboard
                  .writeText(data.createAddress)
                  .then(() => toast.success('Address Copied'))
              }
            >
              <Copy size={18} />
              Copy
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col justify-between items-center w-full md:flex-row">
            <h4 className="text-sm font-medium my-1">Address Type:</h4>

            <div className="flex gap-2 flex-col md:flex-row">
              <SmallSelectWithValue
                callback={e => setType((e[0] || options[1]) as any)}
                options={options}
                value={type}
                isClearable={false}
              />

              <Button
                variant="outline"
                onClick={() =>
                  createAddress({ variables: { type: type.value } })
                }
                disabled={received || loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    Create Address <ChevronRight size={18} />
                  </>
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
