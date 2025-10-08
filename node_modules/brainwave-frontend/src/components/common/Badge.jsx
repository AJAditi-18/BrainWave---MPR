import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '',
  icon = null,
  removable = false,
  onRemove
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-brainwave-primary text-white',
    secondary: 'bg-brainwave-secondary text-white',
    success: 'bg-brainwave-success text-white',
    warning: 'bg-brainwave-warning text-white',
    error: 'bg-brainwave-error text-white',
    info: 'bg-brainwave-accent text-white',
    outline: 'border border-gray-300 text-gray-700 bg-transparent'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  return (
    <span className={`inline-flex items-center space-x-1 rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
      {icon && <span>{icon}</span>}
      <span>{children}</span>
      {removable && (
        <button
          onClick={onRemove}
          className="ml-1 inline-flex items-center justify-center flex-shrink-0 h-4 w-4 rounded-full hover:bg-white hover:bg-opacity-20 focus:outline-none focus:bg-white focus:bg-opacity-20"
        >
          <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m1 1 6 6m0-6-6 6" />
          </svg>
        </button>
      )}
    </span>
  );
};

export default Badge;
