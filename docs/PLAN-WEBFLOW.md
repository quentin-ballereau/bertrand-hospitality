# Plan : répliquer le POC Bertrand Hospitality dans Webflow

Objectif : vérifier que tout ce que contient le POC statique (HTML/CSS/JS vanilla, GSAP 3.12.5, Lenis) peut être reproduit dans Webflow, en s'appuyant sur les **code components** (React, `@webflow/react`) là où le natif ne suffit pas.

## 1. État des lieux du POC

| Élément | Où | Complexité | Données |
|---|---|---|---|
| Tokens, polices (Ivar Display, Copperplate, Helvetica LT), typo | `css/base.css` | faible | — |
| Navigation (menu / logo / devis) | les 3 pages | faible | — |
| Loader (logo qui se remplit, rideau) | `index.html` | faible | — |
| Hero : titre révélé ligne par ligne, zoom d'arrivée, parallax | `index.html` | moyenne | — |
| Défilement doux Lenis | `index.html` | faible | — |
| **Menu plein écran** (timings Cartier, photo au survol façon springs.estate, bouton cloné sur le déclencheur) | `js/menu.js` | élevée | 6 rubriques fixes |
| **Finder** : barre 3 segments + 3 popovers, compteur de résultats en direct, état dans l'URL | `js/finder.js` | élevée | 30 lieux, 4 formats, 5 secteurs |
| **Coverflow 3D** : roue en perspective, molette / drag avec inertie / clavier, fiche du lieu animée, lazy load | `js/coverflow.js` | élevée | 30 lieux |
| Sections home : accompagnement, chiffres (count-up), formats, quartiers (parallax ±24 px), reveals au scroll | `index.html`, `css/home.css` | moyenne | compteurs calculés depuis les données |
| **Groupe Bertrand → Hôtels** : scène sticky 550svh, carte qui monte puis zoom dans sa photo jusqu'au plein écran (mécanique Sobha, mesures FLIP) | `index.html` l. 461-507 | élevée | — |
| FAQ accordéon + JSON-LD | `index.html` | faible | 6 Q/R |
| Appel final, footer | `index.html` | faible | — |
| Page **Lieux** : titre qui reformule la recherche + finder flottant + coverflow plein écran, page non scrollable | `lieux.html` | élevée | filtres URL |
| Page **Lieu** (immersive) : visite plein écran (pan, suivi souris, hotspots entre espaces), panneau à onglets (espaces, capacités filtrables, offres, infos, avis, galerie + lightbox), vue 360° (iframe), musique YouTube, mode « en événement » | `lieu.html` | très élevée | `js/detail.js` (Polpo seulement), données imbriquées |

Points structurants :
- **Toutes les données sont en dur dans le JS** (`data.js`, `detail.js`). Dans Webflow, elles doivent vivre dans le CMS.
- Les pages ne partagent leur état **que par l'URL** (`?format=&invites=&secteur=`, `?l=slug`) : c'est une bonne nouvelle, c'est exactement le mode de communication qui marche entre code components isolés.
- 49 Mo d'assets, polices sous licence client.

## 2. Contraintes Webflow code components à garder en tête

1. **Shadow DOM** : chaque composant a ses styles isolés. Les variables CSS du site (couleurs, polices) traversent le Shadow DOM, les classes non. Polices déclarées au niveau du site → utilisables via `font-family`.
2. **Racines React isolées** : pas de Context partagé entre composants, ni à travers les Slots. Communication = URL, nano stores ou custom events.
3. **SSR par défaut** : tout accès à `window`/`document`/GSAP doit être dans `useEffect`, ou le composant passe en `ssr: false`.
4. **Pas de tableaux en props** (Text, RichText, Image, Link, Number, Boolean, Variant, Visibility, Slot, Id). Une liste de 30 lieux ne peut pas être passée en prop → c'est **le** point à valider (voir §4).
5. **Pas d'accès direct au CMS** depuis un composant.
6. Taille du bundle limitée : GSAP oui, mais pas de librairies superflues.
7. Comportement dans le canvas du Designer : les composants qui verrouillent le scroll ou écoutent `window` doivent rester sages dans le Designer.

## 3. Répartition proposée : natif / script / code component

| Élément | Natif Webflow | Script (custom code sur du natif) | Code component |
|---|---|---|---|
| Tokens, typo, nav, footer, sections statiques | ✅ variables + classes | | |
| Loader, hero (split du titre, zoom, parallax), reveals, parallax des cartes | ✅ Interactions GSAP de Webflow (SplitText, scroll) — **à vérifier** | fallback | |
| Lenis | | ✅ code du site | |
| FAQ + JSON-LD | ✅ (CMS FAQ + embed JSON-LD) | | |
| Chiffres (count-up, valeurs calculées) | structure native | ✅ count-up + valeurs depuis le CMS | |
| Formats / Quartiers (compteurs de lieux par format/secteur) | ✅ CMS | ✅ calcul des compteurs | |
| Menu plein écran | | option B | ✅ `MainMenu` (option A) |
| Finder | | | ✅ `VenueFinder` |
| Coverflow | | | ✅ `VenueCoverflow` |
| Page Lieux (titre + finder + coverflow liés) | | | ✅ `VenueExplorer` (un seul composant = un seul état) |
| Groupe Bertrand → Hôtels | structure native | ✅ option A (script sur attributs) | option B `ScrollZoomCard` avec Slots |
| Page Lieu immersive | template CMS `/lieux/[slug]` | | ✅ `VenueExperience` (visite + panneau partagent l'espace courant) |

## 4. Le vrai sujet : faire arriver les données CMS dans les composants

Modèle CMS envisagé :
- **Lieux** (30) : nom, slug, quartier, accroche, description, secteur (réf), capacités assis/cocktail/réunion/dansant, photo principale, about, adresse, accès, contact, site, Instagram, plaquette, Street View, musique, galerie (multi-image).
- **Secteurs** (5), **Formats** (4, avec icône SVG), **FAQ**.
- **Espaces** (réf → Lieu) : nom, description, photo, vignette, photo « en événement », capacités, hotspots (JSON en texte brut).
- **Offres** (réf → Lieu) : groupe, nom, note, prix HT/TTC.

Pistes à tester pour alimenter un composant avec une liste, de la plus simple à la plus robuste :
1. **Collection List rendue dans la page** (cachée), chaque item porte ses champs en `data-*` ou dans un `<script type="application/json">` ; le composant lit le DOM au montage (`useEffect`). Simple, SEO-friendly, garde l'édition dans le CMS.
2. **Collection List passée dans un Slot** du composant, lue via une ref. À valider : accès réel au contenu du slot depuis le composant.
3. **Prop Text contenant du JSON** : marche pour une page de template (champs du lieu courant bindés), pas pour une liste.
4. **API** (Webflow Data API via un proxy, ou export JSON au build) : robuste mais hors Designer, à garder en dernier recours.

## 5. Phasage

### Phase 0 — Socle (½ j)
- Projet code components dans `webflow/` (React + TS, `webflow.json`, `@webflow/webflow-cli`, `@webflow/react`, `@webflow/data-types`, `gsap` en dépendance npm).
- Site Webflow de test : variables (couleurs, gutter, easings), polices uploadées, classes de base.
- Le POC statique reste intact à la racine comme référence visuelle.

### Phase 1 — Spike sur le plus risqué : `VenueCoverflow` (1-2 j)
Pourquoi lui : autonome, très visuel, et il valide d'un coup GSAP dans le bundle, la perspective 3D dans le Shadow DOM, molette/drag/clavier, le lazy load et **le passage des données CMS (§4)**.
- Port de `coverflow.js` en hook React (refs + `useEffect`, rendu GSAP inchangé).
- Source des données : pistes 1 puis 2 du §4.
- Critère de succès : rendu identique au POC sur la home Webflow, avec les 30 lieux venant du CMS.

### Phase 2 — `VenueFinder` + page Lieux (2 j)
- Finder seul sur la home : soumission → `/lieux?format=…` (l'URL est déjà le contrat).
- `VenueExplorer` sur la page Lieux : titre reformulé + finder flottant + coverflow dans un même composant.
- Test complémentaire : finder et coverflow en composants séparés, synchronisés par nano store, pour mesurer la faisabilité.

### Phase 3 — Menu et scène Groupe → Hôtels (1-2 j)
- `MainMenu` (props : libellés/liens/images par rubrique, ou Slot) ; le déclencheur est le bouton natif de la nav (`data-menu-open`).
- Scène Sobha : d'abord en script sur structure native (attributs `data-gh-*`) ; si ça coince dans Webflow, en code component à Slots.

### Phase 4 — Page Lieu immersive `VenueExperience` (3-4 j)
- Template CMS `/lieux/[slug]` ; champs du lieu bindés en props, espaces/offres/galerie via les pistes du §4.
- Pour les lieux sans contenu détaillé : même repli que le POC (une scène = photo principale + capacités).

### Phase 5 — Le reste en natif + bilan (2 j)
- Home : sections statiques, interactions GSAP natives, FAQ CMS, footer.
- **Livrable** : grille élément par élément « réplicable natif / script / code component / bloquant », écarts visuels constatés, recommandations pour le projet réel (dont ce que le designer doit savoir pour concevoir « Webflow-compatible »).

## 6. Décisions (26/10/2026)
- **Workspace** : workspace Freelancer de Valentin (les code components sont ouverts aux workspaces Freelancer, Core, Growth, Agency et Enterprise).
- **Pas de Figma** : le POC est la seule référence visuelle ; on compare toujours au POC déployé.
- **Natif d'abord** : tout ce qui peut être fait en natif l'est, puisque c'est la base du futur site. Les code components sont réservés à ce que le natif ne sait pas faire, en priorité le **carrousel 3D** et la **page lieu immersive**.
- Conséquence : le menu et la scène Groupe → Hôtels sont d'abord tentés en natif + interactions/script ; code component seulement en cas d'échec.

## 7. Questions ouvertes
- Musique YouTube et Street View : à garder dans le périmètre du test ?
