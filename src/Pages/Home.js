import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MdEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";

const Home = () => {
  const navigate = useNavigate();
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [formData, setFormData] = useState({});
  const [allTodos, setAllTodos] = useState([]);
  const [showEditButton, setShowEditButton] = useState(false);
  const [todo, setTodo] = useState({});
  const [todoId, setTodoId] = useState("");

  const userName = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("Successfully Logout!");
  };

  const handleAddTodo = () => {
    setShowAddTodo(true);
    setShowEditButton(false);
    setFormData({
      description: "",
      status: "",
    });
  };

  const handleAddTodoForm = async (e) => {
    if (showEditButton) {
      e.preventDefault();

      const { description, status } = formData;
      const payLoad = {
        description: description,
        status: status,
        user_id: parseInt(userId),
      };

      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/todos/${todoId}`,
          payLoad,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.status) {
          toast.success("Todo Updated Successfully");
          setShowAddTodo(false);
        }
      } catch (e) {
        console.log(e);
        toast.error(e?.response?.data?.message);
      }
    } else {
      e.preventDefault();
      const url = `${process.env.REACT_APP_API_BASE_URL}/todos`;
      const { description, status } = formData;
      const payLoad = {
        description: description,
        status: status,
        user_id: parseInt(userId),
      };
      try {
        const response = await axios.post(url, payLoad, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.status) {
          toast.success("Todo Added Successfully");
          setShowAddTodo(false);
        }
      } catch (e) {
        console.log(e);
        toast.error(e?.response?.data?.message);
      }
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getAllTodos = async () => {
    const url = `${process.env.REACT_APP_API_BASE_URL}/todos`;
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status) {
        setAllTodos(response.data.todos);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!showAddTodo) {
      getAllTodos();
    }
  }, [showAddTodo]);

  const handleTodoEdit = async (todo) => {
    setShowAddTodo(true);
    setShowEditButton(true);
    setTodoId(todo.id);
    const url = `${process.env.REACT_APP_API_BASE_URL}/todos/${todo.id}`;
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status) {
        setFormData(response.data.todo);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteTodo = async (id) => {
    const url = `${process.env.REACT_APP_API_BASE_URL}/todos/${id}`;
    try {
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status) {
        toast.success(response.data.message);
        getAllTodos();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleCancel = () => {
    setShowAddTodo(false);
  };

  return (
    <div className="h-[100vh] w-[100vw] home-container">
      <navbar className="flex justify-between items-center bg-slate-100 p-3 shadow">
        <img
          src="https://res.cloudinary.com/djoz0tmyl/image/upload/v1722776711/todo_fyy06t.png"
          alt="todo-logo"
          className="w-[100px]"
        />
        {userName ? (
          <div className="flex items-center">
            <div className="flex items-center">
              <FaUserCircle
                className="mr-2 items-center"
                size={25}
                color="green"
              />
              <span className="text-gray-700">{userName}</span>
            </div>

            <AiOutlineLogout
              onClick={handleLogout}
              size={25}
              color="red"
              className="ml-5 cursor-pointer"
            />
          </div>
        ) : null}
      </navbar>
      {showAddTodo ? (
        <form className="mt-16 px-20" onSubmit={handleAddTodoForm}>
          <h1 className="text-blue-700 font-bold text-2xl mb-5">
            {showEditButton ? "Edit Todo" : "Todo Details"}
          </h1>
          <div className="flex  justify-start items-center mobile-view">
            <div className="mr-5">
              <label
                htmlFor="description"
                className="font-medium text-gray-700"
              >
                Description:
              </label>
              <br />
              <input
                id="description"
                className="outline-none border-2 border-gray-700 rounded p-2 mt-1 lg:w-[300px] sm:w-[250px]"
                name="description"
                onChange={handleInput}
                value={formData.description}
              />
            </div>
            <div>
              <label htmlFor="status" className="font-medium text-gray-700">
                Status:
              </label>
              <br />
              <select
                id="status"
                className="outline-none border-2 border-gray-700 rounded p-2 mt-1 lg:w-[300px] sm:w-[250px]"
                name="status"
                onChange={handleInput}
                value={formData.status}
              >
                <option value="">Select</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>
          <div className="mt-5">
            {showEditButton ? (
              <button
                className="bg-blue-600 py-2 px-4 text-white rounded-lg  border-2 font-semibold "
                type="submit"
              >
                Edit
              </button>
            ) : (
              <button
                className="bg-blue-600 py-2 px-4 text-white rounded-lg  border-2 font-semibold "
                type="submit"
              >
                Save
              </button>
            )}
            <button
              className="ml-3 py-2 px-4 text-blue-600 rounded-lg  border-2 border-blue-600  font-semibold"
              onClick={handleCancel}
            >
              Close
            </button>
          </div>
        </form>
      ) : (
        <>
          <h1 className="font-bold text-2xl text-green-600 text-center mt-10">
            Welcome to TODOS DASHBOARD
          </h1>
          <div className="flex flex-col items-center mt-10">
            <div className="w-[85%] m-3 flex justify-end">
              <button
                className="bg-blue-600 p-2 text-white rounded-lg  border-2 font-semibold self-end"
                onClick={handleAddTodo}
              >
                Add TODO
              </button>
            </div>
            <table className="w-[85%] ">
              <thead>
                <tr>
                  <th className="border-2 border-gray-700">Id</th>
                  <th className="border-2 border-gray-700">Description</th>
                  <th className="border-2 border-gray-700">Status</th>
                  <th className="border-2 border-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="text-center ">
                {allTodos && allTodos.length > 0
                  ? allTodos.map((todo) => (
                      <tr className="border-2 border-gray-700" key={todo.id}>
                        <td>{todo.id}</td>
                        <td>{todo.description}</td>
                        <td>{todo.status}</td>
                        <td>
                          <div className="flex justify-center">
                            <MdEdit
                              color="blue"
                              size={20}
                              className="mr-2 cursor-pointer"
                              onClick={() => handleTodoEdit(todo)}
                            />
                            <MdDeleteOutline
                              color="red"
                              size={20}
                              className="cursor-pointer"
                              onClick={() => handleDeleteTodo(todo.id)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
