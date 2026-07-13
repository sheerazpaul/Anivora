import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { animeApi } from '../api/animeApi';
import AnimeCard from '../components/AnimeCard';
import Pagination from '../components/Pagination';
import { SkeletonCard } from '../components/Skeletons';

export default function GenreDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const genreName = searchParams.get('name') || 'Genre';
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['genre-anime', id, page],
    queryFn: () => animeApi.getAnimeByGenre(id, page),
    staleTime: 120000,
  });

  const totalPages = data?.data?.pagination?.last_visible_page || 1;

  return (
    <div className="min-h-screen pt-20">
      <main className="pb-16 px-6 max-w-screen-2xl mx-auto">
        <section className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">{genreName}</h1>
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
