import { createSlice } from "@reduxjs/toolkit";
import {adminLogin, adminLogout} from '../reducers/thunk/admin.js'


const initialState = {
  user: null,
  loading: false,
  error: null,
  status: null
};


const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.status = action.payload?.role;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        console.log(action.payload)
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(adminLogout.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
        state.status = null
      });
  },
});

export const {} = adminSlice.actions;
export default adminSlice.reducer;