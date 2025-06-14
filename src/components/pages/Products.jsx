import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const navigate = useNavigate();

  const insuranceProducts = [
    {
      id: 'auto-basic',
      type: 'auto',
      title: 'Basic Auto Insurance',
      description: 'Essential coverage for your vehicle with liability protection',
      price: 850,
      features: ['Liability Coverage', 'Collision Protection', 'Comprehensive Coverage', 'Uninsured Motorist'],
      icon: 'Car',
      color: 'bg-blue-500',
      popular: false
    },
    {
      id: 'auto-premium',
      type: 'auto',
      title: 'Premium Auto Insurance',
      description: 'Complete protection with additional benefits and lower deductibles',
      price: 1200,
      features: ['All Basic Features', 'Roadside Assistance', 'Rental Car Coverage', 'Gap Coverage', 'Lower Deductibles'],
      icon: 'Car',
      color: 'bg-blue-600',
      popular: true
    },
    {
      id: 'health-individual',
      type: 'health',
      title: 'Individual Health Plan',
      description: 'Comprehensive health coverage for individuals',
      price: 1450,
      features: ['Medical Expenses', 'Prescription Coverage', 'Preventive Care', 'Specialist Visits'],
      icon: 'Heart',
      color: 'bg-red-500',
      popular: false
    },
    {
      id: 'health-family',
      type: 'health',
      title: 'Family Health Plan',
      description: 'Complete health protection for your entire family',
      price: 2800,
      features: ['All Individual Features', 'Family Coverage', 'Maternity Benefits', 'Pediatric Care', 'Dental & Vision'],
      icon: 'Heart',
      color: 'bg-red-600',
      popular: true
    },
    {
      id: 'travel-domestic',
      type: 'travel',
      title: 'Domestic Travel Insurance',
      description: 'Protection for your travels within the country',
      price: 85,
      features: ['Trip Cancellation', 'Medical Emergency', 'Lost Luggage', 'Trip Delay'],
      icon: 'Plane',
      color: 'bg-green-500',
      popular: false
    },
    {
      id: 'travel-international',
      type: 'travel',
      title: 'International Travel Insurance',
      description: 'Comprehensive coverage for international trips',
      price: 185,
      features: ['All Domestic Features', 'Emergency Evacuation', 'Repatriation', 'Adventure Sports', '24/7 Support'],
      icon: 'Plane',
      color: 'bg-green-600',
      popular: true
    },
    {
      id: 'home-basic',
      type: 'home',
      title: 'Basic Home Insurance',
      description: 'Essential protection for your home and belongings',
      price: 720,
      features: ['Dwelling Protection', 'Personal Property', 'Liability Coverage', 'Additional Living Expenses'],
      icon: 'Home',
      color: 'bg-purple-500',
      popular: false
    },
    {
      id: 'home-premium',
      type: 'home',
      title: 'Premium Home Insurance',
      description: 'Complete home protection with enhanced coverage',
      price: 1150,
      features: ['All Basic Features', 'Replacement Cost', 'Identity Theft', 'Home Business', 'Umbrella Coverage'],
      icon: 'Home',
      color: 'bg-purple-600',
      popular: true
    }
  ];

  const filterOptions = [
    { id: 'all', label: 'All Products', icon: 'Grid3X3' },
    { id: 'auto', label: 'Auto', icon: 'Car' },
    { id: 'health', label: 'Health', icon: 'Heart' },
    { id: 'travel', label: 'Travel', icon: 'Plane' },
    { id: 'home', label: 'Home', icon: 'Home' }
  ];

  const filteredProducts = selectedType === 'all' 
    ? insuranceProducts 
    : insuranceProducts.filter(product => product.type === selectedType);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
};

  const handleGetQuote = (product) => {
    navigate(`/quote?type=${product.type}&product=${product.id}`);
  };

  const handleProductSelection = (product) => {
    setSelectedProducts(prev => {
      const isSelected = prev.some(p => p.id === product.id);
      if (isSelected) {
        return prev.filter(p => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const handleCompare = () => {
    setShowComparisonModal(true);
  };

  const handleClearComparison = () => {
    setSelectedProducts([]);
  };

  return (
    <>
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 font-display">
            Insurance Products
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive range of insurance products designed to protect what matters most to you
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {filterOptions.map((option) => (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedType(option.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedType === option.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
            >
              <ApperIcon name={option.icon} className="w-4 h-4" />
              <span>{option.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 h-full flex flex-col relative">
                {product.popular && (
                  <div className="absolute -top-3 left-6 bg-gradient-to-r from-primary to-secondary text-white px-3 py-1 rounded-full text-xs font-medium">
                    Most Popular
                  </div>
                )}
                
                {/* Comparison Checkbox */}
                <div className="absolute top-4 right-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedProducts.some(p => p.id === product.id)}
                      onChange={() => handleProductSelection(product)}
                      className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                    />
                    <span className="text-xs text-gray-600">Compare</span>
                  </label>
                </div>
                <div className="flex-1">
                  <div className={`w-12 h-12 ${product.color} rounded-lg flex items-center justify-center mb-4`}>
                    <ApperIcon name={product.icon} className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {product.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    {product.description}
                  </p>
                  
                  <div className="mb-4">
                    <div className="flex items-baseline">
                      <span className="text-2xl font-bold text-primary">
                        {formatCurrency(product.price)}
                      </span>
                      <span className="text-gray-500 text-sm ml-2">/year</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-600">
                        <ApperIcon name="Check" className="w-4 h-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <Button
                    onClick={() => handleGetQuote(product)}
                    className="w-full"
                    variant={product.popular ? 'primary' : 'outline'}
                  >
                    Get Quote
                  </Button>
                  <Button
                    variant="text"
                    className="w-full text-sm"
                    onClick={() => {
                      // Handle learn more
                    }}
                  >
                    Learn More
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Comparison Controls */}
        {selectedProducts.length > 0 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">
                {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected
              </span>
              <Button
                variant="text"
                size="sm"
                onClick={handleClearComparison}
                className="text-gray-500 hover:text-gray-700"
              >
                Clear Selection
              </Button>
            </div>
            <Button
              onClick={handleCompare}
              disabled={selectedProducts.length < 2}
              className="min-w-[120px]"
            >
              Compare Plans
            </Button>
          </div>
        )}

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <ApperIcon name="Search" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filter to see more products
            </p>
          </div>
        )}
        {/* CTA Section */}
        <section className="mt-16 text-center">
          <Card className="p-8 bg-gradient-to-r from-primary/5 to-secondary/5">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-display">
              Need Help Choosing?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our insurance experts are here to help you find the perfect coverage for your needs. Get personalized recommendations based on your situation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <ApperIcon name="MessageCircle" className="w-5 h-5 mr-2" />
                Chat with Expert
              </Button>
              <Button variant="outline" size="lg">
                <ApperIcon name="Phone" className="w-5 h-5 mr-2" />
                Call Us
              </Button>
            </div>
          </Card>
        </section>
      </div>

      {/* Comparison Modal */}
      {showComparisonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Compare Plans</h2>
              <button
                onClick={() => setShowComparisonModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ApperIcon name="X" className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-auto max-h-[calc(90vh-80px)]">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold text-gray-900">Feature</th>
                      {selectedProducts.map((product) => (
                        <th key={product.id} className="text-center p-4 min-w-[200px]">
                          <div className="flex flex-col items-center">
                            <div className={`w-12 h-12 ${product.color} rounded-lg flex items-center justify-center mb-2`}>
                              <ApperIcon name={product.icon} className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-semibold text-gray-900">{product.title}</h3>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">Annual Price</td>
                      {selectedProducts.map((product) => (
                        <td key={product.id} className="p-4 text-center">
                          <span className="text-2xl font-bold text-primary">
                            {formatCurrency(product.price)}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium text-gray-900">Description</td>
                      {selectedProducts.map((product) => (
                        <td key={product.id} className="p-4 text-center text-sm text-gray-600">
                          {product.description}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">Coverage Features</td>
                      {selectedProducts.map((product) => (
                        <td key={product.id} className="p-4">
                          <ul className="space-y-2 text-sm">
                            {product.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start">
                                <ApperIcon name="Check" className="w-4 h-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-600">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium text-gray-900">Insurance Type</td>
                      {selectedProducts.map((product) => (
                        <td key={product.id} className="p-4 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                            {product.type}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">Popularity</td>
                      {selectedProducts.map((product) => (
                        <td key={product.id} className="p-4 text-center">
                          {product.popular ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-primary to-secondary text-white">
                              Most Popular
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                {selectedProducts.map((product) => (
                  <Button
                    key={product.id}
                    onClick={() => handleGetQuote(product)}
                    variant={product.popular ? 'primary' : 'outline'}
                    className="flex-1 max-w-xs"
                  >
                    Get Quote - {product.title}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
)}
    </>
  );
};

export default Products;