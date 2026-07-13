import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { animeApi } from '../api/animeApi';
import AnimeCard from '../components/AnimeCard';
import Pagination from '../components/Pagination';
import { SkeletonCard } from '../components/Skeletons';
import { Radio } from 'lucide-react';

export default function Airing() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ['airing', page],
    queryFn: () => animeApi.getTopAnime('airing', page),
    staleTime: 120000,
  });
  const totalPages = data?.data?.pagination?.last_visible_page || 1;

  return (
    <div className="min-h-screen pt-20">
      <main className="pb-16 px-6 max-w-screen-2xl mx-auto">
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-green-50 text-green-500">
              <Radio size={22} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">Currently Airing</h1>
              <p className="text-slate-500">Anime airing right now</p>
            </div>
          </div>
        </section>
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {data?.data?.data?.map((anime, i) => <AnimeCard key={anime.mal_id} anime={anime} index={i} />)}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
          </>
        )}
      </main>
    </div>
  );
}
