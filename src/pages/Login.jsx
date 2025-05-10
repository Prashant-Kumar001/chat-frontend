import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, } from "react-hook-form";
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux";
import { login, setLoading } from "../redux/reducers/auth";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { Button } from "@mui/material";
import bg from "../assets/bg.jpg"

function Login() {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.auth)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    email: "",
    password: "",
  });

  const navigate = useNavigate()

  const onSubmit = async (data) => {
    dispatch(setLoading(true));
    const toastId = toast.loading("logging...")
    try {
      const res = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, data, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(res)
      dispatch(login(res?.data?.user));
      navigate("/");
      toast.success("Logged in successfully");
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message);
      dispatch(setLoading(false));
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };

  return (
    <div className=" items-center grid md:grid-cols-2 grid-cols-1 justify-center h-screen m_font">
      <div className="w-full h-full md:block hidden">
        <img src={bg} alt="" className="w-full h-full" />
      </div>
      <div className="w-full flex flex-col items-center justify-center">
        <div className="w-full max-w-md p-8 rounded-lg shadow-xl border border-sky-200">
          <h2 className="text-2xl font-bold text-center  mb-6">Login</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 ">
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full p-2 border border-sky-300 focus:outline focus:outline-1 focus:outline-sky-400 rounded-md"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 ">
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must have at least 6 characters",
                  },
                })}
                className="w-full p-2 border border-sky-300 focus:outline focus:outline-1 focus:outline-sky-400 rounded-md"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={loading}
              variant="outlined"
              color="primary"
              sx={{
                width: "100%",
                border: "1px solid",
              }}
            >
              {loading ? (
                <span className="loading loading-spinner">Logging in...</span>
              ) : (
                "Login"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm ">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-500 hover:underline">
                register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
