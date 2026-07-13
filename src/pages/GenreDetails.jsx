import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { animeApi } from '../api/animeApi';
import AnimeCard from '../components/AnimeCard';
import Pagination from '../components/Pagination';
import { SkeletonCard } from '../components/Skeletons';
import { ChevronRight, Sparkles } from 'lucide-react';

export default function GenreDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const genreName = searchParams.get('name') || 'Genre';
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['genre-anime', id, page],
    queryFn: () => animeApi.getAnimeByGenre(id, page),
    staleTime: 120000,
    retry: 2,
  });

  const animeList = data?.data?.data || [];
  const totalPages = data?.data?.pagination?.last_visible_page || 1;

  return (
    <div className="min-h-screen pt-20">
      <main className="pb-16 px-6 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
          <Link to="/categories?cat=genres" className="hover:text-primary transition-colors">By Genre</Link>
          <ChevronRight size={12} />
          <span className="text-slate-600 font-medium">{genreName}</span>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-500/10 to-rose-500/10 shadow-sm">
              <Sparkles size={24} className="text-pink-500" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">
                <span className="text-gradient">{genreName}</span>
              </h1>
              <p className="text-slate-400">Explore the best {genreName.toLowerCase()} anime</p>
            </div>
          </div>
        </motion.section>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : animeList.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {animeList.map((anime, i) => (
                <AnimeCard key={anime.mal_id} anime={anime} index={i} rank={i + 1 + (page - 1) * 25} />
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            />
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
              <Sparkles size={28} className="text-slate-300" />
            </div>
            <p className="text-lg font-semibold text-slate-600">No anime found</p>
            <p className="text-sm text-slate-400 mt-1">Try another genre</p>
          </div>
        )}
      </main>
    </div>
  );
}
