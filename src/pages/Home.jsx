import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { animeApi } from '../api/animeApi';
import { Play, ChevronLeft, ChevronRight, TrendingUp, Star, Search, ArrowRight } from 'lucide-react';
import AnimeCard from '../components/AnimeCard';
import Pagination from '../components/Pagination';
import { SkeletonCard } from '../components/Skeletons';

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [page, setPage] = useState(1);

  const { data: heroData, isLoading: heroLoading } = useQuery({
    queryKey: ['hero-top'],
    queryFn: () => animeApi.getTopAnime('', 1),
    select: (res) => res.data.data.slice(0, 6),
    staleTime: 300000,
  });

  const { data: animeData, isLoading: animeLoading } = useQuery({
    queryKey: ['home-anime', page],
    queryFn: () => animeApi.getTopAnime('', page),
    staleTime: 120000,
  });

  const animeList = heroData || [];
  const totalPages = animeData?.data?.pagination?.last_visible_page || 1;

  const next = useCallback(() => {
    if (animeList.length === 0) return;
    setDirection(1);
    setCurrent((prev) => (prev + 1) % animeList.length);
  }, [animeList.length]);

  const prev = useCallback(() => {
    if (animeList.length === 0) return;
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + animeList.length) % animeList.length);
  }, [animeList.length]);

  useEffect(() => {
    if (animeList.length === 0) return;
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next, animeList.length]);

  if (heroLoading) {
    return (
      <div className="min-h-screen">
        <div className="h-[600px] shimmer rounded-b-3xl mx-4 mt-4" />
      </div>
    );
  }

  const anime = animeList[current];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[520px] md:h-[640px] w-full overflow-hidden rounded-b-3xl mx-auto max-w-screen-2xl mt-4">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-surface z-10 pointer-events-none" />

        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={anime?.mal_id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-0"
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${anime?.images?.jpg?.large_image_url})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 via-50% to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-surface/40 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-0 w-full px-8 max-w-screen-2xl mx-auto pb-10 z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${anime?.mal_id}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="max-w-2xl"
            >
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 shadow-sm">
                  #{anime?.rank || 1} Trending
                </span>
                {anime?.score && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200/50 shadow-sm">
                    <Star size={12} fill="currentColor" /> {anime.score}
                  </span>
                )}
                {anime?.type && (
                  <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-500 border border-indigo-200/50">
                    {anime.type}
                  </span>
                )}
                {anime?.episodes && (
                  <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200/50">
                    {anime.episodes} Eps
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-slate-800 leading-tight tracking-tight mb-3">
                {anime?.title}
              </h1>

              <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-xl line-clamp-2 mb-7">
                {anime?.synopsis?.slice(0, 200) || 'An incredible anime awaits you...'}
              </p>

              <div className="flex flex-wrap gap-3">
                {anime?.trailer?.url && (
                  <motion.a
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    href={anime.trailer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary px-6 py-3 shadow-lg shadow-primary/20"
                  >
                    <Play size={16} fill="white" />
                    Watch Trailer
                  </motion.a>
                )}
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link to={`/anime/${anime?.mal_id}`} className="btn-secondary px-6 py-3">
                    View Details
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute bottom-6 right-8 z-20 flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prev}
            className="p-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-indigo-100/60 text-slate-500 hover:text-primary shadow-sm hover:shadow-md transition-all"
          >
            <ChevronLeft size={18} />
          </motion.button>
          <div className="flex gap-1.5">
            {animeList.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                className={`transition-all rounded-full ${
                  i === current
                    ? 'w-7 h-1.5 bg-primary shadow-sm shadow-primary/40'
                    : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={next}
            className="p-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-indigo-100/60 text-slate-500 hover:text-primary shadow-sm hover:shadow-md transition-all"
          >
            <ChevronRight size={18} />
          </motion.button>
        </div>
      </section>

      {/* Quick Search CTA */}
      <section className="px-6 max-w-screen-2xl mx-auto -mt-8 relative z-30 mb-10">
        <div className="max-w-xl mx-auto">
          <Link
            to="/search"
            className="flex items-center gap-3 w-full px-6 py-4 rounded-2xl glass-card hover:shadow-lg hover:border-primary/30 transition-all group"
          >
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Search size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-700">Search for your next obsession...</p>
              <p className="text-xs text-slate-400">Discover thousands of anime</p>
            </div>
            <ArrowRight size={18} className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </section>

      {/* Anime Grid */}
      <section className="px-6 max-w-screen-2xl mx-auto pb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 text-primary shadow-sm">
            <TrendingUp size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              <span className="text-gradient">Top Anime</span>
            </h2>
            <p className="text-sm text-slate-400">The highest rated anime of all time</p>
          </div>
        </div>

        {animeLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {animeData?.data?.data?.map((anime, i) => (
                <AnimeCard key={anime.mal_id} anime={anime} index={i} rank={i + 1 + (page - 1) * 25} />
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            />
          </>
        )}
      </section>
    </div>
  );
}
