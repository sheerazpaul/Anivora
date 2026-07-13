import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          className="text-8xl md:text-9xl font-extrabold mb-4 bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent"
        >
          404
        </motion.div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">Page Not Found</h1>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">
          The anime you are looking for might have been removed or is temporarily unavailable.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/" className="btn-primary">
            <Home size={16} />
            Go Home
          </Link>
          <Link to="/search" className="btn-secondary">
            <Search size={16} />
            Search
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
