
-- Create enum for user status in Spanish
CREATE TYPE public.estado_usuario AS ENUM (
  'nuevo',
  'contactado', 
  'interesado',
  'bajo_contrato',
  'cliente',
  'inactivo'
);

-- Create enum for user source
CREATE TYPE public.fuente_usuario AS ENUM (
  'sitio_web',
  'referido',
  'redes_sociales',
  'publicidad',
  'evento',
  'otro'
);

-- Create comprehensive users management table
CREATE TABLE public.gestion_usuarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre_completo TEXT NOT NULL,
  email TEXT UNIQUE,
  telefono TEXT,
  estado estado_usuario NOT NULL DEFAULT 'nuevo',
  fuente fuente_usuario DEFAULT 'sitio_web',
  propiedad_interes TEXT,
  propiedad_interes_id UUID REFERENCES public.properties(id),
  presupuesto_min NUMERIC,
  presupuesto_max NUMERIC,
  notas TEXT,
  fecha_primer_contacto TIMESTAMP WITH TIME ZONE DEFAULT now(),
  fecha_ultimo_contacto TIMESTAMP WITH TIME ZONE DEFAULT now(),
  fecha_siguiente_seguimiento TIMESTAMP WITH TIME ZONE,
  agente_asignado TEXT,
  prioridad INTEGER DEFAULT 3 CHECK (prioridad >= 1 AND prioridad <= 5),
  tags TEXT[] DEFAULT '{}',
  historial_contactos JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for contact history
CREATE TABLE public.historial_contactos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES public.gestion_usuarios(id) ON DELETE CASCADE,
  tipo_contacto TEXT NOT NULL, -- 'llamada', 'email', 'whatsapp', 'reunion', etc.
  descripcion TEXT NOT NULL,
  resultado TEXT, -- 'exitoso', 'sin_respuesta', 'reagendar', etc.
  fecha_contacto TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  proximo_seguimiento TIMESTAMP WITH TIME ZONE,
  creado_por TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.gestion_usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historial_contactos ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access (you'll need to adjust based on your auth system)
CREATE POLICY "Admin can manage all users" 
  ON public.gestion_usuarios 
  FOR ALL 
  TO authenticated 
  USING (true);

CREATE POLICY "Admin can manage all contact history" 
  ON public.historial_contactos 
  FOR ALL 
  TO authenticated 
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_gestion_usuarios_estado ON public.gestion_usuarios(estado);
CREATE INDEX idx_gestion_usuarios_email ON public.gestion_usuarios(email);
CREATE INDEX idx_gestion_usuarios_fecha_seguimiento ON public.gestion_usuarios(fecha_siguiente_seguimiento);
CREATE INDEX idx_historial_contactos_usuario_id ON public.historial_contactos(usuario_id);
CREATE INDEX idx_historial_contactos_fecha ON public.historial_contactos(fecha_contacto);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_gestion_usuarios()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_gestion_usuarios_updated_at
    BEFORE UPDATE ON public.gestion_usuarios
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_gestion_usuarios();
