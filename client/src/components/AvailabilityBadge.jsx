import React from 'react';

const AvailabilityBadge = ({ isAvailable, className = "" }) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        isAvailable !== false
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      } ${className}`}
    >
      <span
        className={`w-2 h-2 rounded-full mr-1 ${
          isAvailable !== false ? 'bg-green-500' : 'bg-red-500'
        }`}
      ></span>
      {isAvailable !== false ? 'Available' : 'Not Available'}
    </span>
  );
};

export default AvailabilityBadge;
