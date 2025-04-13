// src/pages/UserList.jsx (updated)
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { Search, User } from "lucide-react";
import DashboardOverview from "../components/DashboardOverview";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          mealsCount: doc.data().meals?.length || 0,
          voucherUsed: doc.data().voucherUsed || false,
        }));

        setUsers(usersData);
        setFilteredUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
      return;
    }

    const lowerCaseSearch = searchTerm.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(lowerCaseSearch) ||
        user.phone.includes(searchTerm) ||
        user.code.toLowerCase().includes(lowerCaseSearch)
    );

    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  return (
    <div className="space-y-6">
      <DashboardOverview />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">All Users</h1>

        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500"
            placeholder="Search by name, phone or code..."
          />
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner text="Loading users..." />
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          icon={User}
          title="No users found"
          description={
            searchTerm
              ? "Try a different search term"
              : "Register new users to get started"
          }
          actionText={!searchTerm && "Register New User"}
          actionLink={!searchTerm && "/register"}
        />
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            <AnimatePresence>
              {filteredUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  layout
                >
                  <Link
                    to={`/user/${user.id}`}
                    className="block bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-semibold text-gray-900 truncate">
                          {user.name}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                          {user.phone}
                        </p>
                        <p className="mt-1 text-xs font-medium text-gray-500">
                          Code: {user.code}
                        </p>
                      </div>
                      <div className="ml-2">
                        <StatusBadge
                          mealsCount={user.mealsCount}
                          voucherUsed={user.voucherUsed}
                        />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
