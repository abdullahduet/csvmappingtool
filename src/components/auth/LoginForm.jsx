import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { login, clearError, selectAuthStatus, selectAuthError, selectIsAuthenticated } from '../../redux/slices/authSlice';
import Button from '../common/Button';
import Input from '../common/Input';

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  
  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    
    // Clear any previous errors
    dispatch(clearError());
  }, [isAuthenticated, navigate, dispatch]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const resultAction = await dispatch(login(formData));
      
      if (login.fulfilled.match(resultAction)) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };
  
  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center text-primary">Login</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-error/10 border border-error rounded text-error text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <Input
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        
        <Input
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        
        <Button
          type="submit"
          variant="primary"
          disabled={status === 'loading'}
          fullWidth
          className="mt-4"
        >
          {status === 'loading' ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      
      <div className="mt-4 text-sm text-center text-gray-500">
        <p>Use username: admin, password: password</p>
      </div>
    </div>
  );
};

export default LoginForm;