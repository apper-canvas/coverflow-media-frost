import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import QuickQuoteWidget from '@/components/organisms/QuickQuoteWidget';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import { policyService } from '@/services';

const Home = () => {
  const [stats, setStats] = useState({
    activePolicies: 0,
    totalCoverage: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadStats = async () => {
      try {
        const policies = await policyService.getAll();
        const activePolicies = policies.filter(p => p.status === 'active');
        const totalCoverage = activePolicies.reduce((sum, p) => sum + p.coverageAmount, 0);
        
        setStats({
          activePolicies: activePolicies.length,
          totalCoverage
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const insuranceTypes = [
    {
      id: 'auto',
      title: 'Auto Insurance',
      description: 'Protect your vehicle with comprehensive coverage',
      icon: 'Car',
      color: 'bg-blue-500',
      features: ['Collision Coverage', 'Liability Protection', '24/7 Roadside Assistance']
    },
    {
      id: 'health',
      title: 'Health Insurance',
      description: 'Comprehensive health coverage for you and your family',
      icon: 'Heart',
      color: 'bg-red-500',
      features: ['Medical Expenses', 'Prescription Coverage', 'Preventive Care']
    },
    {
      id: 'travel',
      title: 'Travel Insurance',
      description: 'Stay protected during your adventures',
      icon: 'Plane',
      color: 'bg-green-500',
      features: ['Trip Cancellation', 'Medical Emergency', 'Lost Luggage']
    },
    {
      id: 'home',
      title: 'Home Insurance',
      description: 'Secure your home and belongings',
      icon: 'Home',
      color: 'bg-purple-500',
      features: ['Property Damage', 'Personal Liability', 'Contents Coverage']
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mb-6 font-display"
            >
              Insurance Made Simple
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl mb-8 text-white/90"
            >
              Protect what matters most with our comprehensive insurance solutions
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                onClick={() => navigate('/products')}
                size="lg"
                className="bg-white text-primary hover:bg-gray-50"
              >
                Explore Products
                <ApperIcon name="ArrowRight" className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={() => navigate('/quote')}
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                Get Quote
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 py-12">
        {/* Stats Section */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Shield" className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {loading ? (
                    <div className="h-8 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    stats.activePolicies
                  )}
                </h3>
                <p className="text-gray-600">Active Policies</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="DollarSign" className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {loading ? (
                    <div className="h-8 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    formatCurrency(stats.totalCoverage)
                  )}
                </h3>
                <p className="text-gray-600">Total Coverage</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <QuickQuoteWidget />
            </motion.div>
          </div>
        </section>

        {/* Insurance Types */}
        <section className="mb-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-display">
              Our Insurance Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our comprehensive range of insurance products designed to protect you and your loved ones
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {insuranceTypes.map((type, index) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
              >
                <Card 
                  hover 
                  clickable 
                  onClick={() => navigate(`/products?type=${type.id}`)}
                  className="p-6 h-full"
                >
                  <div className={`w-12 h-12 ${type.color} rounded-lg flex items-center justify-center mb-4`}>
                    <ApperIcon name={type.icon} className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {type.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {type.description}
                  </p>
                  <ul className="space-y-2">
                    {type.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-500">
                        <ApperIcon name="Check" className="w-4 h-4 text-success mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="p-8 bg-gradient-to-r from-primary/5 to-secondary/5">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-display">
              Ready to Get Protected?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust us with their insurance needs. Get started today and secure your peace of mind.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/quote')}
                size="lg"
              >
                Get Your Quote
                <ApperIcon name="Calculator" className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={() => navigate('/my-policies')}
                variant="outline"
                size="lg"
              >
                View My Policies
                <ApperIcon name="FileText" className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Home;