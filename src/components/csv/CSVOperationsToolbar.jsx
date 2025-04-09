import React from 'react';
import PropTypes from 'prop-types';
import Button from '../common/Button';

const CSVOperationsToolbar = ({
  selectedCells,
  data,
  headers,
  onDataChange,
  onHeaderChange,
  setActivePanel
}) => {
  // Get unique row and column indices from selected cells
  const getUniqueIndices = () => {
    if (!selectedCells || selectedCells.length === 0) return { rows: [], cols: [] };
    
    const rows = [...new Set(selectedCells.map(cell => cell.rowIndex))].sort((a, b) => a - b);
    const cols = [...new Set(selectedCells.map(cell => cell.colIndex))].sort((a, b) => a - b);
    
    return { rows, cols };
  };
  
  const { rows: selectedRows, cols: selectedCols } = getUniqueIndices();
  
  // Text operations
  const handleTextOperation = (operation) => {
    if (selectedCells.length === 0) return;
    
    const newData = [...data];
    
    selectedCells.forEach(({ rowIndex, colIndex }) => {
      if (newData[rowIndex] && newData[rowIndex][colIndex] !== undefined) {
        const currentValue = String(newData[rowIndex][colIndex]);
        
        switch (operation) {
          case 'uppercase':
            newData[rowIndex][colIndex] = currentValue.toUpperCase();
            break;
          case 'lowercase':
            newData[rowIndex][colIndex] = currentValue.toLowerCase();
            break;
          case 'capitalize':
            newData[rowIndex][colIndex] = currentValue
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' ');
            break;
          case 'trim':
            newData[rowIndex][colIndex] = currentValue.trim();
            break;
          default:
            break;
        }
      }
    });
    
    onDataChange(newData);
  };
  
  // Row operations
  const insertRow = (position) => {
    if (selectedRows.length === 0) return;
    
    const newData = [...data];
    const sortedRows = [...selectedRows].sort((a, b) => a - b);
    
    if (position === 'above') {
      // Insert above the first selected row
      const targetRow = sortedRows[0];
      const newRow = new Array(headers.length).fill('');
      newData.splice(targetRow, 0, newRow);
    } else {
      // Insert below the last selected row
      const targetRow = sortedRows[sortedRows.length - 1];
      const newRow = new Array(headers.length).fill('');
      newData.splice(targetRow + 1, 0, newRow);
    }
    
    onDataChange(newData);
  };
  
  const deleteRows = () => {
    if (selectedRows.length === 0) return;
    
    // Delete rows in reverse order to maintain indices
    const rowsToDelete = [...selectedRows].sort((a, b) => b - a);
    const newData = [...data];
    
    rowsToDelete.forEach(rowIndex => {
      newData.splice(rowIndex, 1);
    });
    
    onDataChange(newData);
  };
  
  // Column operations
  const insertColumn = (position) => {
    if (selectedCols.length === 0) return;
    
    const sortedCols = [...selectedCols].sort((a, b) => a - b);
    
    if (position === 'left') {
      // Insert to the left of the first selected column
      const targetCol = sortedCols[0];
      const newHeaders = [...headers];
      newHeaders.splice(targetCol, 0, `Column ${headers.length + 1}`);
      
      // Update data
      const newData = data.map(row => {
        const newRow = [...row];
        newRow.splice(targetCol, 0, '');
        return newRow;
      });
      
      onHeaderChange(newHeaders);
      onDataChange(newData);
    } else {
      // Insert to the right of the last selected column
      const targetCol = sortedCols[sortedCols.length - 1];
      const newHeaders = [...headers];
      newHeaders.splice(targetCol + 1, 0, `Column ${headers.length + 1}`);
      
      // Update data
      const newData = data.map(row => {
        const newRow = [...row];
        newRow.splice(targetCol + 1, 0, '');
        return newRow;
      });
      
      onHeaderChange(newHeaders);
      onDataChange(newData);
    }
  };
  
  const deleteColumns = () => {
    if (selectedCols.length === 0) return;
    
    // Delete columns in reverse order to maintain indices
    const colsToDelete = [...selectedCols].sort((a, b) => b - a);
    
    // Update headers
    const newHeaders = [...headers];
    colsToDelete.forEach(colIndex => {
      newHeaders.splice(colIndex, 1);
    });
    
    // Update data
    const newData = data.map(row => {
      const newRow = [...row];
      colsToDelete.forEach(colIndex => {
        newRow.splice(colIndex, 1);
      });
      return newRow;
    });
    
    onHeaderChange(newHeaders);
    onDataChange(newData);
  };
  
  // Clear data
  const clearCells = () => {
    if (selectedCells.length === 0) return;
    
    const newData = [...data];
    
    selectedCells.forEach(({ rowIndex, colIndex }) => {
      if (newData[rowIndex]) {
        newData[rowIndex][colIndex] = '';
      }
    });
    
    onDataChange(newData);
  };
  
  // Sort data
  const sortColumn = (direction) => {
    if (selectedCols.length !== 1 || data.length === 0) return;
    
    const columnIndex = selectedCols[0];
    const newData = [...data];
    
    newData.sort((rowA, rowB) => {
      const a = rowA[columnIndex];
      const b = rowB[columnIndex];
      
      // Handle undefined or empty values
      if (a === undefined || a === '') return direction === 'asc' ? 1 : -1;
      if (b === undefined || b === '') return direction === 'asc' ? -1 : 1;
      
      // Check if both values are numeric
      const aNum = Number(a);
      const bNum = Number(b);
      
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return direction === 'asc' ? aNum - bNum : bNum - aNum;
      }
      
      // String comparison
      const aStr = String(a).toLowerCase();
      const bStr = String(b).toLowerCase();
      
      return direction === 'asc' 
        ? aStr.localeCompare(bStr) 
        : bStr.localeCompare(aStr);
    });
    
    onDataChange(newData);
  };
  
  // Rename column
  const renameColumn = () => {
    if (selectedCols.length !== 1) return;
    
    const columnIndex = selectedCols[0];
    const currentName = headers[columnIndex];
    
    const newName = prompt('Enter new column name:', currentName);
    
    if (newName !== null) {
      const newHeaders = [...headers];
      newHeaders[columnIndex] = newName;
      onHeaderChange(newHeaders);
    }
  };
  
  // Open find/replace panel
  const openFindReplace = () => {
    setActivePanel('findReplace');
  };
  
  // Copy selection to clipboard
  const copySelection = () => {
    if (selectedCells.length === 0) return;
    
    // Get unique rows and columns
    const rowIndices = [...new Set(selectedCells.map(cell => cell.rowIndex))].sort((a, b) => a - b);
    const colIndices = [...new Set(selectedCells.map(cell => cell.colIndex))].sort((a, b) => a - b);
    
    // Create a table structure for the clipboard
    let clipboardText = '';
    
    for (const rowIndex of rowIndices) {
      const rowValues = [];
      
      for (const colIndex of colIndices) {
        // Check if this cell is in the selection
        const isSelected = selectedCells.some(
          cell => cell.rowIndex === rowIndex && cell.colIndex === colIndex
        );
        
        if (isSelected && data[rowIndex] && data[rowIndex][colIndex] !== undefined) {
          rowValues.push(data[rowIndex][colIndex]);
        } else {
          rowValues.push('');
        }
      }
      
      clipboardText += rowValues.join('\t') + '\n';
    }
    
    // Copy to clipboard
    navigator.clipboard.writeText(clipboardText).catch(err => {
      console.error('Failed to copy selection: ', err);
    });
  };
  
  // Show operation availability status
  const canOperateOnRows = selectedRows.length > 0;
  const canOperateOnColumns = selectedCols.length > 0;
  const canOperateOnCells = selectedCells.length > 0;
  const canSortColumn = selectedCols.length === 1;
  const canRenameColumn = selectedCols.length === 1;
  
  return (
    <div className="bg-white p-3 border border-border rounded-lg shadow-sm">
      <div className="flex flex-wrap gap-2">
        {/* Text operations */}
        <div className="relative group">
          <Button
            variant="outline"
            size="sm"
            disabled={!canOperateOnCells}
          >
            Text <span className="ml-1">▼</span>
          </Button>
          
          <div className="absolute left-0 mt-1 w-48 bg-white border border-border rounded shadow-lg hidden group-hover:block z-10">
            <ul className="py-1">
              <li 
                className="px-4 py-2 hover:bg-accent cursor-pointer text-sm flex items-center"
                onClick={() => handleTextOperation('uppercase')}
              >
                UPPERCASE
              </li>
              <li 
                className="px-4 py-2 hover:bg-accent cursor-pointer text-sm flex items-center"
                onClick={() => handleTextOperation('lowercase')}
              >
                lowercase
              </li>
              <li 
                className="px-4 py-2 hover:bg-accent cursor-pointer text-sm flex items-center"
                onClick={() => handleTextOperation('capitalize')}
              >
                Capitalize Words
              </li>
              <li 
                className="px-4 py-2 hover:bg-accent cursor-pointer text-sm flex items-center"
                onClick={() => handleTextOperation('trim')}
              >
                Trim Spaces
              </li>
            </ul>
          </div>
        </div>
        
        {/* Row operations */}
        <div className="relative group">
          <Button
            variant="outline"
            size="sm"
            disabled={!canOperateOnRows}
          >
            Row <span className="ml-1">▼</span>
          </Button>
          
          <div className="absolute left-0 mt-1 w-48 bg-white border border-border rounded shadow-lg hidden group-hover:block z-10">
            <ul className="py-1">
              <li 
                className="px-4 py-2 hover:bg-accent cursor-pointer text-sm flex items-center"
                onClick={() => insertRow('above')}
              >
                Insert Row Above
              </li>
              <li 
                className="px-4 py-2 hover:bg-accent cursor-pointer text-sm flex items-center"
                onClick={() => insertRow('below')}
              >
                Insert Row Below
              </li>
              <li 
                className="px-4 py-2 hover:bg-accent cursor-pointer text-sm flex items-center text-error"
                onClick={deleteRows}
              >
                Delete Row(s)
              </li>
            </ul>
          </div>
        </div>
        
        {/* Column operations */}
        <div className="relative group">
          <Button
            variant="outline"
            size="sm"
            disabled={!canOperateOnColumns}
          >
            Column <span className="ml-1">▼</span>
          </Button>
          
          <div className="absolute left-0 mt-1 w-48 bg-white border border-border rounded shadow-lg hidden group-hover:block z-10">
            <ul className="py-1">
              <li 
                className="px-4 py-2 hover:bg-accent cursor-pointer text-sm flex items-center"
                onClick={() => insertColumn('left')}
              >
                Insert Column Left
              </li>
              <li 
                className="px-4 py-2 hover:bg-accent cursor-pointer text-sm flex items-center"
                onClick={() => insertColumn('right')}
              >
                Insert Column Right
              </li>
              <li 
                className="px-4 py-2 hover:bg-accent cursor-pointer text-sm flex items-center"
                onClick={renameColumn}
                style={{ opacity: canRenameColumn ? 1 : 0.5 }}
              >
                Rename Column
              </li>
              <li 
                className="px-4 py-2 hover:bg-accent cursor-pointer text-sm flex items-center text-error"
                onClick={deleteColumns}
              >
                Delete Column(s)
              </li>
            </ul>
          </div>
        </div>
        
        {/* Sort operations */}
        <div className="relative group">
          <Button
            variant="outline"
            size="sm"
            disabled={!canSortColumn}
          >
            Sort <span className="ml-1">▼</span>
          </Button>
          
          <div className="absolute left-0 mt-1 w-48 bg-white border border-border rounded shadow-lg hidden group-hover:block z-10">
            <ul className="py-1">
              <li 
                className="px-4 py-2 hover:bg-accent cursor-pointer text-sm flex items-center"
                onClick={() => sortColumn('asc')}
              >
                Sort Ascending
              </li>
              <li 
                className="px-4 py-2 hover:bg-accent cursor-pointer text-sm flex items-center"
                onClick={() => sortColumn('desc')}
              >
                Sort Descending
              </li>
            </ul>
          </div>
        </div>
        
        {/* Individual operations */}
        <Button
          variant="outline"
          size="sm"
          onClick={openFindReplace}
        >
          Find & Replace
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={copySelection}
          disabled={!canOperateOnCells}
        >
          Copy
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={clearCells}
          disabled={!canOperateOnCells}
        >
          Clear
        </Button>
      </div>
      
      {/* Selection information */}
      <div className="mt-2 text-xs text-text-600">
        {canOperateOnCells ? (
          <span>
            Selected: {selectedCells.length} cell{selectedCells.length !== 1 ? 's' : ''} 
            {canOperateOnRows && ` in ${selectedRows.length} row${selectedRows.length !== 1 ? 's' : ''}`}
            {canOperateOnColumns && ` and ${selectedCols.length} column${selectedCols.length !== 1 ? 's' : ''}`}
          </span>
        ) : (
          <span>No cells selected. Select cells to enable operations.</span>
        )}
      </div>
    </div>
  );
};

CSVOperationsToolbar.propTypes = {
  selectedCells: PropTypes.arrayOf(
    PropTypes.shape({
      rowIndex: PropTypes.number.isRequired,
      colIndex: PropTypes.number.isRequired
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.any)).isRequired,
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  onDataChange: PropTypes.func.isRequired,
  onHeaderChange: PropTypes.func.isRequired,
  setActivePanel: PropTypes.func.isRequired
};

export default CSVOperationsToolbar;