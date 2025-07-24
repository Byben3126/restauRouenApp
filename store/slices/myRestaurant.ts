import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RestaurantData, Customer } from '@/types/minted/restaurant.types';
import * as request from '@/api/minted/restaurant';

export const fetchMyRestaurant = createAsyncThunk('myRestaurant/fetchMyRestaurant', async () => {
  const response = await request.getMyRestaurant()
  return response.data;
});

const myRestaurantSlice = createSlice({
  name: 'myRestaurant',

  initialState: {
    restaurantData: null as RestaurantData | null,
    lastCustomer: [] as Customer[],
  },
  
  reducers: {
    set_restaurant_data: (state, action) => {
      state.restaurantData = action.payload
    },
    set_last_customer: (state, action) => {
        state.lastCustomer = action.payload
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchMyRestaurant.fulfilled, (state, action) => {
      console.log('fetchMyRestaurant fulfilled', action.payload);
      state.restaurantData = action.payload;
    })
  }
});


export const { 
    set_restaurant_data,
    set_last_customer
} = myRestaurantSlice.actions;

export default myRestaurantSlice.reducer;

