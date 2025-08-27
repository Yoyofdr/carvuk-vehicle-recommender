-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLA: customers (Clientes)
-- =====================================================
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  rut VARCHAR(20) UNIQUE,
  address TEXT,
  city VARCHAR(100),
  region VARCHAR(100),
  preferred_contact_method VARCHAR(50) DEFAULT 'email',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: vehicles (Vehículos)
-- =====================================================
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_version INTEGER UNIQUE NOT NULL, -- ID from AutoPress
  marca VARCHAR(255) NOT NULL,
  modelo VARCHAR(255) NOT NULL,
  version VARCHAR(255),
  ano INTEGER NOT NULL,
  generacion VARCHAR(255),
  carroceria VARCHAR(255),
  motor VARCHAR(255),
  combustible VARCHAR(255),
  transmision VARCHAR(255),
  puertas INTEGER,
  tipo VARCHAR(255),
  segmento VARCHAR(255),
  -- Precios y valuaciones
  precio_comercial NUMERIC(12,2),
  precio_historico NUMERIC(12,2),
  valor_comercial NUMERIC(12,2),
  valor_minimo NUMERIC(12,2),
  valor_maximo NUMERIC(12,2),
  fecha_tasacion DATE,
  -- Información fiscal
  ano_info_fiscal VARCHAR(10),
  tasacion_fiscal NUMERIC(12,2),
  permiso_circulacion NUMERIC(12,2),
  codigo_sii VARCHAR(50),
  -- Metadata
  mas_probable BOOLEAN DEFAULT FALSE,
  flujo_usados_habilitado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_vehicle_version UNIQUE (marca, modelo, version, ano)
);

-- =====================================================
-- TABLA: valuations (Tasaciones)
-- =====================================================
CREATE TABLE valuations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  precio_autopress NUMERIC(12,2) NOT NULL,
  precio_autopress_historico NUMERIC(12,2),
  valor_comercial NUMERIC(12,2) NOT NULL,
  valor_minimo NUMERIC(12,2),
  valor_maximo NUMERIC(12,2),
  fecha_tasacion DATE NOT NULL,
  moneda VARCHAR(10) DEFAULT 'CLP',
  fuente VARCHAR(50) DEFAULT 'AutoPress',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: customer_preferences (Preferencias del Cliente)
-- =====================================================
CREATE TABLE customer_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  -- Presupuesto
  payment_mode VARCHAR(20) DEFAULT 'cash', -- 'cash' or 'monthly'
  min_price NUMERIC(12,2),
  max_price NUMERIC(12,2),
  -- Preferencias de vehículo
  body_types TEXT[], -- Array de tipos de carrocería
  fuel_types TEXT[], -- Array de tipos de combustible
  transmission_types TEXT[], -- Array de tipos de transmisión
  brands TEXT[], -- Array de marcas preferidas
  -- Características deseadas
  features TEXT[], -- Array de características (economy, space, performance, etc.)
  doors_min INTEGER,
  doors_max INTEGER,
  segment VARCHAR(255),
  vehicle_type VARCHAR(255),
  -- Uso previsto
  primary_use VARCHAR(100), -- 'city', 'highway', 'mixed'
  passengers_needed INTEGER,
  cargo_priority BOOLEAN DEFAULT FALSE,
  -- Metadata
  search_name VARCHAR(255), -- Nombre personalizado para esta búsqueda
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =====================================================
-- TABLA: leads (Prospectos/Leads)
-- =====================================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id),
  preference_id UUID REFERENCES customer_preferences(id),
  -- Estado del lead
  lead_status VARCHAR(50) DEFAULT 'new', -- new, contacted, qualified, negotiation, won, lost
  lead_source VARCHAR(100), -- 'discovery', 'direct_search', 'comparison', etc.
  lead_score INTEGER DEFAULT 0, -- 0-100 scoring de calidad
  -- Información de contacto
  contact_date DATE,
  contact_time TIME,
  contact_method VARCHAR(50), -- 'email', 'phone', 'whatsapp'
  -- Seguimiento
  follow_up_date DATE,
  follow_up_notes TEXT,
  last_contact_date TIMESTAMP,
  contact_attempts INTEGER DEFAULT 0,
  -- Asignación
  sales_rep_id UUID,
  sales_rep_name VARCHAR(255),
  -- Resultado
  won_date DATE,
  lost_reason VARCHAR(255),
  final_price NUMERIC(12,2),
  commission_amount NUMERIC(12,2),
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: lead_interactions (Interacciones con Leads)
-- =====================================================
CREATE TABLE lead_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  interaction_type VARCHAR(50), -- 'email', 'call', 'meeting', 'test_drive', 'quote'
  interaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  outcome VARCHAR(100), -- 'successful', 'no_answer', 'rescheduled', etc.
  next_action VARCHAR(255),
  created_by VARCHAR(255)
);

-- =====================================================
-- TABLA: quotes (Cotizaciones)
-- =====================================================
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id),
  -- Precios
  base_price NUMERIC(12,2),
  discount_amount NUMERIC(12,2),
  final_price NUMERIC(12,2),
  -- Financiamiento
  financing_option VARCHAR(100),
  down_payment NUMERIC(12,2),
  monthly_payment NUMERIC(12,2),
  interest_rate NUMERIC(5,2),
  term_months INTEGER,
  -- Estado
  quote_status VARCHAR(50) DEFAULT 'active', -- 'active', 'expired', 'accepted', 'rejected'
  valid_until DATE,
  -- Extras
  includes_insurance BOOLEAN DEFAULT FALSE,
  includes_warranty BOOLEAN DEFAULT FALSE,
  additional_services TEXT[],
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: search_history (Historial de Búsquedas)
-- =====================================================
CREATE TABLE search_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  search_filters JSONB NOT NULL, -- Almacena todos los filtros usados
  results_count INTEGER,
  selected_vehicles UUID[], -- Array de vehicle_ids que vio
  search_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: favorites (Vehículos Favoritos)
-- =====================================================
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_customer_vehicle_favorite UNIQUE (customer_id, vehicle_id)
);

-- =====================================================
-- TABLA: comparisons (Comparaciones de Vehículos)
-- =====================================================
CREATE TABLE comparisons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  vehicle_ids UUID[] NOT NULL, -- Array de vehicle_ids comparados
  comparison_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  winner_vehicle_id UUID REFERENCES vehicles(id),
  comparison_notes TEXT
);

-- =====================================================
-- ÍNDICES para optimización
-- =====================================================
CREATE INDEX idx_vehicles_marca_modelo ON vehicles(marca, modelo);
CREATE INDEX idx_vehicles_precio ON vehicles(precio_comercial);
CREATE INDEX idx_vehicles_carroceria ON vehicles(carroceria);
CREATE INDEX idx_vehicles_combustible ON vehicles(combustible);
CREATE INDEX idx_vehicles_ano ON vehicles(ano);

CREATE INDEX idx_customer_preferences_customer ON customer_preferences(customer_id);
CREATE INDEX idx_customer_preferences_active ON customer_preferences(is_active);

CREATE INDEX idx_leads_customer ON leads(customer_id);
CREATE INDEX idx_leads_vehicle ON leads(vehicle_id);
CREATE INDEX idx_leads_status ON leads(lead_status);
CREATE INDEX idx_leads_created ON leads(created_at);

CREATE INDEX idx_search_history_customer ON search_history(customer_id);
CREATE INDEX idx_search_history_date ON search_history(search_date);

CREATE INDEX idx_favorites_customer ON favorites(customer_id);
CREATE INDEX idx_favorites_vehicle ON favorites(vehicle_id);

-- =====================================================
-- TRIGGERS para updated_at automático
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_preferences_updated_at BEFORE UPDATE ON customer_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();