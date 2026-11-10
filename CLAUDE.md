# Bertrand Hospitality : site événementiel (maquette finale)

Maquette finale en HTML/CSS/JS statique du futur site evenement.bertrand-hospitality.com (refonte Digidop, intégration Webflow ensuite).
Ne jamais l'appeler « POC » : c'est la maquette finale.

- En ligne : https://evenement-bertrand-hospitality.vercel.app (projet Vercel « bertrand-hospitality-poc », équipe digidop)
- Les anciens liens bertrand-hospitality-poc.vercel.app et evenements-bertrand-hospitality.vercel.app redirigent page à page via `vercel.json`. Ne pas supprimer ces redirections.
- Dépôt : github.com/quentin-ballereau/bertrand-hospitality (branche main)

## Règles de travail
- Répondre en français. Ne travailler que sur la page demandée.
- Design « simple et élégant » : épurer et respecter les styles Figma. Garder le pied de page du site quand on intègre une maquette Figma.
- Palette : crème `#FAF8F7`, taupe `--taupe:#806e69` (assombri depuis #8D7974 pour le contraste), encre `#1D1D1B`, gris texte `--muted:#77716e`.
- Polices : Ivar Display (titres), Helvetica LT Std (texte), Copperplate (capitales, interlettrage .11em). Ne pas changer les polices sans demande explicite.
- Jamais de bouton sur deux lignes (`white-space:nowrap`), jamais de texte coupé : pour un texte sur une ligne en `overflow:hidden`, ajouter `padding-block:.3em;margin-block:-.3em`.
- Compte Vercel presque plein : grouper les déploiements.

## Commandes
- Aperçu local : serveur statique sur le port 8766 (configuration « poc » de `.claude/launch.json`).
- Déployer, depuis `poc/` (le cache npm global est cassé, d'où le cache local) :
  `npm_config_cache=/tmp/npmcache npx vercel@latest deploy --prod --yes --scope digidop`
- Pousser : `GIT_TERMINAL_PROMPT=0 git push -q origin main`
- À chaque modification CSS/JS, incrémenter le `?v=` dans toutes les pages, ainsi que dans `../outils/pages-legales/build.py`, qui génère mentions-legales, confidentialite et cookies.html.
  Versions au 09/11/2026 : base.css 23, home.css 35, menu.css 18, menu.js 24, motion.js 6, paris-map.js 15, legal.css 2, pages.css 4, coverflow.css 11, coverflow.js 13, typo-variante.js 11.

## Architecture
- `css/base.css` : variables, navigation, barre de recherche. `css/home.css` : home et pied de page commun. `css/menu.css` + `js/menu.js` : menu plein écran et navigation.
- Navigation (`js/menu.js`) : déplacée à la racine du `<body>`. Elle défile avec la page, puis, passé 60 % de l'écran, revient fixée sur fond crème en glissant depuis le haut (`.is-stuck`, `.is-leaving`, inspiration discoverylandco.com). Sur les pages à héros sombre, la page déclare `.nav{color:#fff}` et le logo blanc `logo-bh.svg` ; le logo foncé lui est superposé (`.logo-alt`).
- `js/motion.js` : Lenis (lerp .12), parallaxe des images cadrées (échelle 1.1, ±5 %), apparitions `.mo-rv`.
- `js/coverflow.js` + `css/coverflow.css` : carrousel 3D, commun à la home, à la page lieux et à la page hôtels (options `card`, `fill`, `width`, `loop`). Cartes à 61,25 % de l’écran (784 px à 1280, 980 px au plus ; 74 % sur mobile ; limitées par la hauteur sur la page lieux), ombre discrète. Hôtels : cartes sans lien, liste doublée pour boucler.
- `js/typo-variante.js` (chargé juste après base.css sur toutes les pages) : comparaison des typographies, `?typo=a` actuelle, `b` retouchée (site actuel ; seuls le texte Light, +1 px, un trait de 0,2 px et un interlettrage de −1 %, et les petites capitales, mini-tags 12 → 13,5 px et tags +0,5 px, changent), `c` Google Fonts (Playfair Display pour les titres, Josefin Sans SemiBold pour les tags et CTA, Inter Light pour le texte, calées sur les proportions des polices actuelles). Choix retenu dans la session, pastille en bas à gauche ; sans paramètre, rien ne change. Planches des polices Google : titres `typo-titres.html`, tags et CTA `typo-tags.html`. Page client : `typographies.html#b/index` (barre A · B · C, choix de la page, le site dessous en iframe ; changer d’option garde la position ; vue « Côte à côte » avec `typo-specimen.html`). Dans l’iframe, les liens du site gardent l’option.
- `js/data.js` : données des lieux. `lieu.html` est une page immersive qui ne défile pas.
- `js/journal.js` : blog et article, pagination. `.vercelignore` exclut les images HD et `.audit`.
- Pages : index, lieux, lieu, offres, offre, secteur, landing, devis, contact, merci, nous-connaitre, engagement, hotels, blog, article, faq, 404, pages légales.

## Vérifier
- Le volet navigateur masqué fige rAF, IntersectionObserver et les animations : pour les contrôles visuels, forcer les classes ou couper les transitions, et auditer dans des iframes en chemins absolus.
- Avant de déployer : aucun débordement horizontal, aucune erreur console, aucun texte coupé, responsive à 375 px.

## En attente
- Typographies : page de comparaison en ligne (`typographies.html`), option B à régler avec Quentin puis à valider par le client ; l'option retenue sera ensuite écrite en dur dans le CSS.
- Contenus client : informations légales, photos HD (La Coupole, Procope, Saint James), chiffres RSE et PDF, articles, règles de réservation des hôtels, routage des demandes de contact.
