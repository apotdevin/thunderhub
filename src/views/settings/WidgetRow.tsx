import { FC } from 'react';
import {
  MultiButton,
  SingleButton,
} from 'src/components/buttons/multiButton/MultiButton';
import { DarkSubTitle } from 'src/components/generic/Styled';
import styled from 'styled-components';
import { NormalizedWidgets } from './DashPanel';

const S = {
  line: styled.div`
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
};

type WidgetRowParams = {
  widget: NormalizedWidgets;
  handleAdd: (id: number) => void;
  handleDelete: (id: number) => void;
};

export const WidgetRow: FC<WidgetRowParams> = ({
  widget,
  handleAdd,
  handleDelete,
}) => (
  <S.line>
    <DarkSubTitle>{widget.name}</DarkSubTitle>
    <MultiButton>
      <SingleButton
        selected={widget.active}
        onClick={() => handleAdd(widget.id)}
      >
        Show
      </SingleButton>
      <SingleButton
        selected={!widget.active}
        onClick={() => handleDelete(widget.id)}
      >
        Hide
      </SingleButton>
    </MultiButton>
  </S.line>
);
