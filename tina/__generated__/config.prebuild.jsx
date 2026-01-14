// tina/config.ts
import { defineConfig } from "tinacms";
var config_default = defineConfig({
  branch: process.env.VERCEL_GIT_COMMIT_REF || "main",
  clientId: process.env.TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [
      // ============================================
      // SETTINGS — Configuration globale
      // ============================================
      {
        name: "settings",
        label: "Settings",
        path: "content/settings",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false
          }
        },
        fields: [
          // --- Hostel Info ---
          {
            type: "string",
            name: "hostelName",
            label: "Hostel Name",
            required: true
          },
          {
            type: "image",
            name: "logo",
            label: "Logo"
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
                  component: "color"
                }
              },
              {
                type: "string",
                name: "accentColor",
                label: "Accent Color",
                ui: {
                  component: "color"
                }
              }
            ]
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
                required: true
              },
              {
                type: "string",
                name: "password",
                label: "Password",
                required: true
              }
            ]
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
                description: "e.g., 14:00"
              },
              {
                type: "string",
                name: "checkOut",
                label: "Check-out Time",
                description: "e.g., 11:00"
              }
            ]
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
                description: "International format: +66812345678"
              },
              {
                type: "string",
                name: "emergencyLocal",
                label: "Emergency (Local)",
                description: "e.g., Tourist Police: 1155"
              },
              {
                type: "string",
                name: "emergencyAmbulance",
                label: "Emergency (Ambulance)"
              }
            ]
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
              "Asia/Bali"
            ]
          }
        ]
      },
      // ============================================
      // PAGES — House Rules & How to Get Here
      // ============================================
      {
        name: "pages",
        label: "Pages",
        path: "content/pages",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            required: true
          },
          {
            type: "rich-text",
            name: "body",
            label: "Content",
            isBody: true
          }
        ]
      },
      // ============================================
      // EXPLORE — Spots externes (que faire en ville)
      // ============================================
      // ============================================
      // RESTAURANTS (Explore)
      // ============================================
      {
        name: "restaurants",
        label: "Restaurants",
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
                label: item?.isHotelService ? `* ${item?.name || "New Restaurant"}` : item?.name || "New Restaurant"
              })
            },
            fields: [
              {
                type: "string",
                name: "id",
                label: "ID",
                required: true,
                description: "Unique slug (e.g., pad-thai-place)"
              },
              {
                type: "string",
                name: "name",
                label: "Name",
                required: true
              },
              {
                type: "string",
                name: "description",
                label: "Description",
                ui: {
                  component: "textarea"
                }
              },
              // --- Hotel Service Flag ---
              {
                type: "boolean",
                name: "isHotelService",
                label: "Hotel Service",
                description: "This is OUR restaurant (shown first with badge, links to Services)"
              },
              {
                type: "string",
                name: "linkedAmenityId",
                label: "Linked Amenity ID",
                description: "ID from Services/Amenities (e.g., hotel-restaurant). Only for hotel services."
              },
              // --- End Hotel Service ---
              {
                type: "string",
                name: "cuisineType",
                label: "Cuisine Type",
                options: ["Thai", "Western", "Japanese", "Indian", "Vietnamese", "Italian", "Seafood", "Vegetarian", "International", "Street Food"]
              },
              {
                type: "string",
                name: "priceRange",
                label: "Price Range",
                options: [
                  { value: "$", label: "$ \u2014 Budget" },
                  { value: "$$", label: "$$ \u2014 Mid-range" },
                  { value: "$$$", label: "$$$ \u2014 Expensive" }
                ]
              },
              {
                type: "image",
                name: "image",
                label: "Photo"
              },
              {
                type: "string",
                name: "address",
                label: "Address"
              },
              {
                type: "object",
                name: "coordinates",
                label: "Coordinates",
                fields: [
                  {
                    type: "number",
                    name: "lat",
                    label: "Latitude"
                  },
                  {
                    type: "number",
                    name: "lng",
                    label: "Longitude"
                  }
                ]
              },
              {
                type: "string",
                name: "tags",
                label: "Tags",
                list: true,
                description: "e.g., breakfast, wifi, air-con"
              }
            ]
          }
        ]
      },
      // ============================================
      // LAUNDRY (Explore)
      // ============================================
      {
        name: "laundry",
        label: "Laundry",
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
                label: item?.isHotelService ? `* ${item?.name || "New Laundry"}` : item?.name || "New Laundry"
              })
            },
            fields: [
              { type: "string", name: "id", label: "ID", required: true },
              { type: "string", name: "name", label: "Name", required: true },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
              // --- Hotel Service Flag ---
              {
                type: "boolean",
                name: "isHotelService",
                label: "Hotel Service",
                description: "This is OUR laundry service (shown first with badge, links to Services)"
              },
              {
                type: "string",
                name: "linkedAmenityId",
                label: "Linked Amenity ID",
                description: "ID from Services/Amenities (e.g., laundry-service). Only for hotel services."
              },
              // --- End Hotel Service ---
              {
                type: "string",
                name: "serviceType",
                label: "Service Type",
                options: ["Self-service", "Drop-off", "Pick-up & Delivery", "Hotel Laundry"]
              },
              {
                type: "string",
                name: "priceRange",
                label: "Price Range",
                options: [
                  { value: "$", label: "$ \u2014 Budget" },
                  { value: "$$", label: "$$ \u2014 Mid-range" }
                ]
              },
              { type: "image", name: "image", label: "Photo" },
              { type: "string", name: "address", label: "Address" },
              {
                type: "object",
                name: "coordinates",
                label: "Coordinates",
                fields: [
                  { type: "number", name: "lat", label: "Latitude" },
                  { type: "number", name: "lng", label: "Longitude" }
                ]
              },
              { type: "string", name: "tags", label: "Tags", list: true }
            ]
          }
        ]
      },
      // ============================================
      // TRANSPORT (Explore)
      // ============================================
      {
        name: "transport",
        label: "Transport",
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
                label: item?.isHotelService ? `* ${item?.name || "New Transport"}` : item?.name || "New Transport"
              })
            },
            fields: [
              { type: "string", name: "id", label: "ID", required: true },
              { type: "string", name: "name", label: "Name", required: true },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
              // --- Hotel Service Flag ---
              {
                type: "boolean",
                name: "isHotelService",
                label: "Hotel Service",
                description: "This is OUR transport service (shown first with badge, links to Services)"
              },
              {
                type: "string",
                name: "linkedAmenityId",
                label: "Linked Amenity ID",
                description: "ID from Services/Amenities (e.g., airport-shuttle). Only for hotel services."
              },
              // --- End Hotel Service ---
              {
                type: "string",
                name: "transportType",
                label: "Type",
                options: ["Scooter Rental", "Car Rental", "Taxi", "Bus Station", "Train Station", "Airport Shuttle", "Boat", "Bicycle"]
              },
              {
                type: "string",
                name: "priceRange",
                label: "Price Range",
                options: [
                  { value: "$", label: "$ \u2014 Budget" },
                  { value: "$$", label: "$$ \u2014 Mid-range" },
                  { value: "$$$", label: "$$$ \u2014 Expensive" }
                ]
              },
              { type: "image", name: "image", label: "Photo" },
              { type: "string", name: "address", label: "Address" },
              {
                type: "object",
                name: "coordinates",
                label: "Coordinates",
                fields: [
                  { type: "number", name: "lat", label: "Latitude" },
                  { type: "number", name: "lng", label: "Longitude" }
                ]
              },
              { type: "string", name: "tags", label: "Tags", list: true }
            ]
          }
        ]
      },
      // ============================================
      // BARS (Explore)
      // ============================================
      {
        name: "bars",
        label: "Bars",
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
                label: item?.isHotelService ? `* ${item?.name || "New Bar"}` : item?.name || "New Bar"
              })
            },
            fields: [
              { type: "string", name: "id", label: "ID", required: true },
              { type: "string", name: "name", label: "Name", required: true },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
              // --- Hotel Service Flag ---
              {
                type: "boolean",
                name: "isHotelService",
                label: "Hotel Service",
                description: "This is OUR bar (shown first with badge, links to Services)"
              },
              {
                type: "string",
                name: "linkedAmenityId",
                label: "Linked Amenity ID",
                description: "ID from Services/Amenities (e.g., rooftop-bar). Only for hotel services."
              },
              // --- End Hotel Service ---
              {
                type: "string",
                name: "barType",
                label: "Type",
                options: ["Rooftop", "Beach Bar", "Sports Bar", "Cocktail Bar", "Pub", "Club", "Live Music"]
              },
              {
                type: "string",
                name: "priceRange",
                label: "Price Range",
                options: [
                  { value: "$", label: "$ \u2014 Budget" },
                  { value: "$$", label: "$$ \u2014 Mid-range" },
                  { value: "$$$", label: "$$$ \u2014 Expensive" }
                ]
              },
              { type: "image", name: "image", label: "Photo" },
              { type: "string", name: "address", label: "Address" },
              {
                type: "object",
                name: "coordinates",
                label: "Coordinates",
                fields: [
                  { type: "number", name: "lat", label: "Latitude" },
                  { type: "number", name: "lng", label: "Longitude" }
                ]
              },
              { type: "string", name: "tags", label: "Tags", list: true }
            ]
          }
        ]
      },
      // ============================================
      // ACTIVITIES (Explore)
      // ============================================
      {
        name: "activities",
        label: "Activities",
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
                label: item?.isHotelService ? `* ${item?.name || "New Activity"}` : item?.name || "New Activity"
              })
            },
            fields: [
              { type: "string", name: "id", label: "ID", required: true },
              { type: "string", name: "name", label: "Name", required: true },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
              // --- Hotel Service Flag ---
              {
                type: "boolean",
                name: "isHotelService",
                label: "Hotel Service",
                description: "This is OUR activity (shown first with badge, links to Services)"
              },
              {
                type: "string",
                name: "linkedAmenityId",
                label: "Linked Amenity ID",
                description: "ID from Services/Amenities (e.g., yoga-classes). Only for hotel services."
              },
              // --- End Hotel Service ---
              {
                type: "string",
                name: "activityType",
                label: "Type",
                options: ["Temple", "Beach", "Waterfall", "Market", "Museum", "Viewpoint", "Diving", "Cooking Class", "Massage", "Yoga", "Tour"]
              },
              {
                type: "string",
                name: "priceRange",
                label: "Price Range",
                options: [
                  { value: "Free", label: "Free" },
                  { value: "$", label: "$ \u2014 Budget" },
                  { value: "$$", label: "$$ \u2014 Mid-range" },
                  { value: "$$$", label: "$$$ \u2014 Expensive" }
                ]
              },
              { type: "image", name: "image", label: "Photo" },
              { type: "string", name: "address", label: "Address" },
              {
                type: "object",
                name: "coordinates",
                label: "Coordinates",
                fields: [
                  { type: "number", name: "lat", label: "Latitude" },
                  { type: "number", name: "lng", label: "Longitude" }
                ]
              },
              { type: "string", name: "tags", label: "Tags", list: true }
            ]
          }
        ]
      },
      // ============================================
      // SERVICES — Internes à l'hôtel
      // ============================================
      // ============================================
      // AMENITIES (Services)
      // ============================================
      {
        name: "amenities",
        label: "Amenities",
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
                label: item?.name || "New Amenity"
              })
            },
            fields: [
              {
                type: "string",
                name: "id",
                label: "ID",
                required: true,
                description: "Unique slug (e.g., swimming-pool)"
              },
              {
                type: "string",
                name: "name",
                label: "Name",
                required: true
              },
              {
                type: "string",
                name: "description",
                label: "Description",
                ui: {
                  component: "textarea"
                }
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
                ]
              },
              {
                type: "string",
                name: "hours",
                label: "Opening Hours",
                description: "e.g., 07:00-22:00 or 24/7"
              },
              {
                type: "string",
                name: "price",
                label: "Price",
                description: "e.g., Free, 200 THB/hour, Included"
              },
              {
                type: "string",
                name: "location",
                label: "Location",
                description: "e.g., 3rd Floor, Rooftop, Building B"
              },
              {
                type: "image",
                name: "image",
                label: "Photo"
              },
              {
                type: "rich-text",
                name: "details",
                label: "Additional Details",
                description: "Menu, services list, rules, etc."
              },
              {
                type: "boolean",
                name: "isHighlighted",
                label: "Highlight on Home",
                description: "Show this amenity on the home page"
              },
              {
                type: "string",
                name: "tags",
                label: "Tags",
                list: true,
                description: "e.g., free, reservation-required, popular"
              }
            ]
          }
        ]
      },
      // ============================================
      // EVENTS (Services)
      // ============================================
      {
        name: "events",
        label: "Events",
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
                label: item?.title ? `${item.date} \u2014 ${item.title}` : "New Event"
              })
            },
            fields: [
              {
                type: "string",
                name: "id",
                label: "ID",
                required: true
              },
              {
                type: "string",
                name: "title",
                label: "Event Title",
                required: true
              },
              {
                type: "string",
                name: "description",
                label: "Description",
                ui: {
                  component: "textarea"
                }
              },
              {
                type: "datetime",
                name: "date",
                label: "Date",
                required: true
              },
              {
                type: "string",
                name: "time",
                label: "Time",
                description: "e.g., 18:00 or 18:00-21:00"
              },
              {
                type: "string",
                name: "location",
                label: "Location",
                description: "e.g., Rooftop, Main Lobby, Pool Area"
              },
              {
                type: "string",
                name: "price",
                label: "Price",
                description: "e.g., Free, 200 THB, 500 THB (includes dinner)"
              },
              {
                type: "image",
                name: "image",
                label: "Event Image"
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
                    description: "e.g., Join us!, Book now, More info"
                  },
                  {
                    type: "string",
                    name: "type",
                    label: "CTA Type",
                    options: [
                      { value: "whatsapp", label: "WhatsApp Message" },
                      { value: "link", label: "Custom Link" }
                    ]
                  },
                  {
                    type: "string",
                    name: "whatsappMessage",
                    label: "WhatsApp Pre-filled Message",
                    description: "Message sent when guest clicks (only for WhatsApp type)"
                  },
                  {
                    type: "string",
                    name: "url",
                    label: "Custom URL",
                    description: "Link destination (only for Custom Link type)"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
