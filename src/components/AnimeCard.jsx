import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFavorites } from '../context/FavoritesContext';
import { useWatchlist } from '../context/WatchlistContext';
import { useTheme } from '../context/ThemeContext';
import { Heart, Plus, Star, Check } from 'lucide-react';

export default function AnimeCard({ anime, index = 0, horizontal = false, rank }) {
  const { isDark } = useTheme();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  const isFav = isFavorite(anime.mal_id);
  const isWl = isInWatchlist(anime.mal_id);

  const toggleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFav) { removeFavorite(anime.mal_id); } else { addFavorite(anime); }
  };

  const toggleWl = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWl) { removeFromWatchlist(anime.mal_id); } else { addToWatchlist(anime); }
  };

  const img = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
  const isAiring = anime.status === 'Currently Airing';
  const isFinished = anime.status === 'Finished Airing';

  if (horizontal) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: index * 0.06 }}
        className="flex-none group"
      >
        <Link
          to={`/anime/${anime.mal_id}`}
          className={`block w-[340px] md:w-[420px] h-[200px] relative rounded-2xl overflow-hidden border transition-all duration-500
            ${isDark ? 'border-slate-700/50' : 'border-indigo-100/60'}
            shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30`}
        >
          <img
            src={img}
            alt={anime.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 flex flex-col justify-end">
            <div className="flex items-center gap-2 mb-2">
              {rank && (
                <span className="px-2 py-0.5 rounded-full bg-primary/80 text-white text-[10px] font-bold">#{rank}</span>
              )}
              {isAiring && <span className="px-2 py-0.5 rounded-full bg-green-500/80 text-white text-[10px] font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />Airing</span>}
            </div>
            <h3 className="text-lg font-bold text-white mb-0.5 line-clamp-1">{anime.title}</h3>
            <p className="text-xs text-white/60 line-clamp-1 mb-2">{anime.synopsis?.slice(0, 80) || 'Explore this anime'}</p>
            <div className="flex items-center gap-2">
              {anime.genres?.slice(0, 2).map((g) => (
                <span key={g.mal_id} className="px-3 py-0.5 rounded-full text-[10px] font-medium bg-white/15 text-white/90 backdrop-blur-sm border border-white/10">
                  {g.name}
                </span>
              ))}
              {anime.score && (
                <span className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 text-[10px] font-bold">
                  <Star size={10} fill="currentColor" />{anime.score}
                </span>
              )}
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
      className="flex-none w-44 md:w-52 group"
    >
      <Link to={`/anime/${anime.mal_id}`}>
        <div className={`relative aspect-[2/3] rounded-2xl overflow-hidden mb-2.5 border transition-all duration-500
          ${isDark ? 'bg-slate-800 border-slate-700/50' : 'bg-white border-indigo-100/60'}
          shadow-sm group-hover:shadow-xl group-hover:shadow-primary/10 group-hover:border-primary/30`}>
          <img
            src={img}
            alt={anime.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />

          <div className={`absolute inset-0 transition-all duration-300 ${
            isDark
              ? 'bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100'
              : 'bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100'
          } flex flex-col justify-end p-3`}>
            <div className="space-y-1.5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <button
                onClick={toggleWl}
                className={`flex items-center justify-center gap-1.5 w-full py-2 rounded-full text-xs font-medium transition-all backdrop-blur-sm ${
                  isWl
                    ? 'bg-primary text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {isWl ? <Check size={12} /> : <Plus size={12} />}
                {isWl ? 'Added' : 'Watchlist'}
              </button>
              <button
                onClick={toggleFav}
                className={`flex items-center justify-center gap-1.5 w-full py-2 rounded-full text-xs font-medium transition-all backdrop-blur-sm ${
                  isFav
                    ? 'bg-red-500/80 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Heart size={12} fill={isFav ? 'currentColor' : 'none'} />
                {isFav ? 'Favorited' : 'Favorite'}
              </button>
            </div>
          </div>

          {rank && (
            <div className="absolute top-2 left-2">
              <div className="w-7 h-7 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shadow-md shadow-primary/30">
                {rank}
              </div>
            </div>
          )}

          {anime.score && (
            <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full backdrop-blur-sm text-white text-[10px] font-bold flex items-center gap-1 border border-white/10 ${
              anime.score >= 8 ? 'bg-yellow-500/30' : anime.score >= 6 ? 'bg-green-500/30' : 'bg-slate-500/30'
            }`}>
              <Star size={10} fill="#fbbf24" stroke="#fbbf24" />
              {anime.score}
            </div>
          )}

          {isAiring && (
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-green-500/80 backdrop-blur-sm text-white text-[9px] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Airing
            </div>
          )}
        </div>

        <h3 className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
          {anime.title}
        </h3>
        <div className="flex items-center gap-1.5 mt-0.5">
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {isAiring ? 'Airing' : isFinished ? 'Completed' : anime.status || 'Unknown'}
            {anime.episodes ? ` · ${anime.episodes} eps` : ''}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
