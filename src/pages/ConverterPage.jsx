import React, { useState } from 'react';
import SEOHead from '../components/common/SEOHead';
import FileUploader from '../components/common/FileUploader';
import CSVPreview from '../components/csv/CSVPreview';
import FormatSelector from '../features/converter/FormatSelector';
import Button from '../components/common/Button';
import { useCSVParser } from '../hooks/useCSVParser';
import { useCSVConverter } from '../hooks/useCSVConverter';
import { useAppSelector } from '../hooks/useAppDispatch';

const ConverterPage = () => {
  const { parseCSV } = useCSVParser();
  const { convertCSV, conversionStatus, error } = useCSVConverter();
  
  const sourceData = useAppSelector(state => state.csvData.sourceData);
  const sourceColumns = useAppSelector(state => state.csvData.sourceColumns);
  const processedData = useAppSelector(state => state.csvData.processedData);
  
  const [selectedFormat, setSelectedFormat] = useState('json');
  const [conversionOptions, setConversionOptions] = useState({
    json: { pretty: true },
    xml: { rootElement: 'data', itemElement: 'item' },
    excel: { sheetName: 'Data' },
    sql: { tableName: 'data', createTable: true }
  });
  
  // Handle file upload
  const handleFileUpload = (file) => {
    parseCSV(file);
  };
  
  // Handle conversion
  const handleConvert = async () => {
    try {
      await convertCSV(selectedFormat, conversionOptions[selectedFormat]);
    } catch (err) {
      console.error('Conversion failed:', err);
    }
  };
  
  // Update format options
  const handleOptionChange = (format, key, value) => {
    setConversionOptions({
      ...conversionOptions,
      [format]: {
        ...conversionOptions[format],
        [key]: value
      }
    });
  };
  
  // Sample data option
  const useSampleData = () => {
    // Implementation for loading sample data
  };
  
  // Download converted data
  const handleDownload = () => {
    // Implementation for downloading converted data
  };
  
  return (
    <>
      <SEOHead 
        title="CSV Converter - Transform CSV to JSON, XML, Excel, and More"
        description="Convert your CSV files to various formats including JSON, XML, Excel, and SQL with our easy-to-use converter tool."
        keywords="csv converter, csv to json, csv to xml, csv to excel, csv to sql, format conversion"
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-primary mb-6">CSV Format Converter</h1>
          
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Upload CSV File</h2>
            
            <FileUploader
              onFileLoaded={handleFileUpload}
              label="Upload CSV to Convert"
              acceptedFileTypes=".csv"
            />
            
            <div className="text-center mt-4">
              <button 
                className="text-primary hover:underline"
                onClick={useSampleData}
              >
                Or use sample data
              </button>
            </div>
          </div>
          
          {sourceData && (
            <>
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Source Data Preview</h2>
                
                <CSVPreview 
                  data={sourceData}
                  columns={sourceColumns}
                  title="CSV Data"
                />
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Select Target Format</h2>
                
                <FormatSelector 
                  selectedFormat={selectedFormat}
                  onFormatChange={setSelectedFormat}
                  options={conversionOptions}
                  onOptionChange={handleOptionChange}
                />
                
                <div className="mt-6">
                  <Button
                    variant="primary"
                    onClick={handleConvert}
                    isLoading={conversionStatus === 'converting'}
                    disabled={conversionStatus === 'converting'}
                    className="w-full"
                  >
                    {conversionStatus === 'converting' ? 'Converting...' : `Convert to ${selectedFormat.toUpperCase()}`}
                  </Button>
                  
                  {error && (
                    <div className="mt-4 p-3 bg-error/10 border border-error rounded text-error text-sm">
                      {error}
                    </div>
                  )}
                </div>
              </div>
              
              {processedData && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Conversion Result</h2>
                  
                  <div className="bg-gray-800 text-white p-4 rounded-lg overflow-auto max-h-96 mb-6">
                    <pre className="text-sm whitespace-pre-wrap">
                      {typeof processedData === 'string' 
                        ? processedData 
                        : JSON.stringify(processedData, null, 2)
                      }
                    </pre>
                  </div>
                  
                  <Button
                    variant="primary"
                    onClick={handleDownload}
                    className="w-full"
                  >
                    Download {selectedFormat.toUpperCase()}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ConverterPage;