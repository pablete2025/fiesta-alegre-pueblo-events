
import React from 'react';
import { EventData } from '../types/event';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Calendar, Clock, MapPin, Heart } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { toast } from '@/hooks/use-toast';

interface EventCardProps {
  event: EventData;
  onClick?: () => void;
  showFavorite?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick, showFavorite = true }) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const isUpcoming = () => {
    const eventDateTime = new Date(`${event.startDate}T${event.startTime}`);
    return eventDateTime > new Date();
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(event.id);
    toast({
      title: isFavorite(event.id) ? "Eliminado de favoritos" : "Agregado a favoritos",
      description: `${event.title} ${isFavorite(event.id) ? 'eliminado de' : 'agregado a'} tus eventos favoritos.`,
    });
  };

  return (
    <Card 
      className="festival-card cursor-pointer hover:scale-105 transform transition-all duration-300 animate-fade-in-up"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold text-gray-800 line-clamp-2">
            {event.title}
          </CardTitle>
          {showFavorite && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavoriteClick}
              className={`p-2 ${isFavorite(event.id) ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
            >
              <Heart className={`w-5 h-5 ${isFavorite(event.id) ? 'fill-current' : ''}`} />
            </Button>
          )}
        </div>
        {!isUpcoming() && (
          <div className="inline-block bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
            Evento pasado
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="text-gray-600 text-sm line-clamp-3">{event.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-700">
            <Calendar className="w-4 h-4 mr-2 text-festival-orange" />
            <span className="font-medium">{formatDate(event.startDate)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-700">
            <Clock className="w-4 h-4 mr-2 text-festival-red" />
            <span>{formatTime(event.startTime)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-700">
            <MapPin className="w-4 h-4 mr-2 text-festival-pink" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
