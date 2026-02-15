import React from 'react';

const TrackPagination = ({ currentPageIndex, totalPages, onNavigate }) => {
  return (
    <ul className='track__pagination'>
      {Array.from({ length: totalPages }, (_, i) => (
        <li key={i}>
          <button
            data-page-index={i}
            aria-label={`Go To Page ${i + 1}`}
            aria-current={currentPageIndex === i ? 'true' : 'false'}
            onClick={() => onNavigate(i)}
          >
            <span className='pagination__number'>{i + 1}</span>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TrackPagination;