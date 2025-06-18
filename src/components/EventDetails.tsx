
import React from 'react';
import { EventData } from '../types/event';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Calendar, Clock, MapPin, Heart, ArrowLeft, Bell } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { toast } from '@/hooks/use-toast';

interface EventDetailsProps {
  event: EventData;
  onBack?: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, onBack }) => {
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

  const handleFavoriteClick = () => {
    toggleFavorite(event.id);
    toast({
      title: isFavorite(event.id) ? "Eliminado de favoritos" : "Agregado a favoritos",
      description: `${event.title} ${isFavorite(event.id) ? 'eliminado de' : 'agregado a'} tus eventos favoritos.`,
    });
  };

  const requestNotificationPermission = async () => {
    // Solo permitir notificaciones si el evento está marcado como favorito
    if (!isFavorite(event.id)) {
      toast({
        title: "Marca como favorito primero",
        description: "Debes marcar este evento como favorito para recibir notificaciones.",
        variant: "destructive"
      });
      return;
    }

    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast({
          title: "¡Perfecto!",
          description: "Recibirás notificaciones 30 minutos antes del evento favorito.",
        });
        
        // Programar notificación 30 minutos antes solo para eventos favoritos
        const eventDateTime = new Date(`${event.startDate}T${event.startTime}`);
        const notificationTime = new Date(eventDateTime.getTime() - 30 * 60 * 1000);
        const now = new Date();
        
        if (notificationTime > now) {
          const timeUntilNotification = notificationTime.getTime() - now.getTime();
          setTimeout(() => {
            if (isFavorite(event.id)) { // Verificar que siga siendo favorito
              new Notification('¡Atención!', {
                body: `El evento ${event.title} comenzará en 30 minutos en ${event.location}.`,
                icon: '/favicon.ico'
              });
            }
          }, timeUntilNotification);
        }
      } else {
        toast({
          title: "Notificaciones bloqueadas",
          description: "Activa las notificaciones en tu navegador para recibir alertas.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="festival-card">
        <CardHeader>
          <div className="flex items-center gap-4 mb-4">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                {event.title}
              </CardTitle>
              {!isUpcoming() && (
                <div className="inline-block bg-gray-500 text-white text-sm px-3 py-1 rounded-full">
                  Evento pasado
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-gray-700 leading-relaxed">
            {event.description}
          </div>
          
          <div className="grid gap-4">
            <div className="flex items-center p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
              <Calendar className="w-6 h-6 mr-3 text-green-600" />
              <div>
                <p className="font-semibold text-gray-800">Fecha</p>
                <p className="text-gray-600">{formatDate(event.startDate)}</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg">
              <Clock className="w-6 h-6 mr-3 text-emerald-600" />
              <div>
                <p className="font-semibold text-gray-800">Hora</p>
                <p className="text-gray-600">{formatTime(event.startTime)}</p>
              </div>
            </div>
            
            <div className="flex items-start p-3 bg-gradient-to-r from-teal-100 to-green-100 rounded-lg">
              <MapPin className="w-6 h-6 mr-3 text-teal-600 mt-1" />
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Ubicación</p>
                <p className="text-gray-600">{event.location}</p>
                {event.coordinates && (
                  <a 
                    href={`https://www.google.com/maps?q=${event.coordinates.lat},${event.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:underline text-sm mt-1 inline-block"
                  >
                    Ver en Google Maps →
                  </a>
                )}
              </div>
            </div>
          </div>
          
          {isUpcoming() && (
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleFavoriteClick}
                variant={isFavorite(event.id) ? "default" : "outline"}
                className={`flex-1 ${isFavorite(event.id) 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'border-green-600 text-green-600 hover:bg-green-50'
                }`}
              >
                <Heart className={`w-4 h-4 mr-2 ${isFavorite(event.id) ? 'fill-current' : ''}`} />
                {isFavorite(event.id) ? 'En Favoritos' : 'Agregar a Favoritos'}
              </Button>
              
              <Button
                onClick={requestNotificationPermission}
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                disabled={!isFavorite(event.id)}
              >
                <Bell className="w-4 h-4 mr-2" />
                Notificarme
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventDetails;
