// src/pages/UserDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";
import {
  User,
  Phone,
  Tag,
  Calendar,
  ArrowLeft,
  Gift,
  Loader,
  X,
  Check,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [voucherModalOpen, setVoucherModalOpen] = useState(false);
  const [activeMealIndex, setActiveMealIndex] = useState(null);
  const [billNumber, setBillNumber] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [voucherSubmitting, setVoucherSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [voucherError, setVoucherError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", id));

        if (userDoc.exists()) {
          setUser({
            id: userDoc.id,
            ...userDoc.data(),
          });
        } else {
          toast.error("User not found");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Error loading user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, navigate]);

  const openModal = (index) => {
    setActiveMealIndex(index);
    setBillNumber("");
    setBillAmount("");
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveMealIndex(null);
  };

  const openVoucherModal = () => {
    setVoucherCode("");
    setVoucherError("");
    setVoucherModalOpen(true);
  };

  const closeVoucherModal = () => {
    setVoucherModalOpen(false);
  };

  const handleMealSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate inputs
    if (!billNumber.trim() || !billAmount.trim()) {
      setError("Both fields are required");
      return;
    }

    const amount = parseFloat(billAmount);
    if (isNaN(amount) || amount < 200) {
      setError("Bill amount must be at least 200 SAR");
      return;
    }

    setSubmitting(true);

    try {
      const userRef = doc(db, "users", id);
      const mealData = {
        index: activeMealIndex,
        billNumber,
        amount,
        date: new Date(),
      };

      await updateDoc(userRef, {
        meals: arrayUnion(mealData),
      });

      // Update the local user state
      setUser((prevUser) => ({
        ...prevUser,
        meals: [...(prevUser.meals || []), mealData],
      }));

      toast.success("Meal recorded successfully!");
      closeModal();
    } catch (error) {
      console.error("Error updating meal:", error);
      setError("Failed to save meal information");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVoucherUse = async (e) => {
    e.preventDefault();
    setVoucherError("");

    // Validate code matches user code
    if (voucherCode.trim() !== user.code) {
      setVoucherError("Code does not match user unique code");
      return;
    }

    setVoucherSubmitting(true);

    try {
      const userRef = doc(db, "users", id);
      await updateDoc(userRef, {
        voucherUsed: true,
        voucherUsedDate: new Date(),
      });

      // Update local state
      setUser((prevUser) => ({
        ...prevUser,
        voucherUsed: true,
        voucherUsedDate: new Date(),
      }));

      toast.success("Voucher used successfully!");
      closeVoucherModal();
    } catch (error) {
      console.error("Error using voucher:", error);
      setVoucherError("Failed to process voucher");
    } finally {
      setVoucherSubmitting(false);
    }
  };

  const getMealStatus = (index) => {
    if (!user?.meals) return false;
    return user.meals.find((meal) => meal.index === index);
  };

  const isEligibleForReward = user?.meals?.length >= 6;
  const hasUsedVoucher = user?.voucherUsed === true;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size={24} className="animate-spin text-indigo-600" />
        <span className="ml-2 text-gray-600">Loading user details...</span>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back to all users
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-gray-600">
                  <Phone size={18} className="mr-2" />
                  <span>{user.phone}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <Tag size={18} className="mr-2" />
                  <span>Code: {user.code}</span>
                </div>
              </div>
            </div>

            {isEligibleForReward && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`mt-4 md:mt-0 border rounded-lg p-4 flex flex-col ${
                  hasUsedVoucher
                    ? "bg-gray-50 border-gray-200"
                    : "bg-green-50 border-green-200"
                }`}
              >
                <div className="flex items-center">
                  <Gift
                    size={24}
                    className={
                      hasUsedVoucher ? "text-gray-500" : "text-green-500"
                    }
                  />
                  <div>
                    <h3
                      className={`font-semibold ${
                        hasUsedVoucher ? "text-gray-700" : "text-green-800"
                      }`}
                    >
                      {hasUsedVoucher ? "Voucher Used" : "Reward Eligible!"}
                    </h3>
                    <p
                      className={`text-sm ${
                        hasUsedVoucher ? "text-gray-500" : "text-green-600"
                      }`}
                    >
                      {hasUsedVoucher
                        ? `Used on ${user.voucherUsedDate
                            ?.toDate()
                            .toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}`
                        : "This user qualifies for 500 SAR discount"}
                    </p>
                  </div>
                </div>

                {isEligibleForReward && !hasUsedVoucher && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={openVoucherModal}
                    className="mt-3 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center w-full"
                  >
                    Use Voucher
                  </motion.button>
                )}
              </motion.div>
            )}
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Meal Progress
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[0, 1, 2, 3, 4, 5].map((index) => {
                const mealCompleted = getMealStatus(index);

                return (
                  <motion.button
                    key={index}
                    whileHover={!mealCompleted ? { scale: 1.03 } : {}}
                    whileTap={!mealCompleted ? { scale: 0.97 } : {}}
                    onClick={() => !mealCompleted && openModal(index)}
                    disabled={mealCompleted}
                    className={`relative h-24 rounded-lg flex flex-col items-center justify-center transition-colors ${
                      mealCompleted
                        ? "bg-green-100 border-2 border-green-300 text-green-800 cursor-default"
                        : "bg-gray-100 hover:bg-gray-200 border-2 border-gray-200 text-gray-700"
                    }`}
                  >
                    <Calendar
                      size={20}
                      className={
                        mealCompleted ? "text-green-600" : "text-gray-500"
                      }
                    />
                    <span className="mt-1 font-medium">Meal {index + 1}</span>
                    {mealCompleted && (
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                        ✓
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {user.meals && user.meals.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Meal History
                </h2>

                <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Meal #
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Bill Number
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {[...user.meals]
                          .sort((a, b) => a.index - b.index)
                          .map((meal, i) => (
                            <tr key={i}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                Meal {meal.index + 1}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {meal.billNumber}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {meal.amount} SAR
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {meal.date?.toDate
                                  ? meal.date
                                      .toDate()
                                      .toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      })
                                  : "N/A"}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Meal Form Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={closeModal}
            />

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 z-10"
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">
                  Record Meal {activeMealIndex + 1}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleMealSubmit} className="p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bill Number
                    </label>
                    <input
                      type="text"
                      value={billNumber}
                      onChange={(e) => setBillNumber(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                      placeholder="Enter bill number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bill Amount (SAR)
                    </label>
                    <input
                      type="number"
                      value={billAmount}
                      onChange={(e) => setBillAmount(e.target.value)}
                      min="0"
                      step="0.01"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                      placeholder="Enter amount (min 200 SAR)"
                    />
                    {parseFloat(billAmount) > 0 &&
                      parseFloat(billAmount) < 200 && (
                        <p className="mt-1 text-sm text-red-600">
                          Amount must be at least 200 SAR
                        </p>
                      )}
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={submitting || parseFloat(billAmount) < 200}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center"
                  >
                    {submitting ? (
                      <>
                        <Loader size={16} className="animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      "Save Meal"
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Voucher Usage Modal */}
      <AnimatePresence>
        {voucherModalOpen && (
          <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={closeVoucherModal}
            />

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 z-10"
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">
                  Use 500 SAR Voucher
                </h3>
                <button
                  onClick={closeVoucherModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleVoucherUse} className="p-4">
                <div className="px-2 py-4">
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          This action cannot be undone. Please verify the
                          customer is present and ready to use their 500 SAR
                          discount.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      To confirm, please enter user's unique code
                    </label>
                    <input
                      type="text"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                      placeholder="Enter unique code"
                    />
                  </div>

                  {voucherError && (
                    <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm mb-4">
                      {voucherError}
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={voucherSubmitting}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {voucherSubmitting ? (
                      <>
                        <Loader size={16} className="animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      "Confirm Voucher Usage"
                    )}
                  </motion.button>
                  <button
                    type="button"
                    onClick={closeVoucherModal}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UserDetail;
