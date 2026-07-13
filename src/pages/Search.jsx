import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { animeApi } from '../api/animeApi';
import SearchBar from '../components/SearchBar';
import AnimeCard from '../components/AnimeCard';
import Pagination from '../components/Pagination';
import { SkeletonCard, Spinner } from '../components/Skeletons';
import { Filter, Search, ArrowRight } from 'lucide-react';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['anime-search', query, page],
    queryFn: () => animeApi.getAnimeSearch(query, page),
    enabled: !!query,
    staleTime: 60000,
  });

  const totalPages = data?.data?.pagination?.last_visible_page || 1;

  const handlePageChange = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pt-20">
      <main className="pb-16 px-6 max-w-screen-2xl mx-auto">
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="hidden lg:block">
            <div className="glass-card rounded-2xl p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Filter size={16} className="text-primary" />
                <h3 className="font-semibold text-slate-700">Filters</h3>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Status
                  </label>
                  <select className="w-full bg-white text-slate-600 border border-indigo-100/60 rounded-full p-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                    <option value="">All</option>
                    <option value="airing">Airing</option>
                    <option value="complete">Completed</option>
                    <option value="upcoming">Upcoming</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Format
                  </label>
                  <div className="space-y-2">
                    {['TV', 'Movie', 'OVA', 'Special'].map((fmt) => (
                      <label key={fmt} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-indigo-200 text-primary focus:ring-primary/30" />
                        <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors">{fmt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button className="w-full btn-primary">
                  Apply Filters
                </button>
              </div>
            </div>
          </aside>

          <section className="lg:col-span-3">
            {query && (
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-indigo-100/60">
                <h2 className="text-lg font-semibold text-slate-700">
                  Results <span className="text-slate-400 font-normal">({data?.data?.pagination?.items?.total || 0})</span>
                </h2>
                {isFetching && <Spinner />}
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : data?.data?.data?.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {data.data.data.map((anime, i) => (
                    <AnimeCard key={anime.mal_id} anime={anime} index={i} />
                  ))}
                </div>
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
              </>
            ) : query ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                  <Filter size={28} className="text-slate-300" />
                </div>
                <p className="text-xl font-semibold text-slate-700 mb-1">No results found</p>
                <p className="text-slate-400">Try different keywords</p>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-primary/5 flex items-center justify-center mx-auto mb-4">
                  <Search size={28} className="text-primary" />
                </div>
                <p className="text-xl font-semibold text-slate-700 mb-1">Start searching</p>
                <p className="text-slate-400 mb-6">Find your next favorite anime</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['One Piece', 'Jujutsu Kaisen', 'Attack on Titan', 'Demon Slayer'].map((s) => (
                    <a
                      key={s}
                      href={`/search?q=${encodeURIComponent(s)}`}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium bg-white text-slate-600 border border-indigo-100/60 hover:border-primary/30 hover:text-primary hover:shadow-sm transition-all"
                    >
                      {s}
                      <ArrowRight size={12} />
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
