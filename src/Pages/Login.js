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

    const url = `http://localhost:5000/login`;

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
    <div className="h-[100vh] w-[100vw] flex justify-center items-center">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
      >
        <source src="/background-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="sm:w-[100vw] lg:w-[30vw] bg-transparent rounded-xl shadow shadow-purple-600  p-5 relative z-10 ">
        <h1 className="text-3xl font-bold text-purple-600 text-center">
          Login
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 mt-3 text-white">
            <label htmlFor="username" className="font-semibold ">
              User Name*
            </label>
            <br />
            <input
              type="text"
              id="username"
              className="outline-none border-b-2 border-b-white  p-2 mt-1 bg-transparent"
              name="username"
              onChange={handleInput}
            />
          </div>
          <div className="text-white">
            <label htmlFor="password" className="font-semibold">
              Password*
            </label>
            <br />
            <input
              type="text"
              id="password"
              className="outline-none border-b-2 border-b-white  p-2 mt-1 bg-transparent"
              name="password"
              onChange={handleInput}
            />
          </div>

          <button
            className="bg-purple-700 px-3 py-1 text-white rounded mt-5 font-semibold"
            type="submit"
          >
            Login
          </button>
        </form>
        <p className="mt-5 text-white font-medium text-sm text-center">
          If not registered{" "}
          <Link
            className="text-purple-700 font-bold cursor-pointer italic text-base"
            to="/register"
          >
            Register{" "}
          </Link>{" "}
          here!
        </p>
      </div>
    </div>
  );
};

export default Login;
