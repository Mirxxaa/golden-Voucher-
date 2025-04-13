// src/components/LoadingSpinner.jsx
import { Loader } from "lucide-react";

const LoadingSpinner = ({ text = "Loading...", size = 24 }) => {
  return (
    <div className="flex justify-center items-center py-12">
      <Loader size={size} className="animate-spin text-indigo-600" />
      <span className="ml-2 text-gray-600">{text}</span>
    </div>
  );
};

export default LoadingSpinner;
