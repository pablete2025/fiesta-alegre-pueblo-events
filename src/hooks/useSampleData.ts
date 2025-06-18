
import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { sampleEvents } from '../data/sampleEvents';
import { EventData } from '../types/event';

export const useSampleData = () => {
  const [events, setEvents] = useLocalStorage<EventData[]>('festival_events', []);
  const [dataInitialized, setDataInitialized] = useLocalStorage('festival_data_initialized', false);

  useEffect(() => {
    if (!dataInitialized && events.length === 0) {
      setEvents(sampleEvents);
      setDataInitialized(true);
      console.log('Sample events loaded successfully');
    }
  }, [dataInitialized, events.length, setEvents, setDataInitialized]);

  return { dataInitialized };
};
