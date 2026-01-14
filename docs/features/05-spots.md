# Epic 5: Spot Categories

**Statut** : ✅ DONE
**Complexité** : M (Medium)

## Description

5 pages de catégories affichant les listes de spots recommandés. La page restaurants inclut un filtre par type de cuisine.

## Tâches

### Composant SpotCard
- [x] Créer `SpotCard.astro`
- [x] Photo 16:9 avec placeholder si absente
- [x] Badges: type cuisine (restaurants), prix
- [x] Description tronquée (2 lignes)
- [x] Lien vers page détail

### Pages catégories
- [x] Créer `restaurants.astro` avec filtre cuisine
- [x] Créer `laundry.astro`
- [x] Créer `transport.astro`
- [x] Créer `bars.astro`
- [x] Créer `activities.astro`

### Filtre cuisine
- [x] Filtre intégré dans restaurants.astro (chips avec liens URL params)
- [x] Toggle chips pour chaque type
- [x] Filtrage via URL params (`?cuisine=thai`)

## Composant SpotCard

```astro
---
interface Props {
  spot: Spot;
  showCuisine?: boolean;
}
---
<a href={`/spot/${spot.id}`} class="spot-card">
  <img src={spot.image || '/images/placeholder.svg'} alt={spot.name} />
  <div class="content">
    <h3>{spot.name}</h3>
    {showCuisine && <span class="badge">{spot.cuisineType}</span>}
    <span class="price">{spot.priceRange}</span>
    <p>{truncate(spot.description, 100)}</p>
  </div>
</a>
```

## Fichiers créés

```
/src/components/SpotCard.astro
/src/pages/restaurants.astro
/src/pages/laundry.astro
/src/pages/transport.astro
/src/pages/bars.astro
/src/pages/activities.astro
```

## Types cuisine (enum)

- thai, western, japanese, chinese, indian
- italian, mexican, korean, vietnamese
- vegetarian, vegan, seafood, street-food, cafe, other

## Critères d'acceptation

- [x] Liste filtrable par type cuisine (restaurants uniquement)
- [x] Cards affichent infos essentielles sans cliquer
- [x] Images placeholder si pas de photo
- [x] Touch targets ≥ 44px (classe .touch-target)
- [x] Page charge < 2s sur 3G

## User Story référence

PRD Story 2: Guest consulte les restaurants
