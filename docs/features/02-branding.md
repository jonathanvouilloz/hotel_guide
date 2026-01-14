# Epic 2: Branding & Theming

**Statut** : ✅ DONE
**Complexité** : S (Small)

## Description

Système de theming dynamique basé sur les couleurs configurées dans `settings.json`. Le owner peut personnaliser son guide avec son logo et ses couleurs.

## Tâches

- [x] Définir schema settings.json pour branding
- [x] Injecter CSS variables depuis settings dans BaseLayout
- [x] Créer composant Header avec logo
- [x] Configurer Tailwind pour utiliser CSS variables
- [x] Tester changement de couleurs

## Fichiers à modifier

```
/content/settings.json        # Ajouter primaryColor, accentColor, logo
/src/layouts/BaseLayout.astro # Injecter CSS variables
/src/styles/global.css        # Définir variables + classes Tailwind
/tailwind.config.mjs          # Étendre theme avec CSS variables
```

## Schema settings.json (branding)

```json
{
  "hostelName": "Chill House Chiang Mai",
  "logo": "/images/logo.png",
  "primaryColor": "#2563eb",
  "accentColor": "#f59e0b"
}
```

## CSS Variables

```css
:root {
  --color-primary: #2563eb;
  --color-accent: #f59e0b;
  --color-bg: #ffffff;
  --color-text: #1f2937;
  --color-muted: #6b7280;
  --radius: 12px;
}
```

## Tailwind config

```js
theme: {
  extend: {
    colors: {
      primary: 'var(--color-primary)',
      accent: 'var(--color-accent)',
    }
  }
}
```

## Critères d'acceptation

- [x] Logo affiché dans le header sur toutes les pages
- [x] Primary color appliquée aux boutons et backgrounds
- [x] Accent color appliquée aux badges et highlights
- [x] Changement des couleurs dans settings.json reflété après rebuild

## Notes

- CSS variables injectées via `<style define:vars={}>` dans Astro
- Fallback couleurs si settings manquants
