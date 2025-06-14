import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ClaimCard from '@/components/molecules/ClaimCard';
import ClaimForm from '@/components/organisms/ClaimForm';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import { claimService } from '@/services';

const Claims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const loadClaims = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await claimService.getAll();
        setClaims(result);
      } catch (err) {
        setError(err.message || 'Failed to load claims');
      } finally {
        setLoading(false);
      }
    };

    loadClaims();
  }, []);

  const filterOptions = [
    { id: 'all', label: 'All Claims', count: claims.length },
    { id: 'submitted', label: 'Submitted', count: claims.filter(c => c.status === 'submitted').length },
    { id: 'processing', label: 'Processing', count: claims.filter(c => c.status === 'processing').length },
    { id: 'approved', label: 'Approved', count: claims.filter(c => c.status === 'approved').length },
    { id: 'rejected', label: 'Rejected', count: claims.filter(c => c.status === 'rejected').length }
  ];

  const filteredClaims = filter === 'all' 
    ? claims 
    : claims.filter(claim => claim.status === filter);

  const getClaimStats = () => {
    const totalAmount = claims.reduce((sum, c) => sum + c.amount, 0);
    const approvedClaims = claims.filter(c => c.status === 'approved');
    const approvedAmount = approvedClaims.reduce((sum, c) => sum + c.amount, 0);
    const pendingClaims = claims.filter(c => ['submitted', 'processing'].includes(c.status));

    return {
      totalAmount,
      approvedAmount,
      pendingCount: pendingClaims.length
    };
  };

  const stats = getClaimStats();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleFormSuccess = async () => {
    setShowForm(false);
    // Reload claims
    const result = await claimService.getAll();
    setClaims(result);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
        <SkeletonLoader count={3} type="card" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <ErrorState
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 font-display">
          Claims
        </h1>
        <p className="text-gray-600">
          File new claims and track the status of your existing claims
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-card shadow-card p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="FileText" className="w-6 h-6 text-info" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Claims</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalAmount)}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-card shadow-card p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-success" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Approved Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.approvedAmount)}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-card shadow-card p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" className="w-6 h-6 text-warning" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Claims</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.pendingCount}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Button */}
      <div className="mb-8">
        <Button
          onClick={() => setShowForm(!showForm)}
          className="mb-4"
        >
          <ApperIcon name={showForm ? "X" : "Plus"} className="w-4 h-4 mr-2" />
          {showForm ? 'Cancel' : 'File New Claim'}
        </Button>
      </div>

      {/* Claim Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-8"
        >
          <ClaimForm onSuccess={handleFormSuccess} />
        </motion.div>
      )}

      {claims.length === 0 ? (
        <EmptyState
          title="No claims found"
          description="You haven't filed any claims yet. If you need to file a claim, use the form above to get started."
          actionLabel="File New Claim"
          onAction={() => setShowForm(true)}
          icon="FileCheck"
        />
      ) : (
        <>
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {filterOptions.map((option) => (
              <motion.button
                key={option.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilter(option.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  filter === option.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <span>{option.label}</span>
                <Badge 
                  variant={filter === option.id ? 'default' : 'primary'}
                  size="sm"
                  className={filter === option.id ? 'bg-white/20 text-white' : ''}
                >
                  {option.count}
                </Badge>
              </motion.button>
            ))}
          </div>

          {/* Claims Grid */}
          {filteredClaims.length === 0 ? (
            <EmptyState
              title={`No ${filter === 'all' ? '' : filter} claims found`}
              description={`You don't have any ${filter === 'all' ? '' : filter} claims at the moment.`}
              actionLabel="File New Claim"
              onAction={() => setShowForm(true)}
              icon="FileText"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClaims.map((claim, index) => (
                <ClaimCard key={claim.id} claim={claim} index={index} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Claims;