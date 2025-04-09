import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ColumnDefinitionForm = ({
  column,
  index,
  onUpdate,
  onRemove,
  isRemovable,
  dataTypes
}) => {
  const [localColumn, setLocalColumn] = useState(column);
  
  // Update parent when local state changes
  useEffect(() => {
    onUpdate(localColumn);
  }, [localColumn]);
  
  // Update local state when props change
  useEffect(() => {
    setLocalColumn(column);
  }, [column]);
  
  // Handle input changes
  const handleInputChange = (field, value) => {
    setLocalColumn(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle option changes
  const handleOptionChange = (option, value) => {
    setLocalColumn(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [option]: value
      }
    }));
  };
  
  // Render options based on data type
  const renderTypeOptions = () => {
    const type = localColumn.type;
    const options = localColumn.options;
    
    switch (type) {
      case 'fullName':
      case 'firstName':
      case 'lastName':
        return (
          <div className="mt-2">
            <label className="block text-sm font-medium mb-1">
              Gender
            </label>
            <select
              value={options.gender || 'both'}
              onChange={(e) => handleOptionChange('gender', e.target.value)}
              className="w-full p-2 border border-border rounded"
            >
              <option value="both">Any Gender</option>
              <option value="male">Male Only</option>
              <option value="female">Female Only</option>
            </select>
          </div>
        );
        
      case 'number':
        return (
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Min Value
              </label>
              <input
                type="number"
                value={options.min ?? 0}
                onChange={(e) => handleOptionChange('min', parseInt(e.target.value) || 0)}
                className="w-full p-2 border border-border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Max Value
              </label>
              <input
                type="number"
                value={options.max ?? 100}
                onChange={(e) => handleOptionChange('max', parseInt(e.target.value) || 100)}
                className="w-full p-2 border border-border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Decimal Places
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={options.decimals ?? 0}
                onChange={(e) => handleOptionChange('decimals', parseInt(e.target.value) || 0)}
                className="w-full p-2 border border-border rounded"
              />
            </div>
          </div>
        );
        
      case 'date':
        return (
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={options.startDate || '2000-01-01'}
                onChange={(e) => handleOptionChange('startDate', e.target.value)}
                className="w-full p-2 border border-border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                End Date
              </label>
              <input
                type="date"
                value={options.endDate || new Date().toISOString().split('T')[0]}
                onChange={(e) => handleOptionChange('endDate', e.target.value)}
                className="w-full p-2 border border-border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Format
              </label>
              <select
                value={options.format || 'YYYY-MM-DD'}
                onChange={(e) => handleOptionChange('format', e.target.value)}
                className="w-full p-2 border border-border rounded"
              >
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY/MM/DD">YYYY/MM/DD</option>
              </select>
            </div>
          </div>
        );
        
      case 'boolean':
        return (
          <div className="mt-2">
            <label className="block text-sm font-medium mb-1">
              True Probability (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={options.trueProbability ?? 50}
              onChange={(e) => handleOptionChange('trueProbability', parseInt(e.target.value) || 50)}
              className="w-full p-2 border border-border rounded"
            />
          </div>
        );
        
      case 'oneOf':
        return (
          <div className="mt-2">
            <label className="block text-sm font-medium mb-1">
              Values (comma separated)
            </label>
            <input
              type="text"
              value={options.values?.join(', ') || ''}
              onChange={(e) => {
                const valuesArray = e.target.value.split(',').map(v => v.trim()).filter(v => v);
                handleOptionChange('values', valuesArray);
              }}
              className="w-full p-2 border border-border rounded"
              placeholder="value1, value2, value3"
            />
          </div>
        );
        
      case 'string':
        return (
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Min Length
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={options.minLength ?? 5}
                onChange={(e) => handleOptionChange('minLength', parseInt(e.target.value) || 5)}
                className="w-full p-2 border border-border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Max Length
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={options.maxLength ?? 20}
                onChange={(e) => handleOptionChange('maxLength', parseInt(e.target.value) || 20)}
                className="w-full p-2 border border-border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Prefix
              </label>
              <input
                type="text"
                value={options.prefix || ''}
                onChange={(e) => handleOptionChange('prefix', e.target.value)}
                className="w-full p-2 border border-border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Suffix
              </label>
              <input
                type="text"
                value={options.suffix || ''}
                onChange={(e) => handleOptionChange('suffix', e.target.value)}
                className="w-full p-2 border border-border rounded"
              />
            </div>
          </div>
        );
        
      case 'email':
        return (
          <div className="mt-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id={`useNameColumn-${index}`}
                checked={options.useNameColumn || false}
                onChange={(e) => handleOptionChange('useNameColumn', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor={`useNameColumn-${index}`} className="text-sm">
                Generate from name column
              </label>
            </div>
            {options.useNameColumn && (
              <div className="mt-2">
                <label className="block text-sm font-medium mb-1">
                  Name Column
                </label>
                <input
                  type="text"
                  value={options.nameColumn || ''}
                  onChange={(e) => handleOptionChange('nameColumn', e.target.value)}
                  className="w-full p-2 border border-border rounded"
                  placeholder="name"
                />
              </div>
            )}
            <div className="mt-2">
              <label className="block text-sm font-medium mb-1">
                Domain
              </label>
              <input
                type="text"
                value={options.domain || 'example.com'}
                onChange={(e) => handleOptionChange('domain', e.target.value)}
                className="w-full p-2 border border-border rounded"
              />
            </div>
          </div>
        );
        
      case 'id':
        return (
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Prefix
              </label>
              <input
                type="text"
                value={options.prefix || ''}
                onChange={(e) => handleOptionChange('prefix', e.target.value)}
                className="w-full p-2 border border-border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Start At
              </label>
              <input
                type="number"
                min="0"
                value={options.startAt ?? 1}
                onChange={(e) => handleOptionChange('startAt', parseInt(e.target.value) || 1)}
                className="w-full p-2 border border-border rounded"
              />
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="p-4 border border-border rounded bg-white shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <label className="block text-sm font-medium">
          Column #{index + 1}
        </label>
        
        {isRemovable && (
          <button
            onClick={onRemove}
            className="text-error hover:text-error-dark"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
              />
            </svg>
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Column Name
          </label>
          <input
            type="text"
            value={localColumn.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full p-2 border border-border rounded"
            placeholder="Enter column name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Data Type
          </label>
          <select
            value={localColumn.type}
            onChange={(e) => {
              // Reset options when type changes
              handleInputChange('type', e.target.value);
              handleInputChange('options', {});
            }}
            className="w-full p-2 border border-border rounded"
          >
            <option value="">Select a type</option>
            
            {Object.entries(dataTypes).map(([category, types]) => (
              <optgroup key={category} label={category}>
                {types.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>
      
      {/* Render type-specific options */}
      {localColumn.type && renderTypeOptions()}
    </div>
  );
};

ColumnDefinitionForm.propTypes = {
  column: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    options: PropTypes.object.isRequired
  }).isRequired,
  index: PropTypes.number.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  isRemovable: PropTypes.bool.isRequired,
  dataTypes: PropTypes.object.isRequired
};

export default ColumnDefinitionForm;