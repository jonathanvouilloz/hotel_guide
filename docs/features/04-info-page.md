# Epic 4: Info Page

**Statut** : ⬜ TODO
**Complexité** : S (Small)

## Description

Page regroupant les informations pratiques : règles de la maison (markdown), instructions d'arrivée (markdown), et contacts d'urgence (cliquables).

## Tâches

- [ ] Créer `src/pages/info.astro`
- [ ] Charger et rendre `house-rules.md`
- [ ] Charger et rendre `how-to-get-here.md`
- [ ] Créer composant `EmergencyContacts.astro`
- [ ] Liens `tel:` pour les numéros d'urgence

## Sections de la page

1. **House Rules** - Markdown rendu en HTML
2. **How to Get Here** - Instructions depuis aéroport/gare
3. **Emergency Contacts** - Liste cliquable (tel: links)

## Composants

### EmergencyContacts.astro
```astro
---
interface Props {
  contacts: Array<{ name: string; phone: string }>;
}
---
<ul>
  {contacts.map(c => (
    <li>
      <a href={`tel:${c.phone}`}>{c.name}</a>
      <span>{c.phone}</span>
    </li>
  ))}
</ul>
```

## Fichiers à créer/modifier

```
/src/pages/info.astro
/src/components/EmergencyContacts.astro
/content/house-rules.md          # Contenu exemple
/content/how-to-get-here.md      # Contenu exemple
```

## Contenu exemple

### house-rules.md
```markdown
# House Rules

1. **Quiet hours**: 10 PM - 8 AM
2. **No smoking** inside the building
3. **Kitchen**: Clean up after yourself
4. **Guests**: Inform reception before inviting visitors
5. **Checkout**: Leave room by 11 AM
```

### how-to-get-here.md
```markdown
# How to Get Here

## From the Airport
1. Take the Airport Rail Link to Phaya Thai
2. Transfer to BTS Silom Line
3. Get off at Sala Daeng station
4. Walk 5 minutes east

## By Grab/Taxi
Show driver: "123 Silom Road, Bangkok"
Approx: 300-500 THB from airport
```

## Critères d'acceptation

- [ ] Markdown rendu correctement (headers, listes, bold)
- [ ] Emergency contacts cliquables (ouvre app téléphone)
- [ ] Navigation retour vers home
- [ ] Sections clairement séparées visuellement
