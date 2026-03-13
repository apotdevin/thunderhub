import { Heart } from 'lucide-react';
import { QuickCard, QuickTitle } from '../QuickActions';

type SupportCardProps = {
  callback: () => void;
};

export const SupportCard = ({ callback }: SupportCardProps) => (
  <QuickCard
    onClick={callback}
    className="hover:bg-pink-500/5 hover:border-pink-500/30"
  >
    <Heart size={24} className="text-pink-500" />
    <QuickTitle>Donate</QuickTitle>
  </QuickCard>
);
