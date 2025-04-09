import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../../components/common/Button';

const TemplateSelector = ({ onSelectTemplate }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  
  // Predefined templates
  const templates = [
    {
      id: 'userProfile',
      name: 'User Profile',
      description: 'Basic user profile data with name, email, and demographics',
      columns: [
        { name: 'id', type: 'id', options: { prefix: 'USR' } },
        { name: 'firstName', type: 'firstName', options: { gender: 'both' } },
        { name: 'lastName', type: 'lastName', options: { gender: 'both' } },
        { name: 'email', type: 'email', options: { domain: 'example.com' } },
        { name: 'age', type: 'number', options: { min: 18, max: 80, decimals: 0 } },
        { name: 'gender', type: 'oneOf', options: { values: ['Male', 'Female', 'Non-binary', 'Prefer not to say'] } },
        { name: 'country', type: 'country', options: {} },
        { name: 'registrationDate', type: 'date', options: { startDate: '2020-01-01', format: 'YYYY-MM-DD' } }
      ],
      rowCount: 20
    },
    {
      id: 'salesData',
      name: 'Sales Data',
      description: 'E-commerce sales transactions with products, prices, and dates',
      columns: [
        { name: 'order_id', type: 'id', options: { prefix: 'ORD-' } },
        { name: 'customer_id', type: 'id', options: { prefix: 'CUST-' } },
        { name: 'product_name', type: 'oneOf', options: { values: ['Laptop', 'Smartphone', 'Tablet', 'Headphones', 'Monitor', 'Keyboard', 'Mouse'] } },
        { name: 'category', type: 'oneOf', options: { values: ['Electronics', 'Accessories', 'Peripherals'] } },
        { name: 'price', type: 'number', options: { min: 9.99, max: 1999.99, decimals: 2 } },
        { name: 'quantity', type: 'number', options: { min: 1, max: 5, decimals: 0 } },
        { name: 'order_date', type: 'date', options: { startDate: '2022-01-01', format: 'YYYY-MM-DD' } },
        { name: 'shipping_status', type: 'oneOf', options: { values: ['Processing', 'Shipped', 'Delivered', 'Returned'] } }
      ],
      rowCount: 50
    },
    {
      id: 'employeeDirectory',
      name: 'Employee Directory',
      description: 'Company employee records with departments and roles',
      columns: [
        { name: 'employee_id', type: 'id', options: { prefix: 'EMP-' } },
        { name: 'name', type: 'fullName', options: { gender: 'both' } },
        { name: 'email', type: 'email', options: { domain: 'company.com' } },
        { name: 'department', type: 'oneOf', options: { values: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'] } },
        { name: 'job_title', type: 'oneOf', options: { values: ['Manager', 'Director', 'Developer', 'Designer', 'Analyst', 'Specialist', 'Coordinator'] } },
        { name: 'salary', type: 'number', options: { min: 30000, max: 150000, decimals: 0 } },
        { name: 'hire_date', type: 'date', options: { startDate: '2015-01-01', format: 'YYYY-MM-DD' } },
        { name: 'is_manager', type: 'boolean', options: { trueProbability: 20 } }
      ],
      rowCount: 30
    },
    {
      id: 'stockData',
      name: 'Stock Market Data',
      description: 'Daily stock price data for analysis',
      columns: [
        { name: 'date', type: 'date', options: { startDate: '2022-01-01', endDate: '2022-12-31', format: 'YYYY-MM-DD' } },
        { name: 'symbol', type: 'oneOf', options: { values: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA'] } },
        { name: 'open', type: 'number', options: { min: 100, max: 400, decimals: 2 } },
        { name: 'high', type: 'number', options: { min: 100, max: 450, decimals: 2 } },
        { name: 'low', type: 'number', options: { min: 90, max: 390, decimals: 2 } },
        { name: 'close', type: 'number', options: { min: 95, max: 420, decimals: 2 } },
        { name: 'volume', type: 'number', options: { min: 1000000, max: 20000000, decimals: 0 } }
      ],
      rowCount: 100
    },
    {
      id: 'customerFeedback',
      name: 'Customer Feedback',
      description: 'Survey responses and ratings from customers',
      columns: [
        { name: 'response_id', type: 'id', options: { prefix: 'RESP-' } },
        { name: 'customer_name', type: 'fullName', options: { gender: 'both' } },
        { name: 'product', type: 'oneOf', options: { values: ['Product A', 'Product B', 'Product C', 'Service X', 'Service Y'] } },
        { name: 'rating', type: 'number', options: { min: 1, max: 5, decimals: 0 } },
        { name: 'recommend', type: 'boolean', options: { trueProbability: 70 } },
        { name: 'comment', type: 'string', options: { minLength: 20, maxLength: 100 } },
        { name: 'response_date', type: 'date', options: { startDate: '2023-01-01', format: 'MM/DD/YYYY' } }
      ],
      rowCount: 40
    }
  ];
  
  // Handle template selection
  const handleSelectTemplate = () => {
    if (!selectedTemplate) return;
    
    const template = templates.find(t => t.id === selectedTemplate);
    if (template) {
      onSelectTemplate(template);
    }
  };
  
  return (
    <div>
      <div className="mb-4">
        <label htmlFor="templateSelect" className="block text-sm font-medium mb-1">
          Select a predefined template
        </label>
        <select
          id="templateSelect"
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
          className="w-full p-2 border border-border rounded"
        >
          <option value="">-- Select Template --</option>
          {templates.map(template => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </div>
      
      {selectedTemplate && (
        <div className="mb-4 p-3 bg-accent/20 rounded">
          <h3 className="font-medium text-primary mb-1">
            {templates.find(t => t.id === selectedTemplate)?.name}
          </h3>
          <p className="text-sm text-text-600 mb-2">
            {templates.find(t => t.id === selectedTemplate)?.description}
          </p>
          <div className="text-xs text-text-500">
            {templates.find(t => t.id === selectedTemplate)?.columns.length} columns, 
            {templates.find(t => t.id === selectedTemplate)?.rowCount} rows
          </div>
        </div>
      )}
      
      <Button
        variant="primary"
        onClick={handleSelectTemplate}
        disabled={!selectedTemplate}
        className="w-full"
      >
        Load Template
      </Button>
    </div>
  );
};

TemplateSelector.propTypes = {
  onSelectTemplate: PropTypes.func.isRequired
};

export default TemplateSelector;