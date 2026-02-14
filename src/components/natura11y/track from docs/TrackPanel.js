import React from 'react';

const TrackPanel = () => {
  return (
    <a className="backdrop" href='#1'>
      <div className="backdrop__media">
        <img class="opacity-50" src="https://placehold.co/1500x750" alt="Placeholder" />
      </div>
      <div className="backdrop__cover align-content-end">
        <div className="margin-2">
          <span className="button font-size-sm">Button</span>
        </div>
      </div>
    </a>
  );
};

export default TrackPanel;
