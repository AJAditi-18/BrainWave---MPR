import React, { useState } from 'react';

const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder = '',
  className = '',
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="mb-4 w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-brainwave-secondary font-semibold mb-2"
        >
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          pattern={type === 'email' ? "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" : undefined}
          title={type === 'email' ? "Please enter a valid email address (e.g., user@example.com)" : undefined}
          className={`w-full px-4 py-2 rounded-lg bg-white text-brainwave-primary border border-gray-300 focus:ring-2 focus:ring-brainwave-secondary focus:outline-none placeholder-brainwave-primary ${className}`}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brainwave-bg bg-transparent p-0 border-0 shadow-none outline-none"
            style={{ background: "none" }}
            tabIndex={-1}
          >
            {showPassword ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
