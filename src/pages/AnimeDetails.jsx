import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { animeApi } from '../api/animeApi';
import { useFavorites } from '../context/FavoritesContext';
import { useWatchlist } from '../context/WatchlistContext';
import { useTheme } from '../context/ThemeContext';
import CharacterCard from '../components/CharacterCard';
import EpisodeCard from '../components/EpisodeCard';
import { Spinner } from '../components/Skeletons';
import { Play, Star, Plus, Check, ExternalLink, Heart, ChevronRight, Calendar, Clock, Film } from 'lucide-react';

const tabs = ['Characters', 'Episodes', 'Recommendations'];

export default function AnimeDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Characters');
  const { isDark } = useTheme();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  const { data: animeData, isLoading } = useQuery({
    queryKey: ['anime', id],
    queryFn: () => animeApi.getAnimeDetails(id),
    select: (res) => res.data.data,
  });

  const { data: charData } = useQuery({
    queryKey: ['anime-characters', id],
    queryFn: () => animeApi.getAnimeCharacters(id),
    select: (res) => res.data.data,
    enabled: activeTab === 'Characters',
  });

  const { data: episodesData } = useQuery({
    queryKey: ['anime-episodes', id],
    queryFn: () => animeApi.getAnimeEpisodes(id),
    select: (res) => res.data.data,
    enabled: activeTab === 'Episodes',
  });

  const { data: recommendationsData } = useQuery({
    queryKey: ['anime-recommendations', id],
    queryFn: () => animeApi.getAnimeRecommendations(id),
    select: (res) => res.data.data,
    enabled: activeTab === 'Recommendations',
  });

  const anime = animeData;
  const wl = anime ? isInWatchlist(anime.mal_id) : false;
  const fav = anime ? isFavorite(anime.mal_id) : false;

  const handleWl = () => {
    if (!anime) return;
    if (wl) { removeFromWatchlist(anime.mal_id); } else { addToWatchlist(anime); }
  };

  const handleFav = () => {
    if (!anime) return;
    if (fav) { removeFavorite(anime.mal_id); } else { addFavorite(anime); }
  };

  if (isLoading) return <div className="pt-24"><Spinner /></div>;
  if (!anime) return null;

  const isAiring = anime.status === 'Currently Airing';

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative w-full min-h-[420px] md:min-h-[480px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={anime.images?.jpg?.large_image_url}
            alt={anime.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-surface/50 to-transparent" />
        </div>

        {/* Breadcrumb */}
        <div className="absolute top-20 left-6 z-10 flex items-center gap-1.5 text-xs text-slate-400">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-slate-600 truncate max-w-[200px]">{anime.title}</span>
        </div>

        <div className={`absolute bottom-0 w-full px-6 max-w-screen-2xl mx-auto pb-8 ${isDark ? 'text-white' : ''}`}>
          <div className="flex flex-col md:flex-row items-end gap-6">
            <div className="hidden md:block w-44 aspect-[2/3] rounded-2xl overflow-hidden shadow-xl shadow-black/10 border border-white/60 shrink-0 -mb-20 relative z-10">
              <img
                src={anime.images?.jpg?.large_image_url}
                alt={anime.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                  {anime.type || 'Anime'}
                </span>
                {anime.score && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200/50">
                    <Star size={12} fill="currentColor" /> {anime.score}
                  </span>
                )}
                {isAiring && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600 border border-green-200/50 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Airing
                  </span>
                )}
                {anime.rating && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200/50">
                    {anime.rating}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 leading-tight mb-2">
                {anime.title}
              </h1>
              {anime.title_japanese && (
                <p className="text-sm text-slate-400 mb-3">{anime.title_japanese}</p>
              )}

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mb-5">
                {anime.year && <span className="flex items-center gap-1"><Calendar size={13} />{anime.year}</span>}
                {anime.episodes && <span className="flex items-center gap-1"><Film size={13} />{anime.episodes} Episodes</span>}
                {anime.duration && <span className="flex items-center gap-1"><Clock size={13} />{anime.duration}</span>}
                {anime.season && <span className="capitalize">{anime.season}</span>}
              </div>

              <div className="flex flex-wrap gap-3">
                {anime.trailer?.url && (
                  <a
                    href={anime.trailer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary px-6 py-2.5 shadow-lg shadow-primary/20"
                  >
                    <Play size={16} fill="white" />
                    Watch Trailer
                  </a>
                )}
                <button
                  onClick={handleWl}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all active:scale-95 shadow-sm ${
                    wl
                      ? 'bg-primary text-white shadow-primary/20'
                      : 'bg-white text-slate-600 border border-indigo-100/60 hover:border-primary/30 hover:text-primary hover:shadow-md'
                  }`}
                >
                  {wl ? <Check size={16} /> : <Plus size={16} />}
                  {wl ? 'In Watchlist' : 'Watchlist'}
                </button>
                <button
                  onClick={handleFav}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all active:scale-95 shadow-sm ${
                    fav
                      ? 'bg-red-500 text-white shadow-red-500/20'
                      : 'bg-white text-slate-600 border border-indigo-100/60 hover:border-red-300 hover:text-red-500 hover:shadow-md'
                  }`}
                >
                  <Heart size={16} fill={fav ? 'currentColor' : 'none'} />
                  {fav ? 'Favorited' : 'Favorite'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-screen-2xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          {/* Synopsis */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-gradient-to-b from-primary to-secondary" />
              Synopsis
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {anime.synopsis || 'No description available.'}
            </p>
            {anime.background && (
              <p className="text-slate-500 leading-relaxed mt-4 text-sm italic border-l-2 border-indigo-100 pl-4">
                {anime.background}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mt-4">
              {anime.genres?.map((g) => (
                <Link
                  key={g.mal_id}
                  to={`/genre/${g.mal_id}?name=${encodeURIComponent(g.name)}`}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-500 border border-indigo-200/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all"
                >
                  {g.name}
                </Link>
              ))}
            </div>
          </motion.section>

          {/* Tabs */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex gap-1 border-b border-indigo-100/60 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 text-sm font-semibold transition-all rounded-t-lg ${
                    activeTab === tab
                      ? 'text-primary border-b-2 border-primary bg-primary/5'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'Characters' && (
                <motion.div
                  key="chars"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {charData?.slice(0, 8).map((item, i) => (
                    <CharacterCard key={item.character?.mal_id} character={item.character} index={i} />
                  ))}
                </motion.div>
              )}
              {activeTab === 'Episodes' && (
                <motion.div
                  key="eps"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2"
                >
                  {episodesData?.slice(0, 20).map((ep, i) => (
                    <EpisodeCard key={ep.mal_id} episode={ep} index={i} />
                  ))}
                </motion.div>
              )}
              {activeTab === 'Recommendations' && (
                <motion.div
                  key="recs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                    {recommendationsData?.slice(0, 12).map((rec, i) => (
                      <div key={rec.entry?.mal_id || i} className="flex-none w-28">
                        <Link to={`/anime/${rec.entry?.mal_id}`}>
                          <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-sm border border-indigo-100/60 group">
                            <img
                              src={rec.entry?.images?.jpg?.image_url}
                              alt={rec.entry?.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Play size={20} className="text-white" fill="white" />
                            </div>
                          </div>
                          <p className="text-xs text-slate-600 mt-1.5 font-medium truncate">{rec.entry?.title}</p>
                        </Link>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        </div>

        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <div className="glass-card rounded-2xl p-6 space-y-4">
            {anime.studios?.[0] && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Studio</p>
                <p className="text-slate-700 font-medium">{anime.studios.map(s => s.name).join(', ')}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 pt-2">
              {anime.rank && (
                <div className="bg-gradient-to-br from-indigo-50 to-transparent rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Rank</p>
                  <p className="text-2xl font-black text-primary">#{anime.rank}</p>
                </div>
              )}
              {anime.popularity && (
                <div className="bg-gradient-to-br from-slate-50 to-transparent rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Popularity</p>
                  <p className="text-2xl font-black text-slate-700">#{anime.popularity}</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {anime.members && (
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Members</p>
                  <p className="text-sm font-bold text-slate-700">{anime.members.toLocaleString()}</p>
                </div>
              )}
              {anime.favorites && (
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Favorites</p>
                  <p className="text-sm font-bold text-slate-700">{anime.favorites.toLocaleString()}</p>
                </div>
              )}
            </div>
            {anime.url && (
              <a
                href={anime.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full text-sm font-medium bg-indigo-50 text-indigo-500 hover:bg-primary/10 hover:text-primary transition-all border border-indigo-100/60"
              >
                <ExternalLink size={14} />
                View on MyAnimeList
              </a>
            )}
          </div>

          {anime.trailer?.embed_url && (
            <div className="glass-card rounded-2xl overflow-hidden border">
              <div className="aspect-video">
                <iframe
                  src={anime.trailer.embed_url}
                  title="Trailer"
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </motion.aside>
      </div>
    </div>
  );
}
