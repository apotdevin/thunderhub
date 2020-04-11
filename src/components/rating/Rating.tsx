import React from 'react';
import { Star, HalfStar } from '../../components/generic/Icons';
import { themeColors } from '../../styles/Themes';
import styled from 'styled-components';

const StyledStar = styled(Star)`
  margin-bottom: -1px;
`;

const StyledHalfStar = styled(HalfStar)`
  margin-bottom: -1px;
`;

const StyledRatings = styled.div`
  display: flex;
`;

interface RatingProps {
  rating: number | null;
  size?: string;
  color?: string;
}

export const Rating = ({
  rating,
  size = '14px',
  color = themeColors.blue3,
}: RatingProps) => {
  if (!rating) {
    return null;
  }

  const correctRating = Math.min(Math.max(Math.round(rating * 10), 0), 10);

  const amount = (correctRating - (correctRating % 2)) / 2;
  const hasHalf = correctRating % 2 > 0 ? true : false;

  const stars = [];

  const starConfig = {
    size,
    color,
  };

  for (let i = 0; i < 5; i += 1) {
    if (i < amount) {
      stars.push(
        <StyledStar key={i} {...starConfig} fillcolor={themeColors.blue3} />
      );
    } else if (hasHalf && i === amount) {
      stars.push(<StyledHalfStar key={i} {...starConfig} />);
    } else {
      stars.push(<StyledStar key={i} {...starConfig} />);
    }
  }

  return <StyledRatings>{stars.map(star => star)}</StyledRatings>;
};
