import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import api from '../../utils/api';
import { showToastMessage } from '../common/uiSlice';

// Define initial state
const initialState = {
  orderList: [],
  orderNum: '',
  selectedOrder: {},
  error: '',
  loading: false,
  totalPageNum: 1,
};

// Async thunks
export const createOrder = createAsyncThunk('order/createOrder', async (payload, { dispatch, rejectWithValue }) => {
  try {
    const response = await api.post('/api/order', payload);
    if (response.status !== 200) throw new Error(response.error);
    dispatch(showToastMessage({ message: '주문이 완료되었습니다', status: 'success' }));
    return response.data.orderNum;
  } catch (error) {
    dispatch(showToastMessage({ message: error.error, status: 'error' }));
    return rejectWithValue(error.error);
  }
});

export const getOrder = createAsyncThunk('order/getOrder', async (page, { rejectWithValue }) => {
  try {
    const response = await api.get(`/api/order?page=${page}`);
    if (response.status !== 200) throw new Error(response.error);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.error);
  }
});

export const getOrderList = createAsyncThunk('order/getOrderList', async (query, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams(query).toString();
    const response = await api.get(`/api/order/admin?${params}`);
    if (response.status !== 200) throw new Error(response.error);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.error);
  }
});

export const updateOrder = createAsyncThunk('order/updateOrder', async ({ id, status }, { dispatch, rejectWithValue }) => {});

// Order slice
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = '';
        state.orderNum = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderList = action.payload.data;
        state.totalPageNum = action.payload.totalPageNum;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOrderList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrderList.fulfilled, (state, action) => {
        state.loading = false;
        state.orderList = action.payload.data;
        state.totalPageNum = action.payload.totalPageNum;
      })
      .addCase(getOrderList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
