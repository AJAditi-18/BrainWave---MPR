import React from 'react';

const Avatar = ({ 
  src, 
  alt, 
  size = 'md', 
  fallback = null,
  onClick,
  className = '',
  status = null // 'online', 'offline', 'away', 'busy'
}) => {
  const sizes = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
    '2xl': 'h-20 w-20'
  };

  const statusColors = {
    online: 'bg-green-400',
    offline: 'bg-gray-400',
    away: 'bg-yellow-400',
    busy: 'bg-red-400'
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl'
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word)
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isClickable = onClick ? 'cursor-pointer hover:ring-2 hover:ring-brainwave-primary' : '';

  return (
    <div className={`relative inline-block ${className}`}>
      <div 
        className={`${sizes[size]} rounded-full overflow-hidden ${isClickable} transition-all duration-200`}
        onClick={onClick}
      >
        {src ? (
          <img 
            src={src} 
            alt={alt || 'Avatar'} 
            className="h-full w-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        <div 
          className={`h-full w-full bg-brainwave-primary text-white flex items-center justify-center ${textSizes[size]} font-semibold ${src ? 'hidden' : ''}`}
        >
          {fallback || getInitials(alt)}
        </div>
      </div>
      
      {/* Status indicator */}
      {status && (
        <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white ${statusColors[status]}`} />
      )}
    </div>
  );
};

export default Avatar;
