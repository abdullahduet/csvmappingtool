import StateManagement from '../components/features/StateManagement';
import Routing from '../components/features/Routing';
import APIIntegration from '../components/features/APIIntegration';
import Authentication from '../components/features/Authentication';
import Performance from '../components/features/Performance';

export const features = [
  {
    id: 'state-management',
    name: 'State Management',
    description: 'Efficient state management with Redux Toolkit',
    component: StateManagement,
    icon: 'database',
  },
  {
    id: 'routing',
    name: 'Routing',
    description: 'Seamless navigation with React Router',
    component: Routing,
    icon: 'git-fork',
  },
  {
    id: 'api-integration',
    name: 'API Integration',
    description: 'Streamlined API calls with thunks',
    component: APIIntegration,
    icon: 'exchange',
  },
  {
    id: 'authentication',
    name: 'Authentication',
    description: 'Secure user access control',
    component: Authentication,
    icon: 'lock',
  },
  {
    id: 'performance',
    name: 'Performance Optimization',
    description: 'Faster load times and better UX',
    component: Performance,
    icon: 'zap',
  },
];