import React, { useEffect } from 'react';
import logo from "../assets/Healix.png";
import useUserStore from '../store/useUserStore';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/Api';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);
  const loadingUser = useUserStore((state) => state.loadingUser);
  const setLoadingUser = useUserStore((state) => state.setLoadingUser);

  // Fetch user on mount
  useEffect(() => {
    const getUser = async () => {
      setLoadingUser(true);
      try {
        const response = await axiosInstance.get("/auth/user", {
          headers: { "Content-Type": "application/json" },
        });
        if (response.data) setUser(response.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoadingUser(false);
      }
    };

    getUser();
  }, [setUser, setLoadingUser]);

  const Logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      clearUser();
      window.location.href = "/login";
      toast.success("✅ Logout successful!", {
        icon: "🚀",
        style: { fontSize: "1rem", fontWeight: "bold" },
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 fixed -top-4 left-0 w-full z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={logo} className="h-28" alt="Healix" />
        </a>

        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {loadingUser ? (
            <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse" />
          ) : user ? (
            <button
              type="button"
              className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:text-teal-300 focus:border-b-teal-400"
              id="user-menu-button"
              aria-expanded={isDropdownOpen}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="sr-only">Open user menu</span>
              <div className="relative rounded-full overflow-hidden w-12 h-12">
                <img
                  className="w-12 h-12 rounded-full"
                  src={user.avatar}
                  alt="user photo"
                />
              </div>
            </button>
          ) : (
            <button
              className="px-6 py-2 rounded-full text-white font-semibold
                 bg-gradient-to-r from-teal-400 via-teal-500 to-sky-500
                 hover:from-teal-500 hover:via-teal-600 hover:to-sky-600
                 transition-colors duration-300 shadow-md"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}

          {isDropdownOpen && (
            <div
              className="z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600 absolute top-16 right-4"
              id="user-dropdown"
            >
              <div className="px-4 py-3">
                <span className="block text-sm text-gray-900 dark:text-white">{user?.name}</span>
                <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{user?.email}</span>
              </div>
              <ul className="py-2" aria-labelledby="user-menu-button">
                <li>
                 <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Dashboard</Link>
                </li>
                <li>
                  <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Settings</Link>
                </li>
                <li>
                  <Link to="/earnings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Earnings</Link>
                </li>
                <li>
                  <button
                    className="px-6 py-2 rounded-full text-white font-semibold
                       bg-gradient-to-r from-sky-400 via-sky-500 to-teal-500
                       hover:from-sky-500 hover:via-sky-600 hover:to-teal-600
                       transition-colors duration-300 shadow-md"
                    onClick={Logout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-user"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 17 14" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
        </div>

        <div
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isMobileMenuOpen ? '' : 'hidden'}`}
          id="navbar-user"
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 lg:gap-10">
            <li>
              <Link to="/" className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Home</Link>
            </li>
            <li>
              <Link to="/about" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About</Link>
            </li>
            <li>
              <a href="#" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Services</a>
            </li>
            <li>
              <Link to="/pricing" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Pricing</Link>
            </li>
            <li>
              <Link to="/health-report" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Health Report</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
