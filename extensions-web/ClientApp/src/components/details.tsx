import { FC } from 'react';
import { useParams } from 'react-router-dom';

const Details: FC = () => {
  const { identifier, version } = 
    useParams<{ identifier: string, version: string }>();

  return (
    <div>
      <h1>{identifier}</h1>
      <p>Version: {version}</p>
    </div>
  );
};

export default Details;
