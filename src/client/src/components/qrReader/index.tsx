import QrReader from 'react-qr-reader';

type QRCodeReaderProps = {
  onScan: (value: string) => void;
  onError: (error: string) => void;
};

const QRCodeReader = ({ onScan, onError }: QRCodeReaderProps) => {
  const handleScan = (data: string | null) => {
    if (data) {
      onScan(data);
    }
  };
  const handleError = (err: any) => {
    onError(err);
  };
  return (
    <QrReader
      delay={300}
      onError={handleError}
      onScan={handleScan}
      style={{ width: '100%' }}
    />
  );
};

export default QRCodeReader;
