/* Les lieux d'une page Format ou Secteur, filtrables avec la barre de recherche de la home (js/finder.js).
   Le critère déjà connu de la page (le format, ou le quartier) n'est pas reproposé ; le nombre d'invités vient en premier.
   BH.venueList(root, {venues, fields, capOf(v, state), unitOf(state), link(v, state), devis(state)})
   capOf : la capacité du lieu pour l'état des filtres (0 = le lieu ne s'y prête pas). */
BH.venueList = (root, o) => {
  const PAGE = 9;
  const state = {format:null, guests:null, sector:null};
  const results = st => {
    const list = o.venues.filter(v => { const c = o.capOf(v, st); return c && !(st.guests && c < st.guests) && !(st.sector && v.s !== st.sector); });
    // avec un nombre d'invités, le lieu le plus juste d'abord ; sinon du plus grand au plus intime
    return list.sort((a, b) => st.guests ? o.capOf(a, st) - o.capOf(b, st) : o.capOf(b, st) - o.capOf(a, st));
  };

  root.insertAdjacentHTML("beforeend", `
    <div class="finder is-light vl-filter"></div>
    <div class="vl-grid"></div>
    <div class="vl-more"><button class="cta ul caps" type="button"></button></div>
    <div class="vl-empty" hidden><p class="t-text">Aucune de nos maisons ne correspond exactement à ces critères&nbsp;: plusieurs espaces peuvent souvent se combiner. Parlons-en.</p>
      <a class="btn" href="devis.html">Nous consulter</a></div>`);
  const grid = root.querySelector(".vl-grid"), more = root.querySelector(".vl-more"), moreBtn = more.firstElementChild, empty = root.querySelector(".vl-empty");
  let all = false, swapT;

  const card = v => `<a class="vcard" href="${o.link(v, state)}">
      <span class="vcard-img"><img src="assets/lieux/${v.slug}.jpg" alt="" loading="lazy"></span>
      <span class="vcard-txt"><span class="vcard-meta">${v.place} · jusqu’à ${o.capOf(v, state)} invités${o.unitOf ? " " + o.unitOf(state) : ""}</span><span class="vcard-name">${v.name}</span></span></a>`;
  function render() {
    const list = results(state), shown = all ? list : list.slice(0, PAGE);
    grid.innerHTML = shown.map(card).join("");
    more.hidden = list.length <= shown.length;
    moreBtn.textContent = `Voir les ${list.length} lieux`;
    empty.hidden = !!list.length;
    empty.querySelector(".btn").href = o.devis ? o.devis(state) : "devis.html";
  }
  // à chaque filtre, la grille s'efface puis revient avec ses nouveaux lieux
  const swap = () => { grid.classList.add("is-swap"); clearTimeout(swapT); swapT = setTimeout(() => { all = false; render(); grid.classList.remove("is-swap"); }, 260); };
  moreBtn.addEventListener("click", () => { all = true; render(); });

  const finder = BH.finder(root.querySelector(".vl-filter"), {
    state, fields:o.fields, results,
    onChange: swap,
    submitLabel: n => n ? `${n} lieu${n > 1 ? "x" : ""}` : "Nous consulter",
    onSubmit: () => {},
  });
  render();
  return {state, finder, results};
};
