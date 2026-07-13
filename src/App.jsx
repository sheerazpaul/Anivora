import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { WatchlistProvider } from './context/WatchlistContext';
import MainLayout from './layout/MainLayout';
import { PageLoader } from './components/Skeletons';

const Home = lazy(() => import('./pages/Home'));
const Search = lazy(() => import('./pages/Search'));
const AnimeDetails = lazy(() => import('./pages/AnimeDetails'));
const TopAnime = lazy(() => import('./pages/TopAnime'));
const Trending = lazy(() => import('./pages/Trending'));
const Genres = lazy(() => import('./pages/Genres'));
const GenreDetails = lazy(() => import('./pages/GenreDetails'));
const Airing = lazy(() => import('./pages/Airing'));
const Upcoming = lazy(() => import('./pages/Upcoming'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Watchlist = lazy(() => import('./pages/Watchlist'));
const Categories = lazy(() => import('./pages/Categories'));
const About = lazy(() => import('./pages/About'));
const NotFound = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <FavoritesProvider>
          <WatchlistProvider>
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/anime/:id" element={<AnimeDetails />} />
                    <Route path="/top-anime" element={<TopAnime />} />
                    <Route path="/trending" element={<Trending />} />
                    <Route path="/genres" element={<Genres />} />
                    <Route path="/genre/:id" element={<GenreDetails />} />
                    <Route path="/airing" element={<Airing />} />
                    <Route path="/upcoming" element={<Upcoming />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/watchlist" element={<Watchlist />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/about" element={<About />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </Suspense>
            </BrowserRouter>
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#ffffff',
                  color: '#0f172a',
                  borderRadius: '16px',
                  border: '1px solid rgba(99, 102, 241, 0.15)',
                  fontFamily: 'Geist',
                  boxShadow: '0 10px 40px rgba(99, 102, 241, 0.1)',
                },
              }}
            />
          </WatchlistProvider>
        </FavoritesProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
