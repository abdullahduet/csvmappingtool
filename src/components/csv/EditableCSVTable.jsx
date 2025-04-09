import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Button from '../common/Button';

const EditableCSVTable = ({
  data,
  headers,
  onDataChange,
  onHeaderChange,
  selectedCells = [],
  onCellSelect,
  maxHeight = '600px'
}) => {
  const [editingCell, setEditingCell] = useState(null);
  const [editingHeader, setEditingHeader] = useState(null);
  const [cellValue, setCellValue] = useState('');
  const [headerValue, setHeaderValue] = useState('');
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuTarget, setContextMenuTarget] = useState(null);
  
  const tableRef = useRef(null);
  const inputRef = useRef(null);
  const headerInputRef = useRef(null);
  
  // Focus input when editing starts
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingCell]);
  
  useEffect(() => {
    if (editingHeader && headerInputRef.current) {
      headerInputRef.current.focus();
    }
  }, [editingHeader]);
  
  // Handle click outside to cancel editing
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (editingCell || editingHeader) &&
        tableRef.current &&
        !tableRef.current.contains(event.target)
      ) {
        finishEditing();
      }
      
      if (showContextMenu && event.button !== 2) {
        setShowContextMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingCell, editingHeader, showContextMenu]);
  
  // Start editing a cell
  const startEditing = (rowIndex, colIndex) => {
    setEditingCell({ rowIndex, colIndex });
    setCellValue(data[rowIndex][colIndex] || '');
  };
  
  // Start editing a header
  const startEditingHeader = (index) => {
    setEditingHeader(index);
    setHeaderValue(headers[index] || '');
  };
  
  // Finish editing and save changes
  const finishEditing = () => {
    if (editingCell) {
      const { rowIndex, colIndex } = editingCell;
      const newData = [...data];
      
      if (!newData[rowIndex]) {
        newData[rowIndex] = [];
      }
      
      newData[rowIndex][colIndex] = cellValue;
      onDataChange(newData);
      setEditingCell(null);
    }
    
    if (editingHeader !== null) {
      const newHeaders = [...headers];
      newHeaders[editingHeader] = headerValue;
      onHeaderChange(newHeaders);
      setEditingHeader(null);
    }
  };
  
  // Handle cell value change
  const handleCellChange = (e) => {
    setCellValue(e.target.value);
  };
  
  // Handle header value change
  const handleHeaderChange = (e) => {
    setHeaderValue(e.target.value);
  };
  
  // Handle key press in editable cells
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      finishEditing();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
      setEditingHeader(null);
    } else if (e.key === 'Tab') {
      if (editingCell) {
        e.preventDefault();
        const { rowIndex, colIndex } = editingCell;
        finishEditing();
        
        // Move to next cell or next row first cell
        if (colIndex < headers.length - 1) {
          startEditing(rowIndex, colIndex + 1);
        } else if (rowIndex < data.length - 1) {
          startEditing(rowIndex + 1, 0);
        }
      }
    }
  };
  
  // Handle cell selection
  const handleCellClick = (rowIndex, colIndex, e) => {
    if (e.ctrlKey || e.metaKey) {
      // Add to selection with Ctrl/Cmd key
      const cellExists = selectedCells.some(
        cell => cell.rowIndex === rowIndex && cell.colIndex === colIndex
      );
      
      if (cellExists) {
        // Remove from selection if already selected
        onCellSelect(
          selectedCells.filter(
            cell => !(cell.rowIndex === rowIndex && cell.colIndex === colIndex)
          )
        );
      } else {
        // Add to selection
        onCellSelect([...selectedCells, { rowIndex, colIndex }]);
      }
    } else if (e.shiftKey && selectedCells.length > 0) {
      // Range selection with Shift key
      const lastCell = selectedCells[selectedCells.length - 1];
      const startRow = Math.min(lastCell.rowIndex, rowIndex);
      const endRow = Math.max(lastCell.rowIndex, rowIndex);
      const startCol = Math.min(lastCell.colIndex, colIndex);
      const endCol = Math.max(lastCell.colIndex, colIndex);
      
      const newSelection = [];
      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          newSelection.push({ rowIndex: r, colIndex: c });
        }
      }
      
      onCellSelect(newSelection);
    } else {
      // Start editing on double click
      if (e.detail === 2) {
        startEditing(rowIndex, colIndex);
      } else {
        // Single click selects a single cell
        onCellSelect([{ rowIndex, colIndex }]);
      }
    }
  };
  
  // Handle header click
  const handleHeaderClick = (index, e) => {
    if (e.detail === 2) {
      startEditingHeader(index);
    } else {
      // Select entire column
      const columnCells = data.map((_, rowIndex) => ({
        rowIndex,
        colIndex: index
      }));
      onCellSelect(columnCells);
    }
  };
  
  // Handle row selection by clicking row header
  const handleRowClick = (rowIndex, e) => {
    // Select entire row
    const rowCells = headers.map((_, colIndex) => ({
      rowIndex,
      colIndex
    }));
    onCellSelect(rowCells);
  };
  
  // Handle context menu
  const handleContextMenu = (e, rowIndex, colIndex) => {
    e.preventDefault();
    
    // Only show context menu if cell is selected
    if (
      selectedCells.some(
        cell => cell.rowIndex === rowIndex && cell.colIndex === colIndex
      )
    ) {
      setContextMenuPosition({ x: e.clientX, y: e.clientY });
      setContextMenuTarget({ rowIndex, colIndex });
      setShowContextMenu(true);
    }
  };
  
  // Context menu actions
  const handleContextMenuAction = (action) => {
    setShowContextMenu(false);
    
    switch (action) {
      case 'copy':
        handleCopy();
        break;
      case 'paste':
        handlePaste();
        break;
      case 'delete':
        handleDelete();
        break;
      case 'uppercase':
        handleTransform('uppercase');
        break;
      case 'lowercase':
        handleTransform('lowercase');
        break;
      default:
        break;
    }
  };
  
  // Copy selected cells
  const handleCopy = () => {
    if (selectedCells.length === 0) return;
    
    // Create a table structure for clipboard
    const minRow = Math.min(...selectedCells.map(c => c.rowIndex));
    const maxRow = Math.max(...selectedCells.map(c => c.rowIndex));
    const minCol = Math.min(...selectedCells.map(c => c.colIndex));
    const maxCol = Math.max(...selectedCells.map(c => c.colIndex));
    
    let clipboardText = '';
    
    for (let r = minRow; r <= maxRow; r++) {
      const rowValues = [];
      for (let c = minCol; c <= maxCol; c++) {
        // Check if this cell is in selection
        const isSelected = selectedCells.some(
          cell => cell.rowIndex === r && cell.colIndex === c
        );
        
        if (isSelected && data[r] && data[r][c] !== undefined) {
          rowValues.push(data[r][c]);
        } else {
          rowValues.push('');
        }
      }
      clipboardText += rowValues.join('\t') + '\n';
    }
    
    navigator.clipboard.writeText(clipboardText).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };
  
  // Paste into table
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text || selectedCells.length === 0) return;
      
      // Starting cell for paste
      const startRow = Math.min(...selectedCells.map(c => c.rowIndex));
      const startCol = Math.min(...selectedCells.map(c => c.colIndex));
      
      // Parse clipboard data (tab or comma separated)
      const rows = text.split(/\r?\n/).filter(row => row.trim());
      let parsedRows = rows.map(row => {
        // Try to detect if it's tab or comma separated
        if (row.includes('\t')) {
          return row.split('\t');
        } else {
          return row.split(',');
        }
      });
      
      // Create a copy of the current data
      const newData = [...data];
      
      // Paste data starting from selected cell
      parsedRows.forEach((rowData, rowOffset) => {
        rowData.forEach((cellValue, colOffset) => {
          const targetRow = startRow + rowOffset;
          const targetCol = startCol + colOffset;
          
          // Ensure row exists
          if (!newData[targetRow]) {
            newData[targetRow] = [];
          }
          
          // Insert value
          newData[targetRow][targetCol] = cellValue;
        });
      });
      
      // Update data
      onDataChange(newData);
      
      // Select the pasted region
      const pastedSelection = [];
      for (let r = startRow; r < startRow + parsedRows.length; r++) {
        for (let c = startCol; c < startCol + parsedRows[0].length; c++) {
          pastedSelection.push({ rowIndex: r, colIndex: c });
        }
      }
      onCellSelect(pastedSelection);
      
    } catch (err) {
      console.error('Failed to paste: ', err);
    }
  };
  
  // Delete selected cells
  const handleDelete = () => {
    if (selectedCells.length === 0) return;
    
    const newData = [...data];
    
    selectedCells.forEach(({ rowIndex, colIndex }) => {
      if (newData[rowIndex] && newData[rowIndex][colIndex] !== undefined) {
        newData[rowIndex][colIndex] = '';
      }
    });
    
    onDataChange(newData);
  };
  
  // Transform text in selected cells
  const handleTransform = (type) => {
    if (selectedCells.length === 0) return;
    
    const newData = [...data];
    
    selectedCells.forEach(({ rowIndex, colIndex }) => {
      if (newData[rowIndex] && newData[rowIndex][colIndex] !== undefined) {
        const currentValue = String(newData[rowIndex][colIndex]);
        
        if (type === 'uppercase') {
          newData[rowIndex][colIndex] = currentValue.toUpperCase();
        } else if (type === 'lowercase') {
          newData[rowIndex][colIndex] = currentValue.toLowerCase();
        }
      }
    });
    
    onDataChange(newData);
  };
  
  // Add a new row
  const addRow = () => {
    const newData = [...data];
    const newRow = new Array(headers.length).fill('');
    newData.push(newRow);
    onDataChange(newData);
  };
  
  // Add a new column
  const addColumn = () => {
    const newHeaders = [...headers, `Column ${headers.length + 1}`];
    onHeaderChange(newHeaders);
    
    const newData = data.map(row => [...row, '']);
    onDataChange(newData);
  };
  
  // Check if a cell is currently selected
  const isCellSelected = (rowIndex, colIndex) => {
    return selectedCells.some(
      cell => cell.rowIndex === rowIndex && cell.colIndex === colIndex
    );
  };
  
  // Render cell content based on editing state
  const renderCell = (rowIndex, colIndex) => {
    const isEditing = 
      editingCell && 
      editingCell.rowIndex === rowIndex && 
      editingCell.colIndex === colIndex;
    
    if (isEditing) {
      return (
        <input
          ref={inputRef}
          type="text"
          value={cellValue}
          onChange={handleCellChange}
          onKeyDown={handleKeyPress}
          onBlur={finishEditing}
          className="w-full h-full border-none p-1 focus:outline-none"
          autoFocus
        />
      );
    }
    
    return (
      <div className="truncate px-2 py-1 h-full w-full">
        {data[rowIndex] && data[rowIndex][colIndex] !== undefined 
          ? data[rowIndex][colIndex] 
          : ''}
      </div>
    );
  };
  
  // Render header content
  const renderHeader = (index) => {
    const isEditing = editingHeader === index;
    
    if (isEditing) {
      return (
        <input
          ref={headerInputRef}
          type="text"
          value={headerValue}
          onChange={handleHeaderChange}
          onKeyDown={handleKeyPress}
          onBlur={finishEditing}
          className="w-full border-none p-1 focus:outline-none bg-primary-100"
          autoFocus
        />
      );
    }
    
    return (
      <div className="truncate font-semibold px-2 py-1">
        {headers[index]}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col">
      <div className="mb-2 flex justify-between items-center">
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={addRow}
            className="mr-2"
          >
            Add Row
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={addColumn}
          >
            Add Column
          </Button>
        </div>
        <div className="text-sm text-text-600">
          {selectedCells.length > 0 
            ? `${selectedCells.length} cell${selectedCells.length > 1 ? 's' : ''} selected` 
            : 'Click to select cells. Double-click to edit.'}
        </div>
      </div>
      
      <div 
        className="overflow-auto border border-border rounded"
        style={{ maxHeight }}
        ref={tableRef}
      >
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-accent">
            <tr>
              {/* Corner cell */}
              <th className="w-12 px-2 py-2 text-left text-xs font-medium text-text-900 uppercase tracking-wider border-r border-border">
                #
              </th>
              
              {/* Column headers */}
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-2 py-2 text-left text-xs font-medium text-text-900 uppercase tracking-wider border-r border-border min-w-[120px] cursor-pointer hover:bg-accent-200"
                  onClick={(e) => handleHeaderClick(index, e)}
                >
                  {renderHeader(index)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-border">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="divide-x divide-border">
                {/* Row header */}
                <td 
                  className="w-12 px-2 py-1 whitespace-nowrap text-sm font-medium text-text-900 bg-accent/30 cursor-pointer hover:bg-accent-200"
                  onClick={(e) => handleRowClick(rowIndex, e)}
                >
                  {rowIndex + 1}
                </td>
                
                {/* Row cells */}
                {headers.map((_, colIndex) => (
                  <td
                    key={colIndex}
                    className={`whitespace-nowrap text-sm text-text-900 border-r border-border relative min-w-[120px] cursor-pointer ${
                      isCellSelected(rowIndex, colIndex) ? 'bg-primary/10' : ''
                    }`}
                    onClick={(e) => handleCellClick(rowIndex, colIndex, e)}
                    onContextMenu={(e) => handleContextMenu(e, rowIndex, colIndex)}
                  >
                    {renderCell(rowIndex, colIndex)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Context Menu */}
      {showContextMenu && (
        <div 
          className="fixed bg-white rounded-md shadow-lg z-50 border border-border"
          style={{ 
            top: `${contextMenuPosition.y}px`, 
            left: `${contextMenuPosition.x}px` 
          }}
        >
          <ul className="py-1">
            <li 
              className="px-4 py-2 hover:bg-accent cursor-pointer text-sm"
              onClick={() => handleContextMenuAction('copy')}
            >
              Copy
            </li>
            <li 
              className="px-4 py-2 hover:bg-accent cursor-pointer text-sm"
              onClick={() => handleContextMenuAction('paste')}
            >
              Paste
            </li>
            <li 
              className="px-4 py-2 hover:bg-accent cursor-pointer text-sm"
              onClick={() => handleContextMenuAction('delete')}
            >
              Delete
            </li>
            <li className="border-t border-border my-1"></li>
            <li 
              className="px-4 py-2 hover:bg-accent cursor-pointer text-sm"
              onClick={() => handleContextMenuAction('uppercase')}
            >
              To Uppercase
            </li>
            <li 
              className="px-4 py-2 hover:bg-accent cursor-pointer text-sm"
              onClick={() => handleContextMenuAction('lowercase')}
            >
              To Lowercase
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

EditableCSVTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.any)).isRequired,
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  onDataChange: PropTypes.func.isRequired,
  onHeaderChange: PropTypes.func.isRequired,
  selectedCells: PropTypes.arrayOf(
    PropTypes.shape({
      rowIndex: PropTypes.number.isRequired,
      colIndex: PropTypes.number.isRequired
    })
  ),
  onCellSelect: PropTypes.func.isRequired,
  maxHeight: PropTypes.string
};

export default EditableCSVTable;