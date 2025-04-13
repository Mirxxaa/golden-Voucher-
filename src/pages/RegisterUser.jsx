// src/pages/RegisterUser.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { db } from "../firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { User, Phone, Key, Loader } from "lucide-react";

const RegisterUser = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^05\d{8}$/.test(phone))
      newErrors.phone =
        "Enter a valid 10-digit Saudi phone number (05xxxxxxxx)";

    if (!code.trim()) newErrors.code = "Code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Check if code already exists
      const codeQuery = query(
        collection(db, "users"),
        where("code", "==", code)
      );
      const codeSnapshot = await getDocs(codeQuery);

      if (!codeSnapshot.empty) {
        setErrors({ code: "This code is already registered" });
        toast.error("This code is already registered");
        setIsLoading(false);
        return;
      }

      // Add new user
      await addDoc(collection(db, "users"), {
        name,
        phone,
        code,
        meals: [],
        createdAt: new Date(),
      });

      toast.success("User registered successfully!");
      setName("");
      setPhone("");
      setCode("");
      setErrors({});
    } catch (error) {
      console.error("Error registering user:", error);
      toast.error("Failed to register user. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto"
    >
      <div className="bg-white rounded-lg shadow-lg overflow-hidden p-8 mt-12">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Register New User
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500`}
                  placeholder="Enter full name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500`}
                  placeholder="05xxxxxxxx"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unique Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.code ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500`}
                  placeholder="Enter unique code"
                />
              </div>
              {errors.code && (
                <p className="mt-1 text-sm text-red-600">{errors.code}</p>
              )}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md mt-6 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-70 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader size={18} className="animate-spin mr-2" />
                Registering...
              </>
            ) : (
              "Register User"
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default RegisterUser;
