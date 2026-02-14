import React from 'react';

import Track from '.';

const panels = [
  {
    imageUrl: 'https://placehold.co/1500x750?text=One',
    altText: 'Placeholder Image One',
    buttonText: 'Button Label 1',
    linkUrl: '#1',
  },
  {
    imageUrl: 'https://placehold.co/1500x750?text=Two',
    altText: 'Placeholder Image Two',
    buttonText: 'Button Label 2',
    linkUrl: '#2',
  },
  {
    imageUrl: 'https://placehold.co/1500x750?text=Three',
    altText: 'Placeholder Image Three',
    buttonText: 'Button Label 3',
    linkUrl: '#3',
  },
  {
    imageUrl: 'https://placehold.co/1500x750?text=Four',
    altText: 'Placeholder Image Four',
    buttonText: 'Button Label 4',
    linkUrl: '#4',
  },
  {
    imageUrl: 'https://placehold.co/1500x750?text=Five',
    altText: 'Placeholder Image Five',
    buttonText: 'Button Label 5',
    linkUrl: '#5',
  },
  {
    imageUrl: 'https://placehold.co/1500x750?text=Six',
    altText: 'Placeholder Image Six',
    buttonText: 'Button Label 6',
    linkUrl: '#6',
  },
  {
    imageUrl: 'https://placehold.co/1500x750?text=Seven',
    altText: 'Placeholder Image Seven',
    buttonText: 'Button Label 7',
    linkUrl: '#7',
  },
  {
    imageUrl: 'https://placehold.co/1500x750?text=Eight',
    altText: 'Placeholder Image Eight',
    buttonText: 'Button Label 8',
    linkUrl: '#8',
  },
];

const TrackParent = (props) => {
  const {
    utilities,
    peeking = true,
  } = props;
  
  return (
    <Track
      ariaLabel='Featured Content'
      utilities={utilities}
      peeking={peeking}
      panels={panels} 
    />
  );
};

export default TrackParent;