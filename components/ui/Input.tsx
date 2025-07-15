import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

const Input: React.FC<InputProps> = ({ label, id, className, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-base font-bold text-pink-500 mb-1">
        {label}
      </label>
      <input
        id={id}
        className={`w-full px-4 py-3 border-2 border-pink-200 rounded-full shadow focus:ring-pink-300 focus:border-pink-400 bg-white text-lg transition-all duration-200 ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
