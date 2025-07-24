import * as request from '@/api/minted/user';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '@/types';


export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  const response = await request.getUser()
  return response.data;
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (
    { user, patch }: { user: User; patch: User },
    { rejectWithValue }
  ) => {
    try {
      await request.updateUser(patch);
      return {...user,...patch};
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);


const userSlice = createSlice({
  name: 'user',

  initialState: {
    value: null as User,
  },

  reducers: {
    set_user: (state, action) => {
      state.value = action.payload
    },
    update_user: (state, action) => {
      state.value = {...state.value, ...action.payload}
    },
    update_subscription: (state, action) => {
      state.value.subscription = {...state.value.subscription, ...action.payload}
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.value = action.payload;
    })
    .addCase(updateUser.pending, (state, action) => {
      const { user, patch  } = action.meta.arg;
      state.value = { ...user, ...patch };
    })
    .addCase(updateUser.rejected, (state, action) => {
      const { user } = action.meta.arg;
      state.value = { ...user };
    })
  }
});


export const { 
    set_user,
    update_user,
    update_subscription
} = userSlice.actions;

export default userSlice.reducer;

