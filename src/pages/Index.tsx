import React, { useState } from 'react';
import { useEvents } from '../hooks/useEvents';
import { useFavorites } from '../hooks/useFavorites';
import { useSampleData } from '../hooks/useSampleData';
import FestivalHeader from '../components/FestivalHeader';
import EventCard from '../components/EventCard';
import EventDetails from '../components/EventDetails';
import { Button } from '../components/ui/button';
import { Heart, Sparkles } from 'lucide-react';
import { EventData } from '../types/event';

const Index = () => {
  const { events, getUpcomingEvents } = useEvents();
  const { favorites } = useFavorites();
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  
  // Initialize sample data
  useSampleData();

  const upcomingEvents = getUpcomingEvents();
  const allEvents = events.sort((a, b) => {
    const dateA = new Date(`${a.startDate}T${a.startTime}`);
    const dateB = new Date(`${b.startDate}T${b.startTime}`);
    return dateB.getTime() - dateA.getTime();
  });

  const displayEvents = showOnlyFavorites 
    ? allEvents.filter(event => favorites.includes(event.id))
    : allEvents;

  const favoriteEvents = allEvents.filter(event => favorites.includes(event.id));

  if (selectedEvent) {
    return (
      <div className="min-h-screen">
        <FestivalHeader />
        <main className="container mx-auto px-4 py-8 pt-24">
          <EventDetails 
            event={selectedEvent} 
            onBack={() => setSelectedEvent(null)} 
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <FestivalHeader />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
            ¡VIVA PEDRAJA!
          </h2>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            Descubre todos los eventos de nuestras fiestas patronales. No te pierdas ni una sola celebración.
          </p>
          
          {upcomingEvents.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6 text-green-600 mr-2 animate-bounce-gentle" />
                <h3 className="text-xl font-semibold text-gray-800">Próximo Evento</h3>
                <Sparkles className="w-6 h-6 text-green-600 ml-2 animate-bounce-gentle" />
              </div>
              <div className="max-w-md mx-auto">
                <EventCard 
                  event={upcomingEvents[0]}
                  onClick={() => setSelectedEvent(upcomingEvents[0])}
                  showFavorite={false}
                />
              </div>
            </div>
          )}
        </div>

        {/* Filter Section - Only show if there are events */}
        {allEvents.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button
              onClick={() => setShowOnlyFavorites(false)}
              variant={!showOnlyFavorites ? "default" : "outline"}
              className={!showOnlyFavorites ? "festival-button" : ""}
            >
              Todos los Eventos ({allEvents.length})
            </Button>
            <Button
              onClick={() => setShowOnlyFavorites(true)}
              variant={showOnlyFavorites ? "default" : "outline"}
              className={`${showOnlyFavorites ? "bg-green-600 hover:bg-green-700 text-white" : "border-green-600 text-green-600 hover:bg-green-50"}`}
            >
              <Heart className="w-4 h-4 mr-2" />
              Mis Favoritos ({favoriteEvents.length})
            </Button>
          </div>
        )}

        {/* Events Grid */}
        {displayEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => setSelectedEvent(event)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            {showOnlyFavorites ? (
              <div>
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No tienes eventos favoritos
                </h3>
                <p className="text-gray-500 mb-4">
                  Marca algunos eventos como favoritos para verlos aquí
                </p>
                <Button 
                  onClick={() => setShowOnlyFavorites(false)}
                  className="festival-button"
                >
                  Ver Todos los Eventos
                </Button>
              </div>
            ) : (
              <div>
                <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Próximamente...
                </h3>
                <p className="text-gray-500">
                  Los eventos de las fiestas patronales aparecerán aquí cuando sean publicados por los organizadores
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
