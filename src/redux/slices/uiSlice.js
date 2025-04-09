const uiSlice = createSlice({
    name: 'ui',
    initialState: {
      theme: 'light',
      sidebarOpen: true,
      activeTool: null,
      notifications: [],
      previewMode: 'table', // 'table', 'raw', 'card'
      modalState: {
        isOpen: false,
        type: null,
        data: null
      }
    },
    reducers: {
      setTheme: (state, action) => {
        state.theme = action.payload;
      },
      toggleSidebar: (state) => {
        state.sidebarOpen = !state.sidebarOpen;
      },
      setActiveTool: (state, action) => {
        state.activeTool = action.payload;
      },
      addNotification: (state, action) => {
        state.notifications.push(action.payload);
      },
      removeNotification: (state, action) => {
        state.notifications = state.notifications.filter(
          notification => notification.id !== action.payload
        );
      },
      setPreviewMode: (state, action) => {
        state.previewMode = action.payload;
      },
      openModal: (state, action) => {
        state.modalState = {
          isOpen: true,
          type: action.payload.type,
          data: action.payload.data
        };
      },
      closeModal: (state) => {
        state.modalState.isOpen = false;
      }
    }
  });