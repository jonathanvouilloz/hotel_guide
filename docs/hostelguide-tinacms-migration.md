# HostelGuide — Migration vers TinaCMS

> **Date:** 2025-01-14
> **Contexte:** Fork du projet pour modifications libres
> **Changement principal:** PagesCMS → TinaCMS

---

## 1. Résumé du projet

**HostelGuide** est une PWA "brochure digitale" pour hostels/hôtels permettant aux guests d'accéder via QR code à toutes les infos essentielles : WiFi, restaurants recommandés, services de l'hôtel, règles, etc.

### Stack technique

| Composant | Choix |
|-----------|-------|
| Framework | Astro (SSG) |
| CMS | ~~PagesCMS~~ → **TinaCMS** |
| Hosting | Vercel |
| Styling | Tailwind CSS + CSS variables |
| Data | JSON/Markdown dans Git |

---

## 1.1 Navigation

### Bottom Bar — 5 éléments avec action centrale

```
┌─────────────────────────────────────┐
│                                     │
│         [Contenu plein]             │
│                                     │
├─────────────────────────────────────┤
│  🏠      🧭       💬       🛎️      ℹ️  │
│ Home  Explore   Chat   Services  Info │
└─────────────────────────────────────┘
                   ↑
            WhatsApp (central, surélevé)
```

### Sections

| Onglet | Icône | Contenu |
|--------|-------|---------|
| **Home** | 🏠 | Hero, WiFi (tap to copy), check-in/out, welcome message |
| **Explore** | 🧭 | Spots externes — "Que faire à [ville]" (restos, bars, activities, transport, laundry) |
| **Chat** | 💬 | Bouton WhatsApp central (pas une page, action directe) |
| **Services** | 🛎️ | Amenities internes + Events (pool, spa, gym, restaurant, cooking class, etc.) |
| **Info** | ℹ️ | House rules, how to get here, emergency contacts |

### Comportement du bouton Chat
- Tap → ouvre `wa.me/+66xxx?text=Hi, I'm staying at [Hotel] and I have a question...`
- Pas de page dédiée, action directe
- Icône légèrement plus grande / surélevée (style FAB intégré)

---

## 2. Pourquoi TinaCMS ?

### Problèmes avec PagesCMS
- UI basique, pas professionnelle pour un client hôtel
- Pas de visual editing
- Maintenance incertaine (projet moins actif)

### Avantages TinaCMS
- **UI moderne et professionnelle** — Le owner voit une interface soignée
- **Visual editing** — Prévisualisation en temps réel (expérimental avec Astro)
- **SSG natif** — Pas besoin de SSR, site 100% statique
- **Tina Cloud** — OAuth géré, déploiement flexible (Vercel ✅)
- **Intégration officielle Astro** — Documentation complète, starter template
- **Free tier généreux** — 2 users gratuits, suffisant pour un hôtel
- **TypeScript config** — Schema typé, meilleure DX

---

## 3. Architecture finale

```
hostelguide/
├── astro.config.mjs
├── tina/
│   └── config.ts              # Schema TinaCMS (remplace .pages.yml)
├── content/
│   ├── settings/
│   │   └── global.json        # Branding, WiFi, contacts, timezone
│   ├── pages/
│   │   ├── house-rules.md     # Rich text markdown
│   │   └── how-to-get-here.md # Rich text markdown
│   ├── explore/               # Spots EXTERNES (que faire en ville)
│   │   ├── restaurants.json
│   │   ├── bars.json
│   │   ├── activities.json
│   │   ├── transport.json
│   │   └── laundry.json
│   └── services/              # INTERNE à l'hôtel
│       ├── amenities.json     # Pool, spa, gym, restaurant, etc.
│       └── events.json        # Cooking class, happy hour, etc.
├── src/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   └── styles/
├── public/
│   └── images/                # Media library
└── package.json
```

### Distinction clé : Explore vs Services

| Explore (externe) | Services (interne) |
|-------------------|-------------------|
| Restos en ville | Restaurant de l'hôtel |
| Bars du quartier | Bar/rooftop de l'hôtel |
| Temples, plages | Pool, spa, gym |
| Location scooter | Navette aéroport |
| Laverie en ville | Laundry service |
| — | Events (cooking class, yoga, etc.) |

### Hotel Services dans Explore (isHotelService)

Les services internes de l'hôtel peuvent aussi apparaître dans Explore avec un badge "Our Place" :

```
┌─────────────────────────────────────┐
│           EXPLORE                   │
├─────────────────────────────────────┤
│ ⭐ OUR RESTAURANT ←── isHotelService: true
│    "Garden Restaurant"              │
│    Tap → /services#hotel-restaurant │
├─────────────────────────────────────┤
│ ⭐ OUR LAUNDRY ←───── isHotelService: true  
│    "Same-day service"               │
│    Tap → /services#laundry-service  │
├─────────────────────────────────────┤
│ Pad Thai Corner ←──── isHotelService: false (default)
│    Tap → Détail + Google Maps       │
│                                     │
│ Street Food Market                  │
│    Tap → Détail + Google Maps       │
└─────────────────────────────────────┘
```

**Champs ajoutés à tous les spots (Explore) :**

| Champ | Type | Description |
|-------|------|-------------|
| `isHotelService` | boolean | `true` = service interne, affiché en premier avec badge |
| `linkedAmenityId` | string | ID de l'amenity dans Services (pour le lien) |

**Comportement UI :**
- `isHotelService: true` → Affiché en premier, badge "⭐ Our Place", tap → `/services#amenityId`
- `isHotelService: false` → Comportement normal, tap → page détail + Google Maps

---

## 4. Configuration TinaCMS

### 4.1 Installation

```bash
# Dans le repo forké
npx @tinacms/cli@latest init

# Prompts:
# - Public assets directory: public
# - Framework: Other (Astro)
# - Tina Cloud? Skip for now (Enter)
```

### 4.2 Schema complet (`tina/config.ts`)

```typescript
import { defineConfig } from "tinacms";

export default defineConfig({
  branch: process.env.VERCEL_GIT_COMMIT_REF || "main",
  clientId: process.env.TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      // ============================================
      // SETTINGS — Configuration globale
      // ============================================
      {
        name: "settings",
        label: "⚙️ Settings",
        path: "content/settings",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          // --- Hostel Info ---
          {
            type: "string",
            name: "hostelName",
            label: "Hostel Name",
            required: true,
          },
          {
            type: "image",
            name: "logo",
            label: "Logo",
          },
          
          // --- Branding ---
          {
            type: "object",
            name: "branding",
            label: "Branding",
            fields: [
              {
                type: "string",
                name: "primaryColor",
                label: "Primary Color",
                ui: {
                  component: "color",
                },
              },
              {
                type: "string",
                name: "accentColor",
                label: "Accent Color",
                ui: {
                  component: "color",
                },
              },
            ],
          },

          // --- WiFi ---
          {
            type: "object",
            name: "wifi",
            label: "WiFi",
            fields: [
              {
                type: "string",
                name: "networkName",
                label: "Network Name",
                required: true,
              },
              {
                type: "string",
                name: "password",
                label: "Password",
                required: true,
              },
            ],
          },

          // --- Check-in/out ---
          {
            type: "object",
            name: "checkTimes",
            label: "Check-in / Check-out",
            fields: [
              {
                type: "string",
                name: "checkIn",
                label: "Check-in Time",
                description: "e.g., 14:00",
              },
              {
                type: "string",
                name: "checkOut",
                label: "Check-out Time",
                description: "e.g., 11:00",
              },
            ],
          },

          // --- Contacts ---
          {
            type: "object",
            name: "contacts",
            label: "Contacts",
            fields: [
              {
                type: "string",
                name: "whatsapp",
                label: "WhatsApp Number",
                description: "International format: +66812345678",
              },
              {
                type: "string",
                name: "emergencyLocal",
                label: "Emergency (Local)",
                description: "e.g., Tourist Police: 1155",
              },
              {
                type: "string",
                name: "emergencyAmbulance",
                label: "Emergency (Ambulance)",
              },
            ],
          },

          // --- Timezone ---
          {
            type: "string",
            name: "timezone",
            label: "Timezone",
            description: "e.g., Asia/Bangkok",
            options: [
              "Asia/Bangkok",
              "Asia/Ho_Chi_Minh",
              "Asia/Jakarta",
              "Asia/Singapore",
              "Asia/Kuala_Lumpur",
              "Asia/Manila",
              "Asia/Bali",
            ],
          },
        ],
      },

      // ============================================
      // PAGES — House Rules & How to Get Here
      // ============================================
      {
        name: "pages",
        label: "📄 Pages",
        path: "content/pages",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Content",
            isBody: true,
          },
        ],
      },

      // ============================================
      // EXPLORE — Spots externes (que faire en ville)
      // ============================================

      // ============================================
      // RESTAURANTS (Explore)
      // ============================================
      {
        name: "restaurants",
        label: "🍜 Restaurants",
        path: "content/explore/restaurants",
        format: "json",
        fields: [
          {
            type: "object",
            name: "spots",
            label: "Restaurants",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.isHotelService 
                  ? `⭐ ${item?.name || "New Restaurant"}` 
                  : item?.name || "New Restaurant",
              }),
            },
            fields: [
              {
                type: "string",
                name: "id",
                label: "ID",
                required: true,
                description: "Unique slug (e.g., pad-thai-place)",
              },
              {
                type: "string",
                name: "name",
                label: "Name",
                required: true,
              },
              {
                type: "string",
                name: "description",
                label: "Description",
                ui: {
                  component: "textarea",
                },
              },
              // --- Hotel Service Flag ---
              {
                type: "boolean",
                name: "isHotelService",
                label: "⭐ Hotel Service",
                description: "This is OUR restaurant (shown first with badge, links to Services)",
              },
              {
                type: "string",
                name: "linkedAmenityId",
                label: "Linked Amenity ID",
                description: "ID from Services/Amenities (e.g., hotel-restaurant). Only for hotel services.",
              },
              // --- End Hotel Service ---
              {
                type: "string",
                name: "cuisineType",
                label: "Cuisine Type",
                options: ["Thai", "Western", "Japanese", "Indian", "Vietnamese", "Italian", "Seafood", "Vegetarian", "International", "Street Food"],
              },
              {
                type: "string",
                name: "priceRange",
                label: "Price Range",
                options: [
                  { value: "€", label: "€ — Budget" },
                  { value: "€€", label: "€€ — Mid-range" },
                  { value: "€€€", label: "€€€ — Expensive" },
                ],
              },
              {
                type: "image",
                name: "image",
                label: "Photo",
              },
              {
                type: "string",
                name: "address",
                label: "Address",
              },
              {
                type: "object",
                name: "coordinates",
                label: "Coordinates",
                fields: [
                  {
                    type: "number",
                    name: "lat",
                    label: "Latitude",
                  },
                  {
                    type: "number",
                    name: "lng",
                    label: "Longitude",
                  },
                ],
              },
              {
                type: "string",
                name: "tags",
                label: "Tags",
                list: true,
                description: "e.g., breakfast, wifi, air-con",
              },
            ],
          },
        ],
      },

      // ============================================
      // LAUNDRY (Explore)
      // ============================================
      {
        name: "laundry",
        label: "🧺 Laundry",
        path: "content/explore/laundry",
        format: "json",
        fields: [
          {
            type: "object",
            name: "spots",
            label: "Laundry Services",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.isHotelService 
                  ? `⭐ ${item?.name || "New Laundry"}` 
                  : item?.name || "New Laundry",
              }),
            },
            fields: [
              { type: "string", name: "id", label: "ID", required: true },
              { type: "string", name: "name", label: "Name", required: true },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
              // --- Hotel Service Flag ---
              {
                type: "boolean",
                name: "isHotelService",
                label: "⭐ Hotel Service",
                description: "This is OUR laundry service (shown first with badge, links to Services)",
              },
              {
                type: "string",
                name: "linkedAmenityId",
                label: "Linked Amenity ID",
                description: "ID from Services/Amenities (e.g., laundry-service). Only for hotel services.",
              },
              // --- End Hotel Service ---
              {
                type: "string",
                name: "serviceType",
                label: "Service Type",
                options: ["Self-service", "Drop-off", "Pick-up & Delivery", "Hotel Laundry"],
              },
              {
                type: "string",
                name: "priceRange",
                label: "Price Range",
                options: [
                  { value: "€", label: "€ — Budget" },
                  { value: "€€", label: "€€ — Mid-range" },
                ],
              },
              { type: "image", name: "image", label: "Photo" },
              { type: "string", name: "address", label: "Address" },
              {
                type: "object",
                name: "coordinates",
                label: "Coordinates",
                fields: [
                  { type: "number", name: "lat", label: "Latitude" },
                  { type: "number", name: "lng", label: "Longitude" },
                ],
              },
              { type: "string", name: "tags", label: "Tags", list: true },
            ],
          },
        ],
      },

      // ============================================
      // TRANSPORT (Explore)
      // ============================================
      {
        name: "transport",
        label: "🛵 Transport",
        path: "content/explore/transport",
        format: "json",
        fields: [
          {
            type: "object",
            name: "spots",
            label: "Transport Options",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.isHotelService 
                  ? `⭐ ${item?.name || "New Transport"}` 
                  : item?.name || "New Transport",
              }),
            },
            fields: [
              { type: "string", name: "id", label: "ID", required: true },
              { type: "string", name: "name", label: "Name", required: true },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
              // --- Hotel Service Flag ---
              {
                type: "boolean",
                name: "isHotelService",
                label: "⭐ Hotel Service",
                description: "This is OUR transport service (shown first with badge, links to Services)",
              },
              {
                type: "string",
                name: "linkedAmenityId",
                label: "Linked Amenity ID",
                description: "ID from Services/Amenities (e.g., airport-shuttle). Only for hotel services.",
              },
              // --- End Hotel Service ---
              {
                type: "string",
                name: "transportType",
                label: "Type",
                options: ["Scooter Rental", "Car Rental", "Taxi", "Bus Station", "Train Station", "Airport Shuttle", "Boat", "Bicycle"],
              },
              {
                type: "string",
                name: "priceRange",
                label: "Price Range",
                options: [
                  { value: "€", label: "€ — Budget" },
                  { value: "€€", label: "€€ — Mid-range" },
                  { value: "€€€", label: "€€€ — Expensive" },
                ],
              },
              { type: "image", name: "image", label: "Photo" },
              { type: "string", name: "address", label: "Address" },
              {
                type: "object",
                name: "coordinates",
                label: "Coordinates",
                fields: [
                  { type: "number", name: "lat", label: "Latitude" },
                  { type: "number", name: "lng", label: "Longitude" },
                ],
              },
              { type: "string", name: "tags", label: "Tags", list: true },
            ],
          },
        ],
      },

      // ============================================
      // BARS (Explore)
      // ============================================
      {
        name: "bars",
        label: "🍺 Bars",
        path: "content/explore/bars",
        format: "json",
        fields: [
          {
            type: "object",
            name: "spots",
            label: "Bars & Nightlife",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.isHotelService 
                  ? `⭐ ${item?.name || "New Bar"}` 
                  : item?.name || "New Bar",
              }),
            },
            fields: [
              { type: "string", name: "id", label: "ID", required: true },
              { type: "string", name: "name", label: "Name", required: true },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
              // --- Hotel Service Flag ---
              {
                type: "boolean",
                name: "isHotelService",
                label: "⭐ Hotel Service",
                description: "This is OUR bar (shown first with badge, links to Services)",
              },
              {
                type: "string",
                name: "linkedAmenityId",
                label: "Linked Amenity ID",
                description: "ID from Services/Amenities (e.g., rooftop-bar). Only for hotel services.",
              },
              // --- End Hotel Service ---
              {
                type: "string",
                name: "barType",
                label: "Type",
                options: ["Rooftop", "Beach Bar", "Sports Bar", "Cocktail Bar", "Pub", "Club", "Live Music"],
              },
              {
                type: "string",
                name: "priceRange",
                label: "Price Range",
                options: [
                  { value: "€", label: "€ — Budget" },
                  { value: "€€", label: "€€ — Mid-range" },
                  { value: "€€€", label: "€€€ — Expensive" },
                ],
              },
              { type: "image", name: "image", label: "Photo" },
              { type: "string", name: "address", label: "Address" },
              {
                type: "object",
                name: "coordinates",
                label: "Coordinates",
                fields: [
                  { type: "number", name: "lat", label: "Latitude" },
                  { type: "number", name: "lng", label: "Longitude" },
                ],
              },
              { type: "string", name: "tags", label: "Tags", list: true },
            ],
          },
        ],
      },

      // ============================================
      // ACTIVITIES (Explore)
      // ============================================
      {
        name: "activities",
        label: "🎯 Activities",
        path: "content/explore/activities",
        format: "json",
        fields: [
          {
            type: "object",
            name: "spots",
            label: "Activities & Attractions",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.isHotelService 
                  ? `⭐ ${item?.name || "New Activity"}` 
                  : item?.name || "New Activity",
              }),
            },
            fields: [
              { type: "string", name: "id", label: "ID", required: true },
              { type: "string", name: "name", label: "Name", required: true },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
              // --- Hotel Service Flag ---
              {
                type: "boolean",
                name: "isHotelService",
                label: "⭐ Hotel Service",
                description: "This is OUR activity (shown first with badge, links to Services)",
              },
              {
                type: "string",
                name: "linkedAmenityId",
                label: "Linked Amenity ID",
                description: "ID from Services/Amenities (e.g., yoga-classes). Only for hotel services.",
              },
              // --- End Hotel Service ---
              {
                type: "string",
                name: "activityType",
                label: "Type",
                options: ["Temple", "Beach", "Waterfall", "Market", "Museum", "Viewpoint", "Diving", "Cooking Class", "Massage", "Yoga", "Tour"],
              },
              {
                type: "string",
                name: "priceRange",
                label: "Price Range",
                options: [
                  { value: "Free", label: "Free" },
                  { value: "€", label: "€ — Budget" },
                  { value: "€€", label: "€€ — Mid-range" },
                  { value: "€€€", label: "€€€ — Expensive" },
                ],
              },
              { type: "image", name: "image", label: "Photo" },
              { type: "string", name: "address", label: "Address" },
              {
                type: "object",
                name: "coordinates",
                label: "Coordinates",
                fields: [
                  { type: "number", name: "lat", label: "Latitude" },
                  { type: "number", name: "lng", label: "Longitude" },
                ],
              },
              { type: "string", name: "tags", label: "Tags", list: true },
            ],
          },
        ],
      },

      // ============================================
      // SERVICES — Internes à l'hôtel
      // ============================================

      // ============================================
      // AMENITIES (Services)
      // ============================================
      {
        name: "amenities",
        label: "🛎️ Amenities",
        path: "content/services/amenities",
        format: "json",
        fields: [
          {
            type: "object",
            name: "amenities",
            label: "Hotel Amenities",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.name || "New Amenity",
              }),
            },
            fields: [
              {
                type: "string",
                name: "id",
                label: "ID",
                required: true,
                description: "Unique slug (e.g., swimming-pool)",
              },
              {
                type: "string",
                name: "name",
                label: "Name",
                required: true,
              },
              {
                type: "string",
                name: "description",
                label: "Description",
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "string",
                name: "amenityType",
                label: "Type",
                options: [
                  "Pool",
                  "Spa & Massage",
                  "Gym & Fitness",
                  "Restaurant",
                  "Bar & Lounge",
                  "Rooftop",
                  "Laundry Service",
                  "Airport Shuttle",
                  "Bike Rental",
                  "Scooter Rental",
                  "Tour Desk",
                  "Coworking Space",
                  "Kitchen",
                  "Common Area",
                  "Garden",
                  "Parking",
                  "Other"
                ],
              },
              {
                type: "string",
                name: "hours",
                label: "Opening Hours",
                description: "e.g., 07:00-22:00 or 24/7",
              },
              {
                type: "string",
                name: "price",
                label: "Price",
                description: "e.g., Free, 200 THB/hour, Included",
              },
              {
                type: "string",
                name: "location",
                label: "Location",
                description: "e.g., 3rd Floor, Rooftop, Building B",
              },
              {
                type: "image",
                name: "image",
                label: "Photo",
              },
              {
                type: "rich-text",
                name: "details",
                label: "Additional Details",
                description: "Menu, services list, rules, etc.",
              },
              {
                type: "boolean",
                name: "isHighlighted",
                label: "Highlight on Home",
                description: "Show this amenity on the home page",
              },
              {
                type: "string",
                name: "tags",
                label: "Tags",
                list: true,
                description: "e.g., free, reservation-required, popular",
              },
            ],
          },
        ],
      },

      // ============================================
      // EVENTS (Services)
      // ============================================
      {
        name: "events",
        label: "📅 Events",
        path: "content/services/events",
        format: "json",
        fields: [
          {
            type: "object",
            name: "events",
            label: "Hotel Events",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.title ? `${item.date} — ${item.title}` : "New Event",
              }),
            },
            fields: [
              {
                type: "string",
                name: "id",
                label: "ID",
                required: true,
              },
              {
                type: "string",
                name: "title",
                label: "Event Title",
                required: true,
              },
              {
                type: "string",
                name: "description",
                label: "Description",
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "datetime",
                name: "date",
                label: "Date",
                required: true,
              },
              {
                type: "string",
                name: "time",
                label: "Time",
                description: "e.g., 18:00 or 18:00-21:00",
              },
              {
                type: "string",
                name: "location",
                label: "Location",
                description: "e.g., Rooftop, Main Lobby, Pool Area",
              },
              {
                type: "string",
                name: "price",
                label: "Price",
                description: "e.g., Free, 200 THB, 500 THB (includes dinner)",
              },
              {
                type: "image",
                name: "image",
                label: "Event Image",
              },
              {
                type: "object",
                name: "cta",
                label: "Call to Action",
                fields: [
                  {
                    type: "string",
                    name: "label",
                    label: "Button Label",
                    description: "e.g., Join us!, Book now, More info",
                  },
                  {
                    type: "string",
                    name: "type",
                    label: "CTA Type",
                    options: [
                      { value: "whatsapp", label: "WhatsApp Message" },
                      { value: "link", label: "Custom Link" },
                    ],
                  },
                  {
                    type: "string",
                    name: "whatsappMessage",
                    label: "WhatsApp Pre-filled Message",
                    description: "Message sent when guest clicks (only for WhatsApp type)",
                  },
                  {
                    type: "string",
                    name: "url",
                    label: "Custom URL",
                    description: "Link destination (only for Custom Link type)",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});
```

---

## 5. Fichiers de contenu initiaux

### `content/settings/global.json`

```json
{
  "hostelName": "Your Hostel Name",
  "logo": "/images/logo.png",
  "branding": {
    "primaryColor": "#008080",
    "accentColor": "#FF6B6B"
  },
  "wifi": {
    "networkName": "YourHostel_WiFi",
    "password": "welcome123"
  },
  "checkTimes": {
    "checkIn": "14:00",
    "checkOut": "11:00"
  },
  "contacts": {
    "whatsapp": "+66812345678",
    "emergencyLocal": "Tourist Police: 1155",
    "emergencyAmbulance": "1669"
  },
  "timezone": "Asia/Bangkok"
}
```

### `content/pages/house-rules.md`

```markdown
---
title: House Rules
---

## Welcome to our hostel! 🏠

Please respect these simple rules to make everyone's stay enjoyable:

### Quiet Hours
- **22:00 - 08:00** — Please keep noise to a minimum in dorm areas

### Common Areas
- Clean up after yourself in the kitchen
- No outside food in the pool area
- Shoes off in the lounge

### Security
- Always lock your locker
- Don't share your room key
- Report any suspicious activity to staff
```

### `content/pages/how-to-get-here.md`

```markdown
---
title: How to Get Here
---

## From the Airport ✈️

### By Taxi
1. Exit arrivals and find the official taxi stand
2. Show the driver this address: **123 Beach Road, Kata**
3. Journey takes ~45 minutes, costs ~500-700 THB

### By Shuttle
We offer airport pickup for 400 THB/person. Message us on WhatsApp to book!

## From the Bus Station 🚌

The hostel is a 10-minute walk from the main bus station. Head towards the beach and turn left at 7-Eleven.
```

### `content/explore/restaurants.json`

```json
{
  "spots": [
    {
      "id": "hotel-restaurant",
      "name": "Garden Restaurant",
      "description": "Our in-house restaurant serving Thai and Western cuisine. Breakfast included for all guests!",
      "isHotelService": true,
      "linkedAmenityId": "hotel-restaurant",
      "cuisineType": "International",
      "priceRange": "€€",
      "image": "/images/explore/garden-restaurant.jpg",
      "address": null,
      "coordinates": null,
      "tags": ["breakfast-included", "vegetarian-options", "our-place"]
    },
    {
      "id": "pad-thai-corner",
      "name": "Pad Thai Corner",
      "description": "Best pad thai in town! Family-run spot with authentic recipes. Try the crab fried rice too.",
      "isHotelService": false,
      "linkedAmenityId": null,
      "cuisineType": "Thai",
      "priceRange": "€",
      "image": "/images/explore/pad-thai-corner.jpg",
      "address": "45 Beach Road, Kata",
      "coordinates": {
        "lat": 7.8208,
        "lng": 98.2978
      },
      "tags": ["local favorite", "cash only", "lunch"]
    }
  ]
}
```

### `content/services/amenities.json`

```json
{
  "amenities": [
    {
      "id": "swimming-pool",
      "name": "Swimming Pool",
      "description": "Rooftop infinity pool with stunning mountain views. Perfect for sunset drinks!",
      "amenityType": "Pool",
      "hours": "07:00-22:00",
      "price": "Free for guests",
      "location": "Rooftop (5th Floor)",
      "image": "/images/services/pool.jpg",
      "isHighlighted": true,
      "tags": ["free", "popular", "towels-provided"]
    },
    {
      "id": "thai-massage",
      "name": "Traditional Thai Massage",
      "description": "Professional massage therapists available daily. Book at reception.",
      "amenityType": "Spa & Massage",
      "hours": "10:00-21:00",
      "price": "300 THB/hour",
      "location": "Ground Floor",
      "image": "/images/services/massage.jpg",
      "isHighlighted": true,
      "tags": ["reservation-required", "popular"]
    },
    {
      "id": "hotel-restaurant",
      "name": "Garden Restaurant",
      "description": "Thai and Western cuisine. Breakfast included for all guests.",
      "amenityType": "Restaurant",
      "hours": "07:00-22:00",
      "price": "Breakfast included, lunch/dinner à la carte",
      "location": "Garden Area",
      "image": "/images/services/restaurant.jpg",
      "isHighlighted": false,
      "tags": ["breakfast-included", "vegetarian-options"]
    },
    {
      "id": "laundry-service",
      "name": "Laundry Service",
      "description": "Drop off before 10am, ready by 6pm same day.",
      "amenityType": "Laundry Service",
      "hours": "08:00-18:00",
      "price": "40 THB/kg",
      "location": "Reception",
      "image": null,
      "isHighlighted": false,
      "tags": ["same-day"]
    }
  ]
}
```

### `content/services/events.json`

```json
{
  "events": [
    {
      "id": "cooking-class-jan-15",
      "title": "Thai Cooking Class",
      "description": "Learn to make pad thai, green curry, and mango sticky rice with our chef!",
      "date": "2025-01-15T00:00:00.000Z",
      "time": "16:00-19:00",
      "location": "Garden Kitchen",
      "price": "500 THB (includes dinner)",
      "image": "/images/services/cooking-class.jpg",
      "cta": {
        "label": "Join us!",
        "type": "whatsapp",
        "whatsappMessage": "Hi! I'd like to join the Thai Cooking Class on Wednesday Jan 15th 🍳"
      }
    },
    {
      "id": "happy-hour-daily",
      "title": "Sunset Happy Hour",
      "description": "2-for-1 cocktails at the rooftop bar. Best views in town!",
      "date": "2025-01-14T00:00:00.000Z",
      "time": "17:00-19:00",
      "location": "Rooftop Bar",
      "price": "Cocktails from 100 THB",
      "image": "/images/services/happy-hour.jpg",
      "cta": {
        "label": "See menu",
        "type": "link",
        "url": "/services#rooftop-bar"
      }
    }
  ]
}
```

---

## 6. Configuration Astro

### `astro.config.mjs`

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  output: 'static', // SSG — important!
});
```

### `package.json` scripts

```json
{
  "scripts": {
    "dev": "tinacms dev -c \"astro dev\"",
    "build": "tinacms build && astro build",
    "preview": "astro preview"
  }
}
```

---

## 7. Déploiement

### Variables d'environnement (Vercel)

```bash
TINA_CLIENT_ID=xxx        # Depuis Tina Cloud
TINA_TOKEN=xxx            # Depuis Tina Cloud
TINA_BRANCH=main          # Ou ta branche par défaut
```

### Setup Tina Cloud

1. Aller sur [app.tina.io](https://app.tina.io)
2. Créer un projet
3. Connecter le repo GitHub (forké)
4. Récupérer Client ID et Token
5. Ajouter les variables dans Vercel

### Workflow Owner

1. Owner va sur `https://hostelguide.vercel.app/admin`
2. Se connecte via GitHub (OAuth géré par Tina Cloud)
3. Édite le contenu dans l'interface TinaCMS
4. Sauvegarde → Commit auto sur GitHub
5. Vercel rebuild (~30 sec)
6. Changements live!

---

## 8. Checklist migration

### Phase 1: Setup (1h)
- [ ] Fork le repo
- [ ] Supprimer `.pages.yml` (ancien PagesCMS)
- [ ] Installer TinaCMS: `npx @tinacms/cli@latest init`
- [ ] Créer `tina/config.ts` avec le schema ci-dessus
- [ ] Créer la structure `content/` :
  - `content/settings/global.json`
  - `content/pages/house-rules.md`
  - `content/pages/how-to-get-here.md`
  - `content/explore/` (restaurants, bars, activities, transport, laundry)
  - `content/services/amenities.json`
  - `content/services/events.json`

### Phase 2: Intégration Astro (2-3h)
- [ ] Modifier `astro.config.mjs`
- [ ] Mettre à jour les scripts dans `package.json`
- [ ] Créer les pages Astro :
  - `src/pages/index.astro` (Home)
  - `src/pages/explore.astro` (Explore)
  - `src/pages/services.astro` (Services + Events)
  - `src/pages/info.astro` (Info)
- [ ] Créer le composant `BottomNav.astro` (5 onglets + WhatsApp central)
- [ ] Tester en local: `npm run dev`
- [ ] Vérifier l'admin: `http://localhost:4321/admin`

### Phase 3: Déploiement (30min)
- [ ] Créer projet sur Tina Cloud
- [ ] Connecter le repo GitHub
- [ ] Récupérer credentials (Client ID + Token)
- [ ] Configurer variables Vercel
- [ ] Déployer et tester

### Phase 4: Validation (30min)
- [ ] Tester l'édition depuis l'admin prod
- [ ] Vérifier que les commits sont créés sur GitHub
- [ ] Vérifier le rebuild automatique Vercel
- [ ] Tester le bouton WhatsApp central
- [ ] Tester sur mobile (UX guest)

---

## 9. Différences clés vs PagesCMS

| Aspect | PagesCMS | TinaCMS |
|--------|----------|---------|
| Config | `.pages.yml` (YAML) | `tina/config.ts` (TypeScript) |
| UI | Basique | Moderne, personnalisable |
| Auth | GitHub OAuth manuel | Tina Cloud (géré) |
| Visual editing | Non | Oui (expérimental) |
| Media | Upload GitHub direct | Media library intégrée |
| Validation | Basique | Schema typé |
| Local dev | N/A | `tinacms dev` |

---

## 10. Notes pour le développement

### Lecture des données dans Astro

```astro
---
// src/pages/index.astro
import settings from '../../content/settings/global.json';
import amenities from '../../content/services/amenities.json';

const { hostelName, wifi, branding } = settings;
const highlightedAmenities = amenities.amenities.filter(a => a.isHighlighted);
---

<h1 style={`color: ${branding.primaryColor}`}>{hostelName}</h1>
<p>WiFi: {wifi.networkName} / {wifi.password}</p>

<h2>Our Highlights</h2>
{highlightedAmenities.map(amenity => (
  <div>{amenity.name} — {amenity.price}</div>
))}
```

```astro
---
// src/pages/explore.astro
import restaurants from '../../content/explore/restaurants.json';
import bars from '../../content/explore/bars.json';
import activities from '../../content/explore/activities.json';

const allSpots = [
  ...restaurants.spots.map(s => ({...s, category: 'restaurant'})),
  ...bars.spots.map(s => ({...s, category: 'bar'})),
  ...activities.spots.map(s => ({...s, category: 'activity'})),
];

// Sort: hotel services first, then alphabetically
const sortedSpots = allSpots.sort((a, b) => {
  if (a.isHotelService && !b.isHotelService) return -1;
  if (!a.isHotelService && b.isHotelService) return 1;
  return a.name.localeCompare(b.name);
});
---

{sortedSpots.map(spot => (
  <a 
    href={spot.isHotelService 
      ? `/services#${spot.linkedAmenityId}` 
      : `/explore/${spot.category}/${spot.id}`
    }
    class={spot.isHotelService ? 'border-2 border-primary' : ''}
  >
    {spot.isHotelService && (
      <span class="bg-primary text-white text-xs px-2 py-1 rounded">
        ⭐ Our Place
      </span>
    )}
    <h3>{spot.name}</h3>
    <span>{spot.category}</span>
  </a>
))}
```

```astro
---
// src/pages/services.astro
import amenities from '../../content/services/amenities.json';
import events from '../../content/services/events.json';

// Filter future events only
const now = new Date();
const upcomingEvents = events.events.filter(e => new Date(e.date) >= now);
---

<section>
  <h2>Our Services</h2>
  {amenities.amenities.map(a => (
    <div>{a.name} — {a.hours}</div>
  ))}
</section>

<section>
  <h2>This Week</h2>
  {upcomingEvents.map(e => (
    <div>{e.title} — {e.time}</div>
  ))}
</section>
```

### Bottom Navigation Component

```astro
---
// src/components/BottomNav.astro
import settings from '../../content/settings/global.json';

const whatsappLink = `https://wa.me/${settings.contacts.whatsapp.replace(/\+/g, '')}?text=${encodeURIComponent(`Hi, I'm staying at ${settings.hostelName} and I have a question...`)}`;
---

<nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2">
  <div class="flex justify-around items-center">
    <a href="/" class="flex flex-col items-center text-gray-600 hover:text-primary">
      <span class="text-xl">🏠</span>
      <span class="text-xs">Home</span>
    </a>
    <a href="/explore" class="flex flex-col items-center text-gray-600 hover:text-primary">
      <span class="text-xl">🧭</span>
      <span class="text-xs">Explore</span>
    </a>
    
    <!-- WhatsApp Central Button -->
    <a 
      href={whatsappLink}
      target="_blank"
      class="flex flex-col items-center justify-center -mt-6 bg-green-500 text-white rounded-full w-14 h-14 shadow-lg"
    >
      <span class="text-2xl">💬</span>
    </a>
    
    <a href="/services" class="flex flex-col items-center text-gray-600 hover:text-primary">
      <span class="text-xl">🛎️</span>
      <span class="text-xs">Services</span>
    </a>
    <a href="/info" class="flex flex-col items-center text-gray-600 hover:text-primary">
      <span class="text-xl">ℹ️</span>
      <span class="text-xs">Info</span>
    </a>
  </div>
</nav>
```

### CSS Variables pour le theming

```css
/* src/styles/global.css */
:root {
  --color-primary: var(--hostel-primary, #008080);
  --color-accent: var(--hostel-accent, #FF6B6B);
}
```

Injecter dynamiquement dans le layout:

```astro
---
import settings from '../../content/settings/global.json';
---
<style define:vars={{
  'hostel-primary': settings.branding.primaryColor,
  'hostel-accent': settings.branding.accentColor
}}>
</style>
```

---

**Document prêt pour le développement!** 🚀
