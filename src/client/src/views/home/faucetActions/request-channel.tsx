import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Card } from '../../../components/generic/Styled';
import { InputWithDeco } from '../../../components/input/InputWithDeco';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';
import { faucetApi } from '../../../api/FaucetApi';
import { useGetNodeInfoQuery } from '../../../graphql/queries/__generated__/getNodeInfo.generated';
import { Container, IconStyle, Item } from '../quickActions/openChannel';
import { Hexagon } from 'react-feather';

const signetNodes = [
  {
    name: '025698cc9ac623f5d1ba',
    pubkey:
      '025698cc9ac623f5d1baf56310f2f1b62dfffee43ffcdb2c20ccb541f70497d540',
    host: '54.158.203.78',
    connectionString:
      '025698cc9ac623f5d1baf56310f2f1b62dfffee43ffcdb2c20ccb541f70497d540@54.158.203.78:9739',
  },
  {
    name: 'mutiny-net-lnd',
    pubkey:
      '02465ed5be53d04fde66c9418ff14a5f2267723810176c9212b722e542dc1afb1b',
    host: '45.79.52.207',
    connectionString:
      '02465ed5be53d04fde66c9418ff14a5f2267723810176c9212b722e542dc1afb1b@45.79.52.207:9735',
  },
  {
    name: 'GREENFELONY',
    pubkey:
      '0366abc8eb4da61e31a8d2c4520d31cabdf58cc5250f855657397f3dd62493938a',
    host: '45.33.17.66',
    connectionString:
      '0366abc8eb4da61e31a8d2c4520d31cabdf58cc5250f855657397f3dd62493938a@45.33.17.66:39735',
  },
];

export const RequestChannel = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const [capacity, setCapacity] = useState<number>(50000);
  const [push_amount, setPushAmount] = useState<number>(25000);
  const [pubkey, setPubkey] = useState<string>('');
  const [host, setHost] = useState<string>('');
  const [port, setPort] = useState<number>(9735);

  const { data } = useGetNodeInfoQuery();

  const handleRequestChannel = async () => {
    setLoading(true);

    try {
      await faucetApi.requestChannel({
        capacity,
        push_amount,
        pubkey,
        host: host + ':' + port,
      });
      toast.success('Channel Opened');
    } catch (err) {
      toast.error((err as Error).message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (
      data?.getNodeInfo?.public_key &&
      typeof data.getNodeInfo.public_key === 'string' &&
      pubkey.length === 0
    ) {
      setPubkey(data.getNodeInfo.public_key);
    }
  }, [data, pubkey]);

  return (
    <>
      <Card>
        <Container>
          {signetNodes.map((item, index) => (
            <Item
              key={`${index}-${item.name}`}
              onClick={() => {
                const [pubkey, host, port] = item.connectionString.split(/@|:/);
                setPubkey(pubkey);
                setHost(host);
                setPort(Number(port));
              }}
            >
              <IconStyle>
                <Hexagon size="18" />
              </IconStyle>
              {item.name}
            </Item>
          ))}
        </Container>
        <InputWithDeco
          value={capacity}
          inputCallback={value => setCapacity(Number(value))}
          onEnter={() => handleRequestChannel()}
          placeholder="50000"
          title="Capacity (sats)"
          inputType="number"
        />
        <InputWithDeco
          value={push_amount}
          inputCallback={value => setPushAmount(Number(value))}
          onEnter={() => handleRequestChannel()}
          placeholder="25000"
          title="Push Amount (Sats)"
          inputType="number"
        />
        <InputWithDeco
          value={host}
          inputCallback={value => setHost(value)}
          onEnter={() => handleRequestChannel()}
          placeholder="127.0.0.1"
          title="Host"
        />

        <ColorButton
          arrow={true}
          fullWidth={true}
          disabled={loading}
          withMargin={'16px 0 0'}
          onClick={() => handleRequestChannel()}
        >
          Gimme a lightning channel
        </ColorButton>
      </Card>
    </>
  );
};
