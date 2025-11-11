# Getting Started with Routy Dashboard

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

The project is already configured to connect to `routy.propanel.ma`.

Environment files are located at:
- `.env.development` - for development
- `.env.production` - for production

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Login

Access the login page and use your Odoo credentials:
- URL: `http://localhost:5173/login`
- Database: `routy_db` (configured in .env)
- Username: Your Odoo username
- Password: Your Odoo password

## Project Structure

```
src/
├── api/                    # API Layer
│   ├── odoo/
│   │   └── client.ts      # Odoo JSON-RPC client
│   └── services/          # Service-specific API calls
│       ├── serviceRequestService.ts
│       ├── parcelService.ts
│       ├── jobService.ts
│       ├── driverService.ts
│       └── trackingService.ts
│
├── stores/                # Pinia State Management
│   ├── auth.ts           # Authentication state
│   ├── serviceRequests.ts
│   ├── parcels.ts
│   ├── jobs.ts
│   ├── drivers.ts
│   └── tracking.ts
│
├── views/                # Page Components
│   ├── Auth/
│   ├── Dashboard/
│   ├── ServiceRequests/
│   ├── Parcels/
│   ├── Jobs/
│   ├── Drivers/
│   ├── Tracking/
│   ├── Reports/
│   └── Settings/
│
├── components/           # Reusable Components
│   └── (to be added)
│
├── composables/          # Vue Composables
│   ├── useServiceRequests.ts
│   ├── useTracking.ts
│   └── useNotification.ts
│
├── types/                # TypeScript Types
│   ├── models/          # Data models
│   ├── api.ts           # API types
│   └── common.ts        # Common types
│
└── utils/               # Utility Functions
    ├── date.ts
    ├── format.ts
    ├── validators.ts
    └── constants.ts
```

## Available Features

### ✅ Completed

1. **Authentication System**
   - Login with Odoo credentials
   - Session management
   - Protected routes

2. **Dashboard**
   - KPI cards (Requests, Deliveries, Success Rate, Revenue)
   - Delivery trends chart
   - Status distribution chart
   - Recent activities

3. **Service Requests**
   - List all requests with filtering
   - Create new requests
   - View detailed information
   - Confirm/Cancel requests
   - Status tracking

4. **Layout & Navigation**
   - Responsive sidebar menu
   - Header with notifications
   - User profile menu
   - Route-based navigation

### 🚧 In Progress (Placeholder Views)

- Parcels Management
- Jobs Management
- Drivers Management
- Live GPS Tracking
- Reports & Analytics
- Settings

## Key Technologies

### Core
- **Vue 3.4+** with Composition API
- **TypeScript 5+** for type safety
- **Vite 5** for fast development

### UI & Styling
- **Ant Design Vue 4** - UI component library
- **Tailwind CSS 3** - Utility-first CSS

### State & Data
- **Pinia** - State management
- **TanStack Query** - Server state management
- **Axios** - HTTP client

### Visualization
- **ECharts** - Charts and graphs
- **Leaflet** - Maps (prepared for tracking)

### Real-time
- **Socket.io Client** - WebSocket for live tracking (prepared)

## API Integration

### Odoo JSON-RPC

The dashboard communicates with Odoo 18 backend using JSON-RPC protocol:

```typescript
// Example: Fetch service requests
const requests = await odooClient.search(
  'routy.service_request',
  [['state', '=', 'confirmed']],
  ['name', 'customer_id', 'state']
)
```

### Available Services

1. **serviceRequestService** - Service request operations
2. **parcelService** - Parcel tracking
3. **jobService** - Job management
4. **driverService** - Driver information
5. **trackingService** - GPS tracking

## Development Guidelines

### Adding a New Page

1. Create view in `src/views/[Module]/`
2. Add route in `src/router/index.ts`
3. Add menu item in `src/layouts/DefaultLayout.vue`

### Creating a Service

1. Define types in `src/types/models/`
2. Create service in `src/api/services/`
3. Create store in `src/stores/`
4. Create composable in `src/composables/`

### State Management

Use Pinia stores for global state and TanStack Query for server state:

```typescript
// Store for global state
const authStore = useAuthStore()

// Composable for server state
const { serviceRequests, isLoading } = useServiceRequests()
```

## Building for Production

```bash
# Build
npm run build

# Preview build
npm run preview
```

The build output will be in `dist/` directory.

## Troubleshooting

### Cannot connect to API

- Verify `.env.development` has correct `VITE_API_URL`
- Check if Odoo backend is accessible
- Verify CORS settings on backend

### Authentication fails

- Verify database name in `.env`
- Check username and password
- Ensure user has proper access rights in Odoo

### Dependencies installation issues

- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## Next Steps

1. **Complete remaining views**
   - Implement Parcels list and details
   - Implement Jobs kanban view
   - Implement Drivers list with performance metrics
   - Implement Live Tracking with Leaflet maps
   - Implement Reports with more charts

2. **Add real-time features**
   - WebSocket connection for tracking
   - Real-time notifications
   - Live status updates

3. **Enhance UI/UX**
   - Add loading states
   - Improve error handling
   - Add more animations
   - Mobile responsiveness

4. **Testing**
   - Unit tests with Vitest
   - E2E tests with Playwright
   - API integration tests

## Support

For questions or issues:
- Check the main README.md
- Contact the development team
- Review Odoo API documentation

## License

Proprietary - All rights reserved
