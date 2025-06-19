
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Generate a unique session ID for this browser/device if it doesn't exist
const getSessionId = () => {
  let sessionId = localStorage.getItem('festival_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('festival_session_id', sessionId);
  }
  return sessionId;
};

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const sessionId = getSessionId();

  // Load favorites from Supabase on component mount
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('event_id')
        .eq('user_session_id', sessionId);

      if (error) throw error;

      const favoriteIds = data.map(item => item.event_id);
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Error loading favorites:', error);
      // Fallback to localStorage if Supabase fails
      const localFavorites = localStorage.getItem('festival_favorites');
      if (localFavorites) {
        setFavorites(JSON.parse(localFavorites));
      }
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_session_id: sessionId,
          event_id: eventId
        });

      if (error) throw error;

      setFavorites(prev => [...prev, eventId]);
      
      // Also update localStorage as backup
      const updatedFavorites = [...favorites, eventId];
      localStorage.setItem('festival_favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error adding favorite:', error);
      // Fallback to localStorage
      setFavorites(prev => [...prev, eventId]);
      localStorage.setItem('festival_favorites', JSON.stringify([...favorites, eventId]));
    }
  };

  const removeFavorite = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_session_id', sessionId)
        .eq('event_id', eventId);

      if (error) throw error;

      setFavorites(prev => prev.filter(id => id !== eventId));
      
      // Also update localStorage as backup
      const updatedFavorites = favorites.filter(id => id !== eventId);
      localStorage.setItem('festival_favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error removing favorite:', error);
      // Fallback to localStorage
      setFavorites(prev => prev.filter(id => id !== eventId));
      localStorage.setItem('festival_favorites', JSON.stringify(favorites.filter(id => id !== eventId)));
    }
  };

  const isFavorite = (eventId: string) => {
    return favorites.includes(eventId);
  };

  const toggleFavorite = async (eventId: string) => {
    if (isFavorite(eventId)) {
      await removeFavorite(eventId);
    } else {
      await addFavorite(eventId);
    }
  };

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite
  };
};
