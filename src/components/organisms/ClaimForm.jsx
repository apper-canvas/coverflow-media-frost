import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';
import { claimService } from '@/services';

const ClaimForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    policyId: '',
    type: '',
    amount: '',
    description: '',
    incidentDate: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const claimTypes = [
    { value: 'collision', label: 'Collision' },
    { value: 'medical', label: 'Medical' },
    { value: 'property', label: 'Property Damage' },
    { value: 'theft', label: 'Theft' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.policyId) newErrors.policyId = 'Policy ID is required';
    if (!formData.type) newErrors.type = 'Claim type is required';
    if (!formData.amount) newErrors.amount = 'Claim amount is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.incidentDate) newErrors.incidentDate = 'Incident date is required';
    if (!formData.location) newErrors.location = 'Location is required';
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const claimData = {
        ...formData,
        amount: parseFloat(formData.amount),
        incidentDate: new Date(formData.incidentDate).toISOString()
      };
      
      await claimService.create(claimData);
      toast.success('Claim submitted successfully!');
      
      // Reset form
      setFormData({
        policyId: '',
        type: '',
        amount: '',
        description: '',
        incidentDate: '',
        location: ''
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error('Failed to submit claim. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          File a New Claim
        </h3>
        <p className="text-gray-600 text-sm">
          Fill out the form below to submit your insurance claim
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Policy ID"
            name="policyId"
            value={formData.policyId}
            onChange={handleInputChange}
            error={errors.policyId}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Claim Type <span className="text-error">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.type ? 'border-error' : 'border-gray-300'
              }`}
            >
              <option value="">Select claim type</option>
              {claimTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-error">{errors.type}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Claim Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleInputChange}
            error={errors.amount}
            required
          />
          
          <Input
            label="Incident Date"
            name="incidentDate"
            type="date"
            value={formData.incidentDate}
            onChange={handleInputChange}
            error={errors.incidentDate}
            required
          />
        </div>

        <Input
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          error={errors.location}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-error">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none ${
              errors.description ? 'border-error' : 'border-gray-300'
            }`}
            placeholder="Provide a detailed description of the incident..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-error">{errors.description}</p>
          )}
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            className="px-8"
          >
            Submit Claim
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ClaimForm;