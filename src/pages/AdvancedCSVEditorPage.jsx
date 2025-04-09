import React, { useState, useEffect } from 'react';
import SEOHead from '../components/common/SEOHead';
import EditableCSVTable from '../components/csv/EditableCSVTable';
import CSVDataImporter from '../components/csv/CSVDataImporter';
import CSVOperationsToolbar from '../components/csv/CSVOperationsToolbar';
import FindReplacePanel from '../components/csv/FindReplacePanel';
import Button from '../components/common/Button';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

// Update the Advanced CSV Generation feature only. Please make sure all files are generated properly. allow users to select and edit with a single click, select the entire table by the top left '#' field and operations should work accordingly. Select, Replace, and find operations should highlight the field on the table. Use artifacts for response.

const AdvancedCSVEditorPage = () => {
  // State for CSV data
  const [data, setData] = useState([[]]);
  const [headers, setHeaders] = useState(['Column 1']);
  const [selectedCells, setSelectedCells] = useState([]);
  const [activePanel, setActivePanel] = useState(null);
  const [fileName, setFileName] = useState('data.csv');
  const [hasChanges, setHasChanges] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  
  // Update change status when data or headers change
  useEffect(() => {
    setHasChanges(true);
  }, [data, headers]);
  
  // Handle data import
  const handleDataImport = (importedData) => {
    if (!importedData || !importedData.headers || !importedData.data) return;
    
    setHeaders(importedData.headers);
    setData(importedData.data);
    setSelectedCells([]);
    setHasChanges(false);
  };
  
  // Handle data change
  const handleDataChange = (newData) => {
    setData(newData);
  };
  
  // Handle header change
  const handleHeaderChange = (newHeaders) => {
    setHeaders(newHeaders);
  };
  
  // Handle cell selection
  const handleCellSelect = (cells) => {
    setSelectedCells(cells);
  };
  
  // Handle export
  const handleExport = () => {
    if (data.length === 0 || headers.length === 0) {
      alert('No data to export');
      return;
    }
    
    switch (exportFormat) {
      case 'csv':
        exportAsCSV();
        break;
      case 'xlsx':
        exportAsExcel();
        break;
      case 'json':
        exportAsJSON();
        break;
      default:
        exportAsCSV();
    }
  };
  
  // Export as CSV
  const exportAsCSV = () => {
    const csvContent = Papa.unparse({
      fields: headers,
      data: data
    });
    
    downloadFile(csvContent, fileName, 'text/csv');
  };
  
  // Export as Excel
  const exportAsExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    
    // Convert to Blob
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.replace('.csv', '.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Export as JSON
  const exportAsJSON = () => {
    // Convert data to array of objects with headers as keys
    const jsonData = data.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });
    
    const jsonContent = JSON.stringify(jsonData, null, 2);
    
    downloadFile(jsonContent, fileName.replace('.csv', '.json'), 'application/json');
  };
  
  // Generic download function
  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Clear all data
  const handleClear = () => {
    if (hasChanges && !window.confirm('Clear all data? This cannot be undone.')) {
      return;
    }
    
    setData([[]]);
    setHeaders(['Column 1']);
    setSelectedCells([]);
    setActivePanel(null);
    setHasChanges(false);
  };
  
  // Rename file
  const handleRenameFile = () => {
    const newName = prompt('Enter a new filename:', fileName);
    if (newName) {
      setFileName(newName.endsWith('.csv') ? newName : `${newName}.csv`);
    }
  };
  
  return (
    <>
      <SEOHead 
        title="Advanced CSV Editor"
        description="Edit CSV data with powerful features including find and replace, text transformations, and more."
        keywords="csv editor, csv manipulation, find and replace, text transform, csv converter"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Advanced CSV Editor</h1>
            <p className="text-text-600">
              Import, edit, transform, and export CSV data with powerful features
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="px-3 py-2 border border-border rounded"
            />
            <Button
              variant="outline"
              onClick={handleRenameFile}
              size="sm"
            >
              Rename
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-3">
            <CSVOperationsToolbar
              selectedCells={selectedCells}
              data={data}
              headers={headers}
              onDataChange={handleDataChange}
              onHeaderChange={handleHeaderChange}
              setActivePanel={setActivePanel}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <div className="relative inline-block">
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 border border-border rounded bg-white cursor-pointer"
              >
                <option value="csv">CSV</option>
                <option value="xlsx">Excel</option>
                <option value="json">JSON</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            
            <Button 
              variant="primary"
              onClick={handleExport}
              disabled={data.length === 0 || headers.length === 0}
            >
              Export
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleClear}
            >
              Clear
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <EditableCSVTable
              data={data}
              headers={headers}
              onDataChange={handleDataChange}
              onHeaderChange={handleHeaderChange}
              selectedCells={selectedCells}
              onCellSelect={handleCellSelect}
            />
          </div>
          
          <div>
            {activePanel === 'findReplace' ? (
              <div className="mb-4">
                <FindReplacePanel
                  data={data}
                  headers={headers}
                  selectedCells={selectedCells}
                  onDataChange={handleDataChange}
                  onCellSelect={handleCellSelect}
                />
                <div className="mt-2 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActivePanel(null)}
                  >
                    Hide Panel
                  </Button>
                </div>
              </div>
            ) : (
              <CSVDataImporter onDataImport={handleDataImport} />
            )}
          </div>
        </div>
        
        <div className="mt-6 text-sm text-text-600">
          <h3 className="font-medium mb-2">Keyboard Shortcuts:</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
            <li><strong>Ctrl/Cmd+C:</strong> Copy selected cells</li>
            <li><strong>Ctrl/Cmd+V:</strong> Paste at selected cell</li>
            <li><strong>Delete:</strong> Clear selected cells</li>
            <li><strong>Tab:</strong> Move to next cell</li>
            <li><strong>Shift+Click:</strong> Select range</li>
            <li><strong>Ctrl/Cmd+Click:</strong> Select multiple cells</li>
            <li><strong>Double Click:</strong> Edit cell</li>
            <li><strong>Enter:</strong> Finish editing</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default AdvancedCSVEditorPage;