# Epic 3: Home & Essential Info

**Statut** : ⬜ TODO
**Complexité** : M (Medium)

## Description

Page d'accueil avec les informations essentielles : WiFi (tap-to-copy), grille de navigation vers les catégories, et horaires check-in/out.

## Tâches

### WiFi Card
- [ ] Créer composant `WiFiCard.astro`
- [ ] Implémenter tap-to-copy avec feedback "Copied!"
- [ ] Style proéminent (visible sans scroll)

### Navigation
- [ ] Créer composant `CategoryNav.astro`
- [ ] Grid 2x2 + 2 cards pleine largeur
- [ ] Icônes pour chaque catégorie

### Home page
- [ ] Créer `src/pages/index.astro`
- [ ] Assembler Header + WiFi + Grid + Check-in/out

## Composants

### WiFiCard.astro
```
Props: { name: string, password: string }
Affiche: Nom réseau + password masqué avec bouton copy
Action: Tap → copie password → affiche "Copied!" 2 sec
```

### CategoryNav.astro
```
Grid:
┌─────┐ ┌─────┐
│ 🍜  │ │ 🧺  │
│Food │ │Laun │
└─────┘ └─────┘
┌─────┐ ┌─────┐
│ 🛵  │ │ 🍺  │
│Move │ │Bars │
└─────┘ └─────┘
┌─────────────┐
│     📅      │
│  This Week  │
└─────────────┘
┌─────────────┐
│     ℹ️      │
│  Info/Rules │
└─────────────┘
```

## Fichiers à créer

```
/src/components/WiFiCard.astro
/src/components/CategoryNav.astro
/src/pages/index.astro
```

## Script clipboard

```typescript
// Inline script dans WiFiCard
const copyBtn = document.getElementById('copy-wifi');
copyBtn?.addEventListener('click', async () => {
  await navigator.clipboard.writeText(password);
  // Changer le texte "Copy" → "Copied!"
  setTimeout(() => /* reset */, 2000);
});
```

## Critères d'acceptation

- [ ] WiFi visible sans scroll sur mobile (375px)
- [ ] Tap to copy fonctionne
- [ ] Feedback visuel "Copied!" après tap
- [ ] Touch targets ≥ 44px
- [ ] Toutes les catégories cliquables vers leur page

## User Story référence

PRD Story 1: Guest cherche le WiFi
