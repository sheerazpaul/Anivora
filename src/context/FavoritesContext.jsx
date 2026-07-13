import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('anivora-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('anivora-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (anime) => {
    setFavorites((prev) => {
      if (prev.find((a) => a.mal_id === anime.mal_id)) return prev;
      return [...prev, anime];
    });
  };

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((a) => a.mal_id !== id));
  };

  const isFavorite = (id) => favorites.some((a) => a.mal_id === id);

  const clearFavorites = () => setFavorites([]);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
