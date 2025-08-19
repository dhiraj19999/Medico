import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../api/Api.js";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { HashLoader } from "react-spinners";

// ✅ Debounce helper
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState("");
  const [search, setSearch] = useState("");

  // ✅ Get all users
  const getUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/auth/alluser");
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Search users
  const searchUsers = async (query) => {
    if (!query.trim()) {
      getUsers();
      return;
    }
    try {
      setLoading(true);
      const res = await axiosInstance.post("/auth/search", { search: query });
      setUsers(res.data.data || []);
    } catch (error) {
      console.error("Error searching Users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Debounced search
  const debouncedSearch = useCallback(
    debounce((val) => {
      searchUsers(val);
    }, 500),
    [] // 👈 Empty deps (important!)
  );

  // ✅ Initial fetch
  useEffect(() => {
    getUsers();
  }, []);

  // ✅ Handle search
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    debouncedSearch(val);
  };

  // ✅ Delete user
  const deleteUser = async (userId) => {
    setDeleteId(userId);
    try {
      const res = await axiosInstance.delete(`/auth/delete/${userId}`);
      toast.success(res.data?.message || "✅ User Deleted Successfully", {
        icon: "🚀",
        style: { fontSize: "1rem", fontWeight: "bold" },
      });
      getUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Something went wrong", {
        icon: "⚠️",
        style: { fontSize: "1rem", fontWeight: "bold" },
      });
    } finally {
      setDeleteId("");
    }
  };

  // ✅ Skeleton Loader
  const UserCardSkeleton = () => (
    <div className="animate-pulse bg-white rounded-2xl shadow-md p-6 text-center flex flex-col h-full">
      <div className="h-32 w-32 rounded-full mx-auto bg-gray-200 mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
      <div className="flex flex-wrap justify-center gap-2 mb-3">
        <div className="h-6 w-16 bg-gray-200 rounded"></div>
        <div className="h-6 w-16 bg-gray-200 rounded"></div>
      </div>
      <div className="h-10 bg-gray-200 rounded mt-auto"></div>
    </div>
  );

  const override = {
    display: "block",
    borderColor: "red",
    margin: "0 auto",
  };

  return (
    <div className="p-4 pt-20 mt-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">All Users: ( {users?.length} )</h1>

      {/* ✅ Search bar */}
      <div className="max-w-md mx-auto mb-6">
        <input
          type="text"
          placeholder="Search users by name, city, state, or email..."
          value={search}
          onChange={handleSearchChange}
          className="w-full border rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-teal-500 outline-none"
        />
      </div>

      {/* ✅ Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(6)
            .fill(0)
            .map((_, idx) => <UserCardSkeleton key={idx} />)
        ) : users.length > 0 ? (
          users.map((user) => (
            <motion.div
              key={user._id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl shadow-lg p-6 text-center flex flex-col h-full"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-32 h-32 rounded-full mx-auto object-cover shadow-md mb-3"
              />
              <h2 className="text-xl font-bold">{user.name}</h2>

              <div className="flex flex-wrap justify-center gap-2 mt-3">
                <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm shadow-sm">
            {user?.city}  {user.state}
                </span>
                <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm shadow-sm">
                  {user.email} 
                </span>
                <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm shadow-sm">
                 {user.phone} | {user.gender}
                </span>
                 <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm shadow-sm">
                  Subscription: {user.subscription}
                </span>
              </div>
<span className="bg-red-200 text-red-700 w-16 m-auto mt-2 rounded-full text-sm shadow-sm">
                   {user.role}
                </span>
              <button
                onClick={() => deleteUser(user._id)}
                className={`mt-3 w-full bg-gradient-to-r ${
                  deleteId === user._id
                    ? "bg-white"
                    : "from-green-500 to-teal-500"
                } text-white py-2 rounded-xl shadow-md hover:from-green-600 hover:to-teal-600 transition-all duration-300`}
              >
                {deleteId === user._id ? (
                  <HashLoader color="teal" size={30} cssOverride={override} />
                ) : (
                  "Delete User"
                )}
              </button>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 font-medium py-10">
            😔 No users found
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
