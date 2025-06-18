
import { useLocalStorage } from './useLocalStorage';

export const useFavorites = () => {
  const [favorites, setFavorites] = useLocalStorage<string[]>('festival_favorites', []);

  const addFavorite = (eventId: string) => {
    setFavorites(prev => [...prev, eventId]);
  };

  const removeFavorite = (eventId: string) => {
    setFavorites(prev => prev.filter(id => id !== eventId));
  };

  const isFavorite = (eventId: string) => {
    return favorites.includes(eventId);
  };

  const toggleFavorite = (eventId: string) => {
    if (isFavorite(eventId)) {
      removeFavorite(eventId);
    } else {
      addFavorite(eventId);
    }
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite
  };
};
