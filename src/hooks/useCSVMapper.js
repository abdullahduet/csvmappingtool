// src/hooks/useCSVMapper.js
import { useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useAppDispatch';
import { csvDataActions } from '../redux/slices/csvDataSlice';
import { csvOperationsActions } from '../redux/slices/csvOperationsSlice';

export const useCSVMapper = () => {
  const dispatch = useAppDispatch();
  const sourceData = useAppSelector(state => state.csvData.sourceData);
  const mappingConfig = useAppSelector(state => state.csvOperations.mappingConfig);
  
  const [mappingStatus, setMappingStatus] = useState('idle');
  const [error, setError] = useState(null);
  
  // Transformation functions
  const transformations = {
    toUpperCase: (value) => String(value).toUpperCase(),
    toLowerCase: (value) => String(value).toLowerCase(),
    trim: (value) => String(value).trim(),
    numberFormat: (value, options = { decimals: 2, thousandsSep: ',' }) => {
      if (isNaN(value)) return value;
      const num = parseFloat(value);
      return num.toLocaleString(undefined, {
        minimumFractionDigits: options.decimals,
        maximumFractionDigits: options.decimals
      });
    },
    dateFormat: (value, options = { format: 'YYYY-MM-DD' }) => {
      try {
        const date = new Date(value);
        if (isNaN(date.getTime())) return value;
        
        // Simple date formatter (for more complex formatting, consider a library like date-fns)
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return options.format
          .replace('YYYY', year)
          .replace('MM', month)
          .replace('DD', day);
      } catch (err) {
        return value;
      }
    },
    concatenate: (value, row, options = { fields: [], separator: ' ' }) => {
      if (!options.fields || !options.fields.length) return value;
      
      return options.fields
        .map(field => row[field] || '')
        .join(options.separator || ' ');
    },
    substring: (value, _, options = { start: 0, end: undefined }) => {
      return String(value).substring(
        options.start || 0,
        options.end
      );
    },
    replace: (value, _, options = { find: '', replace: '' }) => {
      if (!options.find) return value;
      return String(value).replace(
        new RegExp(options.find, 'g'),
        options.replace || ''
      );
    }
  };
  
  // Apply mapping to source data
  const applyMapping = useCallback(async (config = mappingConfig) => {
    try {
      setMappingStatus('mapping');
      setError(null);
      
      if (!sourceData || !sourceData.length) {
        throw new Error('Source data is required for mapping');
      }
      
      if (!config.fieldMappings || !config.fieldMappings.length) {
        throw new Error('Field mappings are required');
      }
      
      // Apply the mapping to create new data
      const mappedData = sourceData.map(row => {
        const newRow = {};
        
        config.fieldMappings.forEach(mapping => {
          const { sourceField, targetField, transformation, options } = mapping;
          
          if (!sourceField || !targetField) return;
          
          // Get source value
          let value = row[sourceField];
          
          // Apply transformation if specified
          if (transformation && transformations[transformation]) {
            value = transformations[transformation](value, row, options);
          }
          
          // Assign to target field
          newRow[targetField] = value;
        });
        
        return newRow;
      });
      
      // Store processed data
      dispatch(csvDataActions.setProcessedData(mappedData));
      
      // Update operation status
      dispatch(csvOperationsActions.setOperationStatus('succeeded'));
      
      setMappingStatus('succeeded');
      return mappedData;
      
    } catch (err) {
      const errorMsg = err.message || 'Mapping operation failed';
      setError(errorMsg);
      
      // Update operation status and error
      dispatch(csvOperationsActions.setOperationError(errorMsg));
      
      setMappingStatus('failed');
      throw err;
    }
  }, [dispatch, sourceData, mappingConfig, transformations]);
  
  // Save mapping configuration
  const saveMapping = useCallback((config) => {
    dispatch(csvOperationsActions.setMappingConfig(config));
  }, [dispatch]);
  
  // Get available transformations
  const getTransformations = useCallback(() => {
    return Object.keys(transformations).map(key => ({
      id: key,
      name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
    }));
  }, [transformations]);
  
  return {
    applyMapping,
    saveMapping,
    getTransformations,
    mappingStatus,
    error
  };
};