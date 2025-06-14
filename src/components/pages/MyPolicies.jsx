import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import PolicyCard from '@/components/molecules/PolicyCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import { policyService } from '@/services';
import { useNavigate } from 'react-router-dom';

const MyPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const loadPolicies = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await policyService.getAll();
        setPolicies(result);
      } catch (err) {
        setError(err.message || 'Failed to load policies');
      } finally {
        setLoading(false);
      }
    };

    loadPolicies();
  }, []);

  const filterOptions = [
    { id: 'all', label: 'All Policies', count: policies.length },
    { id: 'active', label: 'Active', count: policies.filter(p => p.status === 'active').length },
    { id: 'expired', label: 'Expired', count: policies.filter(p => p.status === 'expired').length },
    { id: 'pending', label: 'Pending', count: policies.filter(p => p.status === 'pending').length }
  ];

  const filteredPolicies = filter === 'all' 
    ? policies 
    : policies.filter(policy => policy.status === filter);

  const getPolicyStats = () => {
    const activePolicies = policies.filter(p => p.status === 'active');
    const totalCoverage = activePolicies.reduce((sum, p) => sum + p.coverageAmount, 0);
    const totalPremium = activePolicies.reduce((sum, p) => sum + p.premium, 0);
    const nearRenewal = activePolicies.filter(p => {
      const renewalDate = new Date(p.endDate);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return renewalDate <= thirtyDaysFromNow;
    }).length;

    return { totalCoverage, totalPremium, nearRenewal };
  };

  const stats = getPolicyStats();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
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

  if (policies.length === 0) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <EmptyState
          title="No policies found"
          description="You don't have any insurance policies yet. Get started by exploring our products and getting a quote."
          actionLabel="Explore Products"
          onAction={() => navigate('/products')}
          icon="Shield"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 font-display">
          My Policies
        </h1>
        <p className="text-gray-600">
          Manage your insurance policies and track your coverage
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
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Shield" className="w-6 h-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Coverage</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalCoverage)}
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
              <ApperIcon name="DollarSign" className="w-6 h-6 text-success" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Annual Premium</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalPremium)}
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
              <p className="text-sm font-medium text-gray-500">Renewal Alerts</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.nearRenewal}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Button onClick={() => navigate('/products')}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add New Policy
        </Button>
        <Button variant="outline" onClick={() => navigate('/quote')}>
          <ApperIcon name="Calculator" className="w-4 h-4 mr-2" />
          Get Quote
        </Button>
        <Button variant="outline" onClick={() => navigate('/claims')}>
          <ApperIcon name="FileCheck" className="w-4 h-4 mr-2" />
          File Claim
        </Button>
      </div>

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

      {/* Policies Grid */}
      {filteredPolicies.length === 0 ? (
        <EmptyState
          title={`No ${filter === 'all' ? '' : filter} policies found`}
          description={`You don't have any ${filter === 'all' ? '' : filter} policies at the moment.`}
          actionLabel="Explore Products"
          onAction={() => navigate('/products')}
          icon="FileText"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPolicies.map((policy, index) => (
            <PolicyCard key={policy.id} policy={policy} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPolicies;