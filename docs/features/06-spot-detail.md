# Epic 6: Spot Detail

**Statut** : ✅ DONE
**Complexité** : M (Medium)

## Description

Page de détail d'un spot avec toutes les informations et boutons d'action (Google Maps, Copy address).

## Tâches

### Page dynamique
- [x] Créer `src/pages/spot/[id].astro`
- [x] Implémenter `getStaticPaths()` pour tous les spots
- [x] Charger le spot par ID

### Contenu page
- [x] Photo pleine largeur (ou placeholder)
- [x] Infos complètes (nom, description, adresse, tags)
- [x] Boutons action sticky en bas

### Actions
- [x] Créer `src/lib/deeplinks.ts`
- [x] Google Maps directions (ouvre dans nouvelle fenêtre)
- [x] Copy address to clipboard avec feedback "Copied!"

## Fichiers créés/modifiés

```
/src/lib/deeplinks.ts          # Nouveau - utilitaires URL Maps
/src/lib/content.ts            # Modifié - ajout findSpotById()
/src/pages/spot/[id].astro     # Nouveau - page dynamique
```

## Layout page détail

```
┌─────────────────────────┐
│ ← Back to Restaurants   │
├─────────────────────────┤
│      [Photo 16:9]       │
├─────────────────────────┤
│ Pad Thai Heaven         │
│ Thai • €                │
├─────────────────────────┤
│ Best pad thai in the    │
│ old city. Family-run... │
├─────────────────────────┤
│ 📍 123 Main Street...   │
├─────────────────────────┤
│ #local-favorite         │
└─────────────────────────┘
┌─────────────────────────┐
│ [Directions] [Copy]     │ ← Sticky bottom
└─────────────────────────┘
```

## Critères d'acceptation

- [x] Toutes les infos du spot affichées
- [x] Bouton Maps ouvre Google Maps avec itinéraire
- [x] Bouton Copy copie l'adresse + feedback "Copied!"
- [x] Fonctionne sur iOS ET Android
- [x] Back button retourne à la catégorie

## User Story référence

PRD Story 2: Guest consulte les restaurants (flow 3-6)
