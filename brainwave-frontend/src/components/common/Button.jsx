import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  loading = false,
  icon = null,
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2';
  
  const variants = {
    primary: 'bg-brainwave-primary hover:bg-indigo-700 text-white focus:ring-brainwave-primary',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500',
    outline: 'border-2 border-brainwave-primary text-brainwave-primary hover:bg-brainwave-primary hover:text-white focus:ring-brainwave-primary',
    danger: 'bg-brainwave-error hover:bg-red-600 text-white focus:ring-brainwave-error',
    success: 'bg-brainwave-success hover:bg-green-600 text-white focus:ring-brainwave-success',
    warning: 'bg-brainwave-warning hover:bg-yellow-600 text-white focus:ring-brainwave-warning',
    ghost: 'text-brainwave-primary hover:bg-brainwave-primary hover:bg-opacity-10 focus:ring-brainwave-primary'
  };
  
  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  };
  
  return (
    <button 
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

export default Button;
