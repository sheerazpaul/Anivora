import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { animeApi } from '../api/animeApi';
import { Play, ChevronLeft, ChevronRight, Sparkles, TrendingUp, Clock, Star } from 'lucide-react';
import AnimeCard from '../components/AnimeCard';
import GenreCard from '../components/GenreCard';
import SearchBar from '../components/SearchBar';
import { SkeletonCard } from '../components/Skeletons';

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const { data: heroData, isLoading: heroLoading } = useQuery({
    queryKey: ['hero-top'],
    queryFn: () => animeApi.getTopAnime('', 1),
    select: (res) => res.data.data.slice(0, 5),
    staleTime: 300000,
  });

  const { data: trendingData, isLoading: trendingLoading } = useQuery({
    queryKey: ['home-trending'],
    queryFn: () => animeApi.getTopAnime('', 1),
    select: (res) => res.data.data.slice(0, 12),
    staleTime: 120000,
  });

  const { data: genres } = useQuery({
    queryKey: ['home-genres'],
    queryFn: () => animeApi.getGenres(),
    select: (res) => res.data.data.slice(0, 6),
    staleTime: 600000,
  });

  const { data: upcomingData } = useQuery({
    queryKey: ['home-upcoming'],
    queryFn: () => animeApi.getSeasonUpcoming(1),
    select: (res) => res.data.data.slice(0, 6),
    staleTime: 120000,
  });

  const animeList = heroData || [];

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
        <div className="h-[600px] bg-indigo-50/50 animate-pulse rounded-b-3xl mx-4 mt-4" />
      </div>
    );
  }

  const anime = animeList[current];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[620px] w-full overflow-hidden rounded-b-3xl mx-auto max-w-screen-2xl mt-4">
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
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Content */}
        <div className="absolute bottom-0 w-full px-8 max-w-screen-2xl mx-auto pb-10 z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${anime?.mal_id}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="max-w-2xl"
            >
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                  #{anime?.rank || 1} Trending
                </span>
                {anime?.score && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200/50">
                    <Star size={12} fill="currentColor" /> {anime.score}
                  </span>
                )}
                {anime?.type && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-500 border border-indigo-200/50">
                    {anime.type}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-800 leading-tight tracking-tight mb-3">
                {anime?.title}
              </h1>

              <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-xl line-clamp-2 mb-6">
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
                    className="btn-primary"
                  >
                    <Play size={16} fill="white" />
                    Watch Trailer
                  </motion.a>
                )}
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link to={`/anime/${anime?.mal_id}`} className="btn-secondary">
                    View Details
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
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
                    ? 'w-6 h-1.5 bg-primary'
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

      {/* Search Section */}
      <section className="px-6 max-w-screen-2xl mx-auto py-10">
        <div className="max-w-xl mx-auto">
          <SearchBar large />
        </div>
      </section>

      {/* Trending Section */}
      <section className="px-6 max-w-screen-2xl mx-auto pb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <TrendingUp size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Trending Now</h2>
              <p className="text-sm text-slate-500">Most popular anime right now</p>
            </div>
          </div>
          <Link to="/trending" className="btn-ghost text-sm">
            View All
          </Link>
        </div>
        {trendingLoading ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {trendingData?.map((anime, i) => (
              <AnimeCard key={anime.mal_id} anime={anime} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Genres Section */}
      <section className="px-6 max-w-screen-2xl mx-auto pb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Browse by Genre</h2>
              <p className="text-sm text-slate-500">Explore anime by your favorite genres</p>
            </div>
          </div>
          <Link to="/genres" className="btn-ghost text-sm">
            All Genres
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {genres?.map((genre, i) => (
            <GenreCard key={genre.mal_id} genre={genre} index={i} />
          ))}
        </div>
      </section>

      {/* Upcoming Section */}
      {upcomingData?.length > 0 && (
        <section className="px-6 max-w-screen-2xl mx-auto pb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-tertiary/10 text-tertiary">
                <Clock size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Upcoming Releases</h2>
                <p className="text-sm text-slate-500">Anime coming soon</p>
              </div>
            </div>
            <Link to="/upcoming" className="btn-ghost text-sm">
              View All
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {upcomingData.map((anime, i) => (
              <AnimeCard key={anime.mal_id} anime={anime} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
