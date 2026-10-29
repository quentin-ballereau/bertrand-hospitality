/* Le journal : la liste des articles, partagée par la page Journal (blog.html) et la page Article (article.html).
   Des exemples en attendant les contenus du client, du plus récent au plus ancien. Un article sans « slug » n'a pas encore
   de page : sa carte mène à l'article d'exemple. */
(() => {
  const POSTS = [
    {slug:"organiser-un-seminaire", date:"2026-10-22", title:"Organiser un séminaire à Paris, étape par étape", img:"assets/evenement/public-house-etage", alt:"Un salon à l’étage de Public House, dressé pour une réunion"},
    {date:"2026-10-08", title:"Dîner d’équipe de fin d’année : nos idées pour marquer le coup", img:"assets/evenement/coupole", alt:"Un dîner sous la coupole Art déco de La Coupole"},
    {date:"2026-09-24", title:"Se marier dans un salon historique de Paris", img:"assets/evenement/salon-dore", alt:"Un salon doré dressé pour une réception"},
    {date:"2026-09-10", title:"Cocktail ou dîner assis : comment choisir votre format", img:"assets/evenement/public-house-bar", alt:"Le bar de Public House pendant une soirée"},
    {date:"2026-08-27", title:"Un anniversaire sur la Seine, à bord du Polpo", img:"assets/evenement/polpo", alt:"Une soirée sur la terrasse du Polpo, au bord de la Seine"},
    {date:"2026-07-09", title:"Afterworks d’été : nos terrasses préférées", img:"assets/evenement/meida", alt:"Un déjeuner baigné de soleil chez Meïda"},
    {date:"2026-06-18", title:"Le Procope, trois siècles de fêtes parisiennes", img:"assets/evenement/procope", alt:"La façade illuminée du Procope"},
    {date:"2026-06-04", title:"Cinq idées de team building gourmand", jpg:"assets/lieux/bofinger.jpg", alt:"La salle de Bofinger"},
    {date:"2026-05-21", title:"Recevoir à Versailles, à deux pas du château", jpg:"assets/lieux/angelina-versailles.jpg", alt:"Le salon d’Angelina à Versailles"},
    {date:"2026-05-07", title:"Le brunch d’entreprise, un format qui rassemble", jpg:"assets/lieux/angelina-rivoli.jpg", alt:"Le salon de thé Angelina, rue de Rivoli"},
    {date:"2026-04-23", title:"Une conférence de presse dans un lieu de caractère", jpg:"assets/lieux/vaudeville.jpg", alt:"La salle du Vaudeville"},
    {date:"2026-04-09", title:"Fiançailles : réunir ses proches dans une brasserie parisienne", jpg:"assets/lieux/lipp.jpg", alt:"La salle de la Brasserie Lipp"},
    {date:"2026-03-26", title:"Lancement de produit : faire du lieu un décor", jpg:"assets/lieux/public-house.jpg", alt:"La salle de Public House"},
    {date:"2026-03-12", title:"Baptêmes et communions : nos salons pour les fêtes de famille", jpg:"assets/lieux/pavillon-lile.jpg", alt:"Le Pavillon de L’Île"},
    {date:"2026-02-26", title:"Les terrasses à privatiser dès le printemps", jpg:"assets/lieux/terrasse-de-madame.jpg", alt:"La Terrasse de Madame, au jardin du Luxembourg"},
    {date:"2026-02-12", title:"Saint-Valentin : un dîner à deux dans nos maisons", jpg:"assets/lieux/la-coupole.jpg", alt:"La salle de La Coupole"},
    {date:"2026-01-29", title:"Vœux d’entreprise : réussir la cérémonie de début d’année", jpg:"assets/lieux/grand-cafe-capucines.jpg", alt:"Le Grand Café Capucines"},
    {date:"2026-01-15", title:"Un séminaire au Disney Village, à deux pas des parcs", jpg:"assets/lieux/rosalie-disney-village-77.jpg", alt:"Rosalie, au Disney Village"},
    {date:"2025-12-18", title:"Réveillon du Nouvel An : privatiser une brasserie", jpg:"assets/lieux/terminus-nord.jpg", alt:"La salle du Terminus Nord"},
  ];
  const day = d => new Date(d + "T12:00:00").toLocaleDateString("fr-FR", {day:"numeric", month:"long", year:"numeric"});
  window.JOURNAL = {POSTS, day};
})();
