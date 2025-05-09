import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

export const createMessage = createAsyncThunk(
  'messages/create',
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/messages', messageData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchSentMessages = createAsyncThunk(
  'messages/fetchSent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/messages/sent');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchReceivedMessages = createAsyncThunk(
  'messages/fetchReceived',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/messages/received');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    sentMessages: [],
    receivedMessages: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    clearMessageError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMessage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        state.sentMessages.unshift(action.payload);
        state.status = 'succeeded';
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.msg || 'Failed to create message';
      })
      .addCase(fetchSentMessages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSentMessages.fulfilled, (state, action) => {
        state.sentMessages = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchSentMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.msg || 'Failed to fetch sent messages';
      })
      .addCase(fetchReceivedMessages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReceivedMessages.fulfilled, (state, action) => {
        state.receivedMessages = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchReceivedMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.msg || 'Failed to fetch received messages';
      });
  },
});

export const { clearMessageError } = messageSlice.actions;

export default messageSlice.reducer;