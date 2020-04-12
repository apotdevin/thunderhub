import React from 'react';

interface EmojiProps {
  symbol: string;
  label?: string;
}

export const Emoji = ({ label, symbol }: EmojiProps) => (
  <span
    className="emoji"
    role="img"
    aria-label={label ? label : ''}
    aria-hidden={label ? 'false' : 'true'}
  >
    {symbol}
  </span>
);
