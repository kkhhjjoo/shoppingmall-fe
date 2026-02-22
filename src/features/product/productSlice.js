import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { showToastMessage } from '../common/uiSlice';

// 비동기 액션 생성
export const getProductList = createAsyncThunk('products/getProductList', async (query, { rejectWithValue }) => {
  try {
    // 빈 문자열은 제외해서 백엔드에 전달 (검색 조건만 명확히 전달)
    const params = { ...query };
    if (params.name === '') delete params.name;
    const response = await api.get('/api/product', { params });
    console.log('response', response);
    if (response.status !== 200) throw new Error(response.error);
    const data = response.data?.data ?? response.data;
    return {
      data: Array.isArray(data) ? data : [],
      totalPageNum: response.data?.totalPageNum ?? 1,
    };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const getProductDetail = createAsyncThunk('products/getProductDetail', async (id, { rejectWithValue }) => {});

export const createProduct = createAsyncThunk('products/createProduct', async (formData, { dispatch, rejectWithValue }) => {
  try {
    const response = await api.post('/api/product', formData);
    if (response.status !== 200) throw new Error(response.error);
    dispatch(showToastMessage({ message: '상품 생성 완료', status: 'success' }));
    dispatch(getProductList({ page: 1 }));
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id, { dispatch, rejectWithValue }) => {});

export const editProduct = createAsyncThunk('products/editProduct', async ({ id, ...formData }, { dispatch, rejectWithValue }) => {
  try {
    const response = await api.put(`/api/product/${id}`, formData);
    if (response.status !== 200) throw new Error(response.error);
    dispatch(getProductList({ page: 1 }));
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.error);
  }
});

// 슬라이스 생성
const productSlice = createSlice({
  name: 'products',
  initialState: {
    productList: [],
    selectedProduct: null,
    loading: false,
    error: '',
    totalPageNum: 1,
    success: false,
  },
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setFilteredList: (state, action) => {
      state.filteredList = action.payload;
    },
    clearError: (state) => {
      state.error = '';
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProductList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = '';
        state.productList = action.payload.data;
        state.totalPageNum = action.payload.totalPageNum;
      })
      .addCase(getProductList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.loading = false;
        state.error = '';
        state.success = true; //상품 생성을 성공했다? 다이얼로그를 닫고,
        //실패? 실패메세지를 다이얼로그에 보여주고, 닫진 않음
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = '';
        state.success = true;
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { setSelectedProduct, setFilteredList, clearError } = productSlice.actions;
export default productSlice.reducer;
