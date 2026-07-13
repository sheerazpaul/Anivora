import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { animeApi } from '../api/animeApi';
import AnimeCard from '../components/AnimeCard';
import Pagination from '../components/Pagination';
import { SkeletonCard, Spinner } from '../components/Skeletons';
import { LayoutGrid, Crown, Radio, Clock, Sparkles, Flame, Film, Tv, Monitor } from 'lucide-react';

const categories = [
  { id: 'trending', label: 'Trending', icon: Flame, color: 'text-rose-500', bg: 'bg-rose-50' },
  { id: 'top', label: 'Top Rated', icon: Crown, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'airing', label: 'Airing', icon: Radio, color: 'text-green-500', bg: 'bg-green-50' },
  { id: 'upcoming', label: 'Upcoming', icon: Clock, color: 'text-cyan-500', bg: 'bg-cyan-50' },
  { id: 'tv', label: 'TV Series', icon: Tv, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { id: 'movie', label: 'Movies', icon: Film, color: 'text-violet-500', bg: 'bg-violet-50' },
  { id: 'ova', label: 'OVAs', icon: Monitor, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'genres', label: 'By Genre', icon: Sparkles, color: 'text-pink-500', bg: 'bg-pink-50' },
];

const categoryFilters = {
  trending: { type: 'top', filter: '' },
  top: { type: 'top', filter: '' },
  airing: { type: 'top', filter: 'airing' },
  upcoming: { type: 'season', season: 'upcoming' },
  tv: { type: 'top', filter: 'tv' },
  movie: { type: 'top', filter: 'movie' },
  ova: { type: 'top', filter: 'ova' },
};

export default function Categories() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('cat') || 'trending';
  const [page, setPage] = useState(1);

  const setCategory = (cat) => {
    setSearchParams({ cat });
    setPage(1);
  };

  const catConfig = categoryFilters[activeCategory];
  const isGenres = activeCategory === 'genres';

  const { data, isLoading } = useQuery({
    queryKey: ['categories', activeCategory, page],
    queryFn: () => {
      if (activeCategory === 'upcoming') return animeApi.getSeasonUpcoming(page);
      return animeApi.getTopAnime(catConfig?.filter || '', page);
    },
    enabled: !isGenres,
    staleTime: 120000,
  });

  const { data: genresData, isLoading: genresLoading } = useQuery({
    queryKey: ['categories-genres'],
    queryFn: () => animeApi.getGenres(),
    select: (res) => res.data.data,
    enabled: isGenres,
    staleTime: 600000,
  });

  const activeCat = categories.find((c) => c.id === activeCategory) || categories[0];
  const Icon = activeCat.icon;
  const totalPages = data?.data?.pagination?.last_visible_page || 1;

  return (
    <div className="min-h-screen pt-20">
      <main className="pb-16 px-6 max-w-screen-2xl mx-auto">
        {/* Category Pills */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2.5 rounded-xl ${activeCat.bg} ${activeCat.color}`}>
              <LayoutGrid size={22} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">Browse</h1>
              <p className="text-slate-500">Explore anime by category</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const CatIcon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setCategory(cat.id)}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-indigo-100/60 hover:border-primary/30 hover:text-primary'
                  }`}
                >
                  <CatIcon size={16} />
                  {cat.label}
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* Active Category Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-indigo-100/60">
          <div className={`p-2 rounded-lg ${activeCat.bg}`}>
            <Icon size={18} className={activeCat.color} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-700">{activeCat.label}</h2>
            <p className="text-xs text-slate-400">
              {isGenres ? `${genresData?.length || 0} genres to explore` : `Page ${page} of ${totalPages}`}
            </p>
          </div>
        </div>

        {/* Content */}
        {isGenres ? (
          genresLoading ? (
            <Spinner />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {genresData?.map((genre, i) => (
                <motion.div
                  key={genre.mal_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ y: -3 }}
                >
                  <Link
                    to={`/genre/${genre.mal_id}?name=${encodeURIComponent(genre.name)}`}
                    className="block p-5 rounded-2xl text-center transition-all bg-white border border-indigo-100/60 hover:border-primary/30 hover:shadow-md hover:bg-primary-container/20"
                  >
                    <p className="font-semibold text-slate-700 text-sm">{genre.name}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{genre.count} titles</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          )
        ) : isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {data?.data?.data?.map((anime, i) => (
                <AnimeCard key={anime.mal_id} anime={anime} index={i} />
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            />
          </>
        )}
      </main>
    </div>
  );
}
