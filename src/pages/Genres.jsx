import { useQuery } from '@tanstack/react-query';
import { animeApi } from '../api/animeApi';
import GenreCard from '../components/GenreCard';
import { Spinner } from '../components/Skeletons';
import { Sparkles } from 'lucide-react';

export default function Genres() {
  const { data: genres, isLoading } = useQuery({
    queryKey: ['all-genres'],
    queryFn: () => animeApi.getGenres(),
    select: (res) => res.data.data,
    staleTime: 600000,
  });

  return (
    <div className="min-h-screen pt-20">
      <main className="pb-16 px-6 max-w-screen-2xl mx-auto">
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary">
              <Sparkles size={22} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">Genres</h1>
              <p className="text-slate-500">Explore anime by genre</p>
            </div>
          </div>
        </section>

        {isLoading ? <Spinner /> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {genres?.map((genre, i) => <GenreCard key={genre.mal_id} genre={genre} index={i} />)}
          </div>
        )}
      </main>
    </div>
  );
}
