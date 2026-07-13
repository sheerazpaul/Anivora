import { motion } from 'framer-motion';

export default function Logo({ size = 36 }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="shrink-0"
    >
      <rect width="36" height="36" rx="10" fill="url(#logo-grad)" />
      <path
        d="M10 26V10l16 8-16 8Zm2-3.5L22.5 18 12 13.5v9Z"
        fill="white"
      />
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="36" y2="36">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#818CF8" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}
