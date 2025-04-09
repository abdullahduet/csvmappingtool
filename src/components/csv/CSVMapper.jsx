import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Button from '../common/Button';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { csvOperationsActions } from '../../redux/slices/csvOperationsSlice';

// Draggable field item
const FieldItem = ({ field, type }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'FIELD',
    item: { field, type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  
  return (
    <div
      ref={drag}
      className={`p-2 mb-2 rounded border ${
        type === 'source' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'
      } cursor-move ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      {field}
    </div>
  );
};

// Droppable mapping container
const MappingContainer = ({ mapping, index, onUpdate, onRemove, targetFields }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'FIELD',
    drop: (item) => {
      if (item.type === 'source') {
        onUpdate(index, { ...mapping, sourceField: item.field });
      } else if (item.type === 'target') {
        onUpdate(index, { ...mapping, targetField: item.field });
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));
  
  // Transformation options
  const transformationOptions = [
    { value: '', label: 'No Transformation' },
    { value: 'toUpperCase', label: 'Convert to Uppercase' },
    { value: 'toLowerCase', label: 'Convert to Lowercase' },
    { value: 'trim', label: 'Trim Whitespace' },
    { value: 'numberFormat', label: 'Format Number' },
    { value: 'dateFormat', label: 'Format Date' },
  ];
  
  return (
    <div
      ref={drop}
      className={`p-4 mb-4 rounded border ${isOver ? 'border-primary bg-primary/5' : 'border-border'}`}
    >
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium">Mapping {index + 1}</h4>
        <button
          onClick={() => onRemove(index)}
          className="text-error hover:text-error-dark"
          aria-label="Remove mapping"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
        <div>
          <label className="block text-sm font-medium mb-1">Source Field</label>
          <div className={`p-3 rounded border ${!mapping.sourceField ? 'border-dashed' : 'border-solid'}`}>
            {mapping.sourceField || 'Drop source field here'}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Target Field</label>
          <select
            value={mapping.targetField || ''}
            onChange={(e) => onUpdate(index, { ...mapping, targetField: e.target.value })}
            className="w-full p-2 border border-border rounded"
          >
            <option value="">Select target field</option>
            {targetFields.map((field) => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Transformation</label>
        <select
          value={mapping.transformation || ''}
          onChange={(e) => onUpdate(index, { ...mapping, transformation: e.target.value })}
          className="w-full p-2 border border-border rounded"
        >
          {transformationOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

const FieldMapper = ({ sourceFields = [], targetFields = [], onSaveMapping }) => {
  const dispatch = useAppDispatch();
  const existingMapping = useAppSelector(state => state.csvOperations.mappingConfig.fieldMappings);
  
  const [mappings, setMappings] = useState([]);
  
  // Initialize with existing mapping if available
  useEffect(() => {
    if (existingMapping && existingMapping.length > 0) {
      setMappings(existingMapping);
    } else if (sourceFields.length > 0 && targetFields.length > 0) {
      // Auto-generate mappings for fields with same name
      const initialMappings = sourceFields
        .filter(field => targetFields.includes(field))
        .map(field => ({
          sourceField: field,
          targetField: field,
          transformation: ''
        }));
      
      setMappings(initialMappings);
    }
  }, [existingMapping, sourceFields, targetFields]);
  
  const addMapping = () => {
    setMappings([...mappings, { sourceField: '', targetField: '', transformation: '' }]);
  };
  
  const updateMapping = (index, newMapping) => {
    const updatedMappings = [...mappings];
    updatedMappings[index] = newMapping;
    setMappings(updatedMappings);
  };
  
  const removeMapping = (index) => {
    setMappings(mappings.filter((_, i) => i !== index));
  };
  
  const handleSaveMapping = () => {
    // Filter out incomplete mappings
    const validMappings = mappings.filter(
      mapping => mapping.sourceField && mapping.targetField
    );
    
    dispatch(csvOperationsActions.setMappingConfig({
      fieldMappings: validMappings
    }));
    
    if (onSaveMapping) {
      onSaveMapping(validMappings);
    }
  };
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Source Fields */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Source Fields</h3>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search source fields..."
              className="w-full p-2 border border-border rounded"
            />
          </div>
          <div className="max-h-96 overflow-y-auto">
            {sourceFields.map((field) => (
              <FieldItem key={field} field={field} type="source" />
            ))}
          </div>
        </div>
        
        {/* Mapping Area */}
        <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Field Mapping</h3>
            <Button
              onClick={addMapping}
              variant="secondary"
              size="sm"
            >
              Add Mapping
            </Button>
          </div>
          
          <div className="mb-4">
            {mappings.length > 0 ? (
              mappings.map((mapping, index) => (
                <MappingContainer
                  key={index}
                  mapping={mapping}
                  index={index}
                  onUpdate={updateMapping}
                  onRemove={removeMapping}
                  targetFields={targetFields}
                />
              ))
            ) : (
              <div className="p-8 text-center text-text-600 border border-dashed border-border rounded">
                Add a mapping or drag fields from the source list
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button
              onClick={handleSaveMapping}
              variant="primary"
              disabled={!mappings.some(m => m.sourceField && m.targetField)}
            >
              Save Mapping
            </Button>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

FieldMapper.propTypes = {
  sourceFields: PropTypes.array,
  targetFields: PropTypes.array,
  onSaveMapping: PropTypes.func
};

export default FieldMapper;