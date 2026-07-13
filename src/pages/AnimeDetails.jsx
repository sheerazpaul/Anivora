import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { animeApi } from '../api/animeApi';
import { useWatchlist } from '../context/WatchlistContext';
import CharacterCard from '../components/CharacterCard';
import EpisodeCard from '../components/EpisodeCard';
import { Spinner } from '../components/Skeletons';
import { Play, Star, Plus, Check, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const tabs = ['characters', 'episodes', 'recommendations'];

export default function AnimeDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('characters');
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
    enabled: activeTab === 'characters',
  });

  const { data: episodesData } = useQuery({
    queryKey: ['anime-episodes', id],
    queryFn: () => animeApi.getAnimeEpisodes(id),
    select: (res) => res.data.data,
    enabled: activeTab === 'episodes',
  });

  const { data: recommendationsData } = useQuery({
    queryKey: ['anime-recommendations', id],
    queryFn: () => animeApi.getAnimeRecommendations(id),
    select: (res) => res.data.data,
    enabled: activeTab === 'recommendations',
  });

  const anime = animeData;
  const wl = anime ? isInWatchlist(anime.mal_id) : false;

  const handleWl = () => {
    if (!anime) return;
    if (wl) {
      removeFromWatchlist(anime.mal_id);
      toast('Removed from watchlist');
    } else {
      addToWatchlist(anime);
      toast('Added to watchlist');
    }
  };

  if (isLoading) return <div className="pt-24"><Spinner /></div>;
  if (!anime) return null;

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative w-full min-h-[450px] md:min-h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={anime.images?.jpg?.large_image_url}
            alt={anime.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent" />
        </div>
        
        <div className="absolute bottom-0 w-full px-6 max-w-screen-2xl mx-auto pb-8">
          <div className="flex flex-col md:flex-row items-end gap-6">
            <div className="hidden md:block w-44 aspect-[2/3] rounded-2xl overflow-hidden shadow-xl border border-white/60 shrink-0">
              <img
                src={anime.images?.jpg?.large_image_url}
                alt={anime.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                  {anime.type || 'Anime'}
                </span>
                {anime.score && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200/50">
                    <Star size={12} fill="currentColor" /> {anime.score}
                  </span>
                )}
                {anime.status && (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    anime.status === 'Currently Airing'
                      ? 'bg-green-50 text-green-600 border-green-200/50'
                      : 'bg-slate-50 text-slate-500 border-slate-200/50'
                  }`}>
                    {anime.status === 'Currently Airing' ? '● Airing' : anime.status}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 leading-tight mb-2">
                {anime.title}
              </h1>
              <div className="flex flex-wrap gap-3 text-sm text-slate-500 mb-5">
                {anime.year && <span>{anime.year}</span>}
                {anime.episodes && <span>{anime.episodes} Episodes</span>}
                {anime.duration && <span>{anime.duration}</span>}
                {anime.rating && <span>{anime.rating}</span>}
              </div>
              <div className="flex gap-3">
                {anime.trailer?.url && (
                  <a
                    href={anime.trailer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary px-6 py-2.5"
                  >
                    <Play size={16} fill="white" />
                    Watch Trailer
                  </a>
                )}
                <button
                  onClick={handleWl}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all active:scale-95 ${
                    wl
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'bg-white text-slate-600 border border-indigo-100/60 hover:border-primary/30 hover:text-primary hover:shadow-sm'
                  }`}
                >
                  {wl ? <Check size={16} /> : <Plus size={16} />}
                  {wl ? 'In Watchlist' : 'Add to Watchlist'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-screen-2xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Synopsis */}
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-3">Synopsis</h2>
            <p className="text-slate-600 leading-relaxed">
              {anime.synopsis || 'No description available.'}
            </p>
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
          </section>

          {/* Tabs */}
          <section>
            <div className="flex gap-1 border-b border-indigo-100/60 mb-6">
              {tabs.map((tab) => (
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
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'characters' && (
                <motion.div
                  key="chars"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {charData?.map((item, i) => (
                    <CharacterCard key={item.character?.mal_id} character={item.character} index={i} />
                  ))}
                </motion.div>
              )}
              {activeTab === 'episodes' && (
                <motion.div
                  key="eps"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2"
                >
                  {episodesData?.map((ep, i) => (
                    <EpisodeCard key={ep.mal_id} episode={ep} index={i} />
                  ))}
                </motion.div>
              )}
              {activeTab === 'recommendations' && (
                <motion.div
                  key="recs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-4 overflow-x-auto pb-4"
                >
                  {recommendationsData?.slice(0, 10).map((rec, i) => (
                    <div key={rec.entry?.mal_id || i} className="flex-none w-32">
                      <Link to={`/anime/${rec.entry?.mal_id}`}>
                        <img
                          src={rec.entry?.images?.jpg?.image_url}
                          alt={rec.entry?.title}
                          className="w-full aspect-[2/3] rounded-xl object-cover shadow-sm border border-indigo-100/60"
                        />
                        <p className="text-xs text-slate-600 mt-1.5 font-medium truncate">{rec.entry?.title}</p>
                      </Link>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="bg-white rounded-2xl border border-indigo-100/60 p-6">
            {anime.studios?.[0] && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Studio</p>
                <p className="text-slate-700 font-medium">{anime.studios.map(s => s.name).join(', ')}</p>
              </div>
            )}
            {anime.season && anime.year && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Season</p>
                <p className="text-slate-700 font-medium">{anime.season.charAt(0).toUpperCase() + anime.season.slice(1)} {anime.year}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-indigo-100/60">
              {anime.rank && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Rank</p>
                  <p className="text-2xl font-bold text-primary">#{anime.rank}</p>
                </div>
              )}
              {anime.popularity && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Popularity</p>
                  <p className="text-2xl font-bold text-slate-700">#{anime.popularity}</p>
                </div>
              )}
            </div>
            {anime.url && (
              <a
                href={anime.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-full text-sm font-medium bg-indigo-50 text-indigo-500 hover:bg-primary/10 hover:text-primary transition-all border border-indigo-100/60"
              >
                <ExternalLink size={14} />
                View on MyAnimeList
              </a>
            )}
          </div>

          {anime.trailer?.embed_url && (
            <div className="bg-white rounded-2xl overflow-hidden border border-indigo-100/60 shadow-sm">
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
        </aside>
      </div>
    </div>
  );
}
