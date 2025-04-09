import React from 'react';
import PropTypes from 'prop-types';

const FormatSelector = ({ selectedFormat, onFormatChange, options, onOptionChange }) => {
  const formats = [
    { id: 'json', name: 'JSON', icon: 'brackets-curly' },
    { id: 'xml', name: 'XML', icon: 'code' },
    { id: 'excel', name: 'Excel', icon: 'table' },
    { id: 'sql', name: 'SQL', icon: 'database' },
    { id: 'yaml', name: 'YAML', icon: 'file-text' }
  ];
  
  // Render format-specific options
  const renderOptions = () => {
    switch (selectedFormat) {
      case 'json':
        return (
          <div className="mt-4 p-4 bg-accent/20 rounded">
            <h3 className="font-medium mb-3">JSON Options</h3>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="pretty"
                checked={options.json.pretty}
                onChange={(e) => onOptionChange('json', 'pretty', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="pretty">Pretty Print (format with indentation)</label>
            </div>
          </div>
        );
        
      case 'xml':
        return (
          <div className="mt-4 p-4 bg-accent/20 rounded">
            <h3 className="font-medium mb-3">XML Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="rootElement" className="block text-sm font-medium mb-1">
                  Root Element Name
                </label>
                <input
                  type="text"
                  id="rootElement"
                  value={options.xml.rootElement}
                  onChange={(e) => onOptionChange('xml', 'rootElement', e.target.value)}
                  className="w-full p-2 border border-border rounded"
                />
              </div>
              <div>
                <label htmlFor="itemElement" className="block text-sm font-medium mb-1">
                  Item Element Name
                </label>
                <input
                  type="text"
                  id="itemElement"
                  value={options.xml.itemElement}
                  onChange={(e) => onOptionChange('xml', 'itemElement', e.target.value)}
                  className="w-full p-2 border border-border rounded"
                />
              </div>
            </div>
          </div>
        );
        
      case 'excel':
        return (
          <div className="mt-4 p-4 bg-accent/20 rounded">
            <h3 className="font-medium mb-3">Excel Options</h3>
            <div>
              <label htmlFor="sheetName" className="block text-sm font-medium mb-1">
                Sheet Name
              </label>
              <input
                type="text"
                id="sheetName"
                value={options.excel.sheetName}
                onChange={(e) => onOptionChange('excel', 'sheetName', e.target.value)}
                className="w-full p-2 border border-border rounded"
              />
            </div>
          </div>
        );
        
      case 'sql':
        return (
          <div className="mt-4 p-4 bg-accent/20 rounded">
            <h3 className="font-medium mb-3">SQL Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="tableName" className="block text-sm font-medium mb-1">
                  Table Name
                </label>
                <input
                  type="text"
                  id="tableName"
                  value={options.sql.tableName}
                  onChange={(e) => onOptionChange('sql', 'tableName', e.target.value)}
                  className="w-full p-2 border border-border rounded"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="createTable"
                  checked={options.sql.createTable}
                  onChange={(e) => onOptionChange('sql', 'createTable', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="createTable">Include CREATE TABLE statement</label>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {formats.map((format) => (
          <button
            key={format.id}
            onClick={() => onFormatChange(format.id)}
            className={`p-4 rounded-lg border flex flex-col items-center transition-colors ${
              selectedFormat === format.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
              selectedFormat === format.id ? 'bg-primary text-white' : 'bg-gray-100'
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {format.icon === 'brackets-curly' && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                )}
                {format.icon === 'code' && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                )}
                {format.icon === 'table' && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                )}
                {format.icon === 'database' && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                )}
                {format.icon === 'file-text' && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                )}
              </svg>
            </div>
            <span className="font-medium">{format.name}</span>
          </button>
        ))}
      </div>
      
      {renderOptions()}
    </div>
  );
};

FormatSelector.propTypes = {
  selectedFormat: PropTypes.string.isRequired,
  onFormatChange: PropTypes.func.isRequired,
  options: PropTypes.object.isRequired,
  onOptionChange: PropTypes.func.isRequired
};

export default FormatSelector;