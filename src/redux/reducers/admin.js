import { createSlice } from "@reduxjs/toolkit";
import { adminLogin, initialCall } from '../reducers/thunk/admin.js'


const initialState = {
  user: null,
  loading: false,
  error: null,
  status: null,
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
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(initialCall.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload?.admin;
        state.initialState = action.payload?.admin || true
      })
      .addCase(initialCall.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { } = adminSlice.actions;
export default adminSlice.reducer;