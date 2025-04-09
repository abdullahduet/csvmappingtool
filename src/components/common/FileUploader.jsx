import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useCSVParser } from '../../hooks/useCSVParser';
import Button from '../common/Button';

const FileUploader = ({ 
  onFileLoaded, 
  acceptedFileTypes = '.csv',
  maxFileSize = 5242880, // 5MB
  parseOptions = {},
  label = 'Upload CSV File'
}) => {
  const fileInputRef = useRef(null);
  const { parseCSV, parseError, isLoading } = useCSVParser();
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState(null);
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const validateFile = (file) => {
    // Check file type
    if (!file.name.endsWith('.csv') && !file.type === 'text/csv') {
      setFileError('Please upload a CSV file');
      return false;
    }
    
    // Check file size
    if (file.size > maxFileSize) {
      setFileError(`File size exceeds the ${maxFileSize / 1048576}MB limit`);
      return false;
    }
    
    setFileError(null);
    return true;
  };
  
  const processFile = (file) => {
    if (validateFile(file)) {
      parseCSV(file, parseOptions);
      if (onFileLoaded) {
        onFileLoaded(file);
      }
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };
  
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  
  return (
    <div className="w-full">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          dragActive ? 'border-primary bg-primary/5' : 'border-border'
        } ${fileError ? 'border-error bg-error/5' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFileTypes}
          onChange={handleChange}
          className="hidden"
        />
        
        <div className="mb-4">
          <svg 
            className={`w-12 h-12 mx-auto ${fileError ? 'text-error' : 'text-primary'}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" 
            />
          </svg>
        </div>
        
        <p className="mb-2 text-sm font-medium">
          {dragActive ? 'Drop your file here' : label}
        </p>
        
        <p className="text-xs text-text-600 mb-4">
          Drag and drop your CSV file here, or click to browse
        </p>
        
        <Button
          type="button"
          onClick={handleButtonClick}
          disabled={isLoading}
          variant={fileError ? 'error' : 'primary'}
          size="sm"
        >
          {isLoading ? 'Processing...' : 'Select CSV File'}
        </Button>
        
        {(fileError || parseError) && (
          <div className="mt-3 text-sm text-error">
            {fileError || (parseError && 'Error parsing CSV file')}
          </div>
        )}
      </div>
    </div>
  );
};

FileUploader.propTypes = {
  onFileLoaded: PropTypes.func,
  acceptedFileTypes: PropTypes.string,
  maxFileSize: PropTypes.number,
  parseOptions: PropTypes.object,
  label: PropTypes.string
};

export default FileUploader;