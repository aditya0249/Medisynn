import React from "react";

interface SpinnerProps {
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ className }) => {
  return (
    <div
      className={`inline-block animate-spin rounded-full border-4 border-blue-500 border-t-transparent ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
};
