import { motion } from "framer-motion";
import { LoadingProgress } from "./LoadingProgress";

export const LoadingSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="min-h-screen bg-background p-8"
  >
    <div className="container mx-auto space-y-8">
      <LoadingProgress />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-lg p-6 shadow-lg"
          >
            <div className="space-y-4">
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-8 w-16 bg-muted rounded animate-pulse" />
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);