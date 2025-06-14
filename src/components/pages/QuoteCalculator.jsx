import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';
import { quoteService } from '@/services';

const QuoteCalculator = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState(null);
  const [formData, setFormData] = useState({
    productType: searchParams.get('type') || '',
    coverageAmount: '',
    deductible: '',
    age: '',
    location: '',
    vehicleYear: '',
    vehicleMake: '',
    vehicleModel: '',
    tripDestination: '',
    tripDuration: '',
    travelers: '',
    propertyValue: '',
    propertyType: ''
  });

  const totalSteps = 3;

  const productTypes = [
    { id: 'auto', label: 'Auto Insurance', icon: 'Car' },
    { id: 'health', label: 'Health Insurance', icon: 'Heart' },
    { id: 'travel', label: 'Travel Insurance', icon: 'Plane' },
    { id: 'home', label: 'Home Insurance', icon: 'Home' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductTypeSelect = (type) => {
    setFormData(prev => ({
      ...prev,
      productType: type
    }));
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleCalculateQuote = async () => {
    setLoading(true);
    try {
      const coverageOptions = {
        coverageAmount: parseInt(formData.coverageAmount),
        deductible: parseInt(formData.deductible),
        age: parseInt(formData.age) || undefined,
        location: formData.location,
        vehicleYear: parseInt(formData.vehicleYear) || undefined,
        vehicleMake: formData.vehicleMake,
        vehicleModel: formData.vehicleModel,
        destination: formData.tripDestination,
        duration: parseInt(formData.tripDuration) || undefined,
        travelers: parseInt(formData.travelers) || undefined,
        propertyValue: parseInt(formData.propertyValue) || undefined,
        propertyType: formData.propertyType
      };

      const result = await quoteService.calculateQuote(formData.productType, coverageOptions);
      setQuote(result);
      setCurrentStep(totalSteps);
    } catch (error) {
      toast.error('Failed to calculate quote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchasePolicy = async () => {
    if (!quote) return;
    
    try {
      // In a real app, this would navigate to a checkout/payment flow
      toast.success('Redirecting to checkout...');
      // Simulate navigation delay
      setTimeout(() => {
        navigate('/my-policies');
      }, 1500);
    } catch (error) {
      toast.error('Failed to proceed with purchase. Please try again.');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Select Insurance Type
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {productTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleProductTypeSelect(type.id)}
                    className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
                      formData.productType === type.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        formData.productType === type.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <ApperIcon name={type.icon} className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{type.label}</h4>
                        <p className="text-sm text-gray-500">Get coverage for your needs</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Coverage Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Coverage Amount"
                name="coverageAmount"
                type="number"
                value={formData.coverageAmount}
                onChange={handleInputChange}
                placeholder="100000"
                required
              />
              
              <Input
                label="Deductible"
                name="deductible"
                type="number"
                value={formData.deductible}
                onChange={handleInputChange}
                placeholder="500"
                required
              />
              
              <Input
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="30"
              />
              
              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="New York, NY"
                required
              />
            </div>

            {/* Product-specific fields */}
            {formData.productType === 'auto' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="Vehicle Year"
                  name="vehicleYear"
                  type="number"
                  value={formData.vehicleYear}
                  onChange={handleInputChange}
                  placeholder="2022"
                />
                
                <Input
                  label="Vehicle Make"
                  name="vehicleMake"
                  value={formData.vehicleMake}
                  onChange={handleInputChange}
                  placeholder="Toyota"
                />
                
                <Input
                  label="Vehicle Model"
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={handleInputChange}
                  placeholder="Camry"
                />
              </div>
            )}

            {formData.productType === 'travel' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="Destination"
                  name="tripDestination"
                  value={formData.tripDestination}
                  onChange={handleInputChange}
                  placeholder="Europe"
                />
                
                <Input
                  label="Trip Duration (days)"
                  name="tripDuration"
                  type="number"
                  value={formData.tripDuration}
                  onChange={handleInputChange}
                  placeholder="14"
                />
                
                <Input
                  label="Number of Travelers"
                  name="travelers"
                  type="number"
                  value={formData.travelers}
                  onChange={handleInputChange}
                  placeholder="2"
                />
              </div>
            )}

            {formData.productType === 'home' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Property Value"
                  name="propertyValue"
                  type="number"
                  value={formData.propertyValue}
                  onChange={handleInputChange}
                  placeholder="300000"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select property type</option>
                    <option value="single-family">Single Family Home</option>
                    <option value="condo">Condominium</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="apartment">Apartment</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {quote ? (
              <>
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <ApperIcon name="Check" className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Your Quote is Ready!
                  </h3>
                  <p className="text-gray-600">
                    Here's your personalized insurance quote
                  </p>
                </div>

                <Card className="p-6 border-2 border-primary/20">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {formatCurrency(quote.premium)}
                    </div>
                    <div className="text-gray-600">Annual Premium</div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Base Premium</span>
                      <span className="font-semibold">
                        {formatCurrency(quote.breakdown?.basePremium || quote.premium * 0.7)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Taxes</span>
                      <span className="font-semibold">
                        {formatCurrency(quote.breakdown?.taxes || quote.premium * 0.18)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Fees</span>
                      <span className="font-semibold">
                        {formatCurrency(quote.breakdown?.fees || quote.premium * 0.12)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 font-bold text-lg">
                      <span>Total Annual Premium</span>
                      <span className="text-primary">{formatCurrency(quote.premium)}</span>
                    </div>
                  </div>
                </Card>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <ApperIcon name="Info" className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900">Quote Valid for 30 Days</h4>
                      <p className="text-blue-700 text-sm">
                        This quote is valid until {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}. 
                        Purchase your policy to lock in this rate.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Calculating your quote...</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 font-display">
            Get Your Quote
          </h1>
          <p className="text-gray-600">
            Get a personalized insurance quote in just a few simple steps
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i + 1 <= currentStep
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {i + 1 <= currentStep ? (
                    <ApperIcon name="Check" className="w-4 h-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < totalSteps - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    i + 1 < currentStep ? 'bg-primary' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <span className="text-sm text-gray-500">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
        </div>

        {/* Step Content */}
        <Card className="p-8 mb-8">
          {renderStepContent()}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClick={handlePrevStep}
            variant="outline"
            disabled={currentStep === 1}
            className={currentStep === 1 ? 'invisible' : ''}
          >
            <ApperIcon name="ChevronLeft" className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-4">
            {currentStep < totalSteps - 1 && (
              <Button
                onClick={handleNextStep}
                disabled={!formData.productType && currentStep === 1}
              >
                Next
                <ApperIcon name="ChevronRight" className="w-4 h-4 ml-2" />
              </Button>
            )}
            
            {currentStep === totalSteps - 1 && (
              <Button
                onClick={handleCalculateQuote}
                loading={loading}
                disabled={!formData.coverageAmount || !formData.deductible}
              >
                Calculate Quote
                <ApperIcon name="Calculator" className="w-4 h-4 ml-2" />
              </Button>
            )}
            
            {currentStep === totalSteps && quote && (
              <div className="flex space-x-4">
                <Button
                  onClick={() => navigate('/products')}
                  variant="outline"
                >
                  Compare Products
                </Button>
                <Button
                  onClick={handlePurchasePolicy}
                >
                  Purchase Policy
                  <ApperIcon name="CreditCard" className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteCalculator;