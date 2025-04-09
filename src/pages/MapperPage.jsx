import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SEOHead from '../components/common/SEOHead';
import FileUploader from '../components/common/FileUploader';
import CSVPreview from '../components/csv/CSVPreview';
import FieldMapper from '../components/csv/CSVMapper';
import Button from '../components/common/Button';
import { useCSVParser } from '../hooks/useCSVParser';
import { useCSVMapper } from '../hooks/useCSVMapper';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { csvDataActions } from '../redux/slices/csvDataSlice';

const MapperPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { parseCSV } = useCSVParser();
  const { applyMapping, mappingStatus, error } = useCSVMapper();
  
  const sourceData = useAppSelector(state => state.csvData.sourceData);
  const sourceColumns = useAppSelector(state => state.csvData.sourceColumns);
  const targetData = useAppSelector(state => state.csvData.targetData);
  const targetColumns = useAppSelector(state => state.csvData.targetColumns);
  const mappingConfig = useAppSelector(state => state.csvOperations.mappingConfig);
  
  const [currentStep, setCurrentStep] = useState('upload-source');
  
  // Step navigation
  const goToNextStep = () => {
    switch (currentStep) {
      case 'upload-source':
        setCurrentStep('upload-target');
        break;
      case 'upload-target':
        setCurrentStep('map-fields');
        break;
      case 'map-fields':
        handleProcessMapping();
        break;
      default:
        break;
    }
  };
  
  const goToPreviousStep = () => {
    switch (currentStep) {
      case 'upload-target':
        setCurrentStep('upload-source');
        break;
      case 'map-fields':
        setCurrentStep('upload-target');
        break;
      case 'results':
        setCurrentStep('map-fields');
        break;
      default:
        break;
    }
  };
  
  // Handle source file upload
  const handleSourceFileUpload = (file) => {
    parseCSV(file, { isSource: true });
  };
  
  // Handle target file upload
  const handleTargetFileUpload = (file) => {
    parseCSV(file, { isSource: false });
  };
  
  // Handle mapping process
  const handleProcessMapping = async () => {
    try {
      await applyMapping();
      setCurrentStep('results');
    } catch (err) {
      console.error('Mapping failed:', err);
    }
  };
  
  // Sample data option
  const useSampleData = (dataType) => {
    // Load predefined sample data
    if (dataType === 'source') {
      dispatch(csvDataActions.setSourceData({
        data: sampleSourceData,
        columns: Object.keys(sampleSourceData[0]),
        fileInfo: { name: 'sample-source.csv', size: 1024, lastModified: Date.now() }
      }));
    } else {
      dispatch(csvDataActions.setTargetData({
        data: sampleTargetData,
        columns: Object.keys(sampleTargetData[0]),
        fileInfo: { name: 'sample-target.csv', size: 1024, lastModified: Date.now() }
      }));
    }
  };
  
  // Download processed data
  const handleDownload = (format) => {
    // Implementation for downloading processed data in different formats
  };
  
  // Save mapping template
  const handleSaveTemplate = () => {
    // Implementation for saving the mapping configuration as a template
  };
  
  // Render different steps based on current state
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'upload-source':
        return (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Step 1: Upload Source CSV</h2>
            <p className="mb-6 text-text-600">
              Upload the CSV file containing your source data. This is the data you want to transform.
            </p>
            
            <FileUploader
              onFileLoaded={handleSourceFileUpload}
              label="Upload Source CSV"
              acceptedFileTypes=".csv"
            />
            
            <div className="text-center mt-6">
              <button 
                className="text-primary hover:underline"
                onClick={() => useSampleData('source')}
              >
                Or use sample source data
              </button>
            </div>
            
            {sourceData && (
              <div className="mt-8">
                <CSVPreview 
                  data={sourceData}
                  columns={sourceColumns}
                  title="Source Data Preview"
                />
                
                <div className="mt-6 flex justify-end">
                  <Button 
                    variant="primary"
                    onClick={goToNextStep}
                  >
                    Next: Upload Target Structure
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
        
      case 'upload-target':
        return (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Step 2: Upload Target Structure</h2>
            <p className="mb-6 text-text-600">
              Upload a CSV file that represents your target data structure. This defines the output format.
            </p>
            
            <FileUploader
              onFileLoaded={handleTargetFileUpload}
              label="Upload Target CSV"
              acceptedFileTypes=".csv"
            />
            
            <div className="text-center mt-6">
              <button 
                className="text-primary hover:underline"
                onClick={() => useSampleData('target')}
              >
                Or use sample target structure
              </button>
            </div>
            
            {targetData && (
              <div className="mt-8">
                <CSVPreview 
                  data={targetData}
                  columns={targetColumns}
                  title="Target Structure Preview"
                />
              </div>
            )}
            
            <div className="mt-6 flex justify-between">
              <Button 
                variant="outline"
                onClick={goToPreviousStep}
              >
                Back
              </Button>
              
              <Button 
                variant="primary"
                onClick={goToNextStep}
                disabled={!targetData}
              >
                Next: Map Fields
              </Button>
            </div>
          </div>
        );
        
      case 'map-fields':
        return (
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Step 3: Map Fields</h2>
            <p className="mb-6 text-text-600">
              Define how fields from your source data map to your target structure.
              Drag source fields to target fields or use the dropdown selectors.
            </p>
            
            <FieldMapper 
              sourceFields={sourceColumns}
              targetFields={targetColumns}
              existingMapping={mappingConfig.fieldMappings}
            />
            
            <div className="mt-8 flex justify-between">
              <Button 
                variant="outline"
                onClick={goToPreviousStep}
              >
                Back
              </Button>
              
              <div className="space-x-4">
                <Button 
                  variant="secondary"
                  onClick={handleSaveTemplate}
                >
                  Save Template
                </Button>
                
                <Button 
                  variant="primary"
                  onClick={handleProcessMapping}
                  isLoading={mappingStatus === 'mapping'}
                  disabled={mappingStatus === 'mapping'}
                >
                  Process Mapping
                </Button>
              </div>
            </div>
            
            {error && (
              <div className="mt-4 p-4 bg-error/10 border border-error rounded text-error">
                {error}
              </div>
            )}
          </div>
        );
        
      case 'results':
        return (
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Mapping Results</h2>
            <p className="mb-6 text-text-600">
              Your data has been successfully mapped to the target structure.
              Preview the results below and download in your preferred format.
            </p>
            
            <CSVPreview 
              data={useAppSelector(state => state.csvData.processedData)}
              columns={targetColumns}
              title="Processed Data Preview"
              showStats={true}
            />
            
            <div className="mt-8 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Download Options</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline"
                  onClick={() => handleDownload('csv')}
                  className="flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download CSV
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => handleDownload('json')}
                  className="flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download JSON
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => handleDownload('excel')}
                  className="flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Excel
                </Button>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <Button 
                variant="outline"
                onClick={goToPreviousStep}
              >
                Edit Mapping
              </Button>
              
              <Button 
                variant="primary"
                onClick={() => navigate('/dashboard')}
              >
                Save to Dashboard
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <>
      <SEOHead 
        title="CSV Mapper - Map Between Different CSV Structures"
        description="Transform your CSV data by mapping fields between different structures. Our intuitive interface makes complex transformations simple."
        keywords="csv mapping, csv transformation, field mapping, data mapping, csv fields"
      />
      
      <div className="container mx-auto px-4 py-12">
        {/* Progress indicator */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            <div className={`flex flex-col items-center ${currentStep === 'upload-source' ? 'text-primary' : 'text-text-600'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep === 'upload-source' ? 'bg-primary text-white' : currentStep === 'upload-target' || currentStep === 'map-fields' || currentStep === 'results' ? 'bg-success text-white' : 'bg-border text-text'}`}>
                1
              </div>
              <span className="text-sm">Source CSV</span>
            </div>
            
            <div className={`flex-1 h-1 mx-2 ${currentStep === 'upload-source' ? 'bg-border' : 'bg-success'}`}></div>
            
            <div className={`flex flex-col items-center ${currentStep === 'upload-target' ? 'text-primary' : currentStep === 'map-fields' || currentStep === 'results' ? 'text-success' : 'text-text-600'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep === 'upload-target' ? 'bg-primary text-white' : currentStep === 'map-fields' || currentStep === 'results' ? 'bg-success text-white' : 'bg-border text-text'}`}>
                2
              </div>
              <span className="text-sm">Target Structure</span>
            </div>
            
            <div className={`flex-1 h-1 mx-2 ${currentStep === 'upload-source' || currentStep === 'upload-target' ? 'bg-border' : 'bg-success'}`}></div>
            
            <div className={`flex flex-col items-center ${currentStep === 'map-fields' ? 'text-primary' : currentStep === 'results' ? 'text-success' : 'text-text-600'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep === 'map-fields' ? 'bg-primary text-white' : currentStep === 'results' ? 'bg-success text-white' : 'bg-border text-text'}`}>
                3
              </div>
              <span className="text-sm">Field Mapping</span>
            </div>
            
            <div className={`flex-1 h-1 mx-2 ${currentStep === 'results' ? 'bg-success' : 'bg-border'}`}></div>
            
            <div className={`flex flex-col items-center ${currentStep === 'results' ? 'text-primary' : 'text-text-600'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep === 'results' ? 'bg-primary text-white' : 'bg-border text-text'}`}>
                4
              </div>
              <span className="text-sm">Results</span>
            </div>
          </div>
        </div>
        
        {renderCurrentStep()}
      </div>
    </>
  );
};

export default MapperPage;