import React from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  size = 'md',
  className = '',
  ...props
}) => {
  const baseClasses = 'w-full bg-black bg-opacity-70 backdrop-blur-md border border-white border-opacity-20 text-white placeholder-white placeholder-opacity-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:border-white focus:border-opacity-40';
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-4 py-4 text-base'
  };
  
  const inputClasses = `${baseClasses} ${sizeClasses[size]} ${error ? 'border-white border-opacity-40' : ''} ${className}`;
  
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-white mb-2"
        >
          {label}
        </label>
      )}
      <input 
        id={inputId}
        className={inputClasses} 
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props} 
      />
      {error && (
        <p 
          id={`${inputId}-error`}
          className="mt-1 text-sm text-white"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
