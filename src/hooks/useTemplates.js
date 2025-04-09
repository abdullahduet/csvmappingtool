// src/hooks/useTemplates.js
import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import templateService from '../services/templateService';

export const useTemplates = () => {
  const { isAuthenticated } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Load user templates
  const loadTemplates = useCallback(async () => {
    if (!isAuthenticated) {
      setTemplates([]);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      const data = await templateService.getTemplates();
      setTemplates(data);
    } catch (err) {
      setError(err.message || 'Failed to load templates');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);
  
  // Save a template
  const saveTemplate = useCallback(async (template) => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to save templates');
    }
    
    try {
      setIsLoading(true);
      setError(null);
      const savedTemplate = await templateService.saveTemplate(template);
      
      // Update templates list
      setTemplates(prev => [savedTemplate, ...prev]);
      
      return savedTemplate;
    } catch (err) {
      setError(err.message || 'Failed to save template');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);
  
  // Delete a template
  const deleteTemplate = useCallback(async (templateId) => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      setError(null);
      await templateService.deleteTemplate(templateId);
      
      // Update templates list
      setTemplates(prev => prev.filter(t => t.id !== templateId));
    } catch (err) {
      setError(err.message || 'Failed to delete template');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);
  
  return {
    templates,
    isLoading,
    error,
    loadTemplates,
    saveTemplate,
    deleteTemplate
  };
};