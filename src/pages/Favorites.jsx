import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ListPlus, Trash2, ArrowLeft, Star } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useWatchlist } from '../context/WatchlistContext';
import toast from 'react-hot-toast';

export default function Favorites() {
  const { favorites, removeFavorite, clearFavorites } = useFavorites();
  const { watchlist, removeFromWatchlist, clearWatchlist } = useWatchlist();
  const [activeTab, setActiveTab] = useState('favorites');

  const items = activeTab === 'favorites' ? favorites : watchlist;
  const remove = activeTab === 'favorites' ? removeFavorite : removeFromWatchlist;
  const clear = activeTab === 'favorites' ? clearFavorites : clearWatchlist;

  return (
    <div className="min-h-screen pt-20">
      <main className="pb-16 px-6 max-w-screen-2xl mx-auto">
        <section className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-2">My Collection</h1>
          <p className="text-slate-500">Manage your favorites and watchlist</p>
        </section>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          <div className="bg-white rounded-2xl border border-indigo-100/60 p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Favorites</p>
            <p className="text-2xl font-bold text-primary">{favorites.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-indigo-100/60 p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Watchlist</p>
            <p className="text-2xl font-bold text-secondary">{watchlist.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-indigo-100/60 p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Items</p>
            <p className="text-2xl font-bold text-slate-700">{favorites.length + watchlist.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-indigo-100/60 p-5 bg-gradient-to-br from-indigo-50/50 to-transparent">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Collection</p>
            <p className="text-2xl font-bold text-primary">{items.length}</p>
          </div>
        </div>

        <section className="mb-6">
          <div className="flex items-center gap-1 border-b border-indigo-100/60">
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-5 py-3 text-sm font-semibold transition-all flex items-center gap-2 rounded-t-lg ${
                activeTab === 'favorites'
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Heart size={16} /> Favorites
            </button>
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`px-5 py-3 text-sm font-semibold transition-all flex items-center gap-2 rounded-t-lg ${
                activeTab === 'watchlist'
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <ListPlus size={16} /> Watchlist
            </button>
            {items.length > 0 && (
              <button
                onClick={() => { clear(); toast(`${activeTab === 'favorites' ? 'Favorites' : 'Watchlist'} cleared`); }}
                className="ml-auto px-4 py-2 rounded-full text-xs font-medium text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <Trash2 size={14} className="inline mr-1" /> Clear All
              </button>
            )}
          </div>
        </section>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
              {activeTab === 'favorites' ? <Heart size={28} className="text-slate-300" /> : <ListPlus size={28} className="text-slate-300" />}
            </div>
            <h2 className="text-xl font-semibold text-slate-700 mb-2">
              {activeTab === 'favorites' ? 'No favorites yet' : 'Watchlist is empty'}
            </h2>
            <p className="text-slate-400 mb-6">
              {activeTab === 'favorites' ? 'Start adding anime to your favorites' : 'Add anime to your watchlist'}
            </p>
            <Link to="/" className="btn-primary">
              <ArrowLeft size={16} /> Browse Anime
            </Link>
          </div>
        ) : (
          <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {items.map((anime) => (
              <motion.div
                key={anime.mal_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative"
              >
                <Link to={`/anime/${anime.mal_id}`}>
                  <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-indigo-100/60 shadow-sm">
                    <img
                      src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
                      alt={anime.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={(e) => { e.preventDefault(); remove(anime.mal_id); toast('Removed'); }}
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
                  <p className="text-xs text-slate-400">{anime.type || 'Anime'}{anime.episodes ? ` · ${anime.episodes} Eps` : ''}</p>
                </Link>
              </motion.div>
            ))}
            <Link to="/" className="relative aspect-[2/3] rounded-2xl border-2 border-dashed border-indigo-200/60 flex flex-col items-center justify-center gap-3 hover:border-primary/40 hover:bg-indigo-50/50 transition-all group">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-primary/10 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#6366f1"><path d="M440-440H240q-11 0-19.5-8.5T220-468v-264q0-11 8.5-19.5T240-760h200v-40q0-17 11.5-28.5T480-840q17 0 28.5 11.5T520-840v40h200q11 0 19.5 8.5T748-772v264q0 11-8.5 19.5T720-480H520v40q0 17-11.5 28.5T480-400q-17 0-28.5-11.5T440-440Z"/></svg>
              </div>
              <span className="text-sm font-semibold text-slate-400 group-hover:text-primary">Add More</span>
            </Link>
          </section>
        )}
      </main>
    </div>
  );
}
