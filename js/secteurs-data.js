/* Les pages Secteur (secteur.html?s=…, en production /secteurs/[secteur]) : un texte par quartier, repris du ton du Figma (6560-899).
   sur   : la tournure du quartier dans les phrases (« Organiser un événement sur les Champs-Élysées ») ;
   img   : photo du hero (imgM : version mobile, imgPos : cadrage) ; blocs : les deux sections photo + texte ; carte : titre et phrase de la carte.
   Hero des Champs-Élysées : Figma 6560-900. Ailleurs, en attendant des photos de quartier, celles de nos maisons. */
BH.SECTEURS = (() => {
  const T = {
    ouest:{short:"Champs-Élysées", sur:"sur les Champs-Élysées", img:"assets/secteurs/champs-elysees.jpg", imgM:"assets/secteurs/champs-elysees-m.jpg", imgPos:"50% 100%",
      intro:"Réunissez vos invités dans un restaurant ou une brasserie des Champs-Élysées. Découvrez les adresses Bertrand Hospitality à réserver en groupe ou à privatiser dans ce quartier emblématique de Paris.",
      blocs:[["Une adresse emblématique", "Privatiser au cœur des Champs-Élysées", "Recevoir sur les Champs-Élysées, c’est donner rendez-vous à vos invités dans un cadre qui incarne Paris. De la tradition de brasserie de L’Alsace à l’inspiration scandinave de Flora Danica, nos adresses du 8ᵉ arrondissement offrent des ambiances singulières pour vos réceptions. Découvrez le lieu qui correspond à votre événement, au nombre de convives et à l’atmosphère recherchée.", "assets/lieux/flora-danica.jpg"],
             ["Un événement à votre image", "Une réception sur-mesure", "Déjeuner d’équipe, dîner d’affaires ou anniversaire : nos équipes vous accompagnent dans l’organisation de votre événement aux Champs-Élysées. Selon l’établissement et votre projet, choisissez une réservation de groupe ou un espace privatisé, avec une offre de restauration adaptée. Partagez votre date, le nombre d’invités et vos envies pour trouver la formule qui vous correspond.", "assets/lieux/sirwinston.jpg"]],
      carte:"De la Seine aux Champs-Élysées"},
    centre:{short:"Opéra et centre", sur:"à l’Opéra et au cœur de Paris", img:"assets/lieux/grand-cafe-capucines.jpg",
      intro:"Des Grands Boulevards aux Halles, de la Bourse à la Bastille : nos brasseries historiques du centre de Paris accueillent vos dîners, vos cocktails et vos séminaires, à quelques pas de l’Opéra Garnier.",
      blocs:[["Des brasseries historiques", "Recevoir au cœur de Paris", "Le Vaudeville face à la Bourse, Bofinger et sa coupole de verre, le Grand Café Capucines sur les Grands Boulevards : nos maisons du centre ont traversé le siècle. Leurs salons Belle Époque et Art déco offrent à vos invités un décor que seul Paris sait donner.", "assets/lieux/bofinger.jpg"],
             ["Un événement à votre image", "Une réception sur-mesure", "Dîner de fin d’année, cocktail après un salon, réunion à deux pas des gares : nos équipes vous accompagnent du premier échange au jour J. Selon la maison, un salon privé, un étage ou la brasserie entière, avec des menus composés pour vous.", "assets/lieux/public-house.jpg"]],
      carte:"Des Grands Boulevards à la Bastille"},
    rg:{short:"Rive gauche", sur:"sur la Rive gauche", img:"assets/lieux/la-coupole.jpg",
      intro:"Saint-Germain-des-Prés, Montparnasse, le jardin du Luxembourg : nos adresses de la Rive gauche portent l’histoire littéraire et artistique de Paris, pour des événements qui ont du caractère.",
      blocs:[["Le Paris des artistes", "Privatiser sur la Rive gauche", "Le Procope, plus ancien café de Paris, la Brasserie Lipp, La Coupole et son Dancing : nos maisons de la Rive gauche ont vu passer écrivains et peintres. Elles accueillent aujourd’hui vos dîners, vos cocktails et vos soirées, dans des décors restés intacts.", "assets/lieux/procope.jpg"],
             ["Un événement à votre image", "Une réception sur-mesure", "Un déjeuner en terrasse au Luxembourg, un dîner de gala à Montparnasse, une soirée dansante jusqu’au bout de la nuit : nos équipes composent avec vous la formule juste, du salon privé à la privatisation complète.", "assets/lieux/terrasse-de-madame.jpg"]],
      carte:"De Saint-Germain à Montparnasse"},
    seine:{short:"Bords de Seine", sur:"en bord de Seine", img:"assets/lieux/polpo.jpg",
      intro:"Une barge à Levallois, une île à Issy-les-Moulineaux, une table méditerranéenne à Saint-Ouen : aux portes de Paris, nos grands lieux au bord de l’eau accueillent les événements les plus nombreux.",
      blocs:[["Au fil de l’eau", "Privatiser en bord de Seine", "Polpo, la plus grande barge d’Europe, L’Île et son Pavillon au cœur d’un parc : aux portes de Paris, nos lieux en bord de Seine offrent l’espace, la lumière et les terrasses que la ville réserve rarement, jusqu’à plusieurs centaines d’invités.", "assets/lieux/lile.jpg"],
             ["Un événement à votre image", "Une réception sur-mesure", "Séminaire au calme, cocktail au coucher du soleil, mariage ou soirée dansante : nos équipes vous accompagnent dans l’organisation de votre événement, de la mise en place à la dernière danse.", "assets/lieux/pavillon-lile.jpg"]],
      carte:"Aux portes de Paris"},
    hors:{short:"Versailles et Disney Village", sur:"à Versailles et Disney Village", img:"assets/lieux/la-flottille-versailles.jpg",
      intro:"Au bord du Grand Canal, au cœur du château de Versailles ou à Disney Village : nos adresses hors de Paris donnent à vos événements un cadre d’exception, à une demi-heure de la capitale.",
      blocs:[["Un cadre d’exception", "Recevoir à Versailles", "La Flottille au bord du Grand Canal, les salons d’Angelina au cœur du château : à Versailles, vos invités vivent l’art de vivre à la française dans l’un des plus beaux décors du monde.", "assets/lieux/angelina-versailles.jpg"],
             ["Un événement à votre image", "Une réception sur-mesure", "Séminaire, déjeuner de groupe ou grande réception à la Brasserie Rosalie de Disney Village : nos équipes organisent avec vous l’accueil, les menus et le déroulé, pour que vous n’ayez qu’à recevoir.", "assets/lieux/rosalie-disney-village-77.jpg"]],
      carte:"Aux portes de Paris"},
  };
  const ALL = BH.SECTORS.map(s => ({...s, ...T[s.id], venues:BH.VENUES.filter(v => v.s === s.id)}));
  return {ALL, byId:id => ALL.find(s => s.id === id)};
})();
