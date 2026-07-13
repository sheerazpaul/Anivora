import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ListPlus, Trash2, Star } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { useFavorites } from '../context/FavoritesContext';
import toast from 'react-hot-toast';

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist, clearWatchlist } = useWatchlist();
  const { favorites, removeFavorite, clearFavorites } = useFavorites();
  const [activeTab, setActiveTab] = useState('favorites');

  const items = activeTab === 'favorites' ? favorites : watchlist;
  const remove = activeTab === 'favorites' ? removeFavorite : removeFromWatchlist;
  const clear = activeTab === 'favorites' ? clearFavorites : clearWatchlist;

  return (
    <div className="min-h-screen pt-20">
      <main className="pb-16 px-6 max-w-screen-2xl mx-auto">
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-1">My Collection</h1>
          <p className="text-slate-500">Manage your favorites and watchlist</p>
        </section>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Favorites', value: favorites.length, color: 'text-primary' },
            { label: 'Watchlist', value: watchlist.length, color: 'text-secondary' },
            { label: 'Total', value: favorites.length + watchlist.length, color: 'text-slate-700' },
            { label: 'Active', value: items.length, color: 'text-primary' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-indigo-100/60 p-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-1 border-b border-indigo-100/60 mb-6">
          {['favorites', 'watchlist'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium capitalize transition-all rounded-t-lg ${
                activeTab === tab
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
          {items.length > 0 && (
            <button
              onClick={() => { clear(); toast.success('Cleared'); }}
              className="ml-auto px-3 py-2.5 text-xs text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
            >
              <Trash2 size={14} className="inline mr-1" /> Clear All
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
              <ListPlus size={28} className="text-slate-300" />
            </div>
            <h2 className="text-xl font-semibold text-slate-700 mb-2">
              {activeTab === 'favorites' ? 'No favorites yet' : 'Watchlist is empty'}
            </h2>
            <p className="text-slate-400 mb-6">
              {activeTab === 'favorites' ? 'Start adding anime to your favorites' : 'Add anime to your watchlist'}
            </p>
            <Link to="/" className="btn-primary">
              Browse Anime
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {items.map((anime) => (
              <motion.div
                key={anime.mal_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group"
              >
                <Link to={`/anime/${anime.mal_id}`}>
                  <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-indigo-100/60 shadow-sm">
                    <img
                      src={anime.images?.jpg?.large_image_url}
                      alt={anime.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={(e) => { e.preventDefault(); remove(anime.mal_id); toast.success('Removed'); }}
                        className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-red-500/70 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    {anime.score && (
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm text-white text-[10px] font-bold flex items-center gap-1">
                        <Star size={10} fill="#fbbf24" stroke="#fbbf24" /> {anime.score}
                      </div>
                    )}
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-slate-700 truncate">{anime.title}</h3>
                  <p className="text-xs text-slate-400">{anime.type || 'Anime'}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
