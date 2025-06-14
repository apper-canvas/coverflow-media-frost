import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  clickable = false,
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-card shadow-card';
  const hoverClasses = hover ? 'hover:shadow-card-hover transition-shadow duration-200' : '';
  const clickableClasses = clickable ? 'cursor-pointer' : '';
  
  const classes = `${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`;
  
  if (hover || clickable) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={clickable ? { scale: 0.98 } : {}}
        className={classes}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;