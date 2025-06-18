
export interface EventData {
  id: string;
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
}

export interface FavoriteEvent {
  userId: string;
  eventId: string;
}
