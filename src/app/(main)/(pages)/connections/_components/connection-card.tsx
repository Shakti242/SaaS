// _components/connection-card.tsx
import React from 'react';

type Props = {
  id: number;
  title: string;
  // other properties if any
};

const ConnectionCard = ({ title }: Props) => {
  return (
    <div>{title}</div>
  );
}

export default ConnectionCard;
