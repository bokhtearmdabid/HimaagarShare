import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  type = 'button',
  disabled = false,
  onClick,
  ...props 
}) => {
  const baseStyles = 'px-6 py-2.5 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-maroon text-white hover:bg-darkMaroon shadow-sm hover:shadow-md',
    secondary: 'bg-babyPink text-maroon hover:bg-babyPink/80 border border-maroon/20',
    outline: 'bg-transparent text-maroon border-2 border-maroon hover:bg-maroon hover:text-white',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md',
    ghost: 'bg-transparent text-maroon hover:bg-babyPink/50'
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
