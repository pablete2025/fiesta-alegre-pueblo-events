
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useEvents } from '../hooks/useEvents';
import FestivalHeader from '../components/FestivalHeader';
import EventForm from '../components/EventForm';
import EventCard from '../components/EventCard';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Plus, Edit, Trash2, Calendar, Users, Heart } from 'lucide-react';
import { EventData } from '../types/event';
import { toast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';

const Admin = () => {
  const { isAdmin } = useAuth();
  const { events, deleteEvent } = useEvents();
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      deleteEvent(eventId);
      toast({
        title: "Evento eliminado",
        description: "El evento ha sido eliminado correctamente.",
      });
    }
  };

  const handleEditEvent = (event: EventData) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  const upcomingEvents = events.filter(event => {
    const eventDateTime = new Date(`${event.startDate}T${event.startTime}`);
    return eventDateTime > new Date();
  }).length;

  const totalEvents = events.length;

  return (
    <div className="min-h-screen">
      <FestivalHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Gestiona los eventos de las fiestas patronales</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="festival-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-festival-orange mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-800">{totalEvents}</p>
                  <p className="text-gray-600">Total Eventos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="festival-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-festival-blue mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-800">{upcomingEvents}</p>
                  <p className="text-gray-600">Próximos Eventos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="festival-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Heart className="w-8 h-8 text-festival-red mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {Math.floor(Math.random() * 50) + 20}
                  </p>
                  <p className="text-gray-600">Usuarios Activos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Section */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            {showForm ? (editingEvent ? 'Editar Evento' : 'Crear Nuevo Evento') : 'Lista de Eventos'}
          </h2>
          
          {!showForm && (
            <Button 
              onClick={() => setShowForm(true)}
              className="festival-button"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Evento
            </Button>
          )}
        </div>

        {/* Form or Events List */}
        {showForm ? (
          <EventForm 
            event={editingEvent}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        ) : (
          <div>
            {events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events
                  .sort((a, b) => {
                    const dateA = new Date(`${a.startDate}T${a.startTime}`);
                    const dateB = new Date(`${b.startDate}T${b.startTime}`);
                    return dateB.getTime() - dateA.getTime();
                  })
                  .map((event) => (
                    <div key={event.id} className="relative">
                      <EventCard 
                        event={event} 
                        showFavorite={false}
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditEvent(event)}
                          className="bg-white/80 hover:bg-white"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteEvent(event.id)}
                          className="bg-white/80 hover:bg-white text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <Card className="festival-card">
                <CardContent className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No hay eventos creados
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Comienza agregando el primer evento de las fiestas patronales
                  </p>
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="festival-button"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Primer Evento
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
