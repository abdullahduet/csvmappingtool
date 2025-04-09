export const useCSVParser = () => {
    const dispatch = useAppDispatch();
    const [parseError, setParseError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const parseCSV = useCallback((file, options = {}) => {
      setIsLoading(true);
      setParseError(null);
      
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const csvText = event.target.result;
        
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setIsLoading(false);
            
            if (results.errors.length > 0) {
              setParseError(results.errors);
              return;
            }
            
            const columns = results.meta.fields || [];
            
            dispatch(csvDataActions.setSourceData({
              data: results.data,
              columns,
              fileInfo: {
                name: file.name,
                size: file.size,
                lastModified: file.lastModified
              }
            }));
          },
          error: (error) => {
            setIsLoading(false);
            setParseError(error);
          },
          ...options
        });
      };
      
      reader.onerror = () => {
        setIsLoading(false);
        setParseError('File reading failed');
      };
      
      reader.readAsText(file);
    }, [dispatch]);
    
    return { parseCSV, parseError, isLoading };
  };