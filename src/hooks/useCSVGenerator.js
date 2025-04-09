import { useState, useCallback } from 'react';
import { faker } from '@faker-js/faker';
import { format } from 'date-fns';

export const useCSVGenerator = () => {
  const [generatingStatus, setGeneratingStatus] = useState('idle');
  const [error, setError] = useState(null);
  
  const generateCSV = useCallback(async ({ columns, rowCount }) => {
    try {
      setGeneratingStatus('generating');
      setError(null);
      
      // Validate inputs
      if (!columns || !columns.length) {
        throw new Error('Columns definition is required');
      }
      
      if (!rowCount || rowCount <= 0 || rowCount > 10000) {
        throw new Error('Row count must be between 1 and 10,000');
      }
      
      // Generate data based on column definitions
      const data = [];
      
      for (let i = 0; i < rowCount; i++) {
        const row = {};
        
        // Process each column for this row
        for (const column of columns) {
          const { name, type, options = {} } = column;
          
          if (!name || !type) continue;
          
          // Generate value based on column type
          row[name] = generateValueForType(type, options, i, row);
        }
        
        data.push(row);
      }
      
      setGeneratingStatus('succeeded');
      return data;
      
    } catch (err) {
      setError(err.message || 'Failed to generate CSV data');
      setGeneratingStatus('failed');
      throw err;
    }
  }, []);
  
  // Helper function to generate values based on type
  const generateValueForType = (type, options, rowIndex, currentRow) => {
    switch (type) {
      case 'id':
        return `${options.prefix || ''}${(options.startAt || 1) + rowIndex}`;
        
      case 'fullName':
        return options.gender === 'male' 
          ? faker.person.fullName({ sex: 'male' })
          : options.gender === 'female'
            ? faker.person.fullName({ sex: 'female' })
            : faker.person.fullName();
            
      case 'firstName':
        return options.gender === 'male' 
          ? faker.person.firstName('male')
          : options.gender === 'female'
            ? faker.person.firstName('female')
            : faker.person.firstName();
            
      case 'lastName':
        return faker.person.lastName();
        
      case 'email':
        // Generate email based on name if specified
        if (options.useNameColumn && options.nameColumn && currentRow[options.nameColumn]) {
          const name = currentRow[options.nameColumn].toLowerCase()
            .replace(/[^a-z0-9]/g, '.')
            .replace(/\.+/g, '.');
          
          return `${name}@${options.domain || 'example.com'}`;
        }
        
        // Otherwise generate random email
        return faker.internet.email({
          provider: options.domain || 'example.com'
        });
        
      case 'company':
        return faker.company.name();
        
      case 'jobTitle':
        return faker.person.jobTitle();
        
      case 'phone':
        return faker.phone.number();
        
      case 'address':
        return faker.location.streetAddress();
        
      case 'city':
        return faker.location.city();
        
      case 'state':
        return faker.location.state();
        
      case 'zipCode':
        return faker.location.zipCode();
        
      case 'country':
        return faker.location.country();
        
      case 'date':
        const startDate = options.startDate 
          ? new Date(options.startDate) 
          : new Date(2000, 0, 1);
          
        const endDate = options.endDate 
          ? new Date(options.endDate) 
          : new Date();
          
        const dateFormat = options.format || 'YYYY-MM-DD';
        
        const randomDate = faker.date.between({ from: startDate, to: endDate });
        
        // Format date according to specified format
        return formatDate(randomDate, dateFormat);
        
      case 'number':
        const min = options.min !== undefined ? Number(options.min) : 0;
        const max = options.max !== undefined ? Number(options.max) : 100;
        const decimals = options.decimals !== undefined ? Number(options.decimals) : 0;
        
        const randomNum = faker.number.float({ min, max, precision: Math.pow(0.1, decimals) });
        
        return decimals === 0 ? Math.floor(randomNum) : Number(randomNum.toFixed(decimals));
        
      case 'boolean':
        const probability = options.trueProbability !== undefined ? options.trueProbability : 50;
        return Math.random() * 100 < probability;
        
      case 'oneOf':
        if (!options.values || !options.values.length) {
          return '';
        }
        
        const randomIndex = Math.floor(Math.random() * options.values.length);
        return options.values[randomIndex];
        
      case 'string':
        const minLength = options.minLength || 5;
        const maxLength = options.maxLength || 20;
        const prefix = options.prefix || '';
        const suffix = options.suffix || '';
        
        const randomString = faker.string.alpha({ length: { min: minLength, max: maxLength } });
        
        return `${prefix}${randomString}${suffix}`;
        
      case 'paragraph':
        const sentences = options.sentences || 3;
        return faker.lorem.paragraph(sentences);
        
      case 'uuid':
        return faker.string.uuid();
        
      case 'color':
        return faker.color.rgb();
        
      case 'productName':
        return faker.commerce.productName();
        
      case 'price':
        const minPrice = options.min !== undefined ? Number(options.min) : 1;
        const maxPrice = options.max !== undefined ? Number(options.max) : 1000;
        const decimalPlaces = options.decimals !== undefined ? Number(options.decimals) : 2;
        
        return Number(faker.commerce.price({ min: minPrice, max: maxPrice, dec: decimalPlaces }));
        
      default:
        return '';
    }
  };
  
  // Helper function to format dates
  const formatDate = (date, formatStr) => {
    const mappings = {
      'YYYY': 'yyyy',
      'YY': 'yy',
      'MM': 'MM',
      'DD': 'dd',
      'M': 'M',
      'D': 'd'
    };
    
    // Convert from simple format to date-fns format
    let dateFormat = formatStr;
    Object.entries(mappings).forEach(([key, value]) => {
      dateFormat = dateFormat.replace(key, value);
    });
    
    // Special case for common formats
    if (formatStr === 'MM/DD/YYYY') {
      dateFormat = 'MM/dd/yyyy';
    } else if (formatStr === 'DD/MM/YYYY') {
      dateFormat = 'dd/MM/yyyy';
    } else if (formatStr === 'YYYY-MM-DD') {
      dateFormat = 'yyyy-MM-dd';
    }
    
    return format(date, dateFormat);
  };
  
  return {
    generateCSV,
    generatingStatus,
    error
  };
};

export default useCSVGenerator;