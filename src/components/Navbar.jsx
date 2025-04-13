// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { User, Users, Home } from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path
      ? "bg-white text-indigo-600"
      : "text-gray-600 hover:bg-white hover:text-indigo-600";
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-indigo-600">
              Zafran Valley
            </div>
            <div className="text-sm font-medium text-gray-500">
              Rewards Dashboard
            </div>
          </div>

          <div className="flex space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-md transition-colors duration-200 flex items-center space-x-1 ${isActive(
                "/"
              )}`}
            >
              <Users size={18} />
              <span>Users</span>
            </Link>

            <Link
              to="/register"
              className={`px-4 py-2 rounded-md transition-colors duration-200 flex items-center space-x-1 ${isActive(
                "/register"
              )}`}
            >
              <User size={18} />
              <span>Register</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
