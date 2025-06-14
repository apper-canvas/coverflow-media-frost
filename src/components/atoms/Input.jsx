import { useState } from 'react';
import { motion } from 'framer-motion';

const Input = ({ 
  label, 
  type = 'text', 
  error, 
  success,
  required = false,
  className = '',
  ...props 
}) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleChange = (e) => {
    setHasValue(e.target.value.length > 0);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type={type}
          className={`w-full px-3 pt-6 pb-2 text-sm border rounded-lg transition-all duration-200 peer focus:outline-none focus:ring-2 focus:ring-offset-0 ${
            error 
              ? 'border-error focus:ring-error' 
              : success 
                ? 'border-success focus:ring-success' 
                : 'border-gray-300 focus:ring-primary focus:border-primary'
          }`}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={handleChange}
          placeholder=" "
          {...props}
        />
        <motion.label
          className={`absolute left-3 transition-all duration-200 pointer-events-none ${
            focused || hasValue || props.value
              ? 'top-2 text-xs text-gray-500'
              : 'top-4 text-sm text-gray-400'
          }`}
          animate={{
            y: focused || hasValue || props.value ? 0 : 0,
            scale: focused || hasValue || props.value ? 0.85 : 1,
          }}
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </motion.label>
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-error"
        >
          {error}
        </motion.p>
      )}
      
      {success && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-success"
        >
          {success}
        </motion.p>
      )}
    </div>
  );
};

export default Input;