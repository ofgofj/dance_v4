import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, className, title }) => {
  return (
    <div className={`bg-white shadow-lg rounded-3xl p-8 border-4 border-pink-100 hover:border-pink-200 transition-all duration-200 ${className}`}>
      {title && <h3 className="text-xl font-bold text-pink-500 border-b-2 border-pink-100 pb-3 mb-4">{title}</h3>}
      {children}
    </div>
  );
};

export default Card;
