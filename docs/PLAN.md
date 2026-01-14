# HostelGuide - Plan d'exécution

> **Dernière mise à jour** : 2026-01-14

## Vue d'ensemble

| # | Epic | Statut | Complexité | Fichier détail |
|---|------|--------|------------|----------------|
| 1 | Foundation | ✅ DONE | M | [01-foundation.md](features/01-foundation.md) |
| 2 | Branding & Theming | ✅ DONE | S | [02-branding.md](features/02-branding.md) |
| 3 | Home & Essential Info | ✅ DONE | M | [03-home.md](features/03-home.md) |
| 4 | Info Page | ✅ DONE | S | [04-info-page.md](features/04-info-page.md) |
| 5 | Spot Categories | ✅ DONE | M | [05-spots.md](features/05-spots.md) |
| 6 | Spot Detail | ✅ DONE | M | [06-spot-detail.md](features/06-spot-detail.md) |
| 7 | Events Calendar | ✅ DONE | L | [07-events.md](features/07-events.md) |
| 8 | PWA Configuration | ✅ DONE | S | [08-pwa.md](features/08-pwa.md) |
| 9-14 | ~~Anciennes tâches~~ | ❌ REMPLACÉ | - | - |
| **15** | **Migration TinaCMS** | ✅ DONE | M | [hostelguide-tinacms-migration.md](hostelguide-tinacms-migration.md) |

**Légende** : ⬜ TODO | 🟡 EN COURS | ✅ DONE | ⏸️ BLOCKED | ❌ REMPLACÉ

---

## Epic 15 : Migration TinaCMS

> **Objectif** : Migrer de PagesCMS vers TinaCMS avec nouvelle navigation et structure contenu.
> **Documentation complète** : [hostelguide-tinacms-migration.md](hostelguide-tinacms-migration.md)

### Changements Principaux

| Aspect | Avant | Après |
|--------|-------|-------|
| **CMS** | PagesCMS (.pages.yml) | TinaCMS (tina/config.ts) |
| **Bottom Nav** | 4 items | 5 items (Home, Explore, WhatsApp FAB, Services, Info) |
| **Contenu** | /content (flat) | /content/explore + /content/services |
| **Events** | Page /events séparée | Intégré dans /services |

### Phase 1: Setup TinaCMS ✅
- [x] Installer TinaCMS (`npx @tinacms/cli@latest init`)
- [x] Supprimer `.pages.yml`
- [x] Créer `tina/config.ts` avec schema complet
- [x] Mettre à jour scripts package.json
- [x] Créer structure content/ (explore/, services/, settings/, pages/)
- [x] Ajouter données exemples

### Phase 2: Navigation 5 éléments ✅
- [x] Modifier BaseLayout.astro (bottom nav 5 items)
- [x] Implémenter WhatsApp FAB central (surélevé, action directe)
- [x] Supprimer page /events

### Phase 3: Pages Services ✅
- [x] Créer /services avec amenities + events
- [x] Modifier /explore pour supporter isHotelService
- [x] Adapter SpotCard pour badge "Our Place"

### Phase 4: Types et Content Loader ✅
- [x] Ajouter types Amenity, HotelEvent
- [x] Modifier content.ts pour nouvelle structure
- [x] Tester chargement données

### Phase 5: Déploiement
- [ ] Setup Tina Cloud (app.tina.io)
- [ ] Configurer variables Vercel (TINA_CLIENT_ID, TINA_TOKEN)
- [ ] Test complet en production

---

## Progression globale

```
[██████████████████░░] 90% (9/10 epics terminés - reste déploiement Tina Cloud)
```

---

## Notes de session

### 2026-01-14
- **Migration TinaCMS terminée en local** (Epic 15 - Phases 1-4)
  - TinaCMS installé et configuré (`tina/config.ts`)
  - `.pages.yml` supprimé
  - Nouvelle structure content/ : explore/, services/, settings/, pages/
  - Navigation 5 éléments avec WhatsApp FAB central
  - Page /services créée (amenities + events)
  - Types et content loader mis à jour
  - **Reste à faire** : Phase 5 (déploiement Tina Cloud + Vercel)
- **Amélioration Bottom Bar** :
  - Labels texte supprimés (icônes seules)
  - Icône Explore : `explore` → `menu_book`
  - Icône Info : `menu_book` → `info_i`
  - Hauteur réduite : 80px → 68px (-15%)
- Décisions précédentes :
  - Nouvelle navigation : 5 éléments avec WhatsApp FAB central
  - Nouvelle structure contenu : Explore (externe) vs Services (interne)
  - Pattern isHotelService pour cross-linking spots/services
  - Events intégrés dans page Services (suppression /events)
  - Pages catégories (/restaurants, /bars, etc.) conservées
  - Données exemples utilisées (owner remplira le vrai contenu)
- **6 nouvelles décisions documentées** dans DECISIONS.md

### 2026-01-10
- Projet initialisé
- Structure documentation créée
- PRD déplacé vers docs/
- **Epic 1 (Foundation) terminé** :
  - Astro 5.16.8 + TypeScript strict
  - Tailwind CSS 4 avec CSS variables
  - Structure /content complète
  - Types TypeScript stricts
  - Content loader fonctionnel
  - BaseLayout avec theming dynamique
  - Page index de test validée
- **Epic 2 (Branding & Theming) terminé** :
  - Répertoire /src/components/ créé
  - Composant Header.astro avec logo et nom
  - Header intégré dans BaseLayout (sticky, primary color)
  - Page index nettoyée
- **Epic 3 (Home & Essential Info) terminé** :
  - WiFiCard.astro avec tap-to-copy (Clipboard API + feedback "Copied!")
  - CategoryCard.astro pour navigation (grille et pleine largeur)
  - Page index complète : WiFi, grille 2x2, This Week, Info/Rules, check-in/out
- **Epic 4 (Info Page) terminé** :
  - EmergencyContacts.astro avec liens tel: cliquables
  - Styles .prose pour rendu markdown
  - Page /info : house rules, how to get here, contacts urgence
- **Epic 5 (Spot Categories) terminé** :
  - SpotCard.astro avec image 16:9, badges, description tronquée
  - Filtre cuisine intégré dans restaurants.astro (URL params)
  - 5 pages catégories : /restaurants, /laundry, /transport, /bars, /activities
- **Epic 6 (Spot Detail) terminé** :
  - Page dynamique /spot/[id].astro avec getStaticPaths
  - deeplinks.ts pour URLs Google Maps
  - findSpotById() dans content.ts
  - Boutons sticky : Directions + Copy Address
- **Epic 7 (Events Calendar) terminé** :
  - getWhatsAppUrl() ajouté à deeplinks.ts
  - EventCard.astro avec date, horaires, CTA
  - Page /events avec liste événements de la semaine
- **Epic 8 (PWA Configuration) terminé** :
  - manifest.json créé avec icônes et metadata
  - Icônes PWA générées (192x192, 512x512, favicon)
  - Meta tags PWA déjà présents dans BaseLayout
- **Planification v2** :
  - Ajout Epics 10-14 basé sur feedback utilisateur
  - 8 nouvelles décisions documentées dans DECISIONS.md
  - Décisions clés :
    - Bottom Nav : Home / Explore / Events / Infos
    - Thèmes : Light/Dark presets + primary/accent/font customisables
    - Horaires : Structure default + exceptions par jour
    - Images par défaut : Illustrations stylisées (à fournir par user)
    - Maps : Bouton principal + Copy secondaire
    - PWA : Modal install au premier lancement
    - Styling : Reste sur Tailwind CSS
  - Epic 14 (Redesign UI) bloqué en attente des nouveaux mockups
