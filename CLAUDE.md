# HostelGuide

## Résumé

PWA "brochure digitale" pour hostels en Asie du Sud-Est. Les guests scannent un QR code et accèdent instantanément aux infos essentielles (WiFi, restaurants, services, événements). Le owner gère le contenu via PagesCMS sans toucher au code.

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | Astro (SSG) |
| Styling | Tailwind CSS |
| CMS | TinaCMS (tina/config.ts) |
| Hosting | Vercel |
| PWA | manifest.json (install prompt, pas d'offline) |

## Commandes utiles

```bash
# Développement
npm run dev         # Démarre le serveur de dev (localhost:4321)

# Build
npm run build       # Build de production
npm run preview     # Preview du build

# Vérification
npm run check       # Vérification TypeScript
```

## Structure du projet

```
/content
  /explore        # Spots externes (restaurants, bars, etc.)
  /services       # Amenities + Events de l'hostel
  /settings       # Configuration globale (global.json)
  /pages          # Pages markdown (house rules, etc.)
/tina             # Configuration TinaCMS
/public           # Assets statiques (images, manifest)
/src
  /components     # Composants Astro (.astro)
  /layouts        # Layouts (BaseLayout)
  /pages          # Pages (routing automatique)
  /lib            # Utilitaires TypeScript
  /styles         # CSS global + Tailwind
```

## Conventions de code

- **Composants** : PascalCase (`SpotCard.astro`)
- **Utilitaires** : camelCase (`deeplinks.ts`)
- **JSON keys** : camelCase
- **CSS variables** : kebab-case (`--color-primary`)
- **Pas de `any`** en TypeScript
- **Langue UI** : Anglais uniquement (pas d'i18n pour MVP)

## Utilitaires disponibles

### Géolocalisation (`src/lib/geolocation.ts`)

Calcul de distance entre l'utilisateur et les spots. **Utiliser sur toutes les pages qui affichent des spots.**

```typescript
import { initDistanceDisplay } from '../lib/geolocation';

// Dans un <script> client-side
initDistanceDisplay();
```

**Fonctions disponibles :**
- `initDistanceDisplay()` - Met à jour automatiquement tous les éléments avec distance
- `calculateDistance(lat1, lng1, lat2, lng2)` - Formule Haversine (retourne mètres)
- `formatDistance(meters)` - Formate "200m" ou "1.2km"
- `getUserLocation()` - Récupère position utilisateur

**Classes CSS requises dans le HTML :**
- `.distance-display[data-lat][data-lng]` - Élément qui affichera la distance
- `.distance-separator` - Séparateur optionnel (affiché quand distance disponible)
- `.distance-badge[data-lat][data-lng]` - Badge sur les cards (pour les listes)

### Horaires d'ouverture (`src/lib/openingHours.ts`)

Vérification si un spot est ouvert et formatage des horaires.

```typescript
import { isOpen, getFormattedHours, getTodayHours } from '../lib/openingHours';

isOpen(spot.openingHours);           // true | false | null
getTodayHours(spot.openingHours);    // "11:30-22:00" | "Closed today" | null
getFormattedHours(spot.openingHours); // Array des 7 jours avec horaires
```

**Supporte deux formats :**
- Simple : `"11:30-22:00"`
- Détaillé : `{ default: "11:30-22:00", exceptions: { monday: "closed" } }`

## Pointeurs documentation

| Fichier | Description |
|---------|-------------|
| [docs/PRD.md](docs/PRD.md) | Product Requirements Document complet |
| [docs/PLAN.md](docs/PLAN.md) | Plan d'exécution avec statuts |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Log des décisions techniques |
| [docs/STYLEGUIDE.md](docs/STYLEGUIDE.md) | Conventions code et design |
| [docs/features/](docs/features/) | Détail par feature/epic |

## État actuel

**Phase** : Epic 15 (Migration TinaCMS) - Phases 1-4 terminées
**Dernière mise à jour** : 2026-01-14

### Fait
- [x] Structure documentation créée
- [x] PRD déplacé vers docs/
- [x] Projet Astro initialisé avec TypeScript strict
- [x] Tailwind CSS 4 configuré avec CSS variables
- [x] Types TypeScript complets (src/lib/types.ts)
- [x] Content loader avec typage strict (src/lib/content.ts)
- [x] BaseLayout avec injection CSS variables dynamique
- [x] Composant Header avec logo et nom de l'hostel
- [x] Système de theming dynamique fonctionnel
- [x] WiFiCard avec tap-to-copy (Clipboard API + feedback)
- [x] CategoryCard pour navigation
- [x] Page d'accueil complète
- [x] EmergencyContacts avec liens tel:
- [x] Styles .prose pour markdown
- [x] Page /info avec house rules, how to get here, contacts urgence
- [x] SpotCard avec image 16:9, badges, description tronquée
- [x] Filtre cuisine intégré (URL params)
- [x] Pages catégories : /restaurants, /laundry, /transport, /bars, /activities
- [x] Page spot detail dynamique
- [x] Boutons sticky : Directions (Google Maps) + Copy Address
- [x] deeplinks.ts pour URLs Maps + WhatsApp
- [x] EventCard avec date, horaires, CTA WhatsApp
- [x] manifest.json avec icônes et metadata PWA
- [x] **Migration TinaCMS** : tina/config.ts, nouvelle structure content/
- [x] **Navigation 5 éléments** : Home, Explore, WhatsApp FAB, Services, Info
- [x] **Page /services** : amenities + events intégrés

### Prochaines étapes (Phase 5 - Déploiement)
- [ ] Setup Tina Cloud (app.tina.io)
- [ ] Configurer variables Vercel (TINA_CLIENT_ID, TINA_TOKEN)
- [ ] Test complet en production
