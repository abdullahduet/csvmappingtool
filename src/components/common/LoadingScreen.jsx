import React from 'react';
import PropTypes from 'prop-types';

const LoadingScreen = ({ 
  message = 'Loading...',
  fullScreen = false,
  overlay = false,
  spinnerSize = 'md',
  spinnerColor = 'primary',
  spinnerType = 'border' // 'border' or 'dots'
}) => {
  // Determine container classes
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 flex items-center justify-center'
    : 'flex items-center justify-center py-12';
  
  // Add background styles based on overlay
  const backgroundClasses = overlay
    ? 'bg-black/50 backdrop-blur-sm'
    : 'bg-white';
  
  // Set spinner size
  const spinnerSizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };
  
  // Set spinner color
  const spinnerColorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    white: 'text-white',
    gray: 'text-gray-400'
  };
  
  // Render border spinner
  const renderBorderSpinner = () => (
    <div 
      className={`${spinnerSizeClasses[spinnerSize]} ${spinnerColorClasses[spinnerColor]} border-4 border-t-transparent rounded-full animate-spin`}
    ></div>
  );
  
  // Render dots spinner
  const renderDotsSpinner = () => (
    <div className="flex space-x-2">
      {[0, 1, 2].map(i => (
        <div 
          key={i}
          className={`${spinnerSize === 'sm' ? 'w-2 h-2' : spinnerSize === 'lg' ? 'w-4 h-4' : 'w-3 h-3'} 
                    ${spinnerColorClasses[spinnerColor]} rounded-full animate-bounce`}
          style={{ animationDelay: `${i * 0.1}s` }}
        ></div>
      ))}
    </div>
  );
  
  return (
    <div className={`${containerClasses} ${backgroundClasses}`}>
      <div className="text-center">
        {spinnerType === 'border' ? renderBorderSpinner() : renderDotsSpinner()}
        
        {message && (
          <p className={`mt-4 font-medium ${overlay ? 'text-white' : 'text-text-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

LoadingScreen.propTypes = {
  message: PropTypes.string,
  fullScreen: PropTypes.bool,
  overlay: PropTypes.bool,
  spinnerSize: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  spinnerColor: PropTypes.oneOf(['primary', 'secondary', 'white', 'gray']),
  spinnerType: PropTypes.oneOf(['border', 'dots'])
};

export default LoadingScreen;