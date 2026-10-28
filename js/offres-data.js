/* Les formats d'événement (page Événements et pages Format) : les neuf formats du site actuel
   (evenement.groupe-bertrand.com/offres et /privatisation), avec leurs textes réécrits.
   cap   : jauge du filtre de recherche (les lieux qui proposent ce format, avec leur capacité dans ce format) ;
   picks : sinon, les lieux conseillés pour ce format sur le site actuel ;
   votre : la tournure du format dans les phrases (« Organiser votre séminaire ») ;
   url   : adresse actuelle, conservée en production (/offres/[format], /privatisation/[occasion]). */
BH.OFFRES = (() => {
  const {VENUES, capFor} = BH;
  const GROUPS = [
    {id:"pro", label:"Rendez-vous professionnels", items:[
      {slug:"reunion-seminaire", votre:"votre séminaire", name:"Réunion & séminaire", url:"/offres/reunion-seminaire/", cap:"reunion",
       img:"assets/home/fmt-1.jpg", img2:"assets/polpo/galerie/13.jpg",
       txt:"Des salles modulables en théâtre, en U ou en cabaret, les pauses, le déjeuner et le matériel technique : tout s’enchaîne, jusqu’au team building.",
       intro:"Réunir vos équipes dans une maison qui a du caractère change la journée. Nos salles se configurent en théâtre, en U, en cabaret ou en plénière ; nous prévoyons le café d’accueil, les pauses, le déjeuner et le matériel, pour que vous n’ayez qu’à travailler.",
       incl:[["Des espaces modulables", "Théâtre, U, cabaret ou plénière, de 15 à 250 participants."], ["Le matériel technique", "Écran, vidéoprojecteur, sonorisation et micros selon la salle."], ["Les pauses et les repas", "Café d’accueil, pauses gourmandes, déjeuner assis ou buffet."], ["La suite de la journée", "Un cocktail, un dîner ou une activité de team building sur place."]]},
      {slug:"dejeuner-diner", votre:"votre déjeuner ou dîner", name:"Déjeuner & dîner", url:"/offres/dejeuner-diner/", cap:"assis",
       img:"assets/home/fmt-2.jpg", img2:"assets/polpo/galerie/04.jpg",
       txt:"Repas d’affaires ou dîner de fête, servis à table autour des spécialités qui ont fait la réputation de nos brasseries.",
       intro:"Un repas d’affaires à midi, un dîner de fin d’année ou une grande tablée entre amis : nos maisons servent à table les spécialités qui ont fait leur réputation, de la brasserie alsacienne aux saveurs danoises ou italiennes, avec des produits frais et de saison.",
       incl:[["Des menus de groupe", "Entrée, plat, dessert, avec un choix commun ou à la carte."], ["Une table à votre mesure", "D’un salon de dix couverts à la privatisation complète."], ["Les accords", "Vins choisis par nos sommeliers, champagne pour les toasts."], ["Le service", "Une équipe dédiée, du placement de vos invités au café."]]},
      {slug:"cocktail", votre:"votre cocktail", name:"Cocktail", url:"/offres/cocktail/", cap:"cocktail",
       img:"assets/home/fmt-3.jpg", img2:"assets/polpo/galerie/08.jpg",
       txt:"Canapés et mignardises pour mêler les groupes, dans une brasserie Art déco, un jardin ou les pieds dans l’eau.",
       intro:"Le cocktail dînatoire est le format qui fait circuler : vos invités se rencontrent autour de pièces salées et sucrées, dans une brasserie Art déco, un jardin ou à bord d’une barge sur la Seine. Nous transformons les espaces pour qu’ils accueillent debout, avec élégance.",
       incl:[["Des pièces cocktail", "Salées et sucrées, à partir de douze pièces par personne."], ["Le bar", "Champagne, vins, cocktails signature ou sans alcool."], ["L’aménagement", "Mange-debout, salons, éclairage et fleurs selon le lieu."], ["L’animation", "DJ, musiciens ou photographe, sur demande."]]},
      {slug:"afterwork", votre:"votre afterwork", name:"Afterwork", url:"/offres/afterwork/", img:"assets/polpo/galerie/02.jpg", img2:"assets/lieux/public-house.jpg",
       picks:["sirwinston", "vaudeville", "au-pied-de-cochon", "auteuil-brasserie", "les-2-stations", "public-house", "amanie"],
       txt:"Un verre en terrasse, une planche de produits de saison : décompresser entre collègues, au cœur de Paris.",
       intro:"Après la journée, un verre en terrasse ou dans un salon feutré, une planche de produits de saison : nos formules afterwork réunissent vos équipes dans des lieux chaleureux, en plein cœur de Paris comme aux portes de la ville.",
       incl:[["Des formules afterwork", "Planches à partager et boissons, au forfait ou à la consommation."], ["Terrasse ou salon", "À la belle saison dehors, l’hiver au coin d’un bar."], ["Des horaires souples", "De 18 h jusqu’au dîner, prolongeable sur place."], ["Le sur-mesure", "Une dégustation, un quiz ou une soirée à thème."]]},
      {slug:"petit-dejeuner-gouter", votre:"votre petit-déjeuner ou brunch", name:"Petit-déjeuner, goûter & brunch", url:"/offres/petit-dejeuner-gouter/", img:"assets/lieux/angelina-rivoli.jpg", img2:"assets/polpo/galerie/12.jpg",
       picks:["sirwinston", "angelina-rivoli", "grand-cafe-capucines", "au-pied-de-cochon", "les-2-stations", "procope", "bofinger", "flora-danica"],
       txt:"Viennoiseries, pâtisseries d’Angelina, brunchs scandinaves ou italiens : pour ouvrir un séminaire ou réunir ses proches.",
       intro:"Ces moments sont trop souvent oubliés : un petit-déjeuner pour lancer un séminaire, un goûter chez Angelina, un brunch scandinave ou italien le dimanche. Sucré ou salé, nous les composons pour vos proches comme pour vos collègues.",
       incl:[["Le petit-déjeuner", "Viennoiseries, jus frais, boissons chaudes, version salée possible."], ["Le goûter", "Pâtisseries de nos maisons, chocolat chaud d’Angelina."], ["Le brunch", "Formules à partager, à table ou en buffet."], ["Pour vos séminaires", "En accueil de matinée, avant la première séance."]]},
      {slug:"salon-privatif", votre:"votre réception en salon privé", name:"Salon privatif", url:"/offres/salon-privatif/", img:"assets/lieux/procope.jpg", img2:"assets/lieux/lipp.jpg",
       picks:["procope", "au-pied-de-cochon", "dancing-coupole", "copenhague", "angelina-rivoli", "bofinger", "pavillon-lile", "sirwinston"],
       txt:"Plus de trente-cinq salons privés et semi-privés, pour les réceptions intimistes, au calme, dans une maison qui vit autour.",
       intro:"Pour un dîner de direction, un anniversaire ou une signature, nos maisons comptent plus de trente-cinq salons privés et semi-privés : l’intimité d’une pièce à vous, avec le charme d’une brasserie Art nouveau ou d’un restaurant contemporain tout autour.",
       incl:[["Plus de 35 salons", "De dix à quatre-vingts convives, privés ou semi-privés."], ["Tous les formats", "Déjeuner, dîner, cocktail ou réunion de travail."], ["Un service dédié", "Une équipe attachée à votre salon le temps de l’événement."], ["Le décor", "Fleurs, menus personnalisés et plan de table sur demande."]]},
    ]},
    {id:"fetes", label:"Fêtes et célébrations", items:[
      {slug:"soiree-dansante", votre:"votre soirée dansante", name:"Soirée dansante", url:"/offres/soiree-dansante/", cap:"dansant", img:"assets/home/fmt-4.jpg", img2:"assets/lieux/la-coupole.jpg",
       txt:"Une piste, un DJ et des lieux qui se transforment à la nuit tombée, jusqu’au bout de la soirée.",
       intro:"Quand le dîner se termine, la soirée commence : piste de danse, DJ, éclairages, et des lieux qui se transforment à la nuit tombée, du Dancing de La Coupole à la barge de Polpo. Nous orchestrons le passage du repas à la fête.",
       incl:[["La piste et le son", "DJ, sonorisation et éclairages adaptés au lieu."], ["Le dîner avant la fête", "Assis ou cocktail dînatoire, puis la soirée."], ["Le bar de nuit", "Formules open bar ou à la consommation."], ["Jusqu’au bout de la nuit", "Des horaires étendus selon les maisons."]]},
      {slug:"soiree-a-theme", votre:"votre soirée à thème", name:"Soirée à thème", url:"/privatisation/festif-soiree-a-theme/", img:"assets/offres/coupole-nuit.jpg", img2:"assets/polpo/galerie/16.jpg",
       picks:["polpo", "angelina-rivoli", "pavillon-lile", "dancing-coupole"],
       txt:"Années folles, Gatsby, guinguette ou garden party : nos lieux se prêtent à tous les décors, et nos équipes aux mises en scène.",
       intro:"Années folles, soirée Gatsby, guinguette, garden party : un thème plonge vos invités dans un autre monde. Nos brasseries mythiques et nos lieux les plus étonnants s’y prêtent, et nos équipes marient décor, musique et menu pour que l’illusion soit complète.",
       incl:[["Le décor", "Mobilier, fleurs, accessoires et éclairages autour de votre thème."], ["La musique", "Orchestre, DJ ou playlist d’époque."], ["Le menu", "Des plats et cocktails accordés au thème."], ["Les animations", "Photographe, comédiens, ateliers selon vos envies."]]},
      {slug:"mariage", votre:"votre mariage", name:"Mariage", url:"/privatisation/mariage/", img:"assets/home/closing.jpg", img2:"assets/lieux/terrasse-de-madame.jpg",
       picks:["lile", "auteuil-brasserie", "polpo", "angelina-rivoli", "pavillon-lile", "flora-danica", "terrasse-de-madame", "amanie"],
       txt:"Salons intimes, terrasses d’été ou grandes salles de réception : nous vous accompagnons de la première visite au jour J.",
       intro:"Un salon pour un mariage intime, une terrasse pour une réception d’été, une grande salle pour réunir toute la famille : nous vous conseillons le lieu juste, puis nous préparons avec vous chaque moment, du vin d’honneur à la dernière danse.",
       incl:[["Le vin d’honneur", "En terrasse, dans un jardin ou au bord de l’eau."], ["Le dîner", "Menus de réception, gâteau et accords mets-vins."], ["La soirée", "Piste de danse, DJ et horaires étendus."], ["Un interlocuteur unique", "De la première visite au lendemain."]]},
    ]},
  ];
  const ALL = GROUPS.flatMap(g => g.items.map(f => ({...f, group:g.label})));
  ALL.forEach((f, i) => {
    f.n = i + 1;
    // les lieux du format, du plus grand au plus petit dans ce format
    f.venues = (f.cap ? VENUES.filter(v => v[f.cap]) : VENUES.filter(v => f.picks.includes(v.slug)))
      .sort((a, b) => (f.cap ? b[f.cap] - a[f.cap] : capFor(b) - capFor(a)));
    f.count = f.venues.length;
    f.capOf = v => f.cap ? v[f.cap] : capFor(v);
    f.max = Math.max(...f.venues.map(f.capOf));
    f.min = Math.min(...f.venues.map(f.capOf));
    f.meta = `${f.count} lieux · jusqu’à ${f.max} invités`;
    f.href = `offre.html?f=${f.slug}`;   // en production : f.url
  });
  return {GROUPS:GROUPS.map(g => ({...g, items:ALL.filter(f => f.group === g.label)})), ALL, bySlug:s => ALL.find(f => f.slug === s)};
})();
