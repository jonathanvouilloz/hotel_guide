import type {
  Settings,
  TinaSettings,
  Spot,
  SpotCategory,
  CategoryMeta,
  Activity,
  ScheduleDay,
  ScheduleSlot,
  SpecialEvent,
  ScheduledEvent,
  MarkdownActivity,
  Amenity,
  AmenitiesFile,
  HotelEvent,
  HotelEventsFile,
  ExploreSpot,
  ExploreSpotsFile,
  ExploreCategory,
  CuisineType,
  BarType,
  PriceRange,
} from './types';

// ============================================
// Utilities
// ============================================

/**
 * Generate a URL-safe slug from a string
 * Example: "Thai Cooking Class" -> "thai-cooking-class"
 * Falls back to hash-based ID for non-Latin text (e.g., Thai names)
 */
function slugify(text: string): string {
  const slug = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')      // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '');         // Remove leading/trailing hyphens

  // Fallback for non-Latin text (generates a simple hash)
  if (!slug) {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `item-${Math.abs(hash).toString(36)}`;
  }

  return slug;
}

// ============================================
// Settings (TinaCMS structure)
// ============================================

let cachedSettings: Settings | null = null;

export async function getSettings(): Promise<Settings> {
  if (cachedSettings) {
    return cachedSettings;
  }

  // Load TinaCMS settings
  const tinaData = await import('../../content/settings/global.json');
  const data = tinaData.default as TinaSettings;

  // Convert TinaCMS settings to legacy format for compatibility
  cachedSettings = {
    hostelName: data.hostelName,
    logo: data.logo || '/images/logo.png',
    primaryColor: data.branding?.primaryColor,
    accentColor: data.branding?.accentColor,
    wifi: {
      name: data.wifi?.networkName || '',
      password: data.wifi?.password || '',
    },
    checkIn: data.checkTimes?.checkIn || '14:00',
    checkOut: data.checkTimes?.checkOut || '11:00',
    contactWhatsApp: data.contacts?.whatsapp || '',
    whatsapp: data.contacts?.whatsapp,
    contacts: data.contacts,
    emergencyContacts: [
      ...(data.contacts?.emergencyLocal ? [{ name: 'Tourist Police', phone: data.contacts.emergencyLocal }] : []),
      ...(data.contacts?.emergencyAmbulance ? [{ name: 'Ambulance', phone: data.contacts.emergencyAmbulance }] : []),
    ],
    timezone: data.timezone || 'Asia/Bangkok',
  };

  return cachedSettings;
}

// ============================================
// Spots (Legacy - redirects to TinaCMS Explore)
// ============================================

export async function getSpots(category: SpotCategory): Promise<Spot[]> {
  // Map legacy categories to new explore categories
  const categoryMap: Record<SpotCategory, ExploreCategory> = {
    'restaurants': 'restaurants',
    'services': 'laundry', // Old "services" was external laundry/services
    'transport': 'transport',
    'bars': 'bars',
  };

  const exploreCategory = categoryMap[category];
  const exploreSpots = await getExploreSpots(exploreCategory);

  // Convert ExploreSpot to legacy Spot format
  return exploreSpots.map((spot) => ({
    id: spot.id,
    name: spot.name,
    description: spot.description || '',
    cuisineType: spot.cuisineType as CuisineType | undefined,
    barType: spot.barType as BarType | undefined,
    priceRange: spot.priceRange as PriceRange | undefined,
    image: spot.image,
    address: spot.address,
    coordinates: spot.coordinates,
    location: spot.coordinates,
    tags: spot.tags,
  }));
}

export async function getSpotById(category: SpotCategory, id: string): Promise<Spot | undefined> {
  const spots = await getSpots(category);
  return spots.find((spot) => spot.id === id);
}

export async function getAllSpots(): Promise<Record<SpotCategory, Spot[]>> {
  const categories: SpotCategory[] = ['restaurants', 'services', 'transport', 'bars'];

  const results = await Promise.all(
    categories.map(async (category) => ({
      category,
      spots: await getSpots(category),
    }))
  );

  return results.reduce(
    (acc, { category, spots }) => {
      acc[category] = spots;
      return acc;
    },
    {} as Record<SpotCategory, Spot[]>
  );
}

export async function findSpotById(
  id: string
): Promise<{ spot: Spot; category: SpotCategory } | undefined> {
  const allSpots = await getAllSpots();

  for (const [category, spots] of Object.entries(allSpots)) {
    const spot = spots.find((s) => s.id === id);
    if (spot) {
      return { spot, category: category as SpotCategory };
    }
  }

  return undefined;
}

// ============================================
// Activities (Legacy - now using TinaCMS events)
// ============================================

export async function getActivities(): Promise<Activity[]> {
  // Legacy function - returns empty array
  // Use getHotelEvents() instead for TinaCMS structure
  return [];
}

export async function getActivityById(id: string): Promise<Activity | undefined> {
  const activities = await getActivities();
  return activities.find((a) => a.id === id);
}

// ============================================
// Schedule (Legacy - now using TinaCMS events)
// ============================================

export async function getSchedule(): Promise<Record<ScheduleDay, ScheduleSlot[]>> {
  // Legacy function - returns empty schedule
  // Use getHotelEvents() instead for TinaCMS structure
  return {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  };
}

// ============================================
// Special Events (Legacy - now using TinaCMS events)
// ============================================

export async function getSpecialEvents(): Promise<SpecialEvent[]> {
  // Legacy function - returns empty array
  // Use getHotelEvents() instead for TinaCMS structure
  return [];
}

export async function getSpecialEventById(id: string): Promise<SpecialEvent | undefined> {
  const events = await getSpecialEvents();
  return events.find((e) => e.id === id);
}

// ============================================
// Unified Scheduled Events (for /events page)
// ============================================

const SCHEDULE_DAYS: ScheduleDay[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

function getDayOfWeek(date: Date): ScheduleDay {
  return SCHEDULE_DAYS[date.getDay()];
}

function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Get all events for the next N days (combining schedule + special events)
 * This is the main function for the /events page
 */
export async function getUpcomingScheduledEvents(days: number = 7): Promise<ScheduledEvent[]> {
  const [activities, schedule, specialEvents] = await Promise.all([
    getActivities(),
    getSchedule(),
    getSpecialEvents(),
  ]);

  // Create a map for quick activity lookup
  const activityMap = new Map(activities.map((a) => [a.id, a]));

  const result: ScheduledEvent[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Generate events for each day
  for (let i = 0; i < days; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() + i);
    const dateStr = formatDateISO(currentDate);
    const dayOfWeek = getDayOfWeek(currentDate);

    // 1. Add recurring activities from schedule
    const slots = schedule[dayOfWeek] || [];
    for (const slot of slots) {
      const activity = activityMap.get(slot.activityId);
      if (activity) {
        result.push({
          id: `${activity.id}-${dateStr}`,
          title: activity.title,
          tagline: activity.tagline,
          description: activity.description,
          type: activity.type,
          startTime: slot.startTime,
          endTime: slot.endTime,
          location: activity.location,
          lat: activity.lat,
          lng: activity.lng,
          image: activity.image,
          price: activity.price,
          cta: activity.cta,
          date: dateStr,
          isRecurring: true,
          sourceId: activity.id,
        });
      }
    }

    // 2. Add special events for this date
    const daySpecialEvents = specialEvents.filter((e) => e.date === dateStr);
    for (const event of daySpecialEvents) {
      result.push({
        id: event.id,
        title: event.title,
        tagline: event.tagline,
        description: event.description,
        type: event.type,
        startTime: event.startTime,
        endTime: event.endTime,
        location: event.location,
        lat: event.lat,
        lng: event.lng,
        image: event.image,
        price: event.price,
        cta: event.cta,
        date: dateStr,
        isRecurring: false,
        sourceId: event.id,
      });
    }
  }

  // Sort by date, then by time (All Day first, then by startTime)
  return result.sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;

    if (a.startTime === null && b.startTime !== null) return -1;
    if (a.startTime !== null && b.startTime === null) return 1;

    if (a.startTime && b.startTime) {
      return a.startTime.localeCompare(b.startTime);
    }

    return 0;
  });
}

/**
 * Get a specific event by its display ID (for detail page)
 * Handles both recurring activities and special events
 */
export async function getScheduledEventById(
  id: string
): Promise<{ event: ScheduledEvent; isRecurring: boolean } | undefined> {
  // Check if it's a recurring event ID (format: "activity-id-YYYY-MM-DD")
  const recurringMatch = id.match(/^(.+)-(\d{4}-\d{2}-\d{2})$/);

  if (recurringMatch) {
    const [, activityId, dateStr] = recurringMatch;
    const activity = await getActivityById(activityId);

    if (activity) {
      // Get schedule to find the time for this activity on this day
      const schedule = await getSchedule();
      const date = new Date(dateStr);
      const dayOfWeek = getDayOfWeek(date);
      const slots = schedule[dayOfWeek] || [];
      const slot = slots.find((s) => s.activityId === activityId);

      return {
        event: {
          id,
          title: activity.title,
          tagline: activity.tagline,
          description: activity.description,
          type: activity.type,
          startTime: slot?.startTime ?? null,
          endTime: slot?.endTime ?? null,
          location: activity.location,
          lat: activity.lat,
          lng: activity.lng,
          image: activity.image,
          price: activity.price,
          cta: activity.cta,
          date: dateStr,
          isRecurring: true,
          sourceId: activityId,
        },
        isRecurring: true,
      };
    }
  }

  // Check special events
  const specialEvent = await getSpecialEventById(id);
  if (specialEvent) {
    return {
      event: {
        id: specialEvent.id,
        title: specialEvent.title,
        tagline: specialEvent.tagline,
        description: specialEvent.description,
        type: specialEvent.type,
        startTime: specialEvent.startTime,
        endTime: specialEvent.endTime,
        location: specialEvent.location,
        lat: specialEvent.lat,
        lng: specialEvent.lng,
        image: specialEvent.image,
        price: specialEvent.price,
        cta: specialEvent.cta,
        date: specialEvent.date,
        isRecurring: false,
        sourceId: specialEvent.id,
      },
      isRecurring: false,
    };
  }

  return undefined;
}

/**
 * Get all possible event IDs for static path generation
 * Used by getStaticPaths() in /event/[id].astro
 */
export async function getAllScheduledEventIds(): Promise<string[]> {
  const events = await getUpcomingScheduledEvents(30);
  return events.map((e) => e.id);
}

// ============================================
// Markdown Activities (Legacy - content moved to TinaCMS)
// ============================================

export async function getMarkdownActivities(): Promise<MarkdownActivity[]> {
  // Legacy function - returns empty array
  // Markdown activities have been removed in TinaCMS migration
  return [];
}

export async function getMarkdownActivityBySlug(
  slug: string
): Promise<MarkdownActivity | undefined> {
  const activities = await getMarkdownActivities();
  return activities.find((a) => a.slug === slug);
}

export async function getAllMarkdownActivitySlugs(): Promise<string[]> {
  const activities = await getMarkdownActivities();
  return activities.map((a) => a.slug);
}

// ============================================
// Category Metadata
// ============================================

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: 'restaurants',
    name: 'Restaurants',
    emoji: '🍜',
    description: 'Local restaurants and cafes',
  },
  {
    slug: 'services',
    name: 'Services',
    emoji: '🧺',
    description: 'Useful services nearby',
  },
  {
    slug: 'transport',
    name: 'Transport',
    emoji: '🛵',
    description: 'Scooter rental and transport',
  },
  {
    slug: 'bars',
    name: 'Bars',
    emoji: '🍺',
    description: 'Bars and nightlife',
  },
];

export function getCategoryMeta(slug: SpotCategory): CategoryMeta | undefined {
  return CATEGORIES.find((cat) => cat.slug === slug);
}

// ============================================
// TinaCMS Amenities (Hotel Services)
// ============================================

let cachedAmenities: Amenity[] | null = null;

export async function getAmenities(): Promise<Amenity[]> {
  if (cachedAmenities) {
    return cachedAmenities;
  }

  try {
    const data = await import('../../content/services/amenities/amenities.json');
    const file = data.default as AmenitiesFile;
    cachedAmenities = file.amenities.map((amenity) => ({
      ...amenity,
      id: amenity.id || slugify(amenity.name),
    }));
    return cachedAmenities;
  } catch {
    return [];
  }
}

export async function getAmenityById(id: string): Promise<Amenity | undefined> {
  const amenities = await getAmenities();
  return amenities.find((a) => a.id === id);
}

export async function getHighlightedAmenities(): Promise<Amenity[]> {
  const amenities = await getAmenities();
  return amenities.filter((a) => a.isHighlighted);
}

// ============================================
// TinaCMS Hotel Events
// ============================================

let cachedHotelEvents: HotelEvent[] | null = null;

export async function getHotelEvents(): Promise<HotelEvent[]> {
  if (cachedHotelEvents) {
    return cachedHotelEvents;
  }

  try {
    const data = await import('../../content/services/events/events.json');
    const file = data.default as HotelEventsFile;
    cachedHotelEvents = file.events.map((event) => ({
      ...event,
      id: event.id || slugify(event.title),
    }));
    return cachedHotelEvents;
  } catch {
    return [];
  }
}

export async function getUpcomingHotelEvents(days: number = 7): Promise<HotelEvent[]> {
  const events = await getHotelEvents();
  const now = new Date();
  const cutoff = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  return events
    .filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= now && eventDate <= cutoff;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

// ============================================
// TinaCMS Explore Spots (External)
// ============================================

export async function getExploreSpots(category: ExploreCategory): Promise<ExploreSpot[]> {
  let rawData: unknown;

  try {
    switch (category) {
      case 'restaurants':
        rawData = (await import('../../content/explore/restaurants/restaurants.json')).default;
        break;
      case 'bars':
        rawData = (await import('../../content/explore/bars/bars.json')).default;
        break;
      case 'activities':
        rawData = (await import('../../content/explore/activities/activities.json')).default;
        break;
      case 'transport':
        rawData = (await import('../../content/explore/transport/transport.json')).default;
        break;
      case 'laundry':
        rawData = (await import('../../content/explore/laundry/laundry.json')).default;
        break;
    }
  } catch {
    return [];
  }

  const data = rawData as ExploreSpotsFile;

  // Auto-generate IDs and sort (hotel services first)
  return data.spots
    .map((spot) => ({
      ...spot,
      id: spot.id || slugify(spot.name),
    }))
    .sort((a, b) => {
      if (a.isHotelService && !b.isHotelService) return -1;
      if (!a.isHotelService && b.isHotelService) return 1;
      return a.name.localeCompare(b.name);
    });
}

export async function getExploreSpotById(
  category: ExploreCategory,
  id: string
): Promise<ExploreSpot | undefined> {
  const spots = await getExploreSpots(category);
  return spots.find((spot) => spot.id === id);
}

export async function findExploreSpotById(
  id: string
): Promise<{ spot: ExploreSpot; category: ExploreCategory } | undefined> {
  const categories: ExploreCategory[] = ['restaurants', 'bars', 'activities', 'transport', 'laundry'];

  for (const category of categories) {
    const spots = await getExploreSpots(category);
    const spot = spots.find((s) => s.id === id);
    if (spot) {
      return { spot, category };
    }
  }

  return undefined;
}

// ============================================
// Explore Category Metadata
// ============================================

export const EXPLORE_CATEGORIES: { slug: ExploreCategory; name: string; emoji: string; description: string }[] = [
  {
    slug: 'restaurants',
    name: 'Restaurants',
    emoji: '🍜',
    description: 'Local restaurants and cafes',
  },
  {
    slug: 'bars',
    name: 'Bars',
    emoji: '🍺',
    description: 'Bars and nightlife',
  },
  {
    slug: 'activities',
    name: 'Activities',
    emoji: '🎯',
    description: 'Things to do nearby',
  },
  {
    slug: 'transport',
    name: 'Transport',
    emoji: '🛵',
    description: 'Getting around',
  },
  {
    slug: 'laundry',
    name: 'Laundry',
    emoji: '🧺',
    description: 'Laundry services',
  },
];

export function getExploreCategoryMeta(slug: ExploreCategory) {
  return EXPLORE_CATEGORIES.find((cat) => cat.slug === slug);
}
