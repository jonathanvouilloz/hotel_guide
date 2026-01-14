# HostelGuide - Plan d'exécution

> **Dernière mise à jour** : 2026-01-10

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
| 9 | Deploy & Polish | ⬜ TODO | M | [09-deploy.md](features/09-deploy.md) |
| 10 | Améliorations UX | ⬜ TODO | M | - |
| 11 | Système de Thèmes | ⬜ TODO | M | - |
| 12 | Contenu & Données | ⬜ TODO | M | - |
| 13 | Build Optimization | ⬜ TODO | S | - |
| 14 | Redesign UI | ⏸️ BLOCKED | L | - |

**Légende** : ⬜ TODO | 🟡 EN COURS | ✅ DONE | ⏸️ BLOCKED

---

## Prochaines étapes prioritaires

### Epic 13 : Build Optimization (immédiat)
- [ ] Créer `vercel.json` avec règles ignoreBuildStep pour images seules
- [ ] Documenter workflow optimal PagesCMS

### Epic 10 : Améliorations UX
- [ ] Créer composant `BottomNav.astro` (Home/Explore/Events/Infos)
- [ ] Ajouter back button (←) dans `Header.astro`
- [ ] Créer composant `InstallPrompt.astro` (modal PWA)
- [ ] Refactorer boutons spot detail : Maps principal + Copy secondaire
- [ ] Ajouter fonction `getMapsSearchUrl()` dans `deeplinks.ts`

### Epic 11 : Système de Thèmes
- [ ] Définir palettes light/dark dans `global.css`
- [ ] Ajouter champs theme/fontFamily dans `settings.json`
- [ ] Mettre à jour `BaseLayout.astro` pour injection thème
- [ ] Mettre à jour `.pages.yml` pour PagesCMS

### Epic 12 : Contenu & Données
- [ ] Créer dossier `public/images/defaults/` (5 images à fournir)
- [ ] Implémenter logique fallback dans `SpotCard.astro`
- [ ] Nouveau type `OpeningHours` dans `types.ts`
- [ ] Créer composant `OpeningHours.astro`
- [ ] Migrer structure horaires dans spots JSON

### Epic 14 : Redesign UI (BLOCKED - en attente mockups)
- [ ] Recevoir nouveaux mockups
- [ ] Implémenter redesign complet

---

## Dépendances entre epics

```
[1-8 DONE] ──> [13. Build Opt] ──> [9. Deploy]
     │
     └──> [10. UX] ──> [11. Thèmes] ──> [14. Redesign UI]
     │                      │                    ↑
     └──> [12. Contenu] ────┘          (BLOCKED: mockups)
```

---

## Progression globale

```
[████████████░░░░░░░░] 57% (8/14 epics)
```

**Note** : Epic 14 (Redesign UI) est bloqué en attente des nouveaux mockups.

---

## Assets à fournir par l'utilisateur

### Images par défaut (pour spots sans photo)

| Catégorie | Fichier attendu | Dimensions | Format |
|-----------|-----------------|------------|--------|
| Restaurants | `public/images/defaults/restaurants.jpg` | 800x450 (16:9) | JPG/WebP |
| Bars | `public/images/defaults/bars.jpg` | 800x450 (16:9) | JPG/WebP |
| Laundry | `public/images/defaults/laundry.jpg` | 800x450 (16:9) | JPG/WebP |
| Transport | `public/images/defaults/transport.jpg` | 800x450 (16:9) | JPG/WebP |
| Activities | `public/images/defaults/activities.jpg` | 800x450 (16:9) | JPG/WebP |

**Style** : Illustrations flat design cohérentes entre elles

---

## Décisions design à prendre (avant Epic 11/14)

### Palette de couleurs
- [ ] **Primary color** : Couleur principale (boutons, header, liens)
- [ ] **Accent color** : Couleur secondaire (badges, highlights)
- [ ] **Background light** : Fond du thème clair
- [ ] **Background dark** : Fond du thème sombre
- [ ] **Text colors** : Couleurs de texte pour chaque thème

### Typographie
- [ ] **Font principale** : Quelle police ? (Inter, System, Poppins, etc.)
- [ ] **Font secondaire** : Si différente pour les titres

### Thème par défaut
- [ ] **Light ou Dark** : Quel thème par défaut pour l'app ?

### Nouveaux mockups
- [ ] **Home** : Layout page d'accueil
- [ ] **Explore/Spots** : Liste des spots
- [ ] **Spot detail** : Page détail d'un spot
- [ ] **Events** : Liste des événements
- [ ] **Info** : Page informations pratiques

> **Action** : Fournir les mockups finaux et les choix de couleurs/fonts avant de commencer Epic 11.

---

## Notes de session

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
