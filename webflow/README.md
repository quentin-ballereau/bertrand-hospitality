# Code components Webflow — Bertrand Hospitality

Bibliothèque de code components React qui reprend les éléments du POC (à la racine du repo) que Webflow ne sait pas faire en natif.
Le plan d'ensemble est dans [../docs/PLAN-WEBFLOW.md](../docs/PLAN-WEBFLOW.md).

## Commandes
```
npm install
npm run dev        # banc d'essai local : http://localhost:5174/coverflow.html (le POC sert les polices, assets et données)
npm run typecheck
npm run share      # publie la bibliothèque dans le workspace Webflow (webflow devlink import)
```

Au premier `npm run share`, le CLI demande de se connecter à Webflow puis de créer (ou choisir) la bibliothèque : il écrit alors son `id` dans `webflow.json`. Il faut committer ce changement. Sans cet `id`, `npm run bundle` refuse de compiler en mode non interactif.

## Composants

### Venue Coverflow
Le carrousel 3D des lieux (`js/coverflow.js` du POC). Il lit les lieux dans une **Collection List « Lieux »** posée sur la même page : un code component n'a pas accès au CMS.

Mise en place dans le Designer :
1. Collection List sur la collection Lieux, avec `display: none` si elle ne doit pas être vue.
2. Sur le **Collection Item** : attribut personnalisé `data-venue`.
3. Dans l'item, un élément par champ, chacun avec l'attribut `data-field` :

| `data-field` | Élément | Champ CMS |
|---|---|---|
| `image` | Image | photo principale |
| `link` | Link Block | page du lieu (template) |
| `slug`, `name`, `place`, `tag`, `desc`, `sector` | Text | textes |
| `assis`, `cocktail`, `reunion`, `dansant` | Text | capacités (nombre, 0 ou vide = non proposé) |

4. Ajouter le composant **Venue Coverflow** sur la page. Propriétés : sélecteur des items (défaut `[data-venue]`), molette `horizontal` (la page continue de défiler) ou `page` (toute la molette pilote le carrousel), hauteur `section` (420 px, home) ou `fill` (hauteur du parent, page des lieux), libellé du lien, entrée au défilement.

Si aucun lieu n'est trouvé, le composant affiche un encadré qui rappelle cette convention.

Couleurs et polices : le composant vit dans un Shadow DOM, il lit les variables `--bh-cream`, `--bh-ink`, `--bh-ink-soft`, `--bh-taupe`, `--bh-serif`, `--bh-caps`, `--bh-sans` si le site les définit, sinon les valeurs du POC. Les polices (Ivar Display, Copperplate, Helvetica LT) doivent être ajoutées au site Webflow sous ces noms de famille.

### Venue Experience
La page lieu immersive (`lieu.html` du POC) : visite plein écran, points de passage entre espaces, panneau à onglets (espaces, capacités, offres, infos, avis, galerie), vue 360°, musique, mode « en événement ». À poser sur la **page de template Lieux**.

- **Les champs du lieu** arrivent en props, liées aux champs du CMS dans le panneau du composant (nom, quartier, accroche, à propos, photo, capacités, adresse, contact, liens, Street View, musique).
- **Les listes** sont lues dans trois Collection Lists de la page, masquées, chacune filtrée sur le lieu courant :

| Collection List | Attribut sur le Collection Item | `data-field` dans l'item |
|---|---|---|
| Espaces (filtre : Lieu = lieu courant, tri : Ordre) | `data-space` | `slug`, `name`, `desc` (Text) · `image`, `thumb`, `event` (Image) · `assis`, `cocktail`, `reunion`, `dansant`, `hot` (Text) |
| Offres (filtre : Lieu = lieu courant, tri : Ordre) | `data-offer` | `group`, `name`, `note`, `ht`, `ttc` (Text) |
| Galerie (champ multi-image du lieu) | `data-photo` | une Image, sans `data-field` |

`hot` contient les points de passage en JSON : `[{"x":44,"y":52,"to":"bar"}]` (position en % de la photo, `to` = slug de l'espace d'arrivée).
Un lieu sans espace s'ouvre sur sa photo principale, avec ses capacités : la page fonctionne pour les 30 lieux.

La navigation du site reste native et doit passer au-dessus du composant (z-index supérieur à 1). Le composant bloque le défilement de la page ; la visionneuse et la vue 360° passent au-dessus de la navigation.

Banc d'essai : http://localhost:5174/lieu.html (Polpo) et http://localhost:5174/lieu.html?l=la-coupole (lieu sans contenu détaillé).

## À savoir
- Les modules CSS s'importent en `import * as styles from "./X.module.css"` : le bundler de Webflow n'a pas d'export par défaut.
- Dans le canvas du Designer (`useWebflowContext().interactive === false`), le carrousel s'affiche sans capter la molette, le glisser ni le clavier.
- Le composant est en `ssr: false` : tout son rendu dépend du navigateur. Le contenu reste indexable grâce à la Collection List.
