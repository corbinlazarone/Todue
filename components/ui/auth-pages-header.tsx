import Image from "next/image";
import { motion } from "framer-motion";

export default function AuthHeader() {
  return (
    <div>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100"
      >
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Todue logo" width={24} height={24} />
            <span className="font-bold text-lg bg-clip-text text-indigo-600">
              Todue
            </span>
          </div>
        </div>
      </motion.header>
    </div>
  );
}