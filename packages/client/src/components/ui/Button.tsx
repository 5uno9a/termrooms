import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'brown' | 'brown-light';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-white text-black hover:bg-black hover:text-white shadow-md hover:shadow-lg',
    secondary: 'bg-black bg-opacity-70 backdrop-blur-md border border-white border-opacity-20 text-white hover:bg-white hover:text-black hover:border-opacity-100 shadow-md hover:shadow-lg',
    outline: 'border-2 border-white text-white hover:bg-white hover:text-black shadow-md hover:shadow-lg',
    ghost: 'text-white hover:text-black hover:bg-white hover:bg-opacity-100 backdrop-blur-sm',
    brown: 'bg-white text-black hover:bg-black hover:text-white shadow-md hover:shadow-lg',
    'brown-light': 'bg-white text-black hover:bg-black hover:text-white shadow-md hover:shadow-lg'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-6 py-4 text-base'
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <button 
      className={classes} 
      role="button"
      aria-pressed={props['aria-pressed']}
      aria-expanded={props['aria-expanded']}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
