const csvDataSlice = createSlice({
    name: 'csvData',
    initialState: {
      sourceData: null,
      targetData: null,
      processedData: null,
      sourceColumns: [],
      targetColumns: [],
      fileInfo: {
        name: '',
        size: 0,
        lastModified: null
      },
      parseOptions: {
        header: true,
        skipEmptyLines: true,
        delimiter: ','
      }
    },
    reducers: {
      setSourceData: (state, action) => {
        state.sourceData = action.payload.data;
        state.sourceColumns = action.payload.columns || [];
        state.fileInfo = action.payload.fileInfo || state.fileInfo;
      },
      setTargetData: (state, action) => {
        state.targetData = action.payload.data;
        state.targetColumns = action.payload.columns || [];
      },
      setProcessedData: (state, action) => {
        state.processedData = action.payload;
      },
      updateParseOptions: (state, action) => {
        state.parseOptions = {...state.parseOptions, ...action.payload};
      },
      clearData: (state) => {
        state.sourceData = null;
        state.targetData = null;
        state.processedData = null;
        state.sourceColumns = [];
        state.targetColumns = [];
        state.fileInfo = {
          name: '',
          size: 0,
          lastModified: null
        };
      }
    }
  });