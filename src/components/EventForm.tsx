
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { EventData } from '../types/event';
import { useEvents } from '../hooks/useEvents';
import { toast } from '@/hooks/use-toast';

interface EventFormProps {
  event?: EventData;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    location: '',
    coordinates: { lat: '', lng: '' }
  });
  const [loading, setLoading] = useState(false);
  const { addEvent, updateEvent } = useEvents();

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        startDate: event.startDate,
        startTime: event.startTime,
        location: event.location,
        coordinates: {
          lat: event.coordinates?.lat.toString() || '',
          lng: event.coordinates?.lng.toString() || ''
        }
      });
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        startTime: formData.startTime,
        location: formData.location,
        coordinates: formData.coordinates.lat && formData.coordinates.lng ? {
          lat: parseFloat(formData.coordinates.lat),
          lng: parseFloat(formData.coordinates.lng)
        } : undefined
      };

      if (event) {
        updateEvent(event.id, eventData);
        toast({
          title: "¡Evento actualizado!",
          description: "El evento ha sido actualizado correctamente.",
        });
      } else {
        addEvent(eventData);
        toast({
          title: "¡Evento creado!",
          description: "El evento ha sido agregado correctamente.",
        });
      }

      if (onSuccess) {
        onSuccess();
      }

      if (!event) {
        setFormData({
          title: '',
          description: '',
          startDate: '',
          startTime: '',
          location: '',
          coordinates: { lat: '', lng: '' }
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error al guardar el evento.",
        variant: "destructive"
      });
    }

    setLoading(false);
  };

  const handleChange = (field: string, value: string) => {
    if (field.startsWith('coordinates.')) {
      const coordField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          [coordField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return (
    <Card className="festival-card">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800">
          {event ? 'Editar Evento' : 'Crear Nuevo Evento'}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título del Evento *</Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Ej: Procesión de San Pedro"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe el evento, actividades, etc."
              rows={4}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startTime">Hora *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleChange('startTime', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Ubicación *</Label>
            <Input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Ej: Plaza Principal, Iglesia San Pedro"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lat">Latitud (opcional)</Label>
              <Input
                id="lat"
                type="number"
                step="any"
                value={formData.coordinates.lat}
                onChange={(e) => handleChange('coordinates.lat', e.target.value)}
                placeholder="Ej: -12.0464"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lng">Longitud (opcional)</Label>
              <Input
                id="lng"
                type="number"
                step="any"
                value={formData.coordinates.lng}
                onChange={(e) => handleChange('coordinates.lng', e.target.value)}
                placeholder="Ej: -77.0428"
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              className="flex-1 festival-button"
              disabled={loading}
            >
              {loading ? 'Guardando...' : (event ? 'Actualizar Evento' : 'Crear Evento')}
            </Button>
            
            {onCancel && (
              <Button 
                type="button" 
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EventForm;
