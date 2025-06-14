import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';

const QuoteCard = ({ quote, index = 0, onPurchase }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'auto': return 'Car';
      case 'health': return 'Heart';
      case 'travel': return 'Plane';
      case 'home': return 'Home';
      default: return 'Shield';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const isExpired = new Date(quote.validUntil) < new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="p-6 relative">
        {isExpired && (
          <div className="absolute inset-0 bg-gray-50/80 rounded-card flex items-center justify-center">
            <div className="text-center">
              <ApperIcon name="Clock" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 font-medium">Quote Expired</p>
            </div>
          </div>
        )}
        
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name={getTypeIcon(quote.productType)} className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 capitalize">
                {quote.productType} Insurance
              </h3>
              <p className="text-sm text-gray-500">Quote #{quote.id}</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">Coverage Amount</p>
          <p className="font-semibold text-gray-900">
            {formatCurrency(quote.coverageOptions?.coverageAmount || 0)}
          </p>
        </div>

        <div className="bg-primary/5 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Annual Premium</span>
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(quote.premium)}
            </span>
          </div>
        </div>

        <div className="text-sm text-gray-500 mb-4">
          Valid until: {format(new Date(quote.validUntil), 'MMM d, yyyy')}
        </div>

        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            disabled={isExpired}
          >
            View Details
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            disabled={isExpired}
            onClick={() => onPurchase && onPurchase(quote)}
          >
            Purchase
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default QuoteCard;