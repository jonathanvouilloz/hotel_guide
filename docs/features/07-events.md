# Epic 7: Events Calendar

**Statut** : ✅ DONE
**Complexité** : L (Large)

## Description

Page des événements de la semaine avec CTAs pour inscription (WhatsApp).

## Tâches

### Data & Types
- [x] Type HostelEvent déjà défini dans types.ts
- [x] Fonctions getEvents, getUpcomingEvents déjà dans content.ts

### Composants
- [x] Créer `EventCard.astro`
- [x] Créer page `events.astro`

### CTAs
- [x] Ajouter getWhatsAppUrl à deeplinks.ts
- [x] Bouton CTA sur EventCard
- [x] Message pré-rempli WhatsApp

## Fichiers créés/modifiés

```
/src/lib/deeplinks.ts         # Modifié - ajout getWhatsAppUrl()
/src/components/EventCard.astro  # Nouveau
/src/pages/events.astro          # Nouveau
```

## Layout EventCard

```
┌─────────────────────────┐
│ WED        │  14:00     │ ← Header coloré
│ 15         │  17:00     │
├────────────┴────────────┤
│ Thai Cooking Class      │
│ Learn 3 authentic...    │
├─────────────────────────┤
│ 📍 Hostel Kitchen       │
│ 💰 500 THB              │
├─────────────────────────┤
│ [Book your spot →]      │ ← CTA WhatsApp
└─────────────────────────┘
```

## Edge cases gérés

- [x] Aucun événement → Empty state "No events planned"
- [x] CTA non configuré → Pas de bouton affiché
- [x] Support WhatsApp et liens externes

## Critères d'acceptation

- [x] Liste des événements de la semaine
- [x] CTA WhatsApp pré-remplit le message
- [x] Événements triés par date
- [x] Empty state si aucun événement

## User Story référence

PRD Story 3: Guest consulte le planning de la semaine
