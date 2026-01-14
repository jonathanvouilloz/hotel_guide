# HostelGuide - Décisions Techniques

> Log des décisions techniques importantes prises pendant le développement.

---

## Format

| Date | Décision | Contexte | Alternatives considérées |
|------|----------|----------|--------------------------|

---

## Décisions

### 2026-01-10 | Chargement contenu : Custom loader functions

**Contexte** : Choix entre Content Collections Astro et fonctions custom pour charger le contenu JSON/MD.

**Décision** : Utiliser des fonctions custom dans `src/lib/content.ts`.

**Justification** :
- PagesCMS édite du JSON brut, pas le format Content Collections
- Plus de contrôle sur le typage TypeScript
- Structure exactement alignée avec le PRD

**Alternatives rejetées** :
- Astro Content Collections : Nécessiterait schema duplication, format différent
- Import direct : Moins de contrôle, pas de validation

---

### 2026-01-10 | Routing spots : Route dynamique unique

**Contexte** : Comment router les pages de détail pour tous les types de spots (restaurants, bars, etc.).

**Décision** : Utiliser `/spot/[id].astro` unique pour tous les spots.

**Justification** :
- IDs uniques (UUID générés par PagesCMS)
- Moins de duplication de code
- Un seul fichier à maintenir

**Alternatives rejetées** :
- Routes par catégorie (`/restaurants/[id]`) : Duplication, plus de fichiers
- Query params (`/spot?id=xxx`) : Pas SSG-friendly

---

### 2026-01-10 | Theming : CSS variables injectées au build-time

**Contexte** : Comment appliquer les couleurs configurées dans settings.json.

**Décision** : Injecter les CSS variables via `<style define:vars={}>` dans BaseLayout.

**Justification** :
- Compatible SSG (pas de JavaScript runtime)
- Tailwind peut référencer les CSS variables
- Simple à implémenter dans Astro

**Alternatives rejetées** :
- JS runtime : Ajoute du JavaScript, flash de contenu
- Tailwind config statique : Nécessite rebuild pour changer les couleurs

---

### 2026-01-10 | Clipboard feedback : Changement de texte inline

**Contexte** : Comment indiquer à l'utilisateur que le texte a été copié.

**Décision** : Changer le texte du bouton "Copy" → "Copied!" pendant 2 secondes.

**Justification** :
- Zero dépendance externe
- Feedback immédiat au point d'interaction
- Meilleure accessibilité

**Alternatives rejetées** :
- Toast library : Dépendance supplémentaire, plus complexe
- Toast custom : Plus de code, moins immédiat

---

### 2026-01-10 | Timezone : Utiliser timezone hostel (pas device)

**Contexte** : Comment afficher les heures des événements.

**Décision** : Afficher les heures telles que stockées (timezone hostel).

**Justification** :
- PRD explicite : "Timezone correcte (locale du hostel, pas du device)"
- Les guests sont physiquement à l'hostel, même timezone
- Simplifie l'implémentation SSG

**Alternatives rejetées** :
- Conversion timezone device : Confusion pour les guests sur place
- Indicateur timezone : Surcharge d'information

---

### 2026-01-10 | Images : Astro Image component

**Contexte** : Comment gérer les images des spots et événements.

**Décision** : Utiliser le composant `<Image>` d'Astro.

**Justification** :
- Optimisation automatique (WebP, resize)
- Responsive sizing
- Pas de service externe requis

**Alternatives rejetées** :
- `<img>` standard : Pas d'optimisation
- CDN externe (Cloudinary) : Dépendance, coût potentiel

---

### 2026-01-10 | Pages catégories : Fichiers séparés

**Contexte** : Comment organiser les pages de catégories (restaurants, bars, etc.).

**Décision** : Un fichier .astro par catégorie.

**Justification** :
- PRD liste explicitement les pages séparées
- Meilleur SEO (URLs dédiées)
- Flexibilité (restaurants a un filtre, les autres non)

**Alternatives rejetées** :
- Route dynamique `/category/[slug]` : Moins flexible pour personnalisation
- Tabs client-side : Pas SSG-friendly

---

### 2026-01-10 | Double Build PagesCMS : Workflow documenté

**Contexte** : PagesCMS déclenche 2 commits séparés (image upload → commit 1, JSON edit → commit 2), causant 2 builds Vercel.

**Décision** : Ajouter `vercel.json` avec règles d'ignore pour les commits d'images seules + documenter le workflow optimal.

**Justification** :
- Évite les builds inutiles
- Réduit la consommation de minutes build Vercel
- Workflow clair pour l'owner

**Alternatives rejetées** :
- Modifier PagesCMS : Pas de contrôle sur le comportement du CMS
- Ignorer le problème : Gaspillage de ressources

---

### 2026-01-10 | Images par défaut : Illustrations stylisées par catégorie

**Contexte** : Comment afficher un placeholder quand un spot n'a pas d'image.

**Décision** : Utiliser une illustration flat design spécifique à chaque catégorie (restaurants, bars, laundry, transport, activities).

**Justification** :
- Plus cohérent visuellement qu'un placeholder gris
- Indépendant du thème light/dark
- Communique la catégorie même sans image

**Alternatives rejetées** :
- Photos stock réalistes : Moins cohérent, style varié
- Emoji + gradient : Trop simpliste pour le design visé

---

### 2026-01-10 | Google Maps : Bouton principal + Copy secondaire

**Contexte** : Sur la page spot detail, comment présenter les actions liées à l'adresse.

**Décision** : Bouton "Voir sur Google Maps" comme action principale, lien "Copier l'adresse" discret en dessous.

**Justification** :
- L'action principale est d'ouvrir Maps pour la navigation
- Copier est une action secondaire
- Utiliser URL de recherche Google Maps si pas de coordonnées (adresse texte encodée)

**Alternatives rejetées** :
- Deux boutons égaux : Confusion sur l'action principale
- Copy seulement : Moins pratique pour la navigation

---

### 2026-01-10 | Thèmes : Light/Dark avec customisation

**Contexte** : Comment permettre aux hostels de personnaliser l'apparence.

**Décision** : 2 presets de base (light/dark) avec customisation de primary color, accent color, et font.

**Structure settings.json** :
```json
{
  "theme": "dark",
  "primaryColor": "#2563eb",
  "accentColor": "#f59e0b",
  "fontFamily": "Inter"
}
```

**Justification** :
- Équilibre entre flexibilité et simplicité
- Les presets garantissent un design cohérent
- La customisation permet l'identité de marque

**Alternatives rejetées** :
- Couleurs uniquement : Pas assez de personnalisation
- Full custom themes : Trop complexe pour PagesCMS

---

### 2026-01-10 | Horaires détaillés : Pré-remplissage par défaut

**Contexte** : Comment gérer les horaires variables des restaurants (jours fermés, horaires différents).

**Décision** : Structure avec horaire par défaut pré-rempli pour tous les jours, puis exceptions éditables.

**Structure** :
```json
{
  "openingHours": {
    "default": "11:30-22:00",
    "exceptions": {
      "monday": "closed",
      "sunday": "12:00-20:00"
    }
  }
}
```

**Justification** :
- Évite de taper 7 fois les mêmes horaires
- Seules les exceptions sont à éditer
- Clair pour l'owner dans PagesCMS

**Alternatives rejetées** :
- 7 champs séparés : Tedious, répétitif
- Texte libre : Pas structuré, difficile à afficher proprement

---

### 2026-01-10 | Navigation : Bottom Bar + Back Button

**Contexte** : Comment améliorer la navigation mobile.

**Décision** :
- Bottom bar fixe avec 4 items : Home / Explore / Events / Infos
- Back button (←) dans le header sur toutes les pages sauf home

**Justification** :
- Pattern mobile standard (iOS/Android)
- Navigation accessible depuis n'importe quelle page
- Retour explicite sans dépendre du bouton browser

**Alternatives rejetées** :
- Navigation header seule : Moins accessible
- Hamburger menu : Cache les options

---

### 2026-01-10 | PWA Install : Modal premier lancement

**Contexte** : Comment encourager les guests à installer la PWA.

**Décision** : Modal explicatif au premier lancement avec instructions différenciées iOS/Android, affiché une seule fois.

**Comportement** :
- Détection premier lancement via localStorage
- Instructions visuelles selon la plateforme
- Bouton "Ne plus afficher"

**Justification** :
- Le prompt browser natif n'est pas toujours visible
- Instructions claires améliorent le taux d'installation
- Une seule fois pour ne pas agacer

**Alternatives rejetées** :
- Prompt natif uniquement : Taux d'installation faible
- Banner permanent : Intrusif

---

### 2026-01-10 | Styling : Rester sur Tailwind CSS

**Contexte** : Pour le redesign UI, faut-il passer en CSS custom ?

**Décision** : Continuer avec Tailwind CSS 4.

**Justification** :
- Tailwind peut reproduire n'importe quel design
- CSS variables intégrées pour le theming
- Plus maintenable et cohérent
- Utilities responsive out-of-the-box

**Alternatives rejetées** :
- CSS custom pur : Plus verbeux, moins de conventions
- CSS-in-JS : Overkill pour SSG

---

### 2026-01-11 | Géolocalisation : Fonction utilitaire partagée

**Contexte** : Calcul de distance utilisateur-spot utilisé sur plusieurs pages (liste restaurants, bars, detail spot, etc.).

**Décision** : Créer `src/lib/geolocation.ts` avec fonction `initDistanceDisplay()` réutilisable.

**Structure** :
```typescript
// Utilisation dans une page Astro
<script>
  import { initDistanceDisplay } from '../lib/geolocation';
  initDistanceDisplay();
</script>
```

**Fonctionnement** :
- Détecte automatiquement les éléments avec classes `.distance-display` ou `.distance-badge`
- Lit les attributs `data-lat` et `data-lng` pour les coordonnées du spot
- Demande la géolocalisation une seule fois (cache 5 min)
- Met à jour tous les éléments trouvés avec la distance formatée

**Justification** :
- Code DRY (évite duplication sur chaque page)
- API simple : un seul appel suffit
- Gestion centralisée des erreurs et du cache
- Facile à étendre pour de nouvelles pages

**Alternatives rejetées** :
- Script inline par page : Duplication, maintenance difficile
- Composant Astro avec script : Moins flexible pour différents layouts

---

## Template pour nouvelles décisions

```markdown
### YYYY-MM-DD | Titre court

**Contexte** : Pourquoi cette décision était nécessaire.

**Décision** : Ce qui a été décidé.

**Justification** :
- Raison 1
- Raison 2

**Alternatives rejetées** :
- Option A : Pourquoi rejetée
- Option B : Pourquoi rejetée
```
