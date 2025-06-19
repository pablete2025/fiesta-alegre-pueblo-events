
import { useState, useEffect } from 'react';
import { EventData } from '../types/event';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useEvents = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(false);

  // Load events from Supabase on component mount
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;

      const formattedEvents: EventData[] = data.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        startDate: event.start_date,
        startTime: event.start_time,
        location: event.location,
        coordinates: event.coordinates,
        createdAt: event.created_at,
        updatedAt: event.updated_at
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error loading events:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los eventos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (eventData: Omit<EventData, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          title: eventData.title,
          description: eventData.description,
          start_date: eventData.startDate,
          start_time: eventData.startTime,
          location: eventData.location,
          coordinates: eventData.coordinates
        })
        .select()
        .single();

      if (error) throw error;

      const newEvent: EventData = {
        id: data.id,
        title: data.title,
        description: data.description,
        startDate: data.start_date,
        startTime: data.start_time,
        location: data.location,
        coordinates: data.coordinates,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      setEvents(prev => [newEvent, ...prev]);
      return newEvent;
    } catch (error) {
      console.error('Error adding event:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el evento",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateEvent = async (id: string, eventData: Partial<EventData>) => {
    try {
      const updateData: any = {};
      if (eventData.title !== undefined) updateData.title = eventData.title;
      if (eventData.description !== undefined) updateData.description = eventData.description;
      if (eventData.startDate !== undefined) updateData.start_date = eventData.startDate;
      if (eventData.startTime !== undefined) updateData.start_time = eventData.startTime;
      if (eventData.location !== undefined) updateData.location = eventData.location;
      if (eventData.coordinates !== undefined) updateData.coordinates = eventData.coordinates;

      const { data, error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedEvent: EventData = {
        id: data.id,
        title: data.title,
        description: data.description,
        startDate: data.start_date,
        startTime: data.start_time,
        location: data.location,
        coordinates: data.coordinates,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      setEvents(prev => prev.map(event => 
        event.id === id ? updatedEvent : event
      ));
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el evento",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEvents(prev => prev.filter(event => event.id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el evento",
        variant: "destructive"
      });
      throw error;
    }
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
    getUpcomingEvents,
    refreshEvents: loadEvents
  };
};
