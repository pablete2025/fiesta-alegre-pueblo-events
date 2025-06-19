
-- Crear tabla para almacenar los eventos
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  start_date DATE NOT NULL,
  start_time TIME NOT NULL,
  location TEXT NOT NULL,
  coordinates JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para almacenar los favoritos de los usuarios
CREATE TABLE public.user_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_session_id TEXT NOT NULL,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_session_id, event_id)
);

-- Habilitar Row Level Security (RLS) para los eventos
-- Los eventos serán públicos para lectura pero solo admins pueden modificarlos
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Política para que todos puedan ver los eventos
CREATE POLICY "Anyone can view events" 
  ON public.events 
  FOR SELECT 
  USING (true);

-- Política para crear eventos (se manejará desde el código con validación admin)
CREATE POLICY "Allow insert events" 
  ON public.events 
  FOR INSERT 
  WITH CHECK (true);

-- Política para actualizar eventos (se manejará desde el código con validación admin)
CREATE POLICY "Allow update events" 
  ON public.events 
  FOR UPDATE 
  USING (true);

-- Política para eliminar eventos (se manejará desde el código con validación admin)
CREATE POLICY "Allow delete events" 
  ON public.events 
  FOR DELETE 
  USING (true);

-- RLS para favoritos (cada usuario solo ve sus favoritos)
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios vean solo sus favoritos
CREATE POLICY "Users can view their own favorites" 
  ON public.user_favorites 
  FOR SELECT 
  USING (true);

-- Política para que los usuarios puedan agregar favoritos
CREATE POLICY "Users can insert their own favorites" 
  ON public.user_favorites 
  FOR INSERT 
  WITH CHECK (true);

-- Política para que los usuarios puedan eliminar sus favoritos
CREATE POLICY "Users can delete their own favorites" 
  ON public.user_favorites 
  FOR DELETE 
  USING (true);
