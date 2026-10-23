# Bertrand Hospitality Événement — POC look & feel

Prototype statique (HTML, CSS, JavaScript sans framework) de la refonte du site événementiel de Bertrand Hospitality.
En ligne : https://bertrand-hospitality-poc.vercel.app

## Pages
- `index.html` : accueil (carrousel des lieux, accompagnement, formats, quartiers, Groupe Bertrand → hôtels, FAQ)
- `lieux.html` : tous les lieux, avec la recherche par format et nombre d'invités
- `lieu.html?l=polpo` : fiche lieu immersive (Polpo est le lieu pilote)

## Lancer en local
```
python3 -m http.server 8766
```
puis ouvrir http://localhost:8766

## Organisation
- `css/` : `base.css` (couleurs, polices, navigation), `home.css`, `coverflow.css` (carrousel commun à la home et à la page lieux), `menu.css`
- `js/` : `data.js` (les 30 lieux), `detail.js` (contenu détaillé de Polpo), `coverflow.js`, `finder.js`, `menu.js`
- `assets/` : photos et logos ; `fonts/` : polices de la marque (Ivar Display, Copperplate, Helvetica LT), sous licence du client

Bibliothèques chargées par CDN : GSAP 3.12.5, Lenis 1.1.13.

## Déploiement
Depuis ce dossier : `npx vercel deploy --prod`
