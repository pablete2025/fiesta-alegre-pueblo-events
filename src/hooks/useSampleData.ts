
import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { EventData } from '../types/event';

export const useSampleData = () => {
  const [events, setEvents] = useLocalStorage<EventData[]>('festival_events', []);
  const [dataInitialized, setDataInitialized] = useLocalStorage('festival_data_initialized', false);

  useEffect(() => {
    // Clear any existing sample data on first load
    if (!dataInitialized) {
      setEvents([]);
      setDataInitialized(true);
      console.log('Sample events cleared - only admins can add events now');
    }
  }, [dataInitialized, setEvents, setDataInitialized]);

  return { dataInitialized };
};
