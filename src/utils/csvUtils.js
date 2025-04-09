// CSV utility functions and constants

// Data types for CSV generator
export const dataTypes = {
    'Basic Types': [
      { value: 'string', label: 'Random String' },
      { value: 'number', label: 'Number' },
      { value: 'boolean', label: 'Boolean (True/False)' },
      { value: 'date', label: 'Date' },
      { value: 'id', label: 'ID/Sequence' },
      { value: 'oneOf', label: 'One from List' },
    ],
    'Personal Data': [
      { value: 'fullName', label: 'Full Name' },
      { value: 'firstName', label: 'First Name' },
      { value: 'lastName', label: 'Last Name' },
      { value: 'email', label: 'Email Address' },
      { value: 'phone', label: 'Phone Number' },
      { value: 'jobTitle', label: 'Job Title' },
    ],
    'Location Data': [
      { value: 'address', label: 'Street Address' },
      { value: 'city', label: 'City' },
      { value: 'state', label: 'State' },
      { value: 'zipCode', label: 'Zip Code' },
      { value: 'country', label: 'Country' },
    ],
    'Business Data': [
      { value: 'company', label: 'Company Name' },
      { value: 'price', label: 'Price' },
      { value: 'productName', label: 'Product Name' },
      { value: 'paragraph', label: 'Text Paragraph' },
      { value: 'uuid', label: 'UUID' },
      { value: 'color', label: 'Color' },
    ]
  };
  
  /**
   * Parse CSV string into array of objects
   * @param {string} csvString - CSV content as string
   * @param {object} options - Parsing options
   * @returns {object} - Parsed data and metadata
   */
  export const parseCSV = (csvString, options = {}) => {
    const {
      header = true,
      skipEmptyLines = true,
      delimiter = ',',
      quotes = '"'
    } = options;
    
    if (!csvString || typeof csvString !== 'string') {
      throw new Error('Invalid CSV string');
    }
    
    // Split CSV into lines
    const lines = csvString.split(/\r?\n/).filter(line => skipEmptyLines ? line.trim() : true);
    
    if (lines.length === 0) {
      return { data: [], columns: [] };
    }
    
    // Parse header row
    const headerLine = lines[0];
    const columns = parseCSVRow(headerLine, delimiter, quotes);
    
    if (!header) {
      // Generate column names if no header
      const columnsGenerated = columns.map((_, i) => `Column ${i + 1}`);
      
      // Parse all rows
      const data = lines.map(line => {
        const values = parseCSVRow(line, delimiter, quotes);
        return values.reduce((obj, value, i) => {
          obj[columnsGenerated[i]] = value;
          return obj;
        }, {});
      });
      
      return { data, columns: columnsGenerated };
    } else {
      // Parse data rows
      const data = lines.slice(1).map(line => {
        const values = parseCSVRow(line, delimiter, quotes);
        return values.reduce((obj, value, i) => {
          if (i < columns.length) {
            obj[columns[i]] = value;
          }
          return obj;
        }, {});
      });
      
      return { data, columns };
    }
  };
  
  /**
   * Parse a single CSV row into array of values
   * @param {string} row - CSV row
   * @param {string} delimiter - Field delimiter
   * @param {string} quotes - Quote character
   * @returns {Array} - Array of field values
   */
  export const parseCSVRow = (row, delimiter = ',', quotes = '"') => {
    if (!row) return [];
    
    const result = [];
    let inQuotes = false;
    let currentField = '';
    let i = 0;
    
    while (i < row.length) {
      const char = row[i];
      const nextChar = row[i + 1];
      
      if (char === quotes) {
        if (inQuotes && nextChar === quotes) {
          // Handle escaped quotes
          currentField += quotes;
          i++;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        // End of field
        result.push(currentField);
        currentField = '';
      } else {
        // Add character to current field
        currentField += char;
      }
      
      i++;
    }
    
    // Add the last field
    result.push(currentField);
    
    return result;
  };
  
  /**
   * Convert array of objects to CSV string
   * @param {Array} data - Array of objects
   * @param {object} options - Conversion options
   * @returns {string} - CSV string
   */
  export const objectsToCSV = (data, options = {}) => {
    if (!Array.isArray(data) || data.length === 0) {
      return '';
    }
    
    const {
      delimiter = ',',
      includeHeader = true,
      columns = Object.keys(data[0]),
      quoteStrings = true
    } = options;
    
    // Create header row
    const headerRow = includeHeader ? columns.join(delimiter) : '';
    
    // Create data rows
    const rows = data.map(item => {
      return columns.map(column => {
        const value = item[column];
        
        // Handle different value types
        if (value === null || value === undefined) {
          return '';
        } else if (typeof value === 'string' && quoteStrings) {
          // Quote strings and escape quotes
          return `"${value.replace(/"/g, '""')}"`;
        } else {
          return String(value);
        }
      }).join(delimiter);
    });
    
    // Combine header and rows
    return includeHeader ? [headerRow, ...rows].join('\n') : rows.join('\n');
  };
  
  /**
   * Generate a preview of CSV data
   * @param {Array} data - Array of objects
   * @param {number} maxRows - Maximum rows to include
   * @returns {Array} - Preview data
   */
  export const generatePreview = (data, maxRows = 10) => {
    if (!Array.isArray(data)) return [];
    
    return data.slice(0, maxRows);
  };
  
  /**
   * Calculate statistics for CSV data
   * @param {Array} data - Array of objects
   * @param {Array} columns - Column names
   * @returns {object} - Column statistics
   */
  export const calculateColumnStats = (data, columns) => {
    if (!Array.isArray(data) || data.length === 0 || !Array.isArray(columns)) {
      return {};
    }
    
    const stats = {};
    
    columns.forEach(column => {
      const values = data.map(row => row[column]);
      const nonEmptyValues = values.filter(val => val !== null && val !== undefined && val !== '');
      const uniqueValues = new Set(values);
      
      // Determine column type
      let isNumeric = true;
      let numericStats = null;
      
      if (nonEmptyValues.length > 0) {
        isNumeric = nonEmptyValues.every(val => !isNaN(Number(val)));
        
        if (isNumeric) {
          const numericValues = nonEmptyValues.map(val => Number(val));
          numericStats = {
            min: Math.min(...numericValues),
            max: Math.max(...numericValues),
            avg: numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length
          };
        }
      }
      
      stats[column] = {
        type: isNumeric ? 'Number' : 'Text',
        uniqueCount: uniqueValues.size,
        emptyCount: data.length - nonEmptyValues.length,
        numericStats
      };
    });
    
    return stats;
  };
  
  export default {
    dataTypes,
    parseCSV,
    parseCSVRow,
    objectsToCSV,
    generatePreview,
    calculateColumnStats
  };