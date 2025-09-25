import React from 'react';

const Loader = ({ 
  size = 'md', 
  color = 'primary',
  text = null,
  overlay = false,
  className = ''
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colors = {
    primary: 'text-brainwave-primary',
    white: 'text-white',
    gray: 'text-gray-500'
  };

  const Spinner = () => (
    <svg 
      className={`animate-spin ${sizes[size]} ${colors[color]} ${className}`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4">
          <Spinner />
          {text && <p className="text-gray-700">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <Spinner />
      {text && <span className="text-gray-700">{text}</span>}
    </div>
  );
};

export default Loader;
