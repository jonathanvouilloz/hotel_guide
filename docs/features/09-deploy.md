# Epic 9: Deploy & Polish

**Statut** : ⬜ TODO
**Complexité** : M (Medium)

## Description

Déploiement sur Vercel, création de contenu de démonstration réaliste, tests sur vrais devices, et configuration finale de PagesCMS.

## Tâches

### PagesCMS
- [ ] Créer `.pages.yml` complet
- [ ] Tester connexion GitHub OAuth
- [ ] Vérifier édition de chaque type de contenu

### Contenu démo
- [ ] 3-5 restaurants avec vraies données
- [ ] 2-3 spots par autre catégorie
- [ ] 3-4 événements sur la semaine
- [ ] House rules réalistes
- [ ] Instructions "how to get here" réalistes

### Vercel
- [ ] Connecter repo GitHub
- [ ] Configurer domaine (optionnel)
- [ ] Vérifier builds automatiques

### Tests mobile
- [ ] iOS Safari
- [ ] Chrome Android
- [ ] PWA install flow
- [ ] Touch targets
- [ ] Performance 3G

## .pages.yml

Voir PRD section 9 pour la config complète.

Points clés :
- Section settings avec color pickers
- Upload images vers public/images
- Listes de spots par catégorie
- Événements avec CTA configurables

## Contenu démo réaliste

### Restaurants (exemple Chiang Mai)
- Pad Thai Heaven (Thai, €)
- The Good View (Thai/Western, €€)
- Rustic & Blue (Cafe, €€)
- Kanjana (Thai street food, €)

### Événements exemple
- Thai Cooking Class (weekly)
- Happy Hour (daily 18-21)
- Temple Tour (Saturday)
- Night Market Walk (Sunday)

## Checklist tests mobile

| Test | iOS Safari | Chrome Android |
|------|------------|----------------|
| Home load < 2s | ☐ | ☐ |
| WiFi copy works | ☐ | ☐ |
| Maps button opens app | ☐ | ☐ |
| WhatsApp CTA works | ☐ | ☐ |
| PWA installable | ☐ | ☐ |
| Touch targets 44px | ☐ | ☐ |
| No horizontal scroll | ☐ | ☐ |

## Workflow déploiement

```
1. git push origin main
2. Vercel détecte le push
3. Build Astro (static)
4. Deploy (~30 sec)
5. Live sur {project}.vercel.app
```

## Fichiers à créer/configurer

```
/.pages.yml
/content/spots/restaurants.json  # Données démo
/content/spots/laundry.json
/content/spots/transport.json
/content/spots/bars.json
/content/spots/activities.json
/content/events.json
/content/house-rules.md
/content/how-to-get-here.md
/content/settings.json
```

## Critères d'acceptation

- [ ] Site déployé et accessible
- [ ] PagesCMS fonctionne (owner peut éditer)
- [ ] Contenu démo réaliste et complet
- [ ] Tous les flows testés sur mobile
- [ ] Performance Lighthouse > 90
- [ ] Documentation owner ready

## Handoff owner

1. Lien PagesCMS avec instructions
2. Credentials GitHub (si nouveau)
3. Guide rapide édition contenu
4. Contact support si problèmes
