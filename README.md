# Carvuk - Plataforma de Recomendación y Compra de Vehículos

Plataforma web moderna que ayuda a los usuarios a encontrar el vehículo perfecto según sus necesidades y presupuesto, conectándolos con concesionarios para obtener las mejores ofertas.

## 🚀 Características Principales

### Para Usuarios
- **Descubrimiento Inteligente**: Wizard interactivo que guía paso a paso para encontrar el vehículo ideal
- **Comparador de Precios**: Compara ofertas de múltiples concesionarios
- **Configurador de Vehículos**: Personalización en tiempo real con precios actualizados
- **Gestión de Ofertas**: Recibe y gestiona ofertas de concesionarios interesados
- **Catálogo Completo**: Exploración de vehículos nuevos y usados

### Para el Negocio
- **Generación de Leads**: Captura información cualificada de compradores potenciales
- **Conexión con Concesionarios**: Sistema de ofertas integrado
- **Analytics Integrado**: Tracking de comportamiento y preferencias

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Componentes UI**: shadcn/ui + Lucide Icons
- **Estado**: React Hooks + LocalStorage
- **Formularios**: Validación nativa HTML5
- **Despliegue**: Vercel-ready

## 📁 Estructura del Proyecto

```
├── app/
│   ├── page.tsx                    # Landing principal
│   ├── descubre/                   # Wizard de descubrimiento
│   │   ├── page.tsx                # Flujo paso a paso
│   │   └── resultados/page.tsx     # Resultados personalizados
│   ├── vehicles/                   # Catálogo de vehículos
│   │   ├── page.tsx                # Lista de vehículos
│   │   └── [id]/page.tsx           # Detalle de vehículo
│   ├── configurar/                 # Configurador
│   │   └── page.tsx                # Personalización del vehículo
│   ├── solicitar-ofertas/          # Formulario de solicitud
│   ├── mis-ofertas/                # Gestión de ofertas recibidas
│   ├── valuation/                  # Tasación de vehículos
│   └── insurance/                  # Comparador de seguros
├── components/
│   ├── ui/                         # Componentes base
│   ├── VehicleCard.tsx            # Tarjeta de vehículo
│   ├── Toaster.tsx                # Sistema de notificaciones
│   └── ...
├── lib/
│   ├── utils/                      # Utilidades
│   │   ├── cn.ts                  # Class names helper
│   │   └── currency.ts            # Formato de moneda
│   └── data/                       # Datos mock
└── public/                         # Assets estáticos
```

## 🚦 Instalación y Configuración

### Requisitos Previos
- Node.js 18+ 
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/carvuk.git
cd carvuk
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno** (opcional)
```bash
cp .env.example .env.local
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

5. **Abrir en el navegador**
```
http://localhost:3000
```

## 📝 Scripts Disponibles

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run start      # Servidor de producción
npm run lint       # Linter de código
npm run format     # Formatear código con Prettier
```

## 🎯 Flujos de Usuario

### 1. Descubrimiento de Vehículos (`/descubre`)
El usuario completa un wizard de 5 pasos:
1. **Presupuesto**: Define rango de precio (mensual o contado)
2. **Tipo de Carrocería**: SUV, Sedán, Hatchback, etc.
3. **Combustible**: Bencina, Diésel, Híbrido, Eléctrico
4. **Características**: Economía, espacio, tecnología, etc.
5. **Marca**: Preferencia de marca (opcional)

### 2. Configuración (`/configurar`)
- Selección de motor y versión
- Elección de color exterior
- Añadir equipamiento opcional
- Ver precio final actualizado

### 3. Solicitud de Ofertas (`/solicitar-ofertas`)
- Formulario de contacto
- Selección de concesionarios
- Envío de solicitud

### 4. Gestión de Ofertas (`/mis-ofertas`)
- Ver ofertas recibidas
- Comparar precios y condiciones
- Aceptar o rechazar ofertas

## 🎨 Sistema de Diseño

### Colores
- **Brand**: `#5862F5` (Azul Carvuk)
- **Neutral**: Escala de grises
- **Semantic**: Success, Warning, Error

### Tipografía
- **Font**: System fonts para mejor rendimiento
- **Headings**: Bold, escala modular
- **Body**: Regular, legible

### Componentes
- Diseño consistente con bordes redondeados
- Sombras sutiles para profundidad
- Transiciones suaves
- Estados hover/active bien definidos

## 📱 Responsive Design

La aplicación es totalmente responsive:
- **Mobile First**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

## 🔐 Consideraciones de Seguridad

- Validación de inputs en cliente y servidor
- Sanitización de datos de usuario
- Protección CSRF en formularios
- Headers de seguridad configurados

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm ci --only=production
RUN npm run build
CMD ["npm", "start"]
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Propiedad de Carvuk. Todos los derechos reservados.

## 👥 Equipo

Desarrollado por **Rodrigo Fernández del Río**

---

Para más información, contactar a: [contacto@carvuk.com]