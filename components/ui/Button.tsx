import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-full font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md';

  const variantStyles = {
    primary: 'bg-gradient-to-r from-pink-400 via-pink-300 to-orange-300 text-white hover:from-pink-500 hover:to-orange-400 focus:ring-pink-300',
    secondary: 'bg-gradient-to-r from-blue-200 via-white to-pink-100 text-pink-600 border-2 border-pink-200 hover:from-blue-300 hover:to-pink-200 focus:ring-blue-200',
    danger: 'bg-gradient-to-r from-red-400 via-pink-400 to-yellow-300 text-white hover:from-red-500 hover:to-yellow-400 focus:ring-red-300',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-base',
    md: 'px-6 py-2.5 text-lg',
    lg: 'px-8 py-3 text-xl',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className} hover:scale-105 active:scale-95`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;