import React from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppDispatch';
import { increment, decrement } from '../../redux/slices/counterSlice';
import Button from '../common/Button';

const StateManagement = () => {
  const count = useAppSelector(state => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-primary mb-4">State Management</h2>
        <p className="text-lg text-text-600 max-w-2xl mx-auto">
          Experience efficient state management with Redux Toolkit, simplifying complex state logic and enabling predictable application behavior.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h3 className="text-xl font-semibold mb-4">Counter Example</h3>
        <p className="mb-6">
          This simple counter demonstrates Redux state management. The counter value is stored in the global Redux store and can be updated through dispatched actions.
        </p>
        
        <div className="flex flex-col items-center justify-center">
          <div className="text-5xl font-bold text-primary mb-6">{count}</div>
          <div className="flex space-x-4">
            <Button onClick={() => dispatch(decrement())}>
              Decrement
            </Button>
            <Button variant="primary" onClick={() => dispatch(increment())}>
              Increment
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-accent rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Key Benefits</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-success mr-2">✓</span>
              <span>Centralized state management</span>
            </li>
            <li className="flex items-start">
              <span className="text-success mr-2">✓</span>
              <span>Predictable state updates</span>
            </li>
            <li className="flex items-start">
              <span className="text-success mr-2">✓</span>
              <span>DevTools for debugging</span>
            </li>
            <li className="flex items-start">
              <span className="text-success mr-2">✓</span>
              <span>Middleware for side effects</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-accent rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Implementation</h3>
          <p className="mb-4">
            Our toolkit uses Redux Toolkit for simplified Redux development:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>CreateSlice for reducer logic</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Immer for immutable updates</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Thunks for async operations</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Hooks for component integration</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StateManagement;