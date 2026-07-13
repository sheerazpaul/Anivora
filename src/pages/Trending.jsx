import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { animeApi } from '../api/animeApi';
import AnimeCard from '../components/AnimeCard';
import Pagination from '../components/Pagination';
import { SkeletonCard } from '../components/Skeletons';
import { TrendingUp } from 'lucide-react';

const filters = [
  { value: '', label: 'All Time' },
  { value: 'airing', label: 'Airing' },
  { value: 'movie', label: 'Movies' },
  { value: 'tv', label: 'TV' },
  { value: 'ova', label: 'OVA' },
];

export default function Trending() {
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['trending', filter, page],
    queryFn: () => animeApi.getTopAnime(filter, page),
    staleTime: 120000,
  });

  const totalPages = data?.data?.pagination?.last_visible_page || 1;

  return (
    <div className="min-h-screen pt-20">
      <main className="pb-16 px-6 max-w-screen-2xl mx-auto">
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <TrendingUp size={22} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">Trending</h1>
              <p className="text-slate-500">What's trending right now</p>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => { setFilter(f.value); setPage(1); }}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                filter === f.value
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-indigo-100/60 hover:border-primary/30 hover:text-primary'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {isLoading ? (
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
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
          </>
        )}
      </main>
    </div>
  );
}
