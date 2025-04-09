// src/data/featuresData.js
// import GeneratorComponent from '../features/generator/GeneratorForm';
// import ConverterComponent from '../features/converter/ConverterForm';
// import MapperComponent from '../features/mapper/MapperForm';
// import ValidatorComponent from '../features/validator/ValidatorForm';
// import VisualizerComponent from '../features/visualizer/VisualizerForm';

export const features = [
  {
    id: 'generator',
    name: 'CSV Generator',
    description: 'Create custom CSV files with defined structures and sample data',
    // component: GeneratorComponent,
    iconPath: 'M12 6v6m0 0v6m0-6h6m-6 0H6', // Plus icon
    keywords: 'create csv, generate csv, csv template',
  },
  {
    id: 'converter',
    name: 'Format Converter',
    description: 'Transform CSV data to various formats including JSON, XML, Excel',
    // component: ConverterComponent,
    iconPath: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', // Convert icon
    keywords: 'csv to json, csv converter, csv to xml, csv to excel',
  },
  {
    id: 'mapper',
    name: 'CSV Mapper',
    description: 'Map data between different CSV structures with intuitive visual interfaces',
    // component: MapperComponent,
    iconPath: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7', // Map icon
    keywords: 'csv mapping, field mapping, csv transformation',
  },
  {
    id: 'validator',
    name: 'CSV Validator',
    description: 'Validate CSV content against predefined rules and schemas',
    // component: ValidatorComponent,
    iconPath: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z', // Validate icon
    keywords: 'csv validation, data validation, schema validation',
  },
  {
    id: 'visualizer',
    name: 'Data Visualizer',
    description: 'Generate visual representations and charts from your CSV data',
    // component: VisualizerComponent,
    iconPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', // Chart icon
    keywords: 'csv visualization, data charts, csv graphs',
  },
];

export default features;