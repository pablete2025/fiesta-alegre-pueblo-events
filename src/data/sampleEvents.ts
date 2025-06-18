
import { EventData } from '../types/event';

export const sampleEvents: EventData[] = [
  {
    id: '1',
    title: 'Procesión de San Pedro',
    description: 'Tradicional procesión con la imagen de San Pedro por las calles principales del pueblo. Acompañada de música folklórica y danzas típicas.',
    startDate: '2024-06-29',
    startTime: '17:00',
    location: 'Iglesia San Pedro - Plaza Principal',
    coordinates: {
      lat: -12.0464,
      lng: -77.0428
    },
    createdAt: '2024-06-18T10:00:00Z',
    updatedAt: '2024-06-18T10:00:00Z'
  },
  {
    id: '2',
    title: 'Misa Solemne',
    description: 'Misa especial en honor a San Pedro Apóstol, patrono de nuestro pueblo. Celebrada por el párroco con invitados especiales.',
    startDate: '2024-06-29',
    startTime: '10:00',
    location: 'Iglesia San Pedro',
    coordinates: {
      lat: -12.0465,
      lng: -77.0430
    },
    createdAt: '2024-06-18T09:00:00Z',
    updatedAt: '2024-06-18T09:00:00Z'
  },
  {
    id: '3',
    title: 'Festival Gastronómico',
    description: 'Degustación de platos típicos preparados por las familias del pueblo. Incluye concurso de cocina tradicional y venta de comida.',
    startDate: '2024-06-30',
    startTime: '12:00',
    location: 'Plaza Principal',
    coordinates: {
      lat: -12.0464,
      lng: -77.0428
    },
    createdAt: '2024-06-18T11:00:00Z',
    updatedAt: '2024-06-18T11:00:00Z'
  },
  {
    id: '4',
    title: 'Concierto Folklórico',
    description: 'Presentación de grupos musicales locales y regionales. Danzas típicas y música tradicional para toda la familia.',
    startDate: '2024-06-30',
    startTime: '20:00',
    location: 'Escenario Plaza Principal',
    coordinates: {
      lat: -12.0464,
      lng: -77.0428
    },
    createdAt: '2024-06-18T12:00:00Z',
    updatedAt: '2024-06-18T12:00:00Z'
  },
  {
    id: '5',
    title: 'Fuegos Artificiales',
    description: 'Gran espectáculo de fuegos artificiales para cerrar las festividades. Evento familiar con vista panorámica desde la plaza.',
    startDate: '2024-06-30',
    startTime: '22:00',
    location: 'Plaza Principal',
    coordinates: {
      lat: -12.0464,
      lng: -77.0428
    },
    createdAt: '2024-06-18T13:00:00Z',
    updatedAt: '2024-06-18T13:00:00Z'
  }
];
