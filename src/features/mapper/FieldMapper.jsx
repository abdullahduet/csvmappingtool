import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Button from '../common/Button';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { csvOperationsActions } from '../../redux/slices/csvOperationsSlice';

// Field Item component for drag and drop
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

// Mapping connector component
const MappingConnector = ({ mapping, index, onUpdate, onRemove, targetFields, transformations }) => {
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
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-3">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Source Field</label>
          <div className={`p-3 rounded border ${!mapping.sourceField ? 'border-dashed border-border bg-gray-50' : 'border-solid border-blue-200 bg-blue-50'}`}>
            {mapping.sourceField || 'Drop source field here'}
          </div>
        </div>
        
        <div className="flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
        
        <div className="md:col-span-2">
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
          <option value="">No transformation</option>
          {transformations.map((transform) => (
            <option key={transform.id} value={transform.id}>
              {transform.name}
            </option>
          ))}
        </select>
      </div>
      
      {mapping.transformation && (
        <div className="mt-3 p-3 bg-accent rounded">
          <p className="text-sm">
            <span className="font-medium">Transformation:</span>{' '}
            {transformations.find(t => t.id === mapping.transformation)?.description || ''}
          </p>
        </div>
      )}
    </div>
  );
};

const FieldMapper = ({ sourceFields, targetFields, existingMapping, onSaveMapping }) => {
  const dispatch = useAppDispatch();
  
  // Available transformations
  const transformations = [
    { id: 'toUpperCase', name: 'Convert to Uppercase', description: 'Converts text to uppercase (e.g., "example" → "EXAMPLE")' },
    { id: 'toLowerCase', name: 'Convert to Lowercase', description: 'Converts text to lowercase (e.g., "EXAMPLE" → "example")' },
    { id: 'trim', name: 'Trim Whitespace', description: 'Removes leading and trailing whitespace' },
    { id: 'numberFormat', name: 'Format Number', description: 'Formats number with decimal places and thousands separators' },
    { id: 'dateFormat', name: 'Format Date', description: 'Converts date strings to a specified format' },
    { id: 'concatenate', name: 'Concatenate Fields', description: 'Combines multiple fields together' },
    { id: 'substring', name: 'Extract Substring', description: 'Gets a portion of text from a position' },
    { id: 'replace', name: 'Find and Replace', description: 'Replaces specified text with new text' },
  ];
  
  const [mappings, setMappings] = useState([]);
  
  // Initialize with existing mapping or create automatic mappings
  useEffect(() => {
    if (existingMapping && existingMapping.length > 0) {
      setMappings(existingMapping);
    } else if (sourceFields.length > 0 && targetFields.length > 0) {
      // Auto-map fields with the same name
      const initialMappings = [];
      
      sourceFields.forEach(sourceField => {
        // Check if there's a matching field in target
        if (targetFields.includes(sourceField)) {
          initialMappings.push({
            sourceField,
            targetField: sourceField,
            transformation: ''
          });
        }
      });
      
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
    
    // Save to Redux store
    dispatch(csvOperationsActions.setMappingConfig({
      fieldMappings: validMappings
    }));
    
    // Call parent callback if provided
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
                <MappingConnector
                  key={index}
                  mapping={mapping}
                  index={index}
                  onUpdate={updateMapping}
                  onRemove={removeMapping}
                  targetFields={targetFields}
                  transformations={transformations}
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
  sourceFields: PropTypes.array.isRequired,
  targetFields: PropTypes.array.isRequired,
  existingMapping: PropTypes.array,
  onSaveMapping: PropTypes.func
};

FieldMapper.defaultProps = {
  existingMapping: [],
};

export default FieldMapper;