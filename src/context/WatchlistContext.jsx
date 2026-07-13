import { createContext, useContext, useState, useEffect } from 'react';

const WatchlistContext = createContext();

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('anivora-watchlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('anivora-watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = (anime) => {
    setWatchlist((prev) => {
      if (prev.find((a) => a.mal_id === anime.mal_id)) return prev;
      return [...prev, { ...anime, addedAt: Date.now() }];
    });
  };

  const removeFromWatchlist = (id) => {
    setWatchlist((prev) => prev.filter((a) => a.mal_id !== id));
  };

  const isInWatchlist = (id) => watchlist.some((a) => a.mal_id === id);

  const clearWatchlist = () => setWatchlist([]);

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist, clearWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export const useWatchlist = () => useContext(WatchlistContext);
