// ============================================
// Theme Types
// ============================================

export type ThemeMode = 'light' | 'dark';

export interface ThemePalette {
  bg: string;
  surface: string;
  surfaceInput: string;
  surfaceSubtle: string;
  surfaceHover: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  muted: string;
  border: string;
  borderLight: string;
  separator: string;
  accent: string;
  accentDark: string;
  accentGlow: string;
}

export const THEME_PALETTES: Record<ThemeMode, ThemePalette> = {
  light: {
    bg: '#F8F9FA',           // Pearl White
    surface: '#FFFFFF',       // Pure White
    surfaceInput: '#E5E7EB',
    surfaceSubtle: '#EFEFEF', // Visible subtle bg on light
    surfaceHover: '#E5E5E5',  // Hover state
    text: '#1A202C',          // Deep Slate
    textSecondary: '#718096', // Cool Grey
    textMuted: '#9CA3AF',     // Labels, captions
    muted: '#9CA3AF',
    border: 'rgba(0, 0, 0, 0.05)',
    borderLight: 'rgba(0, 0, 0, 0.1)',
    separator: 'rgba(0, 0, 0, 0.08)',
    accent: '#008080',        // Thai Teal (default, overridable by primaryColor)
    accentDark: '#006666',
    accentGlow: 'rgba(0, 128, 128, 0.2)',
  },
  dark: {
    bg: '#0F172A',            // Midnight Ocean
    surface: '#1E293B',       // Deep Navy
    surfaceInput: '#334155',
    surfaceSubtle: 'rgba(255, 255, 255, 0.05)', // Subtle bg on dark
    surfaceHover: 'rgba(255, 255, 255, 0.1)',   // Hover state
    text: '#F1F5F9',          // Cloud Grey
    textSecondary: '#94A3B8', // Muted Blue
    textMuted: 'rgba(255, 255, 255, 0.4)',      // Labels, captions
    muted: '#64748B',
    border: 'rgba(255, 255, 255, 0.05)',
    borderLight: 'rgba(255, 255, 255, 0.1)',
    separator: 'rgba(255, 255, 255, 0.1)',
    accent: '#2DD4BF',        // Bright Aqua (default, overridable by primaryColor)
    accentDark: '#14B8A6',
    accentGlow: 'rgba(45, 212, 191, 0.3)',
  },
};

// ============================================
// Settings Types
// ============================================

export interface WiFiSettings {
  name: string;
  password: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
}

export interface CategoryImages {
  food?: string;
  activities?: string;
  services?: string;
  bars?: string;
}

// TinaCMS Settings Structure
export interface TinaSettings {
  hostelName: string;
  logo?: string;
  branding?: {
    primaryColor?: string;
    accentColor?: string;
  };
  wifi?: {
    networkName: string;
    password: string;
  };
  checkTimes?: {
    checkIn?: string;
    checkOut?: string;
  };
  contacts?: {
    whatsapp?: string;
    emergencyLocal?: string;
    emergencyAmbulance?: string;
  };
  timezone?: string;
}

// Legacy Settings (backward compatibility)
export interface Settings {
  hostelName: string;
  logo: string;
  theme?: ThemeMode;
  primaryColor?: string;
  accentColor?: string;
  wifi: WiFiSettings;
  checkIn: string;
  checkOut: string;
  contactWhatsApp: string;
  whatsapp?: string; // TinaCMS compatibility
  contacts?: TinaSettings['contacts']; // TinaCMS compatibility
  emergencyContacts: EmergencyContact[];
  timezone: string;
  heroImage?: string;
  categoryImages?: CategoryImages;
  // PWA assets
  favicon?: string;
  pwaIcon192?: string;
  pwaIcon512?: string;
  // Onboarding & guest data
  whatsappGroupLink?: string;
  webhookUrl?: string;
  googleReviewUrl?: string;
  hostelworldReviewUrl?: string;
  bookingReviewUrl?: string;
}

// ============================================
// Spot Types
// ============================================

export interface Coordinates {
  lat: number;
  lng: number;
}

export type CuisineType =
  | 'thai'
  | 'western'
  | 'japanese'
  | 'chinese'
  | 'indian'
  | 'italian'
  | 'mexican'
  | 'korean'
  | 'vietnamese'
  | 'vegetarian'
  | 'vegan'
  | 'seafood'
  | 'street-food'
  | 'cafe'
  | 'other';

export type BarType =
  | 'cocktail'
  | 'beer'
  | 'wine'
  | 'rooftop'
  | 'live-music'
  | 'sports'
  | 'club'
  | 'lounge'
  | 'pub'
  | 'other';

export type PriceRange = '€' | '€€' | '€€€';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface OpeningHoursDetailed {
  default: string; // e.g., "11:30-22:00"
  exceptions?: Partial<Record<DayOfWeek, string>>; // e.g., { monday: "closed", sunday: "12:00-20:00" }
}

export interface Spot {
  id: string;
  name: string;
  description: string;
  cuisineType?: CuisineType;
  barType?: BarType;
  priceRange?: PriceRange;
  image?: string;
  address?: string;
  coordinates?: Coordinates;
  location?: Coordinates; // Alias for PagesCMS compatibility
  phone?: string;
  openingHours?: string | OpeningHoursDetailed; // Support both simple and detailed format
  tags?: string[];
  // New properties for redesign
  tagline?: string;
  rating?: string;
  walkingDistance?: string;
  isHotelService?: boolean;
}

export interface SpotsFile {
  spots: Spot[];
}

export type SpotCategory = 'restaurants' | 'services' | 'transport' | 'bars';

// ============================================
// Event/Activity Types
// ============================================

export type ActivityType = 'food' | 'bars' | 'activities';

export type CTAType = 'whatsapp' | 'link';

export interface ActivityCTA {
  type: CTAType;
  label: string;
  url: string;
  message?: string;
}

// Activity: Reusable definition without date/time (library)
export interface Activity {
  id: string;
  title: string;
  tagline: string;
  description: string;
  type: ActivityType;
  location: string;
  lat?: number | null;
  lng?: number | null;
  image?: string | null;
  price: string | null;
  cta: ActivityCTA | null;
}

export interface ActivitiesFile {
  activities: Activity[];
}

// Schedule: Weekly recurring slots with times
export type ScheduleDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface ScheduleSlot {
  activityId: string;
  startTime: string | null; // "07:30" or null for All Day
  endTime: string | null;   // "08:15" or null
}

export type WeeklySchedule = Record<ScheduleDay, ScheduleSlot[]>;

export interface ScheduleFile {
  schedule: WeeklySchedule;
}

// Special Event: One-off event with specific date
export interface SpecialEvent {
  id: string;
  title: string;
  tagline: string;
  description: string;
  type: ActivityType;
  date: string; // YYYY-MM-DD
  startTime: string | null;
  endTime: string | null;
  location: string;
  lat?: number | null;
  lng?: number | null;
  image?: string | null;
  price: string | null;
  cta: ActivityCTA | null;
}

export interface SpecialEventsFile {
  events: SpecialEvent[];
}

// ScheduledEvent: Unified type for display (combines Activity + Schedule or SpecialEvent)
export interface ScheduledEvent {
  id: string;              // Unique: "activityId-YYYY-MM-DD" for recurring, or event.id for special
  title: string;
  tagline: string;
  description: string;
  type: ActivityType;
  date: string;            // Computed date YYYY-MM-DD
  startTime: string | null;
  endTime: string | null;
  location: string;
  lat?: number | null;
  lng?: number | null;
  image?: string | null;
  price: string | null;
  cta: ActivityCTA | null;
  isRecurring: boolean;    // true = from schedule, false = special event
  sourceId: string;        // Original activity/event ID for linking
}

// Legacy type aliases for backward compatibility
export type EventType = ActivityType;
export type EventCTA = ActivityCTA;

// ============================================
// Markdown Activities (Inspirational Content)
// ============================================

export interface MarkdownActivityFrontmatter {
  title: string;
  tagline: string;
  image?: string;
  order?: number;
}

export interface MarkdownActivity {
  slug: string;
  frontmatter: MarkdownActivityFrontmatter;
  content: string;
}

// ============================================
// Category Metadata
// ============================================

export interface CategoryMeta {
  slug: SpotCategory;
  name: string;
  emoji: string;
  description: string;
}

// ============================================
// TinaCMS Amenity Types (Hotel Services)
// ============================================

export type AmenityType =
  | 'Pool'
  | 'Spa & Massage'
  | 'Gym & Fitness'
  | 'Restaurant'
  | 'Bar & Lounge'
  | 'Rooftop'
  | 'Laundry Service'
  | 'Airport Shuttle'
  | 'Bike Rental'
  | 'Scooter Rental'
  | 'Tour Desk'
  | 'Coworking Space'
  | 'Kitchen'
  | 'Common Area'
  | 'Garden'
  | 'Parking'
  | 'Other';

export interface Amenity {
  id: string;
  name: string;
  description?: string;
  amenityType?: AmenityType;
  hours?: string;
  price?: string;
  location?: string;
  image?: string;
  details?: string; // Rich text
  isHighlighted?: boolean;
  tags?: string[];
}

export interface AmenitiesFile {
  amenities: Amenity[];
}

// ============================================
// TinaCMS Hotel Event Types
// ============================================

export interface HotelEventCTA {
  label?: string;
  type?: 'whatsapp' | 'link';
  whatsappMessage?: string;
  url?: string;
}

export interface HotelEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO date
  time?: string;
  location?: string;
  price?: string;
  image?: string;
  cta?: HotelEventCTA;
}

export interface HotelEventsFile {
  events: HotelEvent[];
}

// ============================================
// TinaCMS Explore Spot Types (External spots)
// ============================================

export interface ExploreSpot {
  id: string;
  name: string;
  description?: string;
  isHotelService?: boolean;
  linkedAmenityId?: string;
  cuisineType?: string;
  barType?: string;
  activityType?: string;
  serviceType?: string;
  transportType?: string;
  priceRange?: string;
  image?: string;
  address?: string;
  coordinates?: Coordinates;
  tags?: string[];
}

export interface ExploreSpotsFile {
  spots: ExploreSpot[];
}

export type ExploreCategory = 'restaurants' | 'bars' | 'activities' | 'transport' | 'laundry';
