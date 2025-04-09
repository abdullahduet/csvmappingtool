import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const FeatureDropdown = ({ features }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mousemove', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !(event.clientX>999 && event.clientX<1085 && event.clientY>35 && event.clientY<55) ) {
      setIsOpen(false);
      document.removeEventListener('mousemove', handleClickOutside);
      document.removeEventListener('mousedown', handleClickOutside);
    }
  };

  // [1000, 35], [1000, 55], [1085, 35], [1082, 55]
  const handleNavigate = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="relative myFeaturesKeepOpen" ref={dropdownRef}>
      <button
        style={{ padding: '0', backgroundColor: 'unset', borderColor: 'transparent', outline: 'none' }}
        className="font-medium hover:text-primary transition-colors flex items-center hover:feature-button"
        onMouseEnter={() => { setIsOpen(true); document.addEventListener('mousedown', handleClickOutside)}}
        onMouseLeave={() => setTimeout(() => document.addEventListener('mousemove', handleClickOutside), 10)}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Features
        <svg
          className={`ml-1 h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white z-50 py-1"
          // onMouseLeave={() => setIsOpen(false)}
        >
          {features.map((feature) => (
            <div
              key={feature.id}
              className="px-4 py-2 hover:bg-accent cursor-pointer"
              onClick={() => handleNavigate(`/features/${feature.id}`)}
            >
              <div className="font-medium text-primary">{feature.name}</div>
              <div className="text-sm text-text-600">{feature.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

FeatureDropdown.propTypes = {
  features: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      component: PropTypes.elementType,
    })
  ).isRequired,
};

export default FeatureDropdown;