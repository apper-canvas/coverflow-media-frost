import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';

const PolicyCard = ({ policy, index = 0 }) => {
  const navigate = useNavigate();

  const getTypeIcon = (type) => {
    switch (type) {
      case 'auto': return 'Car';
      case 'health': return 'Heart';
      case 'travel': return 'Plane';
      case 'home': return 'Home';
      default: return 'Shield';
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'expired': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card 
        hover 
        clickable 
        onClick={() => navigate(`/policy/${policy.id}`)}
        className="p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name={getTypeIcon(policy.type)} className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 capitalize">
                {policy.type} Insurance
              </h3>
              <p className="text-sm text-gray-500">Policy #{policy.id}</p>
            </div>
          </div>
          <Badge variant={getStatusVariant(policy.status)} className="capitalize">
            {policy.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Coverage Amount</p>
            <p className="font-semibold text-gray-900">
              {formatCurrency(policy.coverageAmount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Annual Premium</p>
            <p className="font-semibold text-gray-900">
              {formatCurrency(policy.premium)}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              Expires: {format(new Date(policy.endDate), 'MMM d, yyyy')}
            </span>
            <div className="flex items-center text-primary">
              <span>View Details</span>
              <ApperIcon name="ChevronRight" className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default PolicyCard;