# Epic 8: PWA Configuration

**Statut** : ✅ DONE
**Complexité** : S (Small)

## Description

Configuration PWA légère pour permettre l'installation sur l'écran d'accueil mobile. Pas de mode offline pour le MVP.

## Tâches

- [x] Créer `public/manifest.json`
- [x] Ajouter meta tags PWA dans BaseLayout
- [x] Générer icons (192x192, 512x512)
- [ ] Tester install prompt sur mobile (à faire manuellement)

## manifest.json

```json
{
  "name": "HostelGuide",
  "short_name": "Guide",
  "description": "Your digital guide to the hostel",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "icons": [
    {
      "src": "/images/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/images/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## Meta tags (BaseLayout)

```html
<head>
  <!-- PWA -->
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#2563eb">

  <!-- iOS -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="apple-mobile-web-app-title" content="HostelGuide">
  <link rel="apple-touch-icon" href="/images/icon-192.png">

  <!-- Viewport -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
</head>
```

## Icons à générer

| Fichier | Taille | Usage |
|---------|--------|-------|
| icon-192.png | 192x192 | Android, manifest |
| icon-512.png | 512x512 | Android splash |
| favicon.ico | 32x32 | Browser tab |

## Fichiers à créer

```
/public/manifest.json
/public/images/icon-192.png
/public/images/icon-512.png
/public/favicon.ico
```

## Test sur mobile

1. Ouvrir le site sur Chrome Android
2. Vérifier banner "Add to Home Screen"
3. Installer
4. Ouvrir depuis home screen → mode standalone

5. Ouvrir le site sur Safari iOS
6. Share → Add to Home Screen
7. Vérifier icon et titre

## Critères d'acceptation

- [ ] manifest.json valide (tester avec Lighthouse)
- [ ] Install prompt apparaît sur Android Chrome
- [ ] App installable sur iOS (Add to Home Screen)
- [ ] Mode standalone (pas de barre URL)
- [ ] Icons corrects sur home screen

## Notes

- Pas de Service Worker (pas d'offline pour MVP)
- theme_color dynamique si possible (depuis settings)
