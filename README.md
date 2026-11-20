# Bertrand Hospitality Événement : maquette finale

Maquette finale en HTML, CSS et JavaScript (sans framework) du futur site evenement.bertrand-hospitality.com.
Elle sert de référence pour l'intégration Webflow (framework Lumos). Elle fixe le design, les contenus et les interactions.
Ce n'est pas du code à importer : Webflow n'importe pas de CSS. La structure est à reconstruire dans le Designer, avec les classes et les variables Lumos.

- En ligne : https://evenement-bertrand-hospitality.vercel.app
- Lancer en local : `python3 -m http.server 8766`, puis http://localhost:8766

## 1. Pages

| Maquette | Dans Webflow | Contenu |
|---|---|---|
| `index.html` | page statique | accueil |
| `lieux.html` | page statique + liste CMS Lieux | tous les lieux, filtres par format et par jauge |
| `lieu.html?l=polpo` | modèle CMS Lieux | visite immersive (Polpo, lieu pilote) |
| `offres.html` | page statique + liste CMS Formats | les formats d'événement |
| `offre.html?f=…` | modèle CMS Formats | une page par format (`/offres/[format]`) |
| `secteur.html?s=…` | modèle CMS Secteurs | une page par quartier (`/secteurs/[secteur]`) |
| `landing.html` | page statique (campagnes) | page d'atterrissage séminaire |
| `blog.html`, `article.html` | liste et modèle CMS Articles | le journal |
| `hotels.html`, `nous-connaitre.html`, `engagement.html`, `faq.html` | pages statiques | |
| `devis.html`, `contact.html`, `merci.html` | pages statiques + formulaires | demande de devis (routage BookingShake à définir) |
| `404.html`, `mentions-legales.html`, `confidentialite.html`, `cookies.html` | pages statiques | |

Les pages modèles sont générées en JavaScript à partir des fichiers de `js/`. Dans Webflow, ces fichiers deviennent des collections CMS (voir la section 4).

## 2. Variables (design tokens)

### Couleurs

| Nom | Valeur | Usage |
|---|---|---|
| `ink` | `#1D1D1B` | texte, fonds sombres |
| `ink-soft` | `#4A4744` | texte courant |
| `muted` | `#77716E` | texte secondaire (contraste 4,5:1) |
| `taupe` | `#806E69` | boutons, liens d'action (le #8D7974 du Figma, assombri pour le contraste) |
| `cream` | `#FAF8F7` | fond principal |
| `cream-2` | `#F3EFEB` | fond secondaire |
| `line` | `#E6E1DD` | filets |
| `white` | `#FFFFFF` | |

### Polices

| Rôle | Police | Graisse | Réglages |
|---|---|---|---|
| Titres | Playfair Display (Google Fonts) | 400 | toujours en capitales, interlettrage 2 %, interligne 1,1 |
| Texte | Inter (Google Fonts) | 300 (400, 500, 700 pour les mots en relief) | interlettrage −1,5 %, interligne 1,4 |
| Capitales (tags, boutons) | **BH Caps** (`fonts/BHCaps-SemiBold.woff2`, `.ttf`) | 600 | capitales, interlettrage 14 % |

BH Caps est Josefin Sans SemiBold dont les métriques verticales ont été corrigées dans le fichier : ascendante 875 et descendante 125, au lieu de 750 et 250.
- **Pourquoi** : avec la Josefin de Google, les capitales remontent d'environ 1,5 px dans les boutons, à côté des flèches.
- **Dans Webflow** : importer ce fichier tel quel comme police personnalisée, sans code supplémentaire.
- **Nom** : la licence OFL interdit de garder le nom « Josefin Sans » sur une version modifiée, d'où « BH Caps ». La licence est dans `fonts/OFL-BHCaps.txt`.

Les autres polices de `fonts/` (Ivar, Copperplate, Helvetica LT) sont les anciennes polices de la marque. Elles ne sont plus utilisées.

### Tailles de texte

Les valeurs « bureau » valent à 1280 px de large, les valeurs « mobile » à 375 px. Ce sont les bornes à saisir dans les tailles fluides de Lumos.

| Style | Bureau | Mobile | Police |
|---|---|---|---|
| H1 | 48 px | 30 px | Playfair |
| H2 | 40 px | 28 px | Playfair |
| H3 | 32 px | 24 px | Playfair |
| H4 | 24 px | 20 px | Playfair |
| H5 | 18 px | 18 px | Playfair |
| Lien du menu plein écran | 32 px | 28 px | Playfair |
| Texte | 14,5 px | 14,5 px | Inter 300 |
| Texte long (articles) | 15,5 px, interligne 1,6 | 15,5 px | Inter 300 |
| Bouton (CTA) | 11,6 px | 11,6 px | BH Caps |
| Mini-tag | 10,8 px | 10,8 px | BH Caps |

### Règles de mise en page du texte

- Titres, sous-titres et chapôs : `text-wrap: balance` (lignes de longueur égale).
- Paragraphes : `text-wrap: pretty` (jamais un mot seul sur la dernière ligne).
- Longueur de ligne : de 60 à 80 caractères. Les réponses de FAQ sont limitées à 540 px, les pages légales à 640 px.
- Texte rogné aux capitales (`text-box: trim-both cap alphabetic`) sur les titres et le texte, pour que les marges du Figma tombent juste.
- Jamais de bouton sur deux lignes (`white-space: nowrap`).

### Espacements et points de rupture

- Marge latérale : 48 px sur bureau, 16 px sur mobile.
- Sections : 200 px de marge verticale sur bureau, 120 px sur mobile.
- Points de rupture de la maquette : 1023 px, 767 px et 359 px. Webflow utilise 991, 767 et 478 : l'écart à 1023 / 991 est sans conséquence.
- Grand écran : la mise en page est plafonnée aux largeurs du 1280 px, rien ne grandit au-delà. Avec Lumos, on peut laisser les tailles grandir un peu au-delà ; c'est à décider avec le design.

## 3. Interactions (JavaScript à reprendre)

| Fichier | Rôle | Piste Webflow |
|---|---|---|
| `js/motion.js` | défilement doux (Lenis, lerp .12), parallaxe des images (échelle 1.1, ±5 %), apparitions | Lenis en code personnalisé ; parallaxe et apparitions en Interactions GSAP |
| `js/menu.js` + `css/menu.css` | navigation qui revient fixée après 60 % de l'écran ; menu plein écran | code personnalisé |
| `js/coverflow.js` | carrousel 3D (home, page lieux) | code personnalisé, alimenté par une liste CMS |
| `js/finder.js`, `js/venue-list.js` | recherche par format et jauge | filtres CMS (Finsweet Attributes) ou code personnalisé |
| `js/paris-map.js` | carte des quartiers | code personnalisé |
| `js/detail.js` + `lieu.html` | visite immersive : espaces, « Lieu vide / En événement », musique | code personnalisé sur le modèle Lieux |
| `js/typo.js` | empêche un mot seul sur une ligne dans les titres | facultatif (le CSS `text-wrap` couvre l'essentiel) |
| `js/reviews.js` | avis (landing) | |

Bibliothèques : GSAP 3.12.5 (cdnjs) et Lenis 1.1.13 (unpkg). Chaque animation respecte `prefers-reduced-motion`.

## 4. Collections CMS

| Collection | Source | Champs |
|---|---|---|
| Lieux (30) | `js/data.js` | slug, nom, quartier (texte), secteur (référence), accroche, description, jauges assis / cocktail / réunion / dansant, photos |
| Espaces d'un lieu | `js/detail.js` | nom, description, jauges, photo vide, photo en événement, miniature (Polpo seul est rempli) |
| Formats (9) | `js/offres-data.js` | slug, nom, tournure (« votre séminaire »), intro, texte, inclus, image, lieux conseillés, jauge, ancienne URL |
| Secteurs (5) | `js/secteurs-data.js` | slug, nom, tournure (« sur les Champs-Élysées »), intro, photo bureau / mobile, deux blocs photo + texte, carte |
| Articles | `js/journal.js` | slug, date, titre, image, texte alternatif, corps |

Les anciennes URL de production (`/offres/[format]`, `/privatisation/[occasion]`) sont notées dans `js/offres-data.js` pour les redirections 301.

## 5. Images

Les photos sont dans `assets/`, en WebP. Les originaux HD (`assets/lieux/hd`) ne sont pas mis en ligne (voir `.vercelignore`).
Webflow génère lui-même les tailles responsives : importer la plus grande version de chaque photo.

## 6. En attente du client

- Informations légales.
- Photos HD de La Coupole, du Procope et du Saint James, et un second visuel du Balzac.
- Chiffres RSE et rapport PDF.
- Articles du journal.
- Nombre de chambres et règles de réservation des deux hôtels.
- Routage des demandes de devis et de contact (BookingShake).
- Contenus des espaces pour les lieux autres que Polpo.
