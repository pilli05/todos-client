import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password } = formData;

    if (!username || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    const url = `${process.env.REACT_APP_API_BASE_URL}/login`;

    const payLoad = {
      username: formData.username,
      password: formData.password,
    };

    try {
      const response = await axios.post(url, payLoad);
      if (response.data.status) {
        toast.success(response.data.status);
        setFormData({
          username: "",
          password: "",
        });
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userName", response.data.userName);
        localStorage.setItem("userId", response.data.userId);
        navigate("/");
      }
    } catch (e) {
      console.log(e);
      toast.error(e?.response?.data?.message);
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="h-[100vh] w-[100vw] flex justify-center items-center bg-slate-100">
      <div className="sm:w-[100vw] lg:w-[30vw] bg-white rounded-lg shadow-xl border-2 border-yellow-400 p-5">
        <h1 className="text-3xl font-bold text-indigo-800 text-center">
          Login
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 mt-3">
            <label htmlFor="username" className="font-semibold">
              User Name*
            </label>
            <br />
            <input
              type="text"
              id="username"
              className="outline-none border-2 border-gray-700 rounded p-2 mt-1"
              name="username"
              onChange={handleInput}
            />
          </div>
          <div>
            <label htmlFor="password" className="font-semibold">
              Password*
            </label>
            <br />
            <input
              type="text"
              id="password"
              className="outline-none border-2 border-gray-700 rounded p-2 mt-1"
              name="password"
              onChange={handleInput}
            />
          </div>
          <button
            className="hover:bg-blue-600 p-2 hover:text-white rounded mt-5 border-2 border-blue-600 text-blue-600 font-semibold"
            type="submit"
          >
            Login
          </button>
        </form>
        <p className="mt-5 text-gray-700 font-semibold text-sm">
          If not registered{" "}
          <Link className="text-blue-700 cursor-pointer" to="/register">
            Register{" "}
          </Link>{" "}
          here!
        </p>
      </div>
    </div>
  );
};

export default Login;
