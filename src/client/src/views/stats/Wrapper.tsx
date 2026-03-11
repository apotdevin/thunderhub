import { FC, ReactNode, useState } from 'react';
import { Card, SubTitle } from '../../components/generic/Styled';
import { ChevronDown, ChevronUp } from 'lucide-react';

type StatWrapperProps = {
  title: string;
  children?: ReactNode;
};

export const StatWrapper: FC<StatWrapperProps> = ({ children, title }) => {
  const [open, openSet] = useState(false);

  return (
    <Card>
      <div
        className="cursor-pointer flex py-2 pb-4 justify-between items-center"
        style={{ marginBottom: open ? 0 : '-8px' }}
        onClick={() => openSet(p => !p)}
      >
        <SubTitle>{title}</SubTitle>
        {open ? <ChevronUp /> : <ChevronDown />}
      </div>
      {open && children}
    </Card>
  );
};
