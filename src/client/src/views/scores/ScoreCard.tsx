import { useRouter } from 'next/router';
import { FC } from 'react';
import { getNodeLink, renderLine } from '../../components/generic/helpers';
import { Link } from '../../components/link/Link';
import { BosScore } from '../../graphql/types';
import { themeColors } from '../../styles/Themes';
import styled from 'styled-components';

type ScoreCardProps = {
  score: BosScore | null;
};

const getBorderColor = (index: number) => {
  switch (index) {
    case 1:
      return 'gold';
    case 2:
      return 'orange';
    case 3:
      return 'white';
    default:
      return themeColors.blue2;
  }
};

const getWidth = (index: number): string => {
  switch (index) {
    case 1:
    case 2:
    case 3:
      return '2px';
    default:
      return '1px';
  }
};

const S = {
  Score: styled.div<{ borderWidth?: string; borderColor?: string }>`
    padding: 8px;
    border: ${({ borderWidth }) => borderWidth || '2px'} solid
      ${({ borderColor }) => borderColor || 'gold'};
    border-radius: 8px;
    text-align: center;
    margin: 0 0 16px;
    cursor: pointer;
  `,
  NoScore: styled.div`
    padding: 8px;
    border-radius: 8px;
    text-align: center;
    margin: 0 0 16px;
    cursor: pointer;
  `,
};

export const ScoreCard: FC<ScoreCardProps> = ({ score }) => {
  const { push } = useRouter();

  if (!score) {
    return (
      <S.NoScore>
        <Link
          href={'https://openoms.gitbook.io/lightning-node-management/bosscore'}
          newTab={true}
        >
          This node is not in the BOS list. Read more about these scores here.
        </Link>
      </S.NoScore>
    );
  }

  const handleClick = () => {
    if (score.public_key) {
      push(`/scores/${score.public_key}`);
    }
  };

  return (
    <S.Score
      borderWidth={getWidth(score.position)}
      borderColor={getBorderColor(score.position)}
      onClick={handleClick}
    >
      {score.alias}
      {renderLine('Position', score.position)}
      {renderLine('Score', score.score)}
      {renderLine('Public Key', getNodeLink(score.public_key))}
    </S.Score>
  );
};
