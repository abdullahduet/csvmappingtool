import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import Button from '../common/Button';

const EditableCSVTable = ({
  data,
  headers,
  onDataChange,
  onHeaderChange,
  selectedCells = [],
  onCellSelect,
  maxHeight = '600px',
  highlightedCell = null,
  setHighlightedCell
}) => {
  const [editingCell, setEditingCell] = useState(null);
  const [editingHeader, setEditingHeader] = useState(null);
  const [cellValue, setCellValue] = useState('');
  const [headerValue, setHeaderValue] = useState('');
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuTarget, setContextMenuTarget] = useState(null);
  const [visibleRowsRange, setVisibleRowsRange] = useState({ start: 0, end: 100 });
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const [lastSelectedCell, setLastSelectedCell] = useState(null);
  
  const tableRef = useRef(null);
  const tableBodyRef = useRef(null);
  const inputRef = useRef(null);
  const headerInputRef = useRef(null);
  const cellRefs = useRef({});
  
  const ROWS_BUFFER = 50; // Number of rows to render before/after visible area
  const ROW_HEIGHT = 35; // Approximate height of each row in pixels
  
  // Calculate visible rows based on scroll position
  const updateVisibleRows = useCallback(() => {
    if (!tableBodyRef.current) return;
    
    const scrollTop = tableBodyRef.current.scrollTop;
    const viewportHeight = tableBodyRef.current.clientHeight;
    
    // Increase buffer size for smoother scrolling
    const startRow = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - ROWS_BUFFER);
    const endRow = Math.min(
      data.length,
      Math.ceil((scrollTop + viewportHeight) / ROW_HEIGHT) + ROWS_BUFFER
    );
    
    // Only update if the visible range has actually changed
    if (startRow !== visibleRowsRange.start || endRow !== visibleRowsRange.end) {
      setVisibleRowsRange({ start: startRow, end: endRow });
    }
  }, [data.length, visibleRowsRange]);

  // Debug function to log selection changes
  // useEffect(() => {
  //   // Force re-render when selection changes
  //   const cellElements = document.querySelectorAll('[data-row-index][data-col-index]');
  //   console.log('[EditableCSVTable] cellElements: ', cellElements.length);
  //   console.log('[EditableCSVTable] selectedCells: ', selectedCells.length);
  //   cellElements.forEach(element => {
  //     const rowIndex = parseInt(element.getAttribute('data-row-index'));
  //     const colIndex = parseInt(element.getAttribute('data-col-index'));
      
  //     if (isCellSelected(rowIndex, colIndex)) {
  //       element.classList.add('bg-primary/10');
  //     } else {
  //       element.classList.remove('bg-primary/10');
  //     }
  //   });
  // }, [selectedCells]);

  useEffect(() => {
    // Listen for custom events from FindReplacePanel
    const handleHighlightAndScroll = (event) => {
      const { rowIndex, colIndex } = event.detail;
      
      // Set highlighted cell state
      setHighlightedCell({ rowIndex, colIndex });
      
      // Scroll to the cell with a slight delay to ensure DOM update
      setTimeout(() => {
        const cellKey = `cell-${rowIndex}-${colIndex}`;
        const cellElement = cellRefs.current[cellKey];
        
        if (cellElement && tableBodyRef.current) {
          // First ensure the row is within the visible range
          const currentVisibleStart = visibleRowsRange.start;
          const currentVisibleEnd = visibleRowsRange.end;
          
          if (rowIndex < currentVisibleStart || rowIndex >= currentVisibleEnd) {
            // Update visible rows range if cell is outside current view
            const newStart = Math.max(0, rowIndex - Math.floor(ROWS_BUFFER/2));
            setVisibleRowsRange({ 
              start: newStart, 
              end: Math.min(data.length, newStart + ROWS_BUFFER * 2) 
            });
          }
          
          // Explicitly scroll to make cell visible with behavior smooth
          cellElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          });
          
          // Add a temporary highlight effect
          cellElement.classList.add('animate-pulse');
          setTimeout(() => {
            cellElement.classList.remove('animate-pulse');
          }, 1000);
        }
      }, 50);
    };
    
    // Register event listener
    document.addEventListener('highlightAndScrollToCell', handleHighlightAndScroll);
    
    return () => {
      document.removeEventListener('highlightAndScrollToCell', handleHighlightAndScroll);
    };
  }, [data.length, visibleRowsRange]);
  
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
  
  // Setup scroll event listener for virtualization
  useEffect(() => {
    const tableBody = tableBodyRef.current;
    if (tableBody) {
      updateVisibleRows();
      tableBody.addEventListener('scroll', updateVisibleRows);
      return () => {
        tableBody.removeEventListener('scroll', updateVisibleRows);
      };
    }
  }, [updateVisibleRows]);
  
  // Focus on highlighted cell when it changes
  useEffect(() => {
    if (highlightedCell) {
      const { rowIndex, colIndex } = highlightedCell;
      const cellKey = `cell-${rowIndex}-${colIndex}`;
      
      // Scroll into view if needed
      if (cellRefs.current[cellKey] && tableBodyRef.current) {
        const cellElement = cellRefs.current[cellKey];
        
        // Calculate if cell is outside visible area
        const cellRect = cellElement.getBoundingClientRect();
        const tableRect = tableBodyRef.current.getBoundingClientRect();
        
        if (
          cellRect.top < tableRect.top ||
          cellRect.bottom > tableRect.bottom ||
          cellRect.left < tableRect.left ||
          cellRect.right > tableRect.right
        ) {
          cellElement.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }
      }
    }
  }, [highlightedCell]);
  
  // Handle click outside to cancel editing and selection
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
    
    // Global mouseup listener to end selection
    const handleMouseUp = () => {
      if (isSelecting) {
        setIsSelecting(false);
      }
    };
    
    // Prevent default selection behavior during table operations
    const handleSelectStart = (e) => {
      // Only prevent selection if we're in the table and not editing
      if (isSelecting && !editingCell && !editingHeader) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('selectstart', handleSelectStart);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('selectstart', handleSelectStart);
    };
  }, [editingCell, editingHeader, showContextMenu, isSelecting]);
  
  // Start editing a cell on double click
  const startEditing = (rowIndex, colIndex) => {
    setEditingCell({ rowIndex, colIndex });
    setCellValue(data[rowIndex]?.[colIndex] || '');
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
        newData[rowIndex] = new Array(headers.length).fill('');
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
  
  // Navigate cells with arrow keys
  const handleKeyDown = (e, rowIndex, colIndex) => {
    if (editingCell) return; // Don't navigate while editing
    
    switch (e.key) {
      case 'ArrowUp':
        if (rowIndex > 0) {
          e.preventDefault();
          onCellSelect([{ rowIndex: rowIndex - 1, colIndex }]);
        }
        break;
      case 'ArrowDown':
        if (rowIndex < data.length - 1) {
          e.preventDefault();
          onCellSelect([{ rowIndex: rowIndex + 1, colIndex }]);
        }
        break;
      case 'ArrowLeft':
        if (colIndex > 0) {
          e.preventDefault();
          onCellSelect([{ rowIndex, colIndex: colIndex - 1 }]);
        }
        break;
      case 'ArrowRight':
        if (colIndex < headers.length - 1) {
          e.preventDefault();
          onCellSelect([{ rowIndex, colIndex: colIndex + 1 }]);
        }
        break;
      case 'Enter':
        e.preventDefault();
        startEditing(rowIndex, colIndex);
        break;
      default:
        break;
    }
  };
  
  // Check if a cell is currently selected
  const isCellSelected = (rowIndex, colIndex) => {
    return selectedCells.some(
      cell => cell.rowIndex === rowIndex && cell.colIndex === colIndex
    );
  };
  
  // Start cell selection process on mouse down
  const handleCellMouseDown = (rowIndex, colIndex, e) => {
    // Prevent default selection behavior
    e.preventDefault();
    
    // Don't handle right-clicks here
    if (e.button === 2) return;
    
    // Handle selection based on modifiers
    if (e.ctrlKey || e.metaKey) {
      // Toggle individual cell with Ctrl/Cmd key
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
      setLastSelectedCell({ rowIndex, colIndex });
    } else if (e.shiftKey && lastSelectedCell) {
      // Range selection with Shift key from last selection to this cell
      const startRow = Math.min(lastSelectedCell.rowIndex, rowIndex);
      const endRow = Math.max(lastSelectedCell.rowIndex, rowIndex);
      const startCol = Math.min(lastSelectedCell.colIndex, colIndex);
      const endCol = Math.max(lastSelectedCell.colIndex, colIndex);
      
      const newSelection = [];
      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          newSelection.push({ rowIndex: r, colIndex: c });
        }
      }
      
      onCellSelect(newSelection);
    } else {
      // Check if the cell is already selected and if it's a single selection
      const cellExists = selectedCells.some(
        cell => cell.rowIndex === rowIndex && cell.colIndex === colIndex
      );
      
      // If this is an exact single cell selection, toggle it off when clicked again
      if (cellExists && selectedCells.length === 1) {
        onCellSelect([]);
        setLastSelectedCell(null);
      } else {
        // Start a new selection
        setIsSelecting(true);
        setSelectionStart({ rowIndex, colIndex });
        setLastSelectedCell({ rowIndex, colIndex });
        onCellSelect([{ rowIndex, colIndex }]);
      }
    }
  };
  
  // Handle cell mouse enter during drag selection
  const handleCellMouseEnter = (rowIndex, colIndex) => {
    if (isSelecting && selectionStart) {
      // Create a range selection from start to current
      const startRow = Math.min(selectionStart.rowIndex, rowIndex);
      const endRow = Math.max(selectionStart.rowIndex, rowIndex);
      const startCol = Math.min(selectionStart.colIndex, colIndex);
      const endCol = Math.max(selectionStart.colIndex, colIndex);
      
      const newSelection = [];
      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          newSelection.push({ rowIndex: r, colIndex: c });
        }
      }
      
      onCellSelect(newSelection);
      setLastSelectedCell({ rowIndex, colIndex });
    }
  };
  
  // Handle mouse up to end selection
  const handleCellMouseUp = (rowIndex, colIndex) => {
    if (isSelecting) {
      setIsSelecting(false);
      setSelectionStart(null);
    }
  };
  
  // Handle double click to edit
  const handleCellDoubleClick = (rowIndex, colIndex) => {
    startEditing(rowIndex, colIndex);
  };
  
  // Handle header click
  const handleHeaderClick = (index, e) => {
    // Prevent default selection behavior
    e.preventDefault();
    
    if (e.detail === 2) {
      startEditingHeader(index);
    } else {
      // Select entire column
      const columnCells = [];
      for (let r = 0; r < data.length; r++) {
        columnCells.push({ rowIndex: r, colIndex: index });
      }
      onCellSelect(columnCells);
      setLastSelectedCell({ rowIndex: 0, colIndex: index });
    }
  };
  
  // Handle row selection by clicking row header
  const handleRowClick = (rowIndex, e) => {
    // Prevent default selection behavior
    e.preventDefault();
    
    // Select entire row
    const rowCells = [];
    for (let c = 0; c < headers.length; c++) {
      rowCells.push({ rowIndex, colIndex: c });
    }
    onCellSelect(rowCells);
    setLastSelectedCell({ rowIndex, colIndex: 0 });
  };
  
  // Handle select all table by clicking top-left '#' cell
  const handleSelectAllClick = (e) => {
    // Prevent default selection behavior
    e.preventDefault();
    
    const allCells = [];
    for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
      for (let colIndex = 0; colIndex < headers.length; colIndex++) {
        allCells.push({ rowIndex, colIndex });
      }
    }
    onCellSelect(allCells);
    setLastSelectedCell({ rowIndex: 0, colIndex: 0 });
  };
  
  // Handle context menu
  const handleContextMenu = (e, rowIndex, colIndex) => {
    e.preventDefault();
    
    // If right-clicking on an unselected cell, select it first
    if (!isCellSelected(rowIndex, colIndex)) {
      onCellSelect([{ rowIndex, colIndex }]);
      setLastSelectedCell({ rowIndex, colIndex });
    }
    
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuTarget({ rowIndex, colIndex });
    setShowContextMenu(true);
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
      
      // Ensure all rows exist
      while (newData.length < startRow + parsedRows.length) {
        newData.push(new Array(headers.length).fill(''));
      }
      
      // Paste data starting from selected cell
      parsedRows.forEach((rowData, rowOffset) => {
        rowData.forEach((cellValue, colOffset) => {
          const targetRow = startRow + rowOffset;
          const targetCol = startCol + colOffset;
          
          // Skip if column is outside range
          if (targetCol >= headers.length) return;
          
          // Insert value
          if (!newData[targetRow]) {
            newData[targetRow] = new Array(headers.length).fill('');
          }
          
          newData[targetRow][targetCol] = cellValue;
        });
      });
      
      // Update data
      onDataChange(newData);
      
      // Select the pasted region
      const pastedSelection = [];
      for (let r = startRow; r < startRow + parsedRows.length; r++) {
        for (let c = startCol; c < startCol + (parsedRows[0]?.length || 0); c++) {
          if (c < headers.length) {
            pastedSelection.push({ rowIndex: r, colIndex: c });
          }
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
      if (newData[rowIndex] && colIndex < headers.length) {
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
    
    // Update visible rows to include new row
    updateVisibleRows();
  };
  
  // Add a new column
  const addColumn = () => {
    const newHeaders = [...headers, `Column ${headers.length + 1}`];
    onHeaderChange(newHeaders);
    
    const newData = data.map(row => {
      const newRow = [...row];
      newRow.push('');
      return newRow;
    });
    
    onDataChange(newData);
  };
  
  // Check if a cell is highlighted (for find/replace)
  const isCellHighlighted = (rowIndex, colIndex) => {
    return highlightedCell && 
           highlightedCell.rowIndex === rowIndex && 
           highlightedCell.colIndex === colIndex;
  };
  
  // Set a cell reference
  const setCellRef = (rowIndex, colIndex, ref) => {
    const key = `cell-${rowIndex}-${colIndex}`;
    cellRefs.current[key] = ref;
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
      <div className="truncate px-2 py-1 h-full w-full select-none">
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
      <div className="truncate font-semibold px-2 py-1 select-none">
        {headers[index]}
      </div>
    );
  };
  
  // Render only the visible portion of the table for performance
  const renderVisibleRows = () => {
    const rows = [];
    
    for (let rowIndex = visibleRowsRange.start; rowIndex < visibleRowsRange.end && rowIndex < data.length; rowIndex++) {
      rows.push(
        <tr key={rowIndex} className="divide-x divide-border">
          {/* Row header */}
          <td 
            className="w-12 px-2 py-1 whitespace-nowrap text-sm font-medium text-text-900 bg-accent/30 cursor-pointer hover:bg-accent-200 sticky left-0 z-10 select-none"
            onClick={(e) => handleRowClick(rowIndex, e)}
            onMouseDown={(e) => {
              e.preventDefault(); // Prevent text selection
              handleRowClick(rowIndex, e);
            }}
          >
            {rowIndex + 1}
          </td>
          
          {/* Row cells */}
          {headers.map((_, colIndex) => {
            const isSelected = isCellSelected(rowIndex, colIndex);
            const isHighlighted = isCellHighlighted(rowIndex, colIndex);
            
            return (
              <td
                key={colIndex}
                ref={(ref) => setCellRef(rowIndex, colIndex, ref)}
                data-row-index={rowIndex}
                data-col-index={colIndex}
                className={`whitespace-nowrap text-sm text-text-900 border-r border-border relative min-w-[120px] cursor-cell ${
                  isSelected ? 'bg-primary/10 bg-secondary/20 outline outline-2 outline-secondary' : ''
                } ${
                  isHighlighted ? 'bg-secondary/20 outline outline-2 outline-secondary' : ''
                }`}
                onMouseDown={(e) => handleCellMouseDown(rowIndex, colIndex, e)}
                onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                onMouseUp={() => handleCellMouseUp(rowIndex, colIndex)}
                onDoubleClick={() => handleCellDoubleClick(rowIndex, colIndex)}
                onContextMenu={(e) => handleContextMenu(e, rowIndex, colIndex)}
                onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                tabIndex="0"
              >
                {renderCell(rowIndex, colIndex)}
              </td>
            );
          })}
        </tr>
      );
    }
    
    return rows;
  };
  
  // Calculate spacer heights
  const topSpacerHeight = visibleRowsRange.start * ROW_HEIGHT;
  const bottomSpacerHeight = Math.max(0, (data.length - visibleRowsRange.end) * ROW_HEIGHT);
  
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
            : 'Click to select cell. Double-click to edit. Drag to select multiple cells.'}
        </div>
      </div>
      
      <div 
        className="overflow-auto border border-border rounded"
        style={{ maxHeight }}
        ref={tableRef}
      >
        <div 
          className="overflow-auto max-h-full"
          ref={tableBodyRef}
        >
          <table className="min-w-full divide-y divide-border relative select-none">
            <thead className="bg-accent sticky top-0 z-20">
              <tr>
                {/* Corner cell - select all */}
                <th 
                  className="w-12 px-2 py-2 text-left text-xs font-medium text-text-900 uppercase tracking-wider border-r border-border cursor-pointer hover:bg-accent-200 sticky left-0 z-30 select-none"
                  onClick={(e) => handleSelectAllClick(e)}
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevent text selection
                    handleSelectAllClick(e);
                  }}
                >
                  #
                </th>
                
                {/* Column headers */}
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="px-2 py-2 text-left text-xs font-medium text-text-900 uppercase tracking-wider border-r border-border min-w-[120px] cursor-pointer hover:bg-accent-200 select-none"
                    onClick={(e) => handleHeaderClick(index, e)}
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent text selection
                      handleHeaderClick(index, e);
                    }}
                  >
                    {renderHeader(index)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-border">
              {/* Top spacer for virtualization */}
              {topSpacerHeight > 0 && (
                <tr>
                  <td colSpan={headers.length + 1} style={{ height: `${topSpacerHeight}px` }}></td>
                </tr>
              )}
              
              {/* Visible rows */}
              {renderVisibleRows()}
              
              {/* Bottom spacer for virtualization */}
              {bottomSpacerHeight > 0 && (
                <tr>
                  <td colSpan={headers.length + 1} style={{ height: `${bottomSpacerHeight}px` }}></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
  maxHeight: PropTypes.string,
  highlightedCell: PropTypes.shape({
    rowIndex: PropTypes.number.isRequired,
    colIndex: PropTypes.number.isRequired
  })
};

export default EditableCSVTable;