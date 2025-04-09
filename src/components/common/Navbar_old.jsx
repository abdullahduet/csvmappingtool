import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectIsAuthenticated, selectUser } from '../../redux/slices/authSlice';
import ProfileDropdown from '../auth/ProfileDropdown';
import FeatureDropdown from './FeatureDropdown';
import Button from './Button';
import logo from '../../assets/images/logo.png';
import { features } from '../../data/featuresData';

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
  
  // Nav links with active state
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Generate CSV', path: '/generateCSV' },
    { name: 'Map CSV', path: '/mapCsv' },
    // { name: 'Features', path: '/features' },
    // { name: 'Pricing', path: '/pricing' },
    { name: 'About', path: '/about' },
  ];
  
  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-6 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-white shadow-md py-2' // todo-future: bg-transparent py-4
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src={logo} 
            alt="ReactRedux Pro Logo" 
            className="h-10 w-auto" 
          />
          <span style={{"color": "#2c5282"}} className="ml-2 text-xl font-bold text-primary hidden md:block">
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
          <FeatureDropdown features={features} />
        </div>

        {/* Auth Controls */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {/* <Link 
                to="/dashboard" 
                className={`font-medium hover:text-primary transition-colors ${
                  location.pathname === '/dashboard' ? 'text-primary' : 'text-text'
                }`}
              >
                Dashboard
              </Link>
              <ProfileDropdown user={user} /> */}
            </>
          ) : (
            <>
              {/* <Link to="/login">
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
              </Link> */}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;