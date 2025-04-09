// src/components/features/Routing.jsx
import React from 'react';

const Routing = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-primary mb-4">Routing</h2>
        <p className="text-lg text-text-600 max-w-2xl mx-auto">
          Implement seamless navigation with React Router, creating a smooth user experience with client-side routing.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-8">
        <h3 className="text-xl font-semibold mb-4">Routing Features</h3>
        <p className="mb-6">
          Our implementation includes route protection, nested routes, dynamic routes, and route-based code splitting.
        </p>
        
        {/* Routing demo content would go here */}
      </div>
    </div>
  );
};

export default Routing;