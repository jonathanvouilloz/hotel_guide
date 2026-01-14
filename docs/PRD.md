# PRD — HostelGuide

> **Version:** 2.0
> **Date:** 2025-01-10
> **Auteur:** Jonathan Vouilloz
> **Statut:** Ready for development

---

## 1. Vision & Contexte

### Problème
Les propriétaires d'hostels passent leur temps à répondre aux mêmes questions répétitives des voyageurs : "C'est quoi le WiFi ?", "Où manger ?", "Où faire ma lessive ?", "Comment louer un scooter ?", "C'est quoi le programme de la semaine ?". Ces infos existent dans leur tête mais ne sont pas accessibles facilement. Résultat : perte de temps pour le owner, frustration pour le guest qui doit attendre une réponse.

### Solution
Une PWA "brochure digitale" que le owner peut personnaliser avec son branding et remplir avec tous ses bons plans. Les guests scannent un QR code à l'arrivée et ont accès instantanément à toutes les infos : WiFi, règles, restaurants, services, transport, planning de la semaine. Chaque lieu a des boutons d'action directs (Google Maps, copier l'adresse).

### Utilisateurs cibles

**Owner (admin)**
- Propriétaire d'hostel/guesthouse en Asie du Sud-Est principalement
- Pas forcément tech-savvy, veut un truc simple à mettre à jour
- Organise régulièrement des activités (cooking class, excursions, happy hours)
- Frustration : répéter les mêmes infos 10x par jour

**Guest (utilisateur final)**
- Backpackers, digital nomads, voyageurs
- Mobile-first (souvent pas d'ordi)
- Veut des infos rapides et actionnables (pas lire, cliquer et y aller)

### Succès
- Un owner peut setup son guide en < 30 minutes
- Un guest trouve l'info qu'il cherche en < 10 secondes
- Le owner ne répond plus aux questions basiques (WiFi, lessive, restos, etc.)
- Adoption : le premier hostel (Thaïlande) utilise activement le guide

---

## 2. Scope

### ✅ IN — MVP

- [ ] **Infos essentielles** : WiFi (nom + password), check-in/out times, house rules, emergency contacts
- [ ] **How to get here** : Instructions depuis aéroport/gare
- [ ] **Catégories de spots fixes** : Restaurants, Laundry, Transport, Bars, Activities
- [ ] **Fiche spot complète** : nom, description, type cuisine, photo, adresse, prix indicatif, boutons action
- [ ] **Boutons action** : Google Maps (directions), Copy address
- [ ] **Planning semaine** : événements sur 7 jours (sans récurrence, events créés manuellement)
- [ ] **CTA sur événements** : bouton "Plus d'infos" / "S'inscrire" (lien WhatsApp ou custom)
- [ ] **Branding** : logo + couleurs primary/accent par hostel
- [ ] **Langue** : English only
- [ ] **PWA Light** : manifest.json pour install prompt, pas de offline
- [ ] **Admin via PagesCMS** : édition GitHub, pas de backend custom

### ❌ OUT — Pas dans cette version

- Récurrence automatique des événements
- Traduction multi-langue (DeepL)
- Offline mode (Service Worker / Workbox)
- Système de réservation/booking intégré
- Paiement en ligne
- Authentification guest (login)
- Chat/messaging
- Reviews/ratings des spots
- Multi-hostel dans une seule instance (1 repo = 1 hostel)
- App native iOS/Android
- Deep links Grab/Bolt (n'existent pas)

### 🔮 LATER — V2 potentielle

- Template marketplace (plusieurs hostels, SaaS)
- Multi-langue avec traduction auto
- Analytics (quels spots sont les plus consultés)
- Système de notification push pour les events
- Récurrence événements automatique
- Mode "offline-first" complet avec sync
- Génération QR code intégrée

---

## 3. User Stories & Flows

### Story 1: Guest cherche le WiFi

**En tant que** guest de l'hostel
**Je veux** trouver le mot de passe WiFi instantanément
**Afin de** me connecter sans demander au staff

**Flow détaillé:**
1. Le guest scanne le QR code ou ouvre le lien
2. Il arrive sur la home avec le logo de l'hostel
3. Le WiFi est affiché directement en haut (nom + password)
4. Il peut cliquer sur le password pour le copier dans le clipboard

**Critères d'acceptation:**
- [ ] WiFi visible sans scroll sur mobile
- [ ] Tap to copy fonctionne
- [ ] Feedback visuel "Copied!" après le tap

---

### Story 2: Guest consulte les restaurants

**En tant que** guest de l'hostel
**Je veux** voir la liste des restaurants recommandés
**Afin de** choisir où manger sans demander au staff

**Flow détaillé:**
1. Depuis la home, il tape sur "Restaurants" 🍜
2. Il voit la liste des restos avec : photo, nom, type cuisine (Thai, Western, etc.), indicateur prix (€/€€/€€€)
3. Il tape sur un resto pour voir le détail
4. Il voit : description, adresse, photo(s)
5. Il tape "Get directions" → Google Maps s'ouvre avec l'itinéraire
6. OU il tape "Copy address" → L'adresse est copiée dans le clipboard

**Critères d'acceptation:**
- [ ] Liste filtrable par type de cuisine (toggle/chips)
- [ ] Chaque carte affiche les infos essentielles sans cliquer
- [ ] Bouton Maps fonctionne sur iOS ET Android
- [ ] Bouton Copy address avec feedback "Copied!"
- [ ] Page charge en < 2s sur 3G

**Edge cases:**
- Si pas de photo → afficher placeholder avec icône catégorie

---

### Story 3: Guest consulte le planning de la semaine

**En tant que** guest
**Je veux** voir ce qui est organisé cette semaine
**Afin de** m'inscrire aux activités qui m'intéressent

**Flow détaillé:**
1. Depuis la home, le guest tape sur "This Week" 📅
2. Il voit un calendrier simple avec les 7 prochains jours
3. Les jours avec événements ont un indicateur visuel
4. Il tape sur un jour pour voir les événements
5. Il voit : heure, titre, description courte, lieu (optionnel)
6. Si CTA configuré → bouton "Join" / "More info" visible
7. Il tape le bouton → ouvre WhatsApp avec message pré-rempli ou lien custom

**Critères d'acceptation:**
- [ ] Vue semaine lisible (pas de scroll horizontal pénible)
- [ ] CTA WhatsApp pré-remplit le message (ex: "Hi! I'd like to join the Cooking Class on Thursday")
- [ ] Timezone correcte (locale du hostel, pas du device)

**Edge cases:**
- Si aucun événement cette semaine → message "No events planned. Check back soon!"
- Si événement passé dans la journée → griser ou masquer

---

### Story 4: Owner ajoute un nouveau spot

**En tant que** owner
**Je veux** ajouter un nouveau restaurant à ma liste
**Afin que** mes guests puissent le découvrir

**Flow détaillé:**
1. Le owner se connecte à PagesCMS (GitHub OAuth)
2. Il navigue vers Content > Restaurants
3. Il clique "New entry"
4. Il remplit : nom, description, type cuisine (select), prix (€/€€/€€€)
5. Il entre l'adresse manuellement
6. Il entre les coordonnées lat/lng (ou les récupère depuis Google Maps)
7. Il upload une photo (ou colle une URL)
8. Il sauvegarde → commit GitHub → rebuild Vercel
9. En ~1 minute, le spot est live

**Critères d'acceptation:**
- [ ] Interface PagesCMS intuitive (labels clairs, help text)
- [ ] Preview possible avant publish

**Edge cases:**
- Si photo trop lourde → compression auto ou warning

---

### Story 5: Owner configure son hostel

**En tant que** owner
**Je veux** personnaliser les infos de base et le branding
**Afin que** le guide ressemble à mon hostel

**Flow détaillé:**
1. Dans PagesCMS, section "Settings"
2. Il configure :
   - Hostel Name
   - Logo (upload)
   - Primary Color (picker)
   - Accent Color (picker)
   - WiFi Name + Password
   - Check-in / Check-out times
   - Contact WhatsApp
   - Emergency contacts
3. Dans section "House Rules", il ajoute ses règles
4. Dans section "How to Get Here", il écrit les instructions
5. Sauvegarde → rebuild

**Critères d'acceptation:**
- [ ] Logo affiché en header sur toutes les pages
- [ ] Primary color = backgrounds principaux, boutons
- [ ] Accent color = highlights, badges, icônes
- [ ] WiFi affiché en évidence sur la home

---

## 4. Data Model

### Structure fichiers (PagesCMS)

```
/content
├── settings.json           # Config hostel (branding, WiFi, contacts)
├── house-rules.md          # Règles de la maison (markdown)
├── how-to-get-here.md      # Instructions arrivée (markdown)
├── spots/
│   ├── restaurants.json    # Liste restaurants
│   ├── laundry.json        # Liste laveries
│   ├── transport.json      # Scooters, infos transport
│   ├── bars.json           # Bars & nightlife
│   └── activities.json     # Excursions, tours
└── events.json             # Événements de la semaine
```

### Schéma settings.json

```json
{
  "hostelName": "Chill House Chiang Mai",
  "logo": "/images/logo.png",
  "primaryColor": "#2563eb",
  "accentColor": "#f59e0b",
  "wifi": {
    "name": "ChillHouse_Guest",
    "password": "welcome2024"
  },
  "checkIn": "14:00",
  "checkOut": "11:00",
  "contactWhatsApp": "+66812345678",
  "emergencyContacts": [
    { "name": "Hostel Reception", "phone": "+66812345678" },
    { "name": "Tourist Police", "phone": "1155" },
    { "name": "Hospital (Ram)", "phone": "+6653920300" },
    { "name": "Embassy", "phone": "+66..." }
  ],
  "timezone": "Asia/Bangkok"
}
```

### Schéma Spot (restaurants.json, etc.)

```json
{
  "spots": [
    {
      "id": "pad-thai-heaven",
      "name": "Pad Thai Heaven",
      "description": "Best pad thai in the old city. Family-run, authentic recipes.",
      "cuisineType": "thai",
      "priceRange": "€",
      "image": "/images/spots/pad-thai-heaven.jpg",
      "address": "123 Ratchadamnoen Rd, Chiang Mai",
      "coordinates": {
        "lat": 18.7883,
        "lng": 98.9853
      },
      "tags": ["local-favorite", "vegetarian-options"]
    }
  ]
}
```

### Schéma Event (events.json)

```json
{
  "events": [
    {
      "id": "cooking-class-jan-15",
      "title": "Thai Cooking Class",
      "description": "Learn to make 3 authentic Thai dishes with our chef.",
      "date": "2025-01-15",
      "startTime": "14:00",
      "endTime": "17:00",
      "location": "Hostel Kitchen",
      "price": "500 THB",
      "cta": {
        "type": "whatsapp",
        "label": "Book your spot",
        "message": "Hi! I'd like to join the Cooking Class on January 15th"
      }
    },
    {
      "id": "happy-hour-jan-16",
      "title": "Happy Hour",
      "description": "2-for-1 beers and cocktails!",
      "date": "2025-01-16",
      "startTime": "18:00",
      "endTime": "21:00",
      "location": "Rooftop Bar",
      "price": null,
      "cta": null
    }
  ]
}
```

### Types cuisine (enum)

```typescript
type CuisineType = 
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
```

---

## 5. Stack Technique

| Couche | Choix | Justification |
|--------|-------|---------------|
| Framework | **Astro** | SSG, markdown-friendly, perf optimale, content-first |
| CMS | **PagesCMS** | Git-based, UI simple, gratuit, édite direct sur GitHub |
| Hosting | **Vercel** | Deploy auto sur push, preview branches, gratuit |
| PWA | **manifest.json** | Install prompt simple, pas besoin d'offline |
| Styling | **Tailwind CSS** | Utility-first, responsive facile, CSS variables pour theming |

### Dépendances clés

```json
{
  "dependencies": {
    "astro": "^4.x",
    "@astrojs/tailwind": "^5.x"
  },
  "devDependencies": {
    "@types/node": "^20.x",
    "typescript": "^5.x"
  }
}
```

---

## 6. Règles & Conventions

### Structure du projet

```
/
├── content/                 # JSON/MD content (PagesCMS edits this)
│   ├── settings.json
│   ├── house-rules.md
│   ├── how-to-get-here.md
│   ├── spots/
│   └── events.json
├── public/
│   ├── images/
│   └── manifest.json        # PWA manifest
├── src/
│   ├── components/
│   │   ├── SpotCard.astro
│   │   ├── EventCard.astro
│   │   ├── CategoryNav.astro
│   │   ├── WiFiCard.astro
│   │   └── WeekCalendar.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── restaurants.astro
│   │   ├── laundry.astro
│   │   ├── transport.astro
│   │   ├── bars.astro
│   │   ├── activities.astro
│   │   ├── events.astro
│   │   ├── info.astro          # House rules, how to get here
│   │   └── spot/[id].astro
│   ├── lib/
│   │   ├── content.ts          # Load JSON/MD content
│   │   └── deeplinks.ts        # Maps URL builders
│   └── styles/
│       └── global.css          # Tailwind + CSS variables
├── .pages.yml                  # PagesCMS config
├── astro.config.mjs
└── package.json
```

### Conventions de code

- Composants: PascalCase (`SpotCard.astro`)
- Fichiers utilitaires: camelCase (`deeplinks.ts`)
- JSON keys: camelCase
- CSS variables: kebab-case (`--color-primary`)
- Pas de `any` TypeScript
- Tout texte UI hardcodé en anglais (pas de i18n pour MVP)

---

## 7. UI/UX Guidelines

### Style général
- [x] **Mobile-first** : 100% optimisé tactile, pas de hover states critiques
- [x] **Minimaliste** : focus sur le contenu, pas de déco superflue
- [x] **Accessible** : contraste AA minimum, touch targets 44px

### Layout mobile — Home

```
┌─────────────────────────┐
│  [Logo]                 │  ← Header
├─────────────────────────┤
│                         │
│  Welcome to             │
│  [Hostel Name]          │
│                         │
│  ┌─────────────────┐   │
│  │ 📶 WiFi         │   │  ← WiFi card (prominent)
│  │ Name: Guest_5G  │   │
│  │ Pass: ●●●●● 📋  │   │  ← Tap to copy
│  └─────────────────┘   │
│                         │
│  ┌─────┐ ┌─────┐       │
│  │ 🍜  │ │ 🧺  │       │  ← Category grid
│  │Food │ │Laun │       │
│  └─────┘ └─────┘       │
│  ┌─────┐ ┌─────┐       │
│  │ 🛵  │ │ 🍺  │       │
│  │Move │ │Bars │       │
│  └─────┘ └─────┘       │
│  ┌─────────────┐       │
│  │     📅      │       │
│  │  This Week  │       │
│  └─────────────┘       │
│  ┌─────────────┐       │
│  │     ℹ️      │       │
│  │  Info/Rules │       │
│  └─────────────┘       │
│                         │
│  Check-in: 14:00        │
│  Check-out: 11:00       │
│                         │
└─────────────────────────┘
```

### Composants clés

| Composant | Description |
|-----------|-------------|
| **WiFiCard** | Nom + password avec tap-to-copy, très visible |
| **SpotCard** | Photo (aspect 16:9), nom, badges (cuisine, prix), preview description |
| **SpotDetail** | Full info + action buttons sticky en bas |
| **EventCard** | Date badge, heure, titre, CTA si présent |
| **WeekCalendar** | 7 jours en row, scroll horizontal si besoin, dots pour events |
| **ActionButton** | Full-width, icône + label, couleurs par type (Maps=blue, Copy=gray) |
| **InfoPage** | House rules + How to get here + Emergency contacts |

### Theming CSS Variables

```css
:root {
  --color-primary: #2563eb;      /* From settings.json */
  --color-accent: #f59e0b;       /* From settings.json */
  --color-bg: #ffffff;
  --color-text: #1f2937;
  --color-muted: #6b7280;
  --radius: 12px;
}
```

---

## 8. Deep Links & Actions

| Action | URL | Notes |
|--------|-----|-------|
| **Google Maps directions** | `https://www.google.com/maps/dir/?api=1&destination={lat},{lng}` | Cross-platform |
| **Copy to clipboard** | JavaScript `navigator.clipboard.writeText()` | Avec feedback "Copied!" |
| **WhatsApp** | `https://wa.me/{phone}?text={encodedMessage}` | Pour CTA events |
| **Phone call** | `tel:{phone}` | Pour emergency contacts |

---

## 9. Config PagesCMS (.pages.yml)

```yaml
# .pages.yml
content:
  - name: settings
    label: "⚙️ Settings"
    path: content/settings.json
    type: file
    fields:
      - name: hostelName
        label: Hostel Name
        type: string
        required: true
      - name: logo
        label: Logo
        type: image
        options:
          path: public/images
      - name: primaryColor
        label: Primary Color
        type: string
        options:
          format: color
      - name: accentColor
        label: Accent Color
        type: string
        options:
          format: color
      - name: wifi
        label: WiFi
        type: object
        fields:
          - name: name
            label: Network Name
            type: string
          - name: password
            label: Password
            type: string
      - name: checkIn
        label: Check-in Time
        type: string
        description: "Format: HH:MM (e.g. 14:00)"
      - name: checkOut
        label: Check-out Time
        type: string
        description: "Format: HH:MM (e.g. 11:00)"
      - name: contactWhatsApp
        label: WhatsApp Number
        type: string
        description: "Include country code, e.g. +66812345678"
      - name: emergencyContacts
        label: Emergency Contacts
        type: object
        list: true
        fields:
          - name: name
            label: Name
            type: string
          - name: phone
            label: Phone
            type: string
      - name: timezone
        label: Timezone
        type: select
        options:
          values:
            - Asia/Bangkok
            - Asia/Ho_Chi_Minh
            - Asia/Jakarta
            - Asia/Bali
            - Asia/Manila
            - Asia/Singapore
            - Asia/Kuala_Lumpur

  - name: house-rules
    label: "📋 House Rules"
    path: content/house-rules.md
    type: file
    fields:
      - name: body
        label: Content
        type: rich-text

  - name: how-to-get-here
    label: "🗺️ How to Get Here"
    path: content/how-to-get-here.md
    type: file
    fields:
      - name: body
        label: Content
        type: rich-text

  - name: restaurants
    label: "🍜 Restaurants"
    path: content/spots/restaurants.json
    type: file
    fields:
      - name: spots
        label: Restaurants
        type: object
        list: true
        fields:
          - name: id
            type: uuid
            hidden: true
          - name: name
            label: Name
            type: string
            required: true
          - name: description
            label: Description
            type: text
          - name: cuisineType
            label: Cuisine Type
            type: select
            options:
              values:
                - thai
                - western
                - japanese
                - chinese
                - indian
                - italian
                - mexican
                - korean
                - vietnamese
                - vegetarian
                - vegan
                - seafood
                - street-food
                - cafe
                - other
          - name: priceRange
            label: Price Range
            type: select
            options:
              values:
                - "€"
                - "€€"
                - "€€€"
          - name: image
            label: Photo
            type: image
            options:
              path: public/images/spots
          - name: address
            label: Address
            type: string
          - name: coordinates
            label: Coordinates
            type: object
            description: "Get from Google Maps: right-click on location → copy coordinates"
            fields:
              - name: lat
                label: Latitude
                type: number
              - name: lng
                label: Longitude
                type: number

  - name: laundry
    label: "🧺 Laundry"
    path: content/spots/laundry.json
    type: file
    fields:
      - name: spots
        label: Laundry Services
        type: object
        list: true
        fields:
          - name: id
            type: uuid
            hidden: true
          - name: name
            label: Name
            type: string
            required: true
          - name: description
            label: Description
            type: text
          - name: priceRange
            label: Price Range
            type: select
            options:
              values:
                - "€"
                - "€€"
                - "€€€"
          - name: image
            label: Photo
            type: image
            options:
              path: public/images/spots
          - name: address
            label: Address
            type: string
          - name: coordinates
            label: Coordinates
            type: object
            fields:
              - name: lat
                label: Latitude
                type: number
              - name: lng
                label: Longitude
                type: number

  - name: transport
    label: "🛵 Transport"
    path: content/spots/transport.json
    type: file
    fields:
      - name: spots
        label: Transport Options
        type: object
        list: true
        fields:
          - name: id
            type: uuid
            hidden: true
          - name: name
            label: Name
            type: string
            required: true
          - name: description
            label: Description
            type: text
          - name: priceRange
            label: Price Range
            type: select
            options:
              values:
                - "€"
                - "€€"
                - "€€€"
          - name: image
            label: Photo
            type: image
            options:
              path: public/images/spots
          - name: address
            label: Address
            type: string
          - name: coordinates
            label: Coordinates
            type: object
            fields:
              - name: lat
                label: Latitude
                type: number
              - name: lng
                label: Longitude
                type: number

  - name: bars
    label: "🍺 Bars"
    path: content/spots/bars.json
    type: file
    fields:
      - name: spots
        label: Bars & Nightlife
        type: object
        list: true
        fields:
          - name: id
            type: uuid
            hidden: true
          - name: name
            label: Name
            type: string
            required: true
          - name: description
            label: Description
            type: text
          - name: priceRange
            label: Price Range
            type: select
            options:
              values:
                - "€"
                - "€€"
                - "€€€"
          - name: image
            label: Photo
            type: image
            options:
              path: public/images/spots
          - name: address
            label: Address
            type: string
          - name: coordinates
            label: Coordinates
            type: object
            fields:
              - name: lat
                label: Latitude
                type: number
              - name: lng
                label: Longitude
                type: number

  - name: activities
    label: "🎯 Activities"
    path: content/spots/activities.json
    type: file
    fields:
      - name: spots
        label: Activities & Tours
        type: object
        list: true
        fields:
          - name: id
            type: uuid
            hidden: true
          - name: name
            label: Name
            type: string
            required: true
          - name: description
            label: Description
            type: text
          - name: priceRange
            label: Price Range
            type: select
            options:
              values:
                - "€"
                - "€€"
                - "€€€"
          - name: image
            label: Photo
            type: image
            options:
              path: public/images/spots
          - name: address
            label: Address
            type: string
          - name: coordinates
            label: Coordinates
            type: object
            fields:
              - name: lat
                label: Latitude
                type: number
              - name: lng
                label: Longitude
                type: number

  - name: events
    label: "📅 This Week"
    path: content/events.json
    type: file
    fields:
      - name: events
        label: Events
        type: object
        list: true
        fields:
          - name: id
            type: uuid
            hidden: true
          - name: title
            label: Title
            type: string
            required: true
          - name: description
            label: Description
            type: text
          - name: date
            label: Date
            type: date
            required: true
          - name: startTime
            label: Start Time
            type: string
            description: "Format: HH:MM (e.g. 18:00)"
          - name: endTime
            label: End Time
            type: string
          - name: location
            label: Location
            type: string
          - name: price
            label: Price
            type: string
            description: "e.g. '500 THB' or 'Free'"
          - name: cta
            label: Call to Action
            type: object
            fields:
              - name: type
                label: Type
                type: select
                options:
                  values:
                    - whatsapp
                    - link
              - name: label
                label: Button Text
                type: string
              - name: url
                label: URL or Phone
                type: string
                description: "WhatsApp: phone number. Link: full URL."
              - name: message
                label: Pre-filled Message
                type: text
                description: "For WhatsApp only"

media:
  path: public/images
  extensions: [jpg, jpeg, png, webp, svg]
```

---

## 10. Sécurité & Auth

### Authentification
- [x] **MVP : Pas d'auth guest** (lien public)

### Admin (PagesCMS)
- GitHub OAuth uniquement
- Seul le owner a accès au repo (tu fais le setup initial)

### Données sensibles
- Pas de données personnelles guests stockées
- WhatsApp numbers owners dans settings.json (public de toute façon)

---

## 11. Déploiement & Environnement

### Variables d'environnement

```env
# Aucune variable requise pour le MVP
# Le contenu est statique, pas d'API externe
```

### Environnements

| Env | URL | Notes |
|-----|-----|-------|
| Local | localhost:4321 | `npm run dev` |
| Preview | pr-xxx.vercel.app | Auto sur PR |
| Prod | {hostel-slug}.vercel.app | Custom domain possible |

### Workflow déploiement

```
Owner edits content in PagesCMS
  → Commit to main branch
  → Vercel webhook triggered
  → Build static site
  → Deploy (~30 sec)
  → Live!
```

---

## 12. Roadmap MVP

### Phase 1 : Setup (Day 1)
- [ ] Init projet Astro
- [ ] Config Tailwind + CSS variables theming
- [ ] Structure fichiers content/
- [ ] Config PagesCMS (.pages.yml)
- [ ] manifest.json pour PWA
- [ ] Deploy Vercel vide

### Phase 2 : Core UI (Day 2-3)
- [ ] Layout mobile + header
- [ ] Home avec WiFi card + grid catégories
- [ ] Page Info (house rules, how to get here, emergency)
- [ ] Liste spots (SpotCard)
- [ ] Détail spot (SpotDetail) + action buttons
- [ ] Deep links Maps + Copy to clipboard

### Phase 3 : Events (Day 4)
- [ ] Week calendar view
- [ ] Event cards
- [ ] CTA buttons (WhatsApp)

### Phase 4 : Polish (Day 5)
- [ ] Test sur vrais devices (iOS + Android)
- [ ] Ajuster responsive
- [ ] Créer contenu de démo
- [ ] Handoff au owner + formation PagesCMS

---

## 13. Changelog

| Date | Version | Changements |
|------|---------|-------------|
| 2025-01-10 | 1.0 | Création initiale |
| 2025-01-10 | 2.0 | Ajout WiFi/emergency/house rules/how-to-get-here, retrait récurrence events, retrait DeepL, PWA light |
