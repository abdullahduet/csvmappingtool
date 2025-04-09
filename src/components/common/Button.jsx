import React from 'react';
import PropTypes from 'prop-types';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  fullWidth = false,
  isLoading = false,
  loadingText = 'Loading...',
  leftIcon = null,
  rightIcon = null,
  ...rest
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-700 focus:ring-primary-500 disabled:bg-primary-300',
    secondary: 'bg-secondary text-white hover:bg-secondary-700 focus:ring-secondary-500 disabled:bg-secondary-300',
    outline: 'border bg-white border-primary text-primary hover:bg-primary-50 focus:ring-primary-500 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400',
    ghost: 'bg-transparent text-primary hover:bg-primary-50 focus:ring-primary-500 disabled:text-gray-400',
    success: 'bg-success text-white hover:bg-success-700 focus:ring-success-500 disabled:bg-success-300',
    error: 'bg-error text-white hover:bg-error-700 focus:ring-error-500 disabled:bg-error-300',
    outlineExt: 'border border-primary text-primary hover:bg-primary hover:text-black focus:ring-primary/50',
  };

  // Size-specific styling
  const sizeClasses = {
    xs: 'py-1 px-2 text-xs rounded',
    sm: 'py-1.5 px-3 text-sm rounded',
    md: 'py-2 px-4 text-sm rounded-md',
    lg: 'py-2.5 px-5 text-base rounded-md',
    xl: 'py-3 px-6 text-lg rounded-lg',
  };

  // Width class for full-width buttons
  const widthClass = fullWidth ? 'w-full' : '';

  // Combine all classes
  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${widthClass}
    ${disabled || isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `;

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && <LoadingSpinner />}
      {leftIcon && !isLoading && <span className="mr-2">{leftIcon}</span>}
      {isLoading && loadingText ? loadingText : children}
      {rightIcon && !isLoading && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'success', 'error', 'outlineExt']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
  isLoading: PropTypes.bool,
  loadingText: PropTypes.string,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node
};

export default Button;