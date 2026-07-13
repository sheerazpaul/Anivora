import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Heart, Search, Moon, Sun, ListPlus, ChevronDown, LayoutGrid, Flame, Crown, Radio, Clock, Tv, Film, Monitor, Sparkles } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useWatchlist } from '../context/WatchlistContext';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';

const browseItems = [
  { id: 'categories', label: 'All Categories', icon: LayoutGrid, to: '/categories' },
  { id: 'trending', label: 'Trending', icon: Flame, to: '/categories?cat=trending' },
  { id: 'top', label: 'Top Rated', icon: Crown, to: '/categories?cat=top' },
  { id: 'airing', label: 'Airing', icon: Radio, to: '/categories?cat=airing' },
  { id: 'upcoming', label: 'Upcoming', icon: Clock, to: '/categories?cat=upcoming' },
  { id: 'tv', label: 'TV Series', icon: Tv, to: '/categories?cat=tv' },
  { id: 'movie', label: 'Movies', icon: Film, to: '/categories?cat=movie' },
  { id: 'ova', label: 'OVAs', icon: Monitor, to: '/categories?cat=ova' },
  { id: 'genres', label: 'By Genre', icon: Sparkles, to: '/categories?cat=genres' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { favorites } = useFavorites();
  const { watchlist } = useWatchlist();
  const browseRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (browseRef.current && !browseRef.current.contains(e.target)) {
        setBrowseOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBrowseClick = (item) => {
    setBrowseOpen(false);
    setIsOpen(false);
    navigate(item.to);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className={`fixed top-3 left-1/2 -translate-x-1/2 w-[calc(100%-24px)] max-w-screen-2xl z-50 transition-all duration-300 rounded-full
        ${isDark
          ? scrolled ? 'bg-slate-900/90 border-white/5 shadow-lg shadow-black/10' : 'bg-slate-900/80 border-white/5'
          : scrolled ? 'bg-white/90 border-indigo-100/50 shadow-lg shadow-indigo-500/5' : 'bg-white/80 border-indigo-100/30'
        } border backdrop-blur-xl`}
    >
      <div className="flex items-center justify-between h-14 px-5">
        <Link to="/" className="flex items-center gap-2.5 group">
          <Logo size={32} />
          <span className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Anivora
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : isDark
                    ? 'text-slate-400 hover:text-white hover:bg-white/10'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-indigo-50'
              }`
            }
          >
            Home
          </NavLink>

          <div ref={browseRef} className="relative">
            <button
              onClick={() => setBrowseOpen(!browseOpen)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                browseOpen
                  ? 'bg-primary text-white shadow-sm'
                  : isDark
                    ? 'text-slate-400 hover:text-white hover:bg-white/10'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-indigo-50'
              }`}
            >
              <LayoutGrid size={15} />
              Browse
              <ChevronDown size={14} className={`transition-transform ${browseOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {browseOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute top-full left-0 mt-2 w-56 rounded-2xl bg-white border border-indigo-100/60 shadow-xl shadow-indigo-500/5 overflow-hidden z-30"
                >
                  <div className="p-1.5">
                    {browseItems.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleBrowseClick(item)}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-indigo-50 hover:text-slate-800 transition-all text-left"
                        >
                          <ItemIcon size={16} className="text-slate-400" />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <NavLink
            to="/search"
            className={`rounded-full p-2 transition-all ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-800 hover:bg-indigo-50'}`}
          >
            <Search size={18} />
          </NavLink>

          <NavLink
            to="/watchlist"
            className={`relative rounded-full p-2 transition-all ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-800 hover:bg-indigo-50'}`}
          >
            <ListPlus size={18} />
            {watchlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-secondary text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                {watchlist.length > 9 ? '9+' : watchlist.length}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/favorites"
            className={`relative rounded-full p-2 transition-all ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-800 hover:bg-indigo-50'}`}
          >
            <Heart size={18} />
            {favorites.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                {favorites.length > 9 ? '9+' : favorites.length}
              </span>
            )}
          </NavLink>

          <button
            onClick={toggleTheme}
            className={`rounded-full p-2 transition-all ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-800 hover:bg-indigo-50'}`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className={`h-6 w-px mx-1 ${isDark ? 'bg-white/10' : 'bg-indigo-100'}`} />

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden rounded-full p-2 transition-all ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-800 hover:bg-indigo-50'}`}
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <Link
            to="/watchlist"
            className="hidden md:inline-flex btn-primary gap-2 text-sm py-2 px-5"
          >
            <ListPlus size={16} />
            My Watchlist
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className={`md:hidden rounded-b-2xl overflow-hidden ${isDark ? 'bg-slate-900/95' : 'bg-white/95'}`}
          >
            <div className="px-4 pb-4 pt-2 space-y-1">
              <NavLink
                to="/"
                end
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-white'
                      : isDark
                        ? 'text-slate-400 hover:text-white hover:bg-white/10'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-indigo-50'
                  }`
                }
              >
                Home
              </NavLink>

              <div className={`pt-2 pb-1 px-1 text-[11px] font-semibold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Browse
              </div>

              {browseItems.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleBrowseClick(item)}
                    className={`flex items-center gap-3 w-full rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
                      isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-800 hover:bg-indigo-50'
                    }`}
                  >
                    <ItemIcon size={15} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
