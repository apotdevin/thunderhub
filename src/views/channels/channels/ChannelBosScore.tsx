import { FC } from 'react';
import {
  getDateDif,
  getFormatDate,
  renderLine,
} from 'src/components/generic/helpers';
import { DarkSubTitle } from 'src/components/generic/Styled';
import { Link } from 'src/components/link/Link';
import { BosScore } from 'src/graphql/types';
import { chartColors } from 'src/styles/Themes';
import styled from 'styled-components';

const S = {
  missingToken: styled.div`
    width: 100%;
    border: 1px solid ${chartColors.darkyellow};
    padding: 8px;
    border-radius: 4px;
    margin: 8px 0 0;
    font-size: 14px;
    text-align: center;

    :hover {
      background-color: ${chartColors.darkyellow};
    }
  `,
};

export const ChannelBosScore: FC<{ score?: BosScore | null }> = ({ score }) => {
  if (!score) {
    return (
      <>
        BOS Score
        <Link to={'/token'} noStyling={true}>
          <S.missingToken>
            Get a token to view this nodes latest BOS score and historical info.
          </S.missingToken>
        </Link>
      </>
    );
  }

  if (!score.alias) {
    return (
      <DarkSubTitle>This node has not appeared in the BOS list</DarkSubTitle>
    );
  }

  return (
    <>
      BOS Score
      {renderLine('Score', score.score)}
      {renderLine('Position', score.position)}
      {renderLine('Last Time on List', `${getDateDif(score.updated)} ago`)}
      {renderLine('Last Time Date', getFormatDate(score.updated))}
      {renderLine(
        'Historical',
        <Link to={`/scores/${score.public_key}`}>View History</Link>
      )}
    </>
  );
};
