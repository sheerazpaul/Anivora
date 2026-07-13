import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFavorites } from '../context/FavoritesContext';
import { useWatchlist } from '../context/WatchlistContext';
import { useTheme } from '../context/ThemeContext';
import { Heart, Plus, Play, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AnimeCard({ anime, index = 0, horizontal = false }) {
  const { isDark } = useTheme();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  const isFav = isFavorite(anime.mal_id);
  const isWl = isInWatchlist(anime.mal_id);

  const toggleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFav) {
      removeFavorite(anime.mal_id);
      toast('Removed from favorites');
    } else {
      addFavorite(anime);
      toast('Added to favorites');
    }
  };

  const toggleWl = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWl) {
      removeFromWatchlist(anime.mal_id);
      toast('Removed from watchlist');
    } else {
      addToWatchlist(anime);
      toast('Added to watchlist');
    }
  };

  const img = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;

  if (horizontal) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: index * 0.06 }}
        whileHover={{ y: -3, scale: 1.01 }}
        className="flex-none group"
      >
        <Link
          to={`/anime/${anime.mal_id}`}
          className={`block w-[340px] md:w-[420px] h-[200px] relative rounded-2xl overflow-hidden border transition-all duration-300
            ${isDark ? 'border-slate-700/50' : 'border-indigo-100/60'}
            ${isDark ? 'bg-slate-800' : 'bg-white'}
            shadow-sm hover:shadow-xl`}
        >
          <img
            src={img}
            alt={anime.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6 flex flex-col justify-end">
            <div>
              <h3 className="text-lg font-bold text-white mb-0.5 line-clamp-1">
                {anime.title}
              </h3>
              <p className="text-xs text-white/60 line-clamp-1 mb-3">
                {anime.synopsis?.slice(0, 80) || 'Explore this anime'}
              </p>
              <div className="flex items-center gap-2">
                {anime.genres?.slice(0, 2).map((g) => (
                  <span key={g.mal_id} className="px-3 py-0.5 rounded-full text-[10px] font-medium bg-white/15 text-white/90 backdrop-blur-sm border border-white/10">
                    {g.name}
                  </span>
                ))}
                {anime.score && (
                  <span className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 text-[10px] font-bold">
                    <Star size={10} fill="currentColor" />
                    {anime.score}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -6 }}
      className="flex-none w-44 md:w-52 group"
    >
      <Link to={`/anime/${anime.mal_id}`}>
        <div className={`relative aspect-[2/3] rounded-2xl overflow-hidden mb-2.5 border transition-all duration-300
          ${isDark
            ? 'bg-slate-800 border-slate-700/50'
            : 'bg-white border-indigo-100/60'
          } shadow-sm group-hover:shadow-xl`}>
          <img
            src={img}
            alt={anime.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />

          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
            <div className="space-y-1.5">
              <Link
                to={`/anime/${anime.mal_id}`}
                className="flex items-center justify-center gap-1.5 w-full py-2 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-all"
              >
                <Play size={12} />
                View Details
              </Link>
              <div className="flex gap-1.5">
                <button
                  onClick={toggleFav}
                  className={`flex-1 py-1.5 rounded-full text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                    isFav ? 'bg-primary text-white' : 'bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm'
                  }`}
                >
                  <Heart size={12} fill={isFav ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={toggleWl}
                  className={`flex-1 py-1.5 rounded-full text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                    isWl ? 'bg-secondary text-white' : 'bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm'
                  }`}
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
          </div>

          {anime.score && (
            <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold flex items-center gap-1 border border-white/10">
              <Star size={10} fill="#fbbf24" stroke="#fbbf24" />
              {anime.score}
            </div>
          )}

          {anime.type && (
            <div className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium backdrop-blur-sm border
              ${isDark ? 'bg-white/15 text-white/90 border-white/10' : 'bg-black/30 text-white border-white/20'}`}>
              {anime.type}
            </div>
          )}
        </div>

        <h3 className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
          {anime.title}
        </h3>
        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {anime.status === 'Currently Airing' ? '● Airing' : 
           anime.status === 'Finished Airing' ? '✓ Completed' : 
           anime.status || 'Unknown'}
          {anime.episodes ? ` · ${anime.episodes} eps` : ''}
        </p>
      </Link>
    </motion.div>
  );
}
