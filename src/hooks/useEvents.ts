
import { useState, useEffect } from 'react';
import { EventData } from '../types/event';
import { useLocalStorage } from './useLocalStorage';

export const useEvents = () => {
  const [events, setEvents] = useLocalStorage<EventData[]>('festival_events', []);
  const [loading, setLoading] = useState(false);

  const addEvent = (eventData: Omit<EventData, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEvent: EventData = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  };

  const updateEvent = (id: string, eventData: Partial<EventData>) => {
    setEvents(prev => prev.map(event => 
      event.id === id 
        ? { ...event, ...eventData, updatedAt: new Date().toISOString() }
        : event
    ));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const getEventById = (id: string) => {
    return events.find(event => event.id === id);
  };

  const getUpcomingEvents = () => {
    const now = new Date();
    return events
      .filter(event => {
        const eventDateTime = new Date(`${event.startDate}T${event.startTime}`);
        return eventDateTime > now;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.startDate}T${a.startTime}`);
        const dateB = new Date(`${b.startDate}T${b.startTime}`);
        return dateA.getTime() - dateB.getTime();
      });
  };

  return {
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    getUpcomingEvents
  };
};
