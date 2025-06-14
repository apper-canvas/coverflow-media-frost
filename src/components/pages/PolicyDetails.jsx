import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import { policyService, claimService } from '@/services';

const PolicyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadPolicyDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const [policyResult, claimsResult] = await Promise.all([
          policyService.getById(id),
          claimService.getByPolicyId(id)
        ]);
        setPolicy(policyResult);
        setClaims(claimsResult);
      } catch (err) {
        setError(err.message || 'Failed to load policy details');
      } finally {
        setLoading(false);
      }
    };

    loadPolicyDetails();
  }, [id]);

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

  const handleRenewPolicy = async () => {
    try {
      toast.success('Policy renewal initiated. You will receive confirmation shortly.');
    } catch (error) {
      toast.error('Failed to renew policy. Please try again.');
    }
  };

  const handleCancelPolicy = async () => {
    if (window.confirm('Are you sure you want to cancel this policy?')) {
      try {
        await policyService.update(id, { status: 'cancelled' });
        setPolicy(prev => ({ ...prev, status: 'cancelled' }));
        toast.success('Policy cancelled successfully');
      } catch (error) {
        toast.error('Failed to cancel policy. Please try again.');
      }
    }
  };

  const handleFileClaimClick = () => {
    navigate('/claims');
  };

  const handleDocumentDownload = (document) => {
    toast.info(`Downloading ${document.name}...`);
    // In a real app, this would trigger actual download
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Eye' },
    { id: 'coverage', label: 'Coverage Details', icon: 'Shield' },
    { id: 'claims', label: 'Claims History', icon: 'FileCheck' },
    { id: 'documents', label: 'Documents', icon: 'FileText' }
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <SkeletonLoader count={1} type="card" />
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

  if (!policy) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <ErrorState
          message="Policy not found"
          onRetry={() => navigate('/my-policies')}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Button
            variant="text"
            onClick={() => navigate('/my-policies')}
            className="mr-4"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Back to Policies
          </Button>
        </div>
        
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name={getTypeIcon(policy.type)} className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 capitalize font-display">
                {policy.type} Insurance
              </h1>
              <p className="text-gray-600">Policy #{policy.id}</p>
            </div>
          </div>
          <Badge variant={getStatusVariant(policy.status)} className="capitalize">
            {policy.status}
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Coverage Amount</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(policy.coverageAmount)}
            </p>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Annual Premium</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(policy.premium)}
            </p>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Start Date</p>
            <p className="text-lg font-semibold text-gray-900">
              {format(new Date(policy.startDate), 'MMM d, yyyy')}
            </p>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">End Date</p>
            <p className="text-lg font-semibold text-gray-900">
              {format(new Date(policy.endDate), 'MMM d, yyyy')}
            </p>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Button onClick={handleFileClaimClick}>
          <ApperIcon name="FileCheck" className="w-4 h-4 mr-2" />
          File Claim
        </Button>
        <Button variant="outline" onClick={handleRenewPolicy}>
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Renew Policy
        </Button>
        <Button variant="outline">
          <ApperIcon name="Download" className="w-4 h-4 mr-2" />
          Download Certificate
        </Button>
        <Button variant="outline" onClick={handleCancelPolicy}>
          <ApperIcon name="X" className="w-4 h-4 mr-2" />
          Cancel Policy
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Policy Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Policy Type</p>
                  <p className="font-medium text-gray-900 capitalize">{policy.type} Insurance</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Policy Status</p>
                  <Badge variant={getStatusVariant(policy.status)} className="capitalize">
                    {policy.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Coverage Amount</p>
                  <p className="font-medium text-gray-900">{formatCurrency(policy.coverageAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Annual Premium</p>
                  <p className="font-medium text-gray-900">{formatCurrency(policy.premium)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Policy Period</p>
                  <p className="font-medium text-gray-900">
                    {format(new Date(policy.startDate), 'MMM d, yyyy')} - {format(new Date(policy.endDate), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            </Card>

            {/* Type-specific information */}
            {policy.vehicleInfo && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Vehicle Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Make & Model</p>
                    <p className="font-medium text-gray-900">
                      {policy.vehicleInfo.make} {policy.vehicleInfo.model}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Year</p>
                    <p className="font-medium text-gray-900">{policy.vehicleInfo.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">VIN</p>
                    <p className="font-medium text-gray-900">{policy.vehicleInfo.vin}</p>
                  </div>
                </div>
              </Card>
            )}

            {policy.propertyInfo && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Property Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Address</p>
                    <p className="font-medium text-gray-900">{policy.propertyInfo.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Property Type</p>
                    <p className="font-medium text-gray-900 capitalize">{policy.propertyInfo.propertyType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Build Year</p>
                    <p className="font-medium text-gray-900">{policy.propertyInfo.buildYear}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Square Footage</p>
                    <p className="font-medium text-gray-900">{policy.propertyInfo.squareFootage?.toLocaleString()} sq ft</p>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        )}

        {activeTab === 'coverage' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Coverage Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">Primary Coverage</p>
                    <p className="text-sm text-gray-500">Main policy coverage amount</p>
                  </div>
                  <p className="font-bold text-primary">{formatCurrency(policy.coverageAmount)}</p>
                </div>
                
                {/* Add more coverage details based on policy type */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">Deductible</p>
                    <p className="text-sm text-gray-500">Amount you pay before coverage kicks in</p>
                  </div>
                  <p className="font-semibold text-gray-900">$500</p>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">Policy Limit</p>
                    <p className="text-sm text-gray-500">Maximum coverage amount</p>
                  </div>
                  <p className="font-semibold text-gray-900">{formatCurrency(policy.coverageAmount)}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'claims' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {claims.length === 0 ? (
              <Card className="p-8 text-center">
                <ApperIcon name="FileCheck" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Claims Filed</h3>
                <p className="text-gray-500 mb-4">You haven't filed any claims for this policy yet.</p>
                <Button onClick={handleFileClaimClick}>
                  <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                  File a Claim
                </Button>
              </Card>
            ) : (
              claims.map((claim) => (
                <Card key={claim.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 capitalize mb-1">
                        {claim.type} Claim
                      </h4>
                      <p className="text-sm text-gray-500">Claim #{claim.id}</p>
                    </div>
                    <Badge variant={claim.status === 'approved' ? 'success' : claim.status === 'processing' ? 'warning' : 'info'}>
                      {claim.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-4">{claim.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Claim Amount</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(claim.amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Filed Date</p>
                      <p className="font-semibold text-gray-900">
                        {format(new Date(claim.filedDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </motion.div>
        )}

        {activeTab === 'documents' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {policy.documents && policy.documents.length > 0 ? (
              policy.documents.map((document) => (
                <Card key={document.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <ApperIcon name="FileText" className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{document.name}</p>
                        <p className="text-sm text-gray-500 capitalize">{document.type} file</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDocumentDownload(document)}
                    >
                      <ApperIcon name="Download" className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center">
                <ApperIcon name="FileText" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Documents Available</h3>
                <p className="text-gray-500">Policy documents will appear here once they are generated.</p>
              </Card>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PolicyDetails;