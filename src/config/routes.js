import Home from '@/components/pages/Home';
import Products from '@/components/pages/Products';
import QuoteCalculator from '@/components/pages/QuoteCalculator';
import MyPolicies from '@/components/pages/MyPolicies';
import Claims from '@/components/pages/Claims';
import PolicyDetails from '@/components/pages/PolicyDetails';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/home',
    icon: 'Home',
    component: Home
  },
  products: {
    id: 'products',
    label: 'Products',
    path: '/products',
    icon: 'Package',
    component: Products
  },
  myPolicies: {
    id: 'myPolicies',
    label: 'My Policies',
    path: '/my-policies',
    icon: 'FileText',
    component: MyPolicies
  },
  claims: {
    id: 'claims',
    label: 'Claims',
    path: '/claims',
    icon: 'FileCheck',
    component: Claims
  },
  quote: {
    id: 'quote',
    label: 'Get Quote',
    path: '/quote',
    icon: 'Calculator',
    component: QuoteCalculator,
    hideFromNav: true
  },
  policyDetails: {
    id: 'policyDetails',
    label: 'Policy Details',
    path: '/policy/:id',
    icon: 'FileText',
    component: PolicyDetails,
    hideFromNav: true
  }
};

export const routeArray = Object.values(routes);
export default routes;