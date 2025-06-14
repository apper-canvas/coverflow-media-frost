import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';

const QuickQuoteWidget = () => {
  const [selectedType, setSelectedType] = useState('');
  const navigate = useNavigate();

  const insuranceTypes = [
    { id: 'auto', label: 'Auto', icon: 'Car' },
    { id: 'health', label: 'Health', icon: 'Heart' },
    { id: 'travel', label: 'Travel', icon: 'Plane' },
    { id: 'home', label: 'Home', icon: 'Home' }
  ];

  const handleGetQuote = () => {
    if (selectedType) {
      navigate(`/quote?type=${selectedType}`);
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Get a Quick Quote
        </h3>
        <p className="text-gray-600 text-sm">
          Select your insurance type and get an instant quote
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {insuranceTypes.map((type) => (
          <motion.button
            key={type.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedType(type.id)}
            className={`p-4 rounded-lg border transition-all duration-200 ${
              selectedType === type.id
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            <ApperIcon name={type.icon} className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-medium">{type.label}</p>
          </motion.button>
        ))}
      </div>

      <Button 
        onClick={handleGetQuote}
        disabled={!selectedType}
        className="w-full"
      >
        Get Quote
        <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
      </Button>
    </Card>
  );
};

export default QuickQuoteWidget;