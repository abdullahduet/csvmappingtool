import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectIsAuthenticated, selectUser } from '../../redux/slices/authSlice';
import ProfileDropdown from '../auth/ProfileDropdown';
import Button from './Button';
import logo from '../../assets/images/logo-1.svg';
import { features } from '../../data/featuresData';

// Feature dropdown component
const FeatureDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleNavigate = (path) => {
    setIsOpen(false);
    navigate(path);
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="font-medium hover:text-primary transition-colors flex items-center"
        onMouseEnter={() => setIsOpen(true)}
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
          className="absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-white z-50 py-1"
          onMouseLeave={() => setIsOpen(false)}
        >
          {features.map((feature) => (
            <div 
              key={feature.id}
              className="px-4 py-3 hover:bg-accent cursor-pointer border-b border-gray-100 last:border-b-0"
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

const Navbar = () => {
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Basic nav links
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/tools' },
    { name: 'Templates', path: '/templates' },
  ];
  
  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-6 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src={logo} 
            alt="CSV Mapping Tool Logo" 
            className="h-10 w-auto" 
          />
          <span className="ml-2 text-xl font-bold text-primary hidden md:block">
            CSV Mapping Tool
          </span>
        </Link>
        
        {/* Navigation Links - Hidden on mobile */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-medium hover:text-primary transition-colors ${
                location.pathname === link.path ? 'text-primary' : 'text-text'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <FeatureDropdown />
        </div>
        
        {/* Auth Controls */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                className={`font-medium hover:text-primary transition-colors ${
                  location.pathname === '/dashboard' ? 'text-primary' : 'text-text'
                }`}
              >
                Dashboard
              </Link>
              <ProfileDropdown user={user} />
            </>
          ) : (
            <>
              <Link to="/upload">
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="hidden sm:inline-flex"
                >
                  Upload CSV
                </Button>
              </Link>
              <Link to="/login">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="hidden md:inline-flex"
                >
                  Log In
                </Button>
              </Link>
              <Link to="/signup">
                <Button 
                  variant="primary" 
                  size="sm"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;