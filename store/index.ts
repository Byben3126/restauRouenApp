import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/user'
import subscriptionSlice from './slices/subscription'
import myRestaurantSlice from './slices/myRestaurant'

const store = configureStore({
  reducer: {
    user: userSlice,
    subscription: subscriptionSlice,
    myRestaurant: myRestaurantSlice
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
