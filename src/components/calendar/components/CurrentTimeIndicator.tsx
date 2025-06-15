
import React from 'react';

const CurrentTimeIndicator: React.FC = () => {
  return (
    <div
      className="absolute left-0 right-4 h-0.5 bg-red-500 z-10"
      style={{
        top: `${(new Date().getHours() * 60 + new Date().getMinutes())}px`
      }}
    >
      <div className="w-3 h-3 bg-red-500 rounded-full -translate-y-1 -translate-x-1"></div>
    </div>
  );
};

export default CurrentTimeIndicator;
