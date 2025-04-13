// src/components/EmptyState.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionText,
  actionLink,
  onActionClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow rounded-lg p-8 text-center"
    >
      {Icon && <Icon size={48} className="mx-auto text-gray-400 mb-3" />}
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}

      {actionText && (actionLink || onActionClick) && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4"
        >
          {actionLink ? (
            <Link
              to={actionLink}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {actionText}
            </Link>
          ) : (
            <button
              onClick={onActionClick}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {actionText}
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;
