const csvOperationsSlice = createSlice({
    name: 'csvOperations',
    initialState: {
      currentOperation: null, // 'generate', 'convert', 'map', 'validate', 'visualize'
      operationStatus: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
      error: null,
      mappingConfig: {
        fieldMappings: [],
        transformations: {}
      },
      conversionConfig: {
        targetFormat: 'json',
        options: {}
      },
      validationResults: {
        valid: true,
        errors: [],
        warnings: []
      }
    },
    reducers: {
      setCurrentOperation: (state, action) => {
        state.currentOperation = action.payload;
        state.operationStatus = 'idle';
        state.error = null;
      },
      setOperationStatus: (state, action) => {
        state.operationStatus = action.payload;
      },
      setOperationError: (state, action) => {
        state.operationStatus = 'failed';
        state.error = action.payload;
      },
      setMappingConfig: (state, action) => {
        state.mappingConfig = {...state.mappingConfig, ...action.payload};
      },
      setConversionConfig: (state, action) => {
        state.conversionConfig = {...state.conversionConfig, ...action.payload};
      },
      setValidationResults: (state, action) => {
        state.validationResults = action.payload;
      },
      resetOperation: (state) => {
        state.operationStatus = 'idle';
        state.error = null;
      }
    }
  });