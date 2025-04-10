import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../common/Button';

const FindReplacePanel = ({
  data,
  headers,
  selectedCells,
  onDataChange,
  onCellSelect
}) => {
  const [findValue, setFindValue] = useState('');
  const [replaceValue, setReplaceValue] = useState('');
  const [useRegex, setUseRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [matchWholeCell, setMatchWholeCell] = useState(false);
  const [searchScope, setSearchScope] = useState('selection'); // 'all', 'selection', 'column', 'row'
  const [foundCells, setFoundCells] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
  const [stats, setStats] = useState({ matches: 0, replaced: 0 });
  const [error, setError] = useState(null);
  
  // Reset matches when find value changes
  useEffect(() => {
    if (findValue === '') {
      setFoundCells([]);
      setCurrentMatchIndex(-1);
      setStats({ matches: 0, replaced: 0 });
    }
  }, [findValue]);
  
  // Reset matches when search scope changes
  useEffect(() => {
    setFoundCells([]);
    setCurrentMatchIndex(-1);
    setStats({ matches: 0, replaced: 0 });
  }, [searchScope]);
  
  // Check if the cell content matches the search criteria
  const doesCellMatch = (cellValue) => {
    if (cellValue === null || cellValue === undefined) {
      return false;
    }
    
    const cellText = String(cellValue);
    
    // Handle empty search string
    if (findValue === '') {
      return false;
    }
    
    try {
      if (useRegex) {
        // Create regex with case sensitivity flag
        const flags = caseSensitive ? 'g' : 'gi';
        const regex = new RegExp(findValue, flags);
        
        if (matchWholeCell) {
          // Match the entire cell content
          const matches = cellText.match(regex);
          return matches !== null && matches[0] === cellText;
        } else {
          // Match part of the cell content
          return regex.test(cellText);
        }
      } else {
        // Plain text search
        const searchText = caseSensitive ? findValue : findValue.toLowerCase();
        const targetText = caseSensitive ? cellText : cellText.toLowerCase();
        
        if (matchWholeCell) {
          // Match the entire cell content
          return targetText === searchText;
        } else {
          // Match part of the cell content
          return targetText.includes(searchText);
        }
      }
    } catch (err) {
      setError(`Invalid search pattern: ${err.message}`);
      return false;
    }
  };
  
  // Get cells to search based on the search scope
  const getCellsToSearch = () => {
    switch (searchScope) {
      case 'all':
        // All cells in the table
        const allCells = [];
        for (let r = 0; r < data.length; r++) {
          if (data[r]) {
            for (let c = 0; c < headers.length; c++) {
              allCells.push({ rowIndex: r, colIndex: c });
            }
          }
        }
        return allCells;
        
      case 'selection':
        // Only selected cells
        return selectedCells.length > 0 
          ? selectedCells 
          : getCellsToSearch('all'); // Fall back to all cells if no selection
        
      case 'column':
        // Only cells in the selected columns
        if (selectedCells.length === 0) return [];
        
        const uniqueColumns = [...new Set(selectedCells.map(cell => cell.colIndex))];
        const columnCells = [];
        
        for (const colIndex of uniqueColumns) {
          for (let r = 0; r < data.length; r++) {
            if (data[r]) {
              columnCells.push({ rowIndex: r, colIndex });
            }
          }
        }
        
        return columnCells;
        
      case 'row':
        // Only cells in the selected rows
        if (selectedCells.length === 0) return [];
        
        const uniqueRows = [...new Set(selectedCells.map(cell => cell.rowIndex))];
        const rowCells = [];
        
        for (const rowIndex of uniqueRows) {
          if (data[rowIndex]) {
            for (let c = 0; c < headers.length; c++) {
              rowCells.push({ rowIndex, colIndex: c });
            }
          }
        }
        
        return rowCells;
        
      default:
        return [];
    }
  };
  
  // Find all matches
  const handleFind = () => {
    if (!findValue) {
      setError('Please enter a search term');
      return;
    }
    
    setError(null);
    const cellsToSearch = getCellsToSearch();
    const matches = [];
    
    for (const cell of cellsToSearch) {
      const { rowIndex, colIndex } = cell;
      
      // Skip if row doesn't exist or column is out of range
      if (!data[rowIndex] || colIndex >= headers.length) {
        continue;
      }
      
      const cellValue = data[rowIndex][colIndex];
      
      if (doesCellMatch(cellValue)) {
        matches.push({ rowIndex, colIndex });
      }
    }
    
    setFoundCells(matches);
    setStats({ ...stats, matches: matches.length });
    
    if (matches.length > 0) {
      setCurrentMatchIndex(0);
      
      // Highlight and select the first match
      const firstMatch = matches[0];
      highlightMatchAndNotify(firstMatch);
    } else {
      setCurrentMatchIndex(-1);
    }
  };
  
  // Find next match
  const handleFindNext = () => {
    if (foundCells.length === 0) {
      handleFind();
      return;
    }
    
    if (currentMatchIndex >= 0 && currentMatchIndex < foundCells.length - 1) {
      const nextIndex = currentMatchIndex + 1;
      setCurrentMatchIndex(nextIndex);
      
      // Highlight and select the next match
      highlightMatchAndNotify(foundCells[nextIndex]);
    } else {
      // Loop back to the first match
      setCurrentMatchIndex(0);
      highlightMatchAndNotify(foundCells[0]);
    }
  };
  
  // Find previous match
  const handleFindPrevious = () => {
    if (foundCells.length === 0) {
      handleFind();
      return;
    }
    
    if (currentMatchIndex > 0) {
      const prevIndex = currentMatchIndex - 1;
      setCurrentMatchIndex(prevIndex);
      
      // Highlight and select the previous match
      highlightMatchAndNotify(foundCells[prevIndex]);
    } else {
      // Loop to the last match
      const lastIndex = foundCells.length - 1;
      setCurrentMatchIndex(lastIndex);
      highlightMatchAndNotify(foundCells[lastIndex]);
    }
  };
  
  // Common function to highlight a match and notify parent components
  const highlightMatchAndNotify = (cell) => {
    // First select the cell
    onCellSelect([cell]);
    
    // Then notify the table component to highlight and focus the cell
    // This uses a custom event to communicate with the parent component
    const event = new CustomEvent('highlightCell', { 
      detail: { rowIndex: cell.rowIndex, colIndex: cell.colIndex }
    });
    
    document.dispatchEvent(event);
  };
  
  // Replace current match
  const handleReplace = () => {
    if (foundCells.length === 0 || currentMatchIndex === -1) {
      handleFind();
      return;
    }
    
    const { rowIndex, colIndex } = foundCells[currentMatchIndex];
    
    // Skip if row doesn't exist or column is out of range
    if (!data[rowIndex] || colIndex >= headers.length) {
      return;
    }
    
    // Create a copy of the data
    const newData = [...data];
    const cellValue = String(newData[rowIndex][colIndex]);
    
    // Perform replacement
    let newValue;
    
    if (useRegex) {
      try {
        // Create regex with case sensitivity flag
        const flags = caseSensitive ? 'g' : 'gi';
        const regex = new RegExp(findValue, flags);
        
        if (matchWholeCell) {
          // Replace whole cell if it matches completely
          const matches = cellValue.match(regex);
          if (matches !== null && matches[0] === cellValue) {
            newValue = replaceValue;
          } else {
            newValue = cellValue;
          }
        } else {
          // Replace only matching parts
          newValue = cellValue.replace(regex, replaceValue);
        }
      } catch (err) {
        setError(`Invalid regex pattern: ${err.message}`);
        return;
      }
    } else {
      // Plain text replacement
      if (matchWholeCell && 
          (caseSensitive ? cellValue === findValue : cellValue.toLowerCase() === findValue.toLowerCase())) {
        // Replace whole cell if it matches completely
        newValue = replaceValue;
      } else if (!matchWholeCell) {
        // Replace only matching parts
        const searchText = caseSensitive ? findValue : findValue.toLowerCase();
        
        if (caseSensitive) {
          newValue = cellValue.split(findValue).join(replaceValue);
        } else {
          // Case-insensitive replacement
          let result = '';
          let remainingText = cellValue;
          
          while (remainingText.length > 0) {
            const lowerText = remainingText.toLowerCase();
            const index = lowerText.indexOf(searchText);
            
            if (index === -1) {
              // No more matches
              result += remainingText;
              break;
            }
            
            // Add text before match
            result += remainingText.substring(0, index);
            // Add replacement
            result += replaceValue;
            // Continue with remaining text
            remainingText = remainingText.substring(index + searchText.length);
          }
          
          newValue = result;
        }
      } else {
        newValue = cellValue;
      }
    }
    
    // Update the cell value
    if (newValue !== cellValue) {
      newData[rowIndex][colIndex] = newValue;
      onDataChange(newData);
      
      // Update stats
      setStats({ ...stats, replaced: stats.replaced + 1 });
    }
    
    // Move to next match
    if (foundCells.length > 1) {
      handleFindNext();
    } else {
      // If we just replaced the last/only match, search again
      handleFind();
    }
  };
  
  // Replace all matches
  const handleReplaceAll = () => {
    if (findValue === '') {
      setError('Please enter a search term');
      return;
    }
    
    setError(null);
    const cellsToSearch = getCellsToSearch();
    const newData = [...data];
    let replaceCount = 0;
    const replacedCells = [];
    
    for (const cell of cellsToSearch) {
      const { rowIndex, colIndex } = cell;
      
      // Skip if row doesn't exist or column is out of range
      if (!newData[rowIndex] || colIndex >= headers.length) {
        continue;
      }
      
      const cellValue = String(newData[rowIndex][colIndex]);
      
      // Check if cell matches
      if (doesCellMatch(cellValue)) {
        // Perform replacement
        let newValue;
        
        if (useRegex) {
          try {
            // Create regex with case sensitivity flag
            const flags = caseSensitive ? 'g' : 'gi';
            const regex = new RegExp(findValue, flags);
            
            if (matchWholeCell) {
              // Replace whole cell if it matches completely
              const matches = cellValue.match(regex);
              if (matches !== null && matches[0] === cellValue) {
                newValue = replaceValue;
              } else {
                newValue = cellValue;
              }
            } else {
              // Replace only matching parts
              newValue = cellValue.replace(regex, replaceValue);
            }
          } catch (err) {
            setError(`Invalid regex pattern: ${err.message}`);
            return;
          }
        } else {
          // Plain text replacement
          if (matchWholeCell && 
              (caseSensitive ? cellValue === findValue : cellValue.toLowerCase() === findValue.toLowerCase())) {
            // Replace whole cell if it matches completely
            newValue = replaceValue;
          } else if (!matchWholeCell) {
            // Replace only matching parts using case sensitivity
            if (caseSensitive) {
              newValue = cellValue.split(findValue).join(replaceValue);
            } else {
              // Case-insensitive replacement
              let result = '';
              let remainingText = cellValue;
              const searchText = findValue.toLowerCase();
              
              while (remainingText.length > 0) {
                const lowerText = remainingText.toLowerCase();
                const index = lowerText.indexOf(searchText);
                
                if (index === -1) {
                  // No more matches
                  result += remainingText;
                  break;
                }
                
                // Add text before match
                result += remainingText.substring(0, index);
                // Add replacement
                result += replaceValue;
                // Continue with remaining text
                remainingText = remainingText.substring(index + searchText.length);
              }
              
              newValue = result;
            }
          } else {
            newValue = cellValue;
          }
        }
        
        // Update the cell value if it's different
        if (newValue !== cellValue) {
          newData[rowIndex][colIndex] = newValue;
          replaceCount++;
          replacedCells.push({ rowIndex, colIndex });
        }
      }
    }
    
    // Update data only if changes were made
    if (replaceCount > 0) {
      onDataChange(newData);
      
      // Update stats
      setStats({ ...stats, replaced: stats.replaced + replaceCount });
      
      // Select all replaced cells to highlight them
      onCellSelect(replacedCells);
      
      // If there are any replaced cells, highlight the last one for focus
      if (replacedCells.length > 0) {
        const lastReplaced = replacedCells[replacedCells.length - 1];
        
        // Notify about highlighting the last replaced cell
        const event = new CustomEvent('highlightCell', { 
          detail: { rowIndex: lastReplaced.rowIndex, colIndex: lastReplaced.colIndex }
        });
        document.dispatchEvent(event);
      }
      
      // Reset for the next search
      setFoundCells([]);
      setCurrentMatchIndex(-1);
    } else {
      setError('No matches found to replace');
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Find & Replace</h2>
      
      <div className="space-y-4">
        {/* Find input */}
        <div>
          <label className="block text-sm font-medium mb-1">Find</label>
          <div className="flex">
            <input
              type="text"
              value={findValue}
              onChange={(e) => setFindValue(e.target.value)}
              className="flex-1 p-2 border border-border rounded-l focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Text to find..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleFind();
              }}
            />
            <Button
              variant="primary"
              onClick={handleFind}
              className="rounded-l-none"
            >
              Find
            </Button>
          </div>
        </div>
        
        {/* Replace input */}
        <div>
          <label className="block text-sm font-medium mb-1">Replace with</label>
          <div className="flex">
            <input
              type="text"
              value={replaceValue}
              onChange={(e) => setReplaceValue(e.target.value)}
              className="flex-1 p-2 border border-border rounded-l focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Replacement text..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && foundCells.length > 0) handleReplace();
              }}
            />
            <div className="flex">
              <Button
                variant="secondary"
                onClick={handleReplace}
                className="rounded-l-none rounded-r-none border-r border-white/20"
                disabled={foundCells.length === 0}
              >
                Replace
              </Button>
              <Button
                variant="secondary"
                onClick={handleReplaceAll}
                className="rounded-l-none"
              >
                Replace All
              </Button>
            </div>
          </div>
        </div>
        
        {/* Options */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="useRegex"
              checked={useRegex}
              onChange={(e) => setUseRegex(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="useRegex" className="text-sm">
              Use Regular Expression
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="caseSensitive"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="caseSensitive" className="text-sm">
              Match Case
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="matchWholeCell"
              checked={matchWholeCell}
              onChange={(e) => setMatchWholeCell(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="matchWholeCell" className="text-sm">
              Match Entire Cell
            </label>
          </div>
        </div>
        
        {/* Search scope */}
        <div>
          <label className="block text-sm font-medium mb-1">Search In</label>
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-1 text-sm rounded ${
                searchScope === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-text hover:bg-gray-200'
              }`}
              onClick={() => setSearchScope('all')}
            >
              All Cells
            </button>
            <button
              className={`px-3 py-1 text-sm rounded ${
                searchScope === 'selection'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-text hover:bg-gray-200'
              }`}
              onClick={() => setSearchScope('selection')}
            >
              Selected Cells
            </button>
            <button
              className={`px-3 py-1 text-sm rounded ${
                searchScope === 'column'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-text hover:bg-gray-200'
              }`}
              onClick={() => setSearchScope('column')}
              disabled={selectedCells.length === 0}
            >
              Selected Columns
            </button>
            <button
              className={`px-3 py-1 text-sm rounded ${
                searchScope === 'row'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-text hover:bg-gray-200'
              }`}
              onClick={() => setSearchScope('row')}
              disabled={selectedCells.length === 0}
            >
              Selected Rows
            </button>
          </div>
        </div>
        
        {/* Navigation buttons */}
        {foundCells.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleFindPrevious}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleFindNext}
              >
                Next
              </Button>
            </div>
            
            <div className="text-sm text-text-600">
              {currentMatchIndex + 1} of {foundCells.length} matches
            </div>
          </div>
        )}
        
        {/* Status and error messages */}
        <div>
          {error && (
            <div className="p-2 mb-2 bg-error/10 border border-error rounded text-error text-sm">
              {error}
            </div>
          )}
          
          <div className="text-sm text-text-600">
            {stats.matches > 0 && (
              <span>Found {stats.matches} matches. </span>
            )}
            {stats.replaced > 0 && (
              <span>Replaced {stats.replaced} occurrences. </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

FindReplacePanel.propTypes = {
  data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.any)).isRequired,
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedCells: PropTypes.arrayOf(
    PropTypes.shape({
      rowIndex: PropTypes.number.isRequired,
      colIndex: PropTypes.number.isRequired
    })
  ).isRequired,
  onDataChange: PropTypes.func.isRequired,
  onCellSelect: PropTypes.func.isRequired
};

export default FindReplacePanel;