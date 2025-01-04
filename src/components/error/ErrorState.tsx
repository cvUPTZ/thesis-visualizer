import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="min-h-screen bg-gray-50 p-8"
  >
    <div className="container mx-auto text-center max-w-md">
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="bg-white rounded-lg shadow-lg p-8 space-y-4"
      >
        <h2 className="text-2xl font-bold text-red-600">Error Loading Dashboard</h2>
        <p className="text-gray-600">{error}</p>
        <Button
          onClick={onRetry}
          className="mt-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          variant="default"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2"
          >
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Retry Loading
          </motion.div>
        </Button>
      </motion.div>
    </div>
  </motion.div>
);