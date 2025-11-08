import React from "react";
import { Loader2 } from "lucide-react"; // Using lucide-react for icons

const LoadingSpinner = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <Loader2
      className={`animate-spin text-indigo-600 ${
        sizeClasses[size] || sizeClasses.md
      }`}
    />
  );
};

export default LoadingSpinner;
