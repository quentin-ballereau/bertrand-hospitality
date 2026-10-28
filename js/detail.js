/* Contenu détaillé des lieux pour l'expérience immersive (lieu.html).
   Polpo est le lieu pilote : espaces, capacités et offres repris de sa fiche actuelle et du POC de Thomas.
   Les autres lieux s'affichent avec leur photo principale et leurs capacités (BH.VENUES) en attendant leur contenu.

   Points de passage (hot) : position en % de l'image ; « to » = espace de destination.
   day / event : photos du même espace en situation d'événement, au même cadrage, en journée et en soirée
   (par ex. day:"assets/polpo/bar-jour.jpg", event:"assets/polpo/bar-soir.jpg") ; le sélecteur « Lieu vide · En journée · En soirée »
   ne s'affiche que sur les espaces qui en ont. empty:false : pas de photo du lieu vide, img est déjà la photo de jour.
   pos : cadrage de la photo (object-position), pour une photo en hauteur. */
BH.DETAIL = {
  polpo: {
    tagline: "La plus grande barge d’Europe, amarrée face à la Seine",
    about: "Installé sur une péniche de 600 m² aux portes du 17ᵉ arrondissement, Polpo déploie une large terrasse panoramique sur la Seine et un décor végétal dépaysant. Le chef y signe une cuisine tendance aux influences marines, déclinée au gré des saisons, du déjeuner au cocktail dînatoire.",
    address: ["47, quai Charles Pasqua", "92300 Levallois-Perret"],
    access: "Pont de Levallois, à 5 minutes de la porte de Champerret",
    contact: {name:"Juliette Gloux", role:"Votre interlocutrice", phone:"01 41 34 32 86", mobile:"07 62 91 61 07", email:"polpo.commercial@groupe-bertrand.com"},
    site: {label:"polpo-brasserie.fr", url:"https://www.polpo-brasserie.fr"},
    instagram: {label:"@polpobrasserie", url:"https://www.instagram.com/polpobrasserie/"},
    brochure: "https://evenement.groupe-bertrand.com/wp-content/uploads/2026/09/POLPO_plaquette.pdf",
    // musique d'ambiance : morceau YouTube repris du POC de Thomas (sous droits, pour la démo uniquement).
    // En production : un fichier sous licence fourni par le lieu.
    music: {youtube:"-s89Shtq_pI"},
    streetview: "https://www.google.com/maps/embed?pb=!4v1685968770306!6m8!1m7!1sCAoSLEFGMVFpcE5BV0JNc2lqZEtBVHZIUjU3RTJ1RVA3Y3FpVF9iUnRQckR0dlFk!2m2!1d48.900298424678!2d2.2807732139093!3f267.35!4f-0.45000000000000284!5f0.7820865974627469",
    offers: [
      {group:"Repas assis", items:[
        {name:"Menu déjeuner", note:"Du lundi au vendredi, hors jours fériés", ht:"34,24", ttc:"38,00"},
        {name:"Menu Plaisance", ht:"49,02", ttc:"55,00"},
        {name:"Menu Polpo", ht:"57,58", ttc:"65,00"}]},
      {group:"Cocktail", items:[
        {name:"Menu cocktail", note:"L’équivalent de 20 pièces", ht:"59,09", ttc:"65,00"}]},
      {group:"Nouveau", items:[
        {name:"Dîner et escapade sur la Seine", ht:"70,68", ttc:"81,00"}]},
    ],
    // galerie : photos fournies par Polpo le 21/10/2026 (Simon Detraz, Romain Ricard) ; originaux dans images-polpo/
    gallery: [
      {src:"assets/polpo/galerie/01.jpg", thumb:"assets/polpo/galerie/01-thumb.jpg", alt:"La mosaïque au poulpe et la longue table de la grande salle"},
      {src:"assets/polpo/galerie/02.jpg", thumb:"assets/polpo/galerie/02-thumb.jpg", alt:"Un spritz sur la Seine"},
      {src:"assets/polpo/galerie/03.jpg", thumb:"assets/polpo/galerie/03-thumb.jpg", alt:"La grande salle sous la verrière"},
      {src:"assets/polpo/galerie/04.jpg", thumb:"assets/polpo/galerie/04-thumb.jpg", alt:"Le homard et ses frites"},
      {src:"assets/polpo/galerie/05.jpg", thumb:"assets/polpo/galerie/05-thumb.jpg", alt:"La terrasse face à la Seine"},
      {src:"assets/polpo/galerie/06.jpg", thumb:"assets/polpo/galerie/06-thumb.jpg", alt:"Le partage, entre amis"},
      {src:"assets/polpo/galerie/07.jpg", thumb:"assets/polpo/galerie/07-thumb.jpg", alt:"Une banquette sous les suspensions"},
      {src:"assets/polpo/galerie/08.jpg", thumb:"assets/polpo/galerie/08-thumb.jpg", alt:"Le cocktail de la maison"},
      {src:"assets/polpo/galerie/09.jpg", thumb:"assets/polpo/galerie/09-thumb.jpg", alt:"La verrière et ses palmiers"},
      {src:"assets/polpo/galerie/10.jpg", thumb:"assets/polpo/galerie/10-thumb.jpg", alt:"Une assiette de la carte, à l’apéritif"},
      {src:"assets/polpo/galerie/11.jpg", thumb:"assets/polpo/galerie/11-thumb.jpg", alt:"Les tables de la terrasse, face à l’eau"},
      {src:"assets/polpo/galerie/12.jpg", thumb:"assets/polpo/galerie/12-thumb.jpg", alt:"La pavlova aux fraises"},
      {src:"assets/polpo/galerie/13.jpg", thumb:"assets/polpo/galerie/13-thumb.jpg", alt:"La salle et sa vue sur le pont de Levallois"},
      {src:"assets/polpo/galerie/14.jpg", thumb:"assets/polpo/galerie/14-thumb.jpg", alt:"Le lobster roll"},
      {src:"assets/polpo/galerie/15.jpg", thumb:"assets/polpo/galerie/15-thumb.jpg", alt:"La grande salle, dressée pour le déjeuner"},
      {src:"assets/polpo/galerie/16.jpg", thumb:"assets/polpo/galerie/16-thumb.jpg", alt:"Un plat de la carte"},
    ],
    scenes: [
      {id:"babord", name:"Espace Bâbord", img:"assets/polpo/babord.jpg", thumb:"assets/polpo/babord-thumb.jpg",
       desc:"La grande salle sous verrière, sa mosaïque au poulpe et ses suspensions en rotin.",
       caps:{assis:100, cocktail:100, reunion:60},
       hot:[{x:44, y:52, to:"bar"}, {x:12, y:58, to:"terrasse"}, {x:78, y:60, to:"tribord"}]},
      {id:"tribord", name:"Espace Tribord", img:"assets/polpo/tribord.jpg", thumb:"assets/polpo/tribord-thumb.jpg",
       desc:"Un salon en banquettes, sous la mezzanine. Idéal pour un comité de direction ou un dîner privé.",
       caps:{assis:40, cocktail:40, reunion:15},
       hot:[{x:52, y:30, to:"mezzanine"}, {x:14, y:62, to:"babord"}]},
      {id:"mezzanine", name:"Mezzanine", img:"assets/polpo/mezzanine.jpg", thumb:"assets/polpo/mezzanine-thumb.jpg",
       desc:"En surplomb de la salle, un espace cocktail confidentiel avec vue plongeante.",
       caps:{cocktail:25},
       hot:[{x:72, y:56, to:"terrasse"}, {x:30, y:64, to:"tribord"}]},
      {id:"bar", name:"Le Bar", img:"assets/polpo/bar.jpg", thumb:"assets/polpo/bar-thumb.jpg", day:"assets/polpo/bar-jour.jpg", event:"assets/polpo/bar-soir.jpg",
       desc:"Carrelage vert et bibliothèque de spiritueux, le cœur des afterworks et des cocktails dînatoires.",
       caps:{cocktail:100},
       hot:[{x:22, y:48, to:"babord"}, {x:70, y:66, to:"restaurant"}]},
      {id:"terrasse", name:"Terrasse sur Seine", img:"assets/polpo/terrasse.jpg", thumb:"assets/polpo/terrasse-thumb.jpg",
       desc:"Une vue panoramique sur la Seine. Couverte et chauffée selon la saison.",
       caps:{cocktail:100},
       hot:[{x:76, y:54, to:"babord"}, {x:30, y:56, to:"plage"}]},
      // mises en situation fournies le 28/10/2026, versions vides livrées ensuite (photos d'ambiance, non contractuelles) : capacités à confirmer avec Polpo
      {id:"plage", name:"La Plage", pos:"50% 38%", img:"assets/polpo/plage.jpg", thumb:"assets/polpo/plage-thumb.jpg", day:"assets/polpo/plage-jour.jpg", event:"assets/polpo/plage-soir.jpg",
       desc:"Transats, sable et lanternes au bord de l’eau, sous une voile tressée : l’été sur la Seine.",
       caps:{},
       hot:[{x:52, y:44, to:"terrasse"}]},
      {id:"tente", name:"Salle sous la tente", img:"assets/polpo/tente.jpg", thumb:"assets/polpo/tente-thumb.jpg", day:"assets/polpo/tente-jour.jpg", event:"assets/polpo/tente-soir.jpg",
       desc:"Sous ses arceaux et ses suspensions en osier, une salle lumineuse ouverte sur le quai, pour les déjeuners et les dîners.",
       caps:{},
       hot:[{x:50, y:60, to:"bar"}]},
      {id:"restaurant", name:"Privatisation totale", img:"assets/polpo/restaurant.jpg", thumb:"assets/polpo/restaurant-thumb.jpg",
       desc:"Toute la barge pour vous : tables rondes, piste de danse, jusqu’à 500 invités en cocktail.",
       caps:{assis:350, cocktail:500, reunion:250, dansant:500},
       hot:[{x:58, y:56, to:"conference"}, {x:20, y:60, to:"bar"}]},
      {id:"conference", name:"Configuration conférence", img:"assets/polpo/conference.jpg", thumb:"assets/polpo/conference-thumb.jpg",
       desc:"Le restaurant en théâtre : 250 places face à l’écran, sous la lumière naturelle de la verrière.",
       caps:{reunion:250},
       hot:[{x:50, y:62, to:"restaurant"}]},
    ],
  },
};
