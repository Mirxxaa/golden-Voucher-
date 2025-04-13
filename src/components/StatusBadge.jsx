import { motion } from "framer-motion";

const StatusBadge = ({ mealsCount, voucherUsed }) => {
  if (voucherUsed) {
    return (
      <motion.span
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
      >
        ✓ Voucher Used
      </motion.span>
    );
  }

  if (mealsCount >= 6) {
    return (
      <motion.span
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
      >
        🎉 Eligible
      </motion.span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
      {mealsCount}/6 Meals
    </span>
  );
};

export default StatusBadge;
