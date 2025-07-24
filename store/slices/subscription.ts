import * as request from '@/api/minted/user';  // Vos appels API peuvent être ajoutés ici si nécessaire.
import { createSlice } from '@reduxjs/toolkit';
import {jwtDecode} from 'jwt-decode';  // Importer jwt-decode

const subscriptionSlice = createSlice({
  name: 'subscription',

  initialState: {
    value: {
      isSubscribed: false,  // Valeur par défaut si non abonné
    },
  },

  reducers: {
    set_subscribe_state: (state, action) => {
      state.value.isSubscribed = action.payload;
    },

    check_subscription_from_token: (state, action) => {
      const token = action.payload;

      if (token) {
        try {
          const decodedToken = jwtDecode(token);

          if (decodedToken.isSubscribed) {
            state.value.isSubscribed = true;
          } else {
            state.value.isSubscribed = false;
          }
        } catch (error) {
          state.value.isSubscribed = false;
        }
      } else {
        state.value.isSubscribed = false;
      }
    },
  },
});

export const { 
  set_subscribe_state,
  check_subscription_from_token,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
