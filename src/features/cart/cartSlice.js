import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { showToastMessage } from '../common/uiSlice';

const initialState = {
  loading: false,
  error: '',
  cartList: [],
  selectedItem: {},
  cartItemCount: 0,
  totalPrice: 0,
};

// Async thunk actions
export const addToCart = createAsyncThunk('cart/addToCart', async ({ id, size }, { rejectWithValue, dispatch }) => {
  try {
    const response = await api.post('/api/cart', { productId: id, size, qty: 1 });
    if (response.status !== 200) throw new Error(response.error);
    dispatch(showToastMessage({ message: '카트에 아이템이 추가 됐습니다', status: 'success' }));
    return response.data; //TODO
  } catch (error) {
    dispatch(showToastMessage({ message: '카트에 아이템 추가 실패', status: 'error' }));
    return rejectWithValue(error.error);
  }
});

export const getCartList = createAsyncThunk('cart/getCartList', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/api/cart');
    if (response.status !== 200) throw new Error(response.error);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.error);
  }
});

export const deleteCartItem = createAsyncThunk('cart/deleteCartItem', async (id, { rejectWithValue }) => {
  try {
    const response = await api.delete(`/api/cart/${id}`);
    if (response.status !== 200) throw new Error(response.error);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.error);
  }
});

export const updateQty = createAsyncThunk('cart/updateQty', async ({ id, value }, { rejectWithValue }) => {
  try {
    const response = await api.put('/api/cart', { id, qty: value });
    if (response.status !== 200) throw new Error(response.error);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.error);
  }
});

export const getCartQty = createAsyncThunk('cart/getCartQty', async (_, { rejectWithValue, dispatch }) => {});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    initialCart: (state) => {
      state.cartItemCount = 0;
    },
    // You can still add reducers here for non-async actions if necessary
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = '';
        state.cartItemCount = action.payload.cartItemQty;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCartList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCartList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = '';
        state.cartList = action.payload.data;
        state.cartItemCount = action.payload.data.length;
        state.totalPrice = action.payload.data.reduce(
          (total, item) => total + item.productId.price * item.qty,
          0
        );
      })
      .addCase(getCartList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateQty.fulfilled, (state, action) => {
        state.cartList = action.payload.data;
        state.totalPrice = action.payload.data.reduce(
          (total, item) => total + item.productId.price * item.qty,
          0
        );
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.cartList = action.payload.data;
        state.cartItemCount = action.payload.data.length;
        state.totalPrice = action.payload.data.reduce(
          (total, item) => total + item.productId.price * item.qty,
          0
        );
      });
  },
});

export default cartSlice.reducer;
export const { initialCart } = cartSlice.actions;
