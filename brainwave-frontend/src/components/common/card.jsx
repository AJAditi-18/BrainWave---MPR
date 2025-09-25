import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  padding = 'md', 
  shadow = 'md',
  hover = false,
  border = false,
  rounded = 'xl'
}) => {
  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl'
  };
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6', 
    lg: 'p-8',
    xl: 'p-10'
  };

  const roundedOptions = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full'
  };
  
  const hoverEffect = hover ? 'hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 cursor-pointer' : '';
  const borderStyle = border ? 'border border-gray-200' : '';
  
  return (
    <div className={`bg-white ${roundedOptions[rounded]} ${shadows[shadow]} ${paddings[padding]} ${hoverEffect} ${borderStyle} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
