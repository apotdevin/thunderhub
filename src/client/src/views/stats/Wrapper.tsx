import { FC, ReactNode, useState } from 'react';
import { Card, SubTitle } from '../../components/generic/Styled';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { StatHeaderLine } from './styles';

type StatWrapperProps = {
  title: string;
  children?: ReactNode;
};

export const StatWrapper: FC<StatWrapperProps> = ({ children, title }) => {
  const [open, openSet] = useState(false);

  return (
    <Card>
      <StatHeaderLine isOpen={open} onClick={() => openSet(p => !p)}>
        <SubTitle>{title}</SubTitle>
        {open ? <ChevronUp /> : <ChevronDown />}
      </StatHeaderLine>
      {open && children}
    </Card>
  );
};
