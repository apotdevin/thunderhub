import React from 'react';
import { Star } from 'react-feather';
import styled from 'styled-components';
import { HalfStar } from '../../assets/half-star.svg';
import { themeColors } from '../../styles/Themes';

const StyledStar = styled(Star)`
  margin-bottom: -1px;
`;

const StyledHalfStar = styled(HalfStar)`
  height: 18px;
  width: 18px;
  stroke-width: 2px;
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
        <StyledStar key={i} {...starConfig} fill={themeColors.blue3} />
      );
    } else if (hasHalf && i === amount) {
      stars.push(<StyledHalfStar key={i} {...starConfig} />);
    } else {
      stars.push(<StyledStar key={i} {...starConfig} />);
    }
  }

  return <StyledRatings>{stars.map(star => star)}</StyledRatings>;
};
