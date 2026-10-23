/* Capacités relevées sur evenement.groupe-bertrand.com (octobre 2026).
   assis / cocktail / reunion = capacité max par format ; dansant = capacité en soirée dansante (0 = non proposé). */
window.BH = (() => {
  const SECTORS = [
    {id:"ouest",  name:"Champs-Élysées et Ouest"},
    {id:"centre", name:"Opéra, Grands Boulevards et centre"},
    {id:"rg",     name:"Rive gauche"},
    {id:"seine",  name:"Bords de Seine et proche banlieue"},
    {id:"hors",   name:"Versailles et Disney Village"},
  ];
  const VENUES = [
    {slug:"polpo", name:"Polpo", place:"Levallois-Perret", s:"seine", tag:"La plus grande barge d’Europe", desc:"Amarrée face à la Seine, la plus grande barge d’Europe, sa verrière baignée de lumière et sa terrasse panoramique.", assis:350, cocktail:500, reunion:250, dansant:500},
    {slug:"la-coupole", name:"La Coupole", place:"Montparnasse", s:"rg", tag:"Montparnasse depuis 1927", desc:"Depuis 1927, la brasserie Art déco de Montparnasse, inscrite au patrimoine, où se croisent artistes et personnalités.", assis:350, cocktail:500, reunion:0, dansant:500},
    {slug:"procope", name:"Le Procope", place:"Odéon", s:"rg", tag:"Le plus ancien café de Paris, depuis 1686", desc:"Depuis 1686, le plus ancien café de Paris et ses salons historiques, au cœur de Saint-Germain.", assis:72, cocktail:80, reunion:72, dansant:0},
    {slug:"flora-danica", name:"Flora Danica", place:"Champs-Élysées", s:"ouest", tag:"Un jardin secret sur les Champs-Élysées", desc:"À cent mètres de l’Arc de Triomphe, une brasserie danoise signée GamFratesi et sa terrasse cachée.", assis:120, cocktail:400, reunion:120, dansant:140},
    {slug:"la-flottille-versailles", name:"La Flottille", place:"Parc du château de Versailles", s:"hors", tag:"Au bord du Grand Canal", desc:"En bordure du Grand Canal, une maison du début du XXᵉ siècle au calme du parc du château de Versailles.", assis:410, cocktail:420, reunion:0, dansant:0},
    {slug:"bofinger", name:"Bofinger", place:"Bastille", s:"centre", tag:"Bastille depuis 1864", desc:"Entre Bastille et place des Vosges, la brasserie de 1864 sous sa coupole de verre et ses boiseries.", assis:90, cocktail:100, reunion:60, dansant:0},
    {slug:"amanie", name:"Amanie", place:"Paris 15 · Commerce", s:"rg", tag:"Brasserie et bar à cocktails du chef Manoj Sharma", desc:"Au bout de la rue du Commerce, une brasserie conviviale du 15ᵉ, sa terrasse perchée et son espace VIP.", assis:175, cocktail:210, reunion:40, dansant:0},
    {slug:"sirwinston", name:"Sir Winston", place:"Étoile", s:"ouest", tag:"Pub anglo-indien près de l’Étoile", desc:"Près de l’Étoile, un pub anglo-indien imaginé par Laura Gonzalez, du jardin d’hiver au bar secret.", assis:130, cocktail:170, reunion:0, dansant:0},
    {slug:"auteuil-brasserie", name:"Auteuil Brasserie", place:"Porte d’Auteuil", s:"ouest", tag:"La brasserie solaire de l’Ouest parisien", desc:"Porte d’Auteuil, une brasserie solaire aux couleurs du Sud et son rooftop végétalisé.", assis:310, cocktail:600, reunion:70, dansant:0},
    {slug:"angelina-rivoli", name:"Angelina Rivoli", place:"Tuileries", s:"centre", tag:"Le salon de thé de la rue de Rivoli, depuis 1903", desc:"Face aux Tuileries depuis 1903, le salon de thé Belle Époque, ses moulures, ses dorures et sa mezzanine.", assis:180, cocktail:200, reunion:30, dansant:0},
    {slug:"meida", name:"Meïda", place:"Saint-Ouen", s:"seine", tag:"Brasserie méditerranéenne de Saint-Ouen", desc:"À Saint-Ouen, la première table du chef Mohamed Cheikh : une cuisine méditerranéenne généreuse, à partager.", assis:170, cocktail:250, reunion:0, dansant:0},
    {slug:"terrasse-de-madame", name:"La Terrasse de Madame", place:"Jardin du Luxembourg", s:"rg", tag:"Une terrasse côté Sénat", desc:"Au cœur du jardin du Luxembourg, une terrasse à l’ombre des marronniers, loin de l’agitation.", assis:60, cocktail:100, reunion:0, dansant:0},
    {slug:"public-house", name:"Public House", place:"Opéra", s:"centre", tag:"British pub et brasserie", desc:"Dans le quartier de l’Opéra, un pub britannique sur trois étages signés Laura Gonzalez, et sa loggia.", assis:150, cocktail:350, reunion:60, dansant:0},
    {slug:"lile", name:"L’Île", place:"Issy-les-Moulineaux", s:"seine", tag:"Au cœur du parc de l’Île Saint-Germain", desc:"Sur l’île Saint-Germain, une maison de campagne en bord de Seine, sa verrière et sa terrasse sur le parc.", assis:350, cocktail:400, reunion:110, dansant:0},
    {slug:"vaudeville", name:"Le Vaudeville", place:"Bourse", s:"centre", tag:"Face à la Bourse depuis 1918", desc:"Face à la Bourse depuis 1918, une brasserie Art déco tout en marbre et en lumière, à deux pas de l’Opéra.", assis:128, cocktail:0, reunion:0, dansant:0},
    {slug:"hotel-norman", name:"Thiou · Hôtel Norman", place:"Champs-Élysées", s:"ouest", tag:"Restaurant thaï de l’hôtel Norman", desc:"Au sein de l’hôtel Norman, près des Champs-Élysées, la table thaïe de la cheffe Thiou et son patio.", assis:58, cocktail:80, reunion:0, dansant:0},
    {slug:"angelina-alma", name:"Angelina Alma", place:"Alma", s:"ouest", tag:"Salon de thé face à la Seine", desc:"Entre la tour Eiffel et l’avenue Montaigne, un salon inspiré de Rivoli, ses matériaux nobles et ses fresques.", assis:30, cocktail:80, reunion:0, dansant:0},
    {slug:"dancing-coupole", name:"Le Dancing de La Coupole", place:"Montparnasse", s:"rg", tag:"La piste mythique sous La Coupole", desc:"Sous La Coupole, un salon Art déco de 225 m² où l’on danse jusqu’au bout de la nuit.", assis:180, cocktail:250, reunion:110, dansant:250},
    {slug:"lipp", name:"Brasserie Lipp", place:"Saint-Germain-des-Prés", s:"rg", tag:"Saint-Germain depuis 1880", desc:"Depuis 1880, l’institution de Saint-Germain-des-Prés, ses grands miroirs et ses céramiques Art nouveau.", assis:160, cocktail:0, reunion:0, dansant:0},
    {slug:"les-2-stations", name:"Les 2 Stations", place:"Porte d’Auteuil", s:"ouest", tag:"Bistrot populaire auvergnat", desc:"Porte d’Auteuil, une maison auvergnate de 1912 au décor des années 50, banquettes en cuir et nappes à carreaux.", assis:50, cocktail:100, reunion:0, dansant:100},
    {slug:"lesmarionnettes", name:"Les Marionnettes", place:"Jardin du Luxembourg", s:"rg", tag:"Au cœur du jardin du Luxembourg", desc:"Au cœur du jardin du Luxembourg, une table en plein air à l’ombre des arbres, à l’écart de la ville.", assis:90, cocktail:100, reunion:50, dansant:0},
    {slug:"au-pied-de-cochon", name:"Au Pied de Cochon", place:"Les Halles", s:"centre", tag:"Les Halles depuis 1947", desc:"Aux Halles depuis 1947, une brasserie Belle Époque et ses trois salons privatifs modulables.", assis:55, cocktail:50, reunion:40, dansant:0},
    {slug:"grand-cafe-capucines", name:"Grand Café Capucines", place:"Opéra", s:"centre", tag:"À deux pas de l’Opéra Garnier depuis 1875", desc:"Sur les Grands Boulevards, à deux pas de l’Opéra Garnier, une grande brasserie et son étage privatisable.", assis:220, cocktail:120, reunion:0, dansant:0},
    {slug:"terminus-nord", name:"Terminus Nord", place:"Gare du Nord", s:"centre", tag:"Gare du Nord depuis 1925", desc:"Face à la Gare du Nord depuis 1925, la brasserie des voyageurs en partance pour Londres ou Bruxelles.", assis:200, cocktail:300, reunion:0, dansant:0},
    {slug:"copenhague", name:"Copenhague", place:"Champs-Élysées", s:"ouest", tag:"La table danoise des Champs-Élysées", desc:"À la Maison du Danemark, une table nordique signée GamFratesi, avec vue sur les Champs-Élysées.", assis:60, cocktail:80, reunion:120, dansant:140},
    {slug:"lorraine", name:"La Lorraine", place:"Place des Ternes", s:"ouest", tag:"Place des Ternes depuis 1919", desc:"Place des Ternes depuis 1919, une brasserie chic rénovée par Laura Gonzalez et sa terrasse ensoleillée.", assis:200, cocktail:250, reunion:0, dansant:0},
    {slug:"lalsace", name:"L’Alsace", place:"Champs-Élysées", s:"ouest", tag:"La brasserie alsacienne des Champs-Élysées", desc:"Sur les Champs-Élysées depuis 1968, la brasserie alsacienne ouverte jour et nuit.", assis:100, cocktail:0, reunion:0, dansant:0},
    {slug:"pavillon-lile", name:"Le Pavillon de L’Île", place:"Issy-les-Moulineaux", s:"seine", tag:"Un pavillon au bord de l’eau", desc:"À côté de L’Île, une bâtisse ouverte sur le parc, son bar extérieur et son salon Napoléon III à l’étage.", assis:130, cocktail:150, reunion:110, dansant:150},
    {slug:"angelina-versailles", name:"Angelina Versailles", place:"Château de Versailles", s:"hors", tag:"Des salons au cœur du château", desc:"Au cœur du château de Versailles, les salons de la maison Angelina et l’art de vivre à la française.", assis:48, cocktail:0, reunion:0, dansant:0},
    {slug:"rosalie-disney-village-77", name:"Brasserie Rosalie", place:"Disney Village", s:"hors", tag:"Une grande brasserie à Disney Village", desc:"À Disney Village, une grande brasserie sur deux étages, ses miroirs et ses fresques peintes à la main.", assis:350, cocktail:380, reunion:55, dansant:0},
  ];
  const FORMATS = [
    {id:"reunion", label:"Séminaire", phrase:"un séminaire", unit:"en réunion",
      icon:'<path d="M5 6h20v12H5z"/><path d="M15 18v6M10 27l5-3 5 3"/><path d="M9 10h7M9 13h11"/>'},
    {id:"assis", label:"Repas assis", phrase:"un repas assis", unit:"assis",
      icon:'<circle cx="15" cy="15" r="7"/><circle cx="15" cy="15" r="4"/><path d="M4 6v6a2 2 0 0 0 2 2v10M6 6v5M8 6v6a2 2 0 0 1-2 2"/><path d="M25 6c-2 1-2.5 4-2.5 7h2.5v11"/>'},
    {id:"cocktail", label:"Cocktail", phrase:"un cocktail", unit:"en cocktail",
      icon:'<path d="M7 6h16l-8 10z"/><path d="M15 16v9M10 25h10"/><path d="M19 4l-3 6"/>'},
    {id:"dansant", label:"Soirée dansante", phrase:"une soirée dansante", unit:"en soirée dansante",
      icon:'<circle cx="15" cy="17" r="7.5"/><path d="M15 3v6.5M7.5 17h15M15 9.5c-2.5 2-2.5 13 0 15M15 9.5c2.5 2 2.5 13 0 15M9 13h12M9 21h12"/>'},
  ];
  const BASE = "https://evenement.groupe-bertrand.com/lieux/";

  const capFor = (v, f) => f ? v[f] : Math.max(v.assis, v.cocktail, v.reunion, v.dansant);
  const match = (v, st) => {
    const c = capFor(v, st.format);
    return !!c && !(st.guests && c < st.guests) && !(st.sector && v.s !== st.sector);
  };
  const results = st => {
    const list = VENUES.filter(v => match(v, st));
    // le lieu le plus juste en premier : la capacité la plus proche au-dessus du besoin
    if (st.guests) list.sort((a, b) => capFor(a, st.format) - capFor(b, st.format));
    return list;
  };
  const fmtOf = id => FORMATS.find(f => f.id === id);
  const secOf = id => SECTORS.find(s => s.id === id);

  /* les filtres voyagent dans l'URL : lieux.html?format=cocktail&invites=120&secteur=rg */
  const toQuery = st => {
    const q = new URLSearchParams();
    if (st.format) q.set("format", st.format);
    if (st.guests) q.set("invites", st.guests);
    if (st.sector) q.set("secteur", st.sector);
    return q.toString();
  };
  const fromQuery = (search = location.search) => {
    const q = new URLSearchParams(search);
    const f = q.get("format"), g = +q.get("invites"), s = q.get("secteur");
    return {format: fmtOf(f) ? f : null, guests: g >= 10 ? Math.min(600, g) : null, sector: secOf(s) ? s : null};
  };

  return {SECTORS, VENUES, FORMATS, BASE, capFor, match, results, fmtOf, secOf, toQuery, fromQuery};
})();
