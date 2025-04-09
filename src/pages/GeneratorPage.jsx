import React, { useState, useEffect } from 'react';
import SEOHead from '../components/common/SEOHead';
import ColumnDefinitionForm from '../components/csv/ColumnDefinitionForm';
import CSVPreview from '../components/csv/CSVPreview';
import TemplateSelector from '../features/generator/TemplateSelector';
import LoadingScreen from '../components/common/LoadingScreen';
import Button from '../components/common/Button';
import { useCSVGenerator } from '../hooks/useCSVGenerator';
import { dataTypes } from '../utils/csvUtils';

const GeneratorPage = () => {
  const { generateCSV, generatingStatus, error } = useCSVGenerator();
  
  const [columns, setColumns] = useState([
    { name: 'id', type: 'id', options: {} },
    { name: 'name', type: 'fullName', options: { gender: 'both' } },
    { name: 'email', type: 'email', options: {} }
  ]);
  
  const [rowCount, setRowCount] = useState(10);
  const [generatedData, setGeneratedData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('define'); // 'define' or 'preview'
  
  // Handle column updates
  const handleColumnUpdate = (index, updatedColumn) => {
    const newColumns = [...columns];
    newColumns[index] = updatedColumn;
    setColumns(newColumns);
  };
  
  // Add a new column
  const handleAddColumn = () => {
    setColumns([...columns, { name: '', type: 'string', options: {} }]);
  };
  
  // Remove a column
  const handleRemoveColumn = (index) => {
    setColumns(columns.filter((_, i) => i !== index));
  };
  
  // Handle row count change
  const handleRowCountChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= 10000) {
      setRowCount(value);
    }
  };
  
  // Generate CSV data
  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const data = await generateCSV({ columns, rowCount });
      setGeneratedData(data);
      setActiveTab('preview');
    } catch (err) {
      console.error('Generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Load a template
  const handleLoadTemplate = (template) => {
    setColumns(template.columns);
    setRowCount(template.rowCount || 10);
  };
  
  // Download generated CSV
  const handleDownload = () => {
    if (!generatedData) return;
    
    // Convert data to CSV
    const headers = columns.map(col => col.name).join(',');
    const rows = generatedData.map(row => 
      columns.map(col => {
        const value = row[col.name];
        // Quote strings that contain commas
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    );
    
    const csvContent = [headers, ...rows].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'generated-data.csv';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  // Validate configuration
  const isValidConfiguration = () => {
    return columns.every(col => col.name.trim() !== '' && col.type) && rowCount > 0;
  };
  
  // Reset the form
  const handleReset = () => {
    setColumns([
      { name: 'id', type: 'id', options: {} },
      { name: 'name', type: 'fullName', options: { gender: 'both' } },
      { name: 'email', type: 'email', options: {} }
    ]);
    setRowCount(10);
    setGeneratedData(null);
    setActiveTab('define');
  };
  
  // Show loading screen while generating
  if (isGenerating) {
    return <LoadingScreen message="Generating CSV data..." />;
  }
  
  return (
    <>
      <SEOHead 
        title="CSV Generator - Create Custom CSV Files with Sample Data"
        description="Generate custom CSV files with defined structures and realistic sample data for testing, development, and demonstrations."
        keywords="csv generator, csv creator, sample data, test data, data generation"
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-primary mb-6">CSV Generator</h1>
          
          {/* Tabs */}
          <div className="flex border-b border-border mb-6">
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === 'define' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-text-600 hover:text-primary'
              }`}
              onClick={() => setActiveTab('define')}
            >
              Define Structure
            </button>
            
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === 'preview' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-text-600 hover:text-primary'
              }`}
              onClick={() => setActiveTab('preview')}
              disabled={!generatedData}
            >
              Preview Data
            </button>
          </div>
          
          {activeTab === 'define' && (
            <>
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Load Template</h2>
                
                <TemplateSelector onSelectTemplate={handleLoadTemplate} />
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Define CSV Structure</h2>
                
                <div className="mb-6">
                  <label htmlFor="rowCount" className="block text-sm font-medium mb-1">
                    Number of Rows
                  </label>
                  <input
                    type="number"
                    id="rowCount"
                    min="1"
                    max="10000"
                    value={rowCount}
                    onChange={handleRowCountChange}
                    className="w-full md:w-48 p-2 border border-border rounded"
                  />
                  <p className="mt-1 text-sm text-text-500">
                    Maximum: 10,000 rows
                  </p>
                </div>
                
                <h3 className="font-medium mb-3">Column Definitions</h3>
                
                <div className="space-y-4 mb-6">
                  {columns.map((column, index) => (
                    <ColumnDefinitionForm 
                      key={index}
                      column={column}
                      index={index}
                      onUpdate={(updatedColumn) => handleColumnUpdate(index, updatedColumn)}
                      onRemove={() => handleRemoveColumn(index)}
                      isRemovable={columns.length > 1}
                      dataTypes={dataTypes}
                    />
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="secondary"
                    onClick={handleAddColumn}
                  >
                    Add Column
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleReset}
                  >
                    Reset Form
                  </Button>
                </div>
                
                <div className="mt-6 pt-6 border-t border-border">
                  <Button
                    variant="primary"
                    onClick={handleGenerate}
                    disabled={!isValidConfiguration()}
                    className="w-full"
                  >
                    Generate CSV Data
                  </Button>
                  
                  {error && (
                    <div className="mt-4 p-3 bg-error/10 border border-error rounded text-error text-sm">
                      {error}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'preview' && generatedData && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Generated Data</h2>
                
                <div className="space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('define')}
                  >
                    Edit Structure
                  </Button>
                  
                  <Button
                    variant="primary"
                    onClick={handleDownload}
                  >
                    Download CSV
                  </Button>
                </div>
              </div>
              
              <CSVPreview 
                data={generatedData}
                columns={columns.map(col => col.name)}
                title="Generated CSV"
                maxRows={20}
                showStats={true}
              />
              
              <div className="mt-6 text-center text-text-600">
                <p>
                  Showing 20 of {generatedData.length} rows. Download the CSV to access all data.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GeneratorPage;