import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';

const ClaimCard = ({ claim, index = 0 }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'processing': return 'warning';
      case 'submitted': return 'info';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'collision': return 'Car';
      case 'medical': return 'Heart';
      case 'property': return 'Home';
      case 'theft': return 'Shield';
      default: return 'FileText';
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
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
              <ApperIcon name={getTypeIcon(claim.type)} className="w-6 h-6 text-info" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 capitalize">
                {claim.type} Claim
              </h3>
              <p className="text-sm text-gray-500">Claim #{claim.id}</p>
            </div>
          </div>
          <Badge variant={getStatusVariant(claim.status)} className="capitalize">
            {claim.status}
          </Badge>
        </div>

        <p className="text-gray-600 mb-4 text-sm line-clamp-2">
          {claim.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Claim Amount</p>
            <p className="font-semibold text-gray-900">
              {formatCurrency(claim.amount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Filed Date</p>
            <p className="font-semibold text-gray-900">
              {format(new Date(claim.filedDate), 'MMM d, yyyy')}
            </p>
          </div>
        </div>

        {claim.documents && claim.documents.length > 0 && (
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center text-sm text-gray-500">
              <ApperIcon name="Paperclip" className="w-4 h-4 mr-1" />
              <span>{claim.documents.length} document{claim.documents.length > 1 ? 's' : ''}</span>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default ClaimCard;