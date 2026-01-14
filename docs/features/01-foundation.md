# Epic 1: Foundation

**Statut** : ⬜ TODO
**Complexité** : M (Medium)

## Description

Initialisation du projet Astro avec TypeScript, configuration de Tailwind CSS, et mise en place de la structure de base pour le contenu et les utilitaires.

## Tâches

### Setup projet
- [ ] Créer projet Astro avec `npm create astro@latest`
- [ ] Configurer TypeScript (strict mode)
- [ ] Installer et configurer `@astrojs/tailwind`

### Structure content
- [ ] Créer dossier `/content`
- [ ] Créer `content/settings.json` (données exemple)
- [ ] Créer `content/spots/` avec fichiers JSON vides
- [ ] Créer `content/events.json`
- [ ] Créer `content/house-rules.md`
- [ ] Créer `content/how-to-get-here.md`

### Utilitaires TypeScript
- [ ] Créer `src/lib/types.ts` (interfaces Settings, Spot, Event, etc.)
- [ ] Créer `src/lib/content.ts` (fonctions chargement JSON/MD)

### Layout de base
- [ ] Créer `src/layouts/BaseLayout.astro`
- [ ] Créer `src/styles/global.css` avec CSS variables

## Fichiers à créer

```
/content/
  settings.json
  house-rules.md
  how-to-get-here.md
  events.json
  spots/
    restaurants.json
    laundry.json
    transport.json
    bars.json
    activities.json
/src/
  lib/
    types.ts
    content.ts
  layouts/
    BaseLayout.astro
  styles/
    global.css
astro.config.mjs
tailwind.config.mjs
tsconfig.json
```

## Critères d'acceptation

- [ ] `npm run dev` démarre sans erreur
- [ ] Types TypeScript complets et stricts
- [ ] Tailwind fonctionne avec CSS variables
- [ ] Content loader retourne les données correctement typées

## Notes techniques

- Utiliser import dynamique pour charger les JSON
- Pas de Content Collections Astro (PagesCMS édite du JSON brut)
- CSS variables injectées depuis settings.json au build-time
