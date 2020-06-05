import * as React from 'react';
import { Card, SubTitle } from 'src/components/generic/Styled';
import { ChevronDown, ChevronUp } from 'react-feather';
import { StatHeaderLine } from './styles';

type StatWrapperProps = {
  title: string;
};

export const StatWrapper: React.FC<StatWrapperProps> = ({
  children,
  title,
}) => {
  const [open, openSet] = React.useState(false);

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
