import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../../config.js";

const adminLogin = createAsyncThunk(
  "admin/verify",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/admin/verify`,
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data?.data?.admin;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Login failed");
    }
  }
);

const reFetchAdmin = createAsyncThunk(
  "admin/refetch",
  async ({ rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/admin`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);
const adminLogout = createAsyncThunk(
  "admin/logout",
  async ({ rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/admin/logout`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

export { adminLogin, reFetchAdmin, adminLogout };
