import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  options: { value: string | number; label: string }[];
}

const Select: React.FC<SelectProps> = ({ label, id, options, className, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        id={id}
        className={`w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${className}`}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
