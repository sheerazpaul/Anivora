import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, ArrowRight, Loader2 } from 'lucide-react';
import { animeApi } from '../api/animeApi';

const popularSearches = ['One Piece', 'Attack on Titan', 'Jujutsu Kaisen', 'Demon Slayer', 'Naruto'];

export default function SearchBar({ autoFocus = true, large = false }) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (autoFocus && inputRef.current) inputRef.current.focus();
  }, [autoFocus]);

  const fetchSuggestions = useCallback(async (q) => {
    if (!q.trim()) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await animeApi.getAnimeSearch(q, 1);
      const data = res.data.data?.slice(0, 5) || [];
      setSuggestions(data.map((a) => ({ mal_id: a.mal_id, title: a.title, image: a.images?.jpg?.image_url, type: a.type, score: a.score })));
    } catch {
      setSuggestions([]);
    }
    setLoading(false);
  }, []);

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  const handleSearch = (q) => {
    const searchQuery = q || query;
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const showDropdown = focused && query.length > 0 && (suggestions.length > 0 || loading);

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <Search size={large ? 22 : 18} className="absolute left-5 text-indigo-300 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 250)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
          placeholder="Search for your next obsession..."
          className={`w-full pl-12 pr-14 rounded-full bg-white border border-indigo-100/80 text-slate-700 placeholder:text-slate-400
            focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all
            ${large ? 'py-4 text-base' : 'py-2.5 text-sm'}`}
        />
        <button
          onClick={() => handleSearch()}
          className="absolute right-1.5 rounded-full bg-primary p-2 text-white hover:bg-primary/90 transition-all active:scale-90"
        >
          <ArrowRight size={large ? 18 : 15} />
        </button>
      </div>

      <AnimatePresence>
        {focused && !query && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 w-full mt-2 rounded-2xl bg-white border border-indigo-100/60 shadow-xl shadow-indigo-500/5 overflow-hidden z-20"
          >
            <div className="p-3 border-b border-indigo-50">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Popular Searches</span>
            </div>
            <div className="p-1">
              {popularSearches.map((item) => (
                <button
                  key={item}
                  onMouseDown={() => handleSearch(item)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-indigo-50 hover:text-slate-800 transition-all text-left"
                >
                  <TrendingUp size={14} className="text-indigo-300" />
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 w-full mt-2 rounded-2xl bg-white border border-indigo-100/60 shadow-xl shadow-indigo-500/5 overflow-hidden z-20"
          >
            <div className="p-3 border-b border-indigo-50">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                Suggestions for "{query}"
              </span>
            </div>
            <div className="p-1">
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 size={18} className="text-primary animate-spin" />
                </div>
              ) : (
                suggestions.map((item) => (
                  <button
                    key={item.mal_id}
                    onMouseDown={() => handleSearch(item.title)}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-slate-600 hover:bg-indigo-50 hover:text-slate-800 transition-all text-left"
                  >
                    <div className="w-8 h-10 rounded-lg overflow-hidden bg-indigo-50 shrink-0">
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.title}</p>
                      <p className="text-[11px] text-slate-400">{item.type || 'Anime'}{item.score ? ` · ${item.score}` : ''}</p>
                    </div>
                    <ArrowRight size={14} className="text-slate-300 shrink-0" />
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
