import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../components/common/Button';

const existingFeatures = ['generateCSV', 'mapCsv', 'features', 'tutorials', 'cookie-policy', 'changelog', 'contact', 'about'];


const NotFound = () => {
  const location = useLocation();
  const comingSoon = existingFeatures.includes(location.pathname.slice(1));
  return (
    <div className="max-w-md mx-auto text-center mt-16 px-4">
      {comingSoon ? (
        <>
          <h1 className="text-6xl font-bold text-primary mb-4">503</h1>
          <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
          <p className="text-gray-600 mb-8">
            We're Launching Soon!
          </p>
          <Link to="/">
            <Button variant="outlineExt">
              Return to Home
            </Button>
          </Link>
        </>
      ) : <>
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="primary">
            Return to Home
          </Button>
        </Link>
      </>}
    </div>
  );
};

export default NotFound;