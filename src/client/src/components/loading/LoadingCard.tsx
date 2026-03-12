import { Loader2 } from 'lucide-react';
import { CardWithTitle, CardTitle, SubTitle, Card } from '../generic/Styled';

interface LoadingCardProps {
  title?: string;
  noCard?: boolean;
  color?: string;
  noTitle?: boolean;
  loadingHeight?: string;
  inverseColor?: boolean;
}

const Spinner = ({
  loadingHeight,
  color,
}: {
  loadingHeight?: string;
  color: string;
}) => (
  <div
    className="w-full flex justify-center items-center"
    style={{ height: loadingHeight || 'auto' }}
  >
    <Loader2 className="animate-spin" size={20} style={{ color }} />
  </div>
);

export const LoadingCard = ({
  title = '',
  color,
  noCard = false,
  noTitle = false,
  loadingHeight,
  inverseColor,
}: LoadingCardProps) => {
  const loadingColor = color || 'var(--color-primary)';

  if (noCard) {
    return <Spinner loadingHeight={loadingHeight} color={loadingColor} />;
  }

  if (noTitle) {
    return (
      <Card>
        <Spinner loadingHeight={loadingHeight} color={loadingColor} />
      </Card>
    );
  }

  return (
    <CardWithTitle>
      <CardTitle>
        <SubTitle inverseColor={inverseColor}>{title}</SubTitle>
      </CardTitle>
      <Card>
        <Spinner loadingHeight={loadingHeight} color={loadingColor} />
      </Card>
    </CardWithTitle>
  );
};
