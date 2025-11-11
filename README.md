# Routy Dashboard

Smart Delivery Management System - Web Dashboard

## Features

- 📊 Real-time Dashboard with KPIs and Charts
- 📦 Service Requests Management
- 🚚 Parcel Tracking
- 👨‍💼 Driver Management
- 🗺️ Live GPS Tracking
- 📈 Reports and Analytics
- 🔐 Secure Authentication with Odoo 18

## Tech Stack

- **Frontend Framework**: Vue.js 3.4+ (Composition API)
- **Language**: TypeScript 5+
- **Build Tool**: Vite 5
- **UI Library**: Ant Design Vue 4
- **State Management**: Pinia
- **Data Fetching**: TanStack Query
- **Maps**: Leaflet
- **Charts**: ECharts
- **Real-time**: Socket.io
- **Backend**: Odoo 18 (JSON-RPC API)

## Project Structure

```
src/
├── api/              # API client and services
├── assets/           # Static assets and styles
├── components/       # Vue components
├── composables/      # Vue composables
├── layouts/          # Layout components
├── router/           # Vue Router configuration
├── stores/           # Pinia stores
├── types/            # TypeScript types
├── utils/            # Utility functions
└── views/            # Page views
```

## Prerequisites

- Node.js 18+ and npm
- Access to Routy Odoo 18 backend at routy.propanel.ma

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create `.env.development` and `.env.production` files:

```env
VITE_API_URL=https://routy.propanel.ma
VITE_ODOO_DB=routy_db
VITE_WS_URL=https://routy.propanel.ma
```

## Development

The development server runs on `http://localhost:5173`

Default credentials will be provided by your system administrator.

## Build

```bash
npm run build
```

The build output will be in the `dist/` directory.

## API Integration

The dashboard connects to Odoo 18 backend via JSON-RPC:

- Authentication: `/web/session/authenticate`
- Data operations: `/web/dataset/call_kw`

All API calls are managed through the `odooClient` service.

## Features Overview

### Dashboard
- KPI cards (Total Requests, Active Deliveries, Success Rate, Revenue)
- Delivery trends chart
- Status distribution pie chart
- Recent activities

### Service Requests
- List all service requests
- Filter by status, date range, customer
- Create new requests
- View detailed information
- Confirm/Cancel requests

### Parcels
- Track parcel status
- View delivery history
- Proof of delivery

### Jobs
- View driver jobs
- Job assignment
- Track job completion

### Drivers
- Driver management
- Performance metrics
- Active status tracking

### Live Tracking
- Real-time GPS tracking
- Vehicle locations on map
- Route visualization

### Reports
- Daily reports
- Driver performance
- Delivery analytics

## Contributing

This is a proprietary project. Contact the development team for contribution guidelines.

## License

Proprietary - All rights reserved

## Support

For support, contact the Routy development team.
