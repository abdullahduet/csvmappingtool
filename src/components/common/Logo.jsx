import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import logoLight from '../../assets/images/logo.png';
import logoDark from '../../assets/images/logo-dark.svg';

const Logo = ({ variant = 'light', showText = true, size = 'md', to = '/' }) => {
  const logoSrc = variant === 'light' ? logoLight : logoDark;
  
  // Size classes
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
    xl: 'h-12',
  };
  
  // Text size classes
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };
  
  return (
    <Link to={to} className="flex items-center">
      <img 
        src={logoSrc} 
        alt="ReactRedux Pro Logo" 
        className={`${sizeClasses[size]} w-auto`}
      />
      
      {showText && (
        <span className={`ml-2 font-bold ${textSizeClasses[size]} ${
          variant === 'light' ? 'text-white' : 'text-primary'
        }`}>
          ReactRedux Pro
        </span>
      )}
    </Link>
  );
};

Logo.propTypes = {
  variant: PropTypes.oneOf(['light', 'dark']),
  showText: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  to: PropTypes.string,
};

export default Logo;