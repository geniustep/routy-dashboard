export const SERVICE_TYPES = [
  { label: 'Local Delivery', value: 'local' },
  { label: 'Express Delivery', value: 'express' },
  { label: 'Scheduled Delivery', value: 'scheduled' },
]

export const SERVICE_REQUEST_STATES = [
  { label: 'Draft', value: 'draft', color: 'default' },
  { label: 'Confirmed', value: 'confirmed', color: 'blue' },
  { label: 'Assigned', value: 'assigned', color: 'orange' },
  { label: 'In Progress', value: 'in_progress', color: 'cyan' },
  { label: 'Delivered', value: 'delivered', color: 'green' },
  { label: 'Cancelled', value: 'cancelled', color: 'red' },
]

export const PARCEL_STATES = [
  { label: 'Pending', value: 'pending', color: 'default' },
  { label: 'Picked', value: 'picked', color: 'blue' },
  { label: 'In Transit', value: 'in_transit', color: 'cyan' },
  { label: 'Out for Delivery', value: 'out_for_delivery', color: 'orange' },
  { label: 'Delivered', value: 'delivered', color: 'green' },
  { label: 'Failed', value: 'failed', color: 'red' },
  { label: 'Returned', value: 'returned', color: 'purple' },
]

export const JOB_STATES = [
  { label: 'Assigned', value: 'assigned', color: 'default' },
  { label: 'Accepted', value: 'accepted', color: 'blue' },
  { label: 'In Progress', value: 'in_progress', color: 'cyan' },
  { label: 'Completed', value: 'completed', color: 'green' },
  { label: 'Failed', value: 'failed', color: 'red' },
  { label: 'Cancelled', value: 'cancelled', color: 'orange' },
]

export const JOB_TYPES = [
  { label: 'Pickup', value: 'pickup' },
  { label: 'Delivery', value: 'delivery' },
]

export const DRIVER_STATUSES = [
  { label: 'Online', value: 'online', color: 'success' },
  { label: 'Offline', value: 'offline', color: 'default' },
  { label: 'Busy', value: 'busy', color: 'warning' },
]

export const DEFAULT_MAP_CENTER = {
  lat: 33.5731,
  lng: -7.5898,
} // Casablanca

export const DEFAULT_MAP_ZOOM = 12

export const DATE_FORMAT = 'YYYY-MM-DD'
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm'
export const TIME_FORMAT = 'HH:mm'

export const PAGINATION_PAGE_SIZE = 20
export const PAGINATION_PAGE_SIZE_OPTIONS = ['10', '20', '50', '100']

export const CURRENCY = 'MAD'

export const API_TIMEOUT = 30000 // 30 seconds
export const WS_RECONNECT_INTERVAL = 5000 // 5 seconds
