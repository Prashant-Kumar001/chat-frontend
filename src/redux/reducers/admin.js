import { createSlice } from "@reduxjs/toolkit";
import { adminLogin } from "../reducers/thunk/admin.js";

const initialState = {
  user: null,
  loading: false,
  error: null,
  status: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.status = null;
    },
  },
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
        console.log(action.payload);
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = adminSlice.actions;
export default adminSlice.reducer;
