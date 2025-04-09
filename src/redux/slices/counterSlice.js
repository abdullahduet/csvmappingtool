import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk action
export const fetchCount = createAsyncThunk(
  'counter/fetchCount',
  async (amount = 1, { rejectWithValue }) => {
    try {
      // Simulate API call
      const response = await new Promise((resolve) => 
        setTimeout(() => resolve({ data: amount }), 500)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch count');
    }
  }
);

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCount.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCount.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.value += action.payload;
      })
      .addCase(fetchCount.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// Selectors
export const selectCount = (state) => state.counter.value;
export const selectCountStatus = (state) => state.counter.status;
export const selectCountError = (state) => state.counter.error;

export default counterSlice.reducer;