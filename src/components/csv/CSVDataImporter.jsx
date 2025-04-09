import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Button from '../common/Button';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const CSVDataImporter = ({ onDataImport }) => {
  const [importMethod, setImportMethod] = useState('paste');
  const [pasteValue, setPasteValue] = useState('');
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  
  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setFileName(file.name);
    setError(null);
    setIsImporting(true);
    
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (['csv', 'txt'].includes(fileExtension)) {
      handleCSVFile(file);
    } else if (['xlsx', 'xls', 'ods'].includes(fileExtension)) {
      handleExcelFile(file);
    } else {
      setError('Unsupported file format. Please upload a CSV, Excel, or text file.');
      setIsImporting(false);
    }
  };
  
  // Handle CSV file
  const handleCSVFile = (file) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const csvText = event.target.result;
        parseCSVData(csvText);
      } catch (err) {
        setError(`Error reading CSV file: ${err.message}`);
        setIsImporting(false);
      }
    };
    
    reader.onerror = () => {
      setError('Failed to read the file');
      setIsImporting(false);
    };
    
    reader.readAsText(file);
  };
  
  // Handle Excel file
  const handleExcelFile = (file) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first worksheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to CSV
        const csvText = XLSX.utils.sheet_to_csv(worksheet);
        parseCSVData(csvText);
        
      } catch (err) {
        setError(`Error reading Excel file: ${err.message}`);
        setIsImporting(false);
      }
    };
    
    reader.onerror = () => {
      setError('Failed to read the file');
      setIsImporting(false);
    };
    
    reader.readAsArrayBuffer(file);
  };
  
  // Parse CSV data
  const parseCSVData = (csvText) => {
    try {
      Papa.parse(csvText, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            setError(`CSV parsing error: ${results.errors[0].message}`);
            setIsImporting(false);
            return;
          }
          
          // Extract headers (first row) and data
          if (results.data.length === 0) {
            setError('No data found in the file');
            setIsImporting(false);
            return;
          }
          
          const headers = results.data[0].map((header, index) => 
            header ? header : `Column ${index + 1}`
          );
          
          const data = results.data.slice(1);
          
          // Call the import callback
          onDataImport({
            headers,
            data
          });
          
          // Reset state
          setPasteValue('');
          setIsImporting(false);
        },
        error: (error) => {
          setError(`CSV parsing error: ${error.message}`);
          setIsImporting(false);
        }
      });
    } catch (err) {
      setError(`Error parsing CSV data: ${err.message}`);
      setIsImporting(false);
    }
  };
  
  // Handle data pasting
  const handlePaste = () => {
    if (!pasteValue.trim()) {
      setError('Please paste some data first');
      return;
    }
    
    setError(null);
    setIsImporting(true);
    
    try {
      // Detect if pasted content is TSV (tab-separated)
      const delimiter = pasteValue.includes('\t') ? '\t' : ',';
      
      Papa.parse(pasteValue, {
        header: false,
        skipEmptyLines: true,
        delimiter: delimiter,
        complete: (results) => {
          if (results.errors.length > 0) {
            setError(`Parsing error: ${results.errors[0].message}`);
            setIsImporting(false);
            return;
          }
          
          // Extract headers (first row) and data
          if (results.data.length === 0) {
            setError('No data found in the pasted content');
            setIsImporting(false);
            return;
          }
          
          const headers = results.data[0].map((header, index) => 
            header ? header : `Column ${index + 1}`
          );
          
          const data = results.data.slice(1);
          
          // Call the import callback
          onDataImport({
            headers,
            data
          });
          
          // Reset paste value
          setPasteValue('');
          setIsImporting(false);
        },
        error: (error) => {
          setError(`Parsing error: ${error.message}`);
          setIsImporting(false);
        }
      });
    } catch (err) {
      setError(`Error processing pasted data: ${err.message}`);
      setIsImporting(false);
    }
  };
  
  // Trigger file input click
  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };
  
  // Handle direct paste event
  const handleDirectPaste = (event) => {
    const clipboardData = event.clipboardData || window.clipboardData;
    const pastedText = clipboardData.getData('text');
    
    if (pastedText) {
      setPasteValue(pastedText);
      
      // Auto import on paste if in paste mode
      if (importMethod === 'paste') {
        setTimeout(() => {
          handlePaste();
        }, 0);
      }
    }
  };
  
  // Focus textarea on mode change
  React.useEffect(() => {
    if (importMethod === 'paste' && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [importMethod]);
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Import Data</h2>
      
      <div className="mb-4">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 font-medium rounded-t-md ${
              importMethod === 'paste'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-text hover:bg-gray-200'
            }`}
            onClick={() => setImportMethod('paste')}
          >
            Paste Data
          </button>
          <button
            className={`px-4 py-2 font-medium rounded-t-md ${
              importMethod === 'file'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-text hover:bg-gray-200'
            }`}
            onClick={() => setImportMethod('file')}
          >
            Upload File
          </button>
        </div>
        
        <div className="mt-1 p-4 border border-border rounded-b-md rounded-tr-md">
          {importMethod === 'paste' ? (
            <div>
              <p className="text-sm text-text-600 mb-2">
                Paste data from Excel, CSV, or any table format below:
              </p>
              <textarea
                ref={textareaRef}
                value={pasteValue}
                onChange={(e) => setPasteValue(e.target.value)}
                onPaste={handleDirectPaste}
                className="w-full h-32 p-2 border border-border rounded font-mono text-sm"
                placeholder="Paste your data here (e.g., from Excel, Google Sheets, or CSV)..."
              ></textarea>
              <div className="mt-4 flex justify-end">
                <Button
                  variant="primary"
                  onClick={handlePaste}
                  disabled={isImporting || !pasteValue.trim()}
                  isLoading={isImporting}
                >
                  Import Data
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-text-600 mb-2">
                Select a CSV, Excel, or text file from your computer:
              </p>
              <div className="flex items-center mt-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".csv,.txt,.xlsx,.xls,.ods"
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={handleBrowseClick}
                  className="mr-2"
                >
                  Browse Files
                </Button>
                <span className="text-sm text-text-600">
                  {fileName ? fileName : 'No file selected'}
                </span>
              </div>
              <p className="mt-4 text-sm text-text-600">
                Supported formats: CSV (.csv), Excel (.xlsx, .xls), Text (.txt), OpenDocument Spreadsheet (.ods)
              </p>
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <div className="p-3 mb-4 bg-error/10 border border-error rounded text-error text-sm">
          {error}
        </div>
      )}
      
      <div className="mt-2">
        <h3 className="font-medium mb-2">Quick Tips:</h3>
        <ul className="text-sm text-text-600 list-disc pl-5 space-y-1">
          <li>Headers will be extracted from the first row</li>
          <li>Empty cells will be preserved</li>
          <li>Copy and paste directly from Excel or Google Sheets</li>
          <li>Tab and comma-separated values are automatically detected</li>
        </ul>
      </div>
    </div>
  );
};

CSVDataImporter.propTypes = {
  onDataImport: PropTypes.func.isRequired
};

export default CSVDataImporter;