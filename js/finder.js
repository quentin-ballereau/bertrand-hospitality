/* Barre de recherche commune à la home et à la page des lieux.
   BH.finder(el, {state, onSubmit(state), onChange(state), submitLabel(n, touched)}) */
BH.finder = (root, opts = {}) => {
  const {FORMATS, SECTORS, results, fmtsOf, secOf} = BH;
  const state = opts.state || {format:null, guests:null, sector:null};
  const GUEST_CHIPS = [20, 50, 100, 200, 400];
  const ARROW = '<svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true"><path d="M0 5h15M11 1l4 4-4 4" stroke="currentColor"/></svg>';

  root.innerHTML = `
    <div class="pop" data-lenis-prevent data-id="format" role="dialog" aria-label="Format de l’événement">
      <div class="pop-head"><p class="pop-title">Quel événement&nbsp;?</p><p class="pop-hint">Plusieurs choix possibles</p></div>
      <div class="formats">${FORMATS.map(f =>
        `<button class="fmt" type="button" data-f="${f.id}" aria-pressed="false"><svg viewBox="0 0 30 30" aria-hidden="true">${f.icon}</svg><span class="caps">${f.label}</span></button>`).join("")}</div>
    </div>
    <div class="pop" data-lenis-prevent data-id="guests" role="dialog" aria-label="Nombre d’invités">
      <div class="pop-head"><p class="pop-title">Combien d’invités&nbsp;?</p><p class="pop-hint">De 10 à 600</p></div>
      <div class="guests">
        <div>
          <div class="stepper">
            <button type="button" data-step="-10" aria-label="Moins de personnes">−</button>
            <output class="g-num">50</output>
            <button type="button" data-step="10" aria-label="Plus de personnes">+</button>
          </div>
          <span class="g-unit">personnes</span>
        </div>
        <div>
          <input class="range" type="range" min="10" max="600" step="10" value="50" aria-label="Nombre d’invités">
          <div class="chips">${GUEST_CHIPS.map(n => `<button class="chip" type="button" data-g="${n}" aria-pressed="false">${n === 400 ? "400 et +" : n}</button>`).join("")}</div>
        </div>
      </div>
    </div>
    <div class="pop" data-lenis-prevent data-id="sector" role="dialog" aria-label="Secteur">
      <div class="pop-head"><p class="pop-title">Où&nbsp;?</p><p class="pop-hint">Facultatif</p></div>
      <div class="sectors"></div>
    </div>
    <div class="bar" role="search" aria-label="Trouver un lieu">
      <button class="seg" type="button" data-pop="format" aria-expanded="false"><span class="seg-label caps">Événement</span><span class="seg-value" data-v="format"></span></button>
      <button class="seg" type="button" data-pop="guests" aria-expanded="false"><span class="seg-label caps">Invités</span><span class="seg-value" data-v="guests"></span></button>
      <button class="seg" type="button" data-pop="sector" aria-expanded="false"><span class="seg-label caps">Secteur</span><span class="seg-value" data-v="sector"></span></button>
      <button class="go caps" type="button" data-go><span class="go-label"></span>${ARROW}</button>
    </div>`;
  // sur mobile la feuille recouvre la barre : chaque feuille a son propre bouton
  root.querySelectorAll(".pop").forEach(p => p.insertAdjacentHTML("beforeend", `<button class="go pop-go caps" type="button" data-go><span class="go-label"></span></button>`));

  // le voile se place juste avant la recherche, dans le même contexte d'empilement :
  // ajouté à la racine du document, il passait au-dessus du hero et interceptait tous les clics
  const scrim = document.createElement("div");
  scrim.className = "scrim";
  root.insertAdjacentElement("beforebegin", scrim);

  const q = s => root.querySelector(s), qa = s => root.querySelectorAll(s);
  const range = q(".range");
  let openId = null;

  function renderSectors() {
    const any = {...state, sector:null};
    q(".sectors").innerHTML = [{id:null, name:"Peu importe"}, ...SECTORS].map(s => {
      const n = results({...any, sector:s.id}).length;
      return `<button class="sec${n ? "" : " is-zero"}" type="button" data-s="${s.id ?? ""}" aria-pressed="${state.sector === s.id}"><span>${s.name}</span><small>${n} lieu${n > 1 ? "x" : ""}</small></button>`;
    }).join("");
  }
  function open(id) {
    close(true); openId = id;          // passer d'un choix à l'autre n'est pas une fermeture
    q(`.pop[data-id="${id}"]`).classList.add("is-open");
    q(`[data-pop="${id}"]`).setAttribute("aria-expanded", "true");
    scrim.classList.add("is-on");
    if (id === "sector") renderSectors();
    if (opts.onOpen) opts.onOpen(id);
  }
  function close(switching) {
    if (!openId) return;
    q(`.pop[data-id="${openId}"]`).classList.remove("is-open");
    q(`[data-pop="${openId}"]`).setAttribute("aria-expanded", "false");
    scrim.classList.remove("is-on"); openId = null;
    if (!switching && opts.onClose) opts.onClose();
  }
  const setVal = (k, txt, empty) => { const el = q(`[data-v="${k}"]`); el.textContent = txt; el.classList.toggle("is-empty", empty); };
  const defaultLabel = (n, touched) => touched ? (n ? (n > 1 ? `Voir les ${n} lieux` : "Voir le lieu") : "Nous consulter") : "Trouver un lieu";

  function update(silent) {
    const fs = fmtsOf(state.format), s = secOf(state.sector);
    setVal("format", fs.length > 1 ? `${fs.length} formats` : fs.length ? fs[0].label : "Tous formats", !fs.length);
    setVal("guests", state.guests ? `${state.guests} personnes` : "Combien ?", !state.guests);
    setVal("sector", s ? s.name : "Tout Paris", !s);
    qa(".fmt").forEach(b => b.setAttribute("aria-pressed", fmtsOf(state.format).some(f => f.id === b.dataset.f)));
    qa(".chip").forEach(b => b.setAttribute("aria-pressed", +b.dataset.g === state.guests));
    const g = state.guests ?? 50;
    q(".g-num").textContent = g; range.value = g;
    range.style.setProperty("--p", ((g - 10) / 590 * 100) + "%");
    const touched = !!(state.format || state.guests || state.sector);
    const label = (opts.submitLabel || defaultLabel)(results(state).length, touched);
    qa(".go-label").forEach(el => el.textContent = label);
    if (openId === "sector") renderSectors();
    if (!silent && opts.onChange) opts.onChange(state);
  }
  const setGuests = n => { state.guests = Math.max(10, Math.min(600, n)); update(); };

  qa(".seg").forEach(b => b.addEventListener("click", () => openId === b.dataset.pop ? close() : open(b.dataset.pop)));
  scrim.addEventListener("click", () => close());
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  q(".formats").addEventListener("click", e => {
    const b = e.target.closest(".fmt"); if (!b) return;
    // plusieurs formats : chaque clic ajoute ou retire le sien (le lieu devra tous les accueillir) ; on reste sur la feuille
    const on = new Set(fmtsOf(state.format).map(f => f.id));
    on.has(b.dataset.f) ? on.delete(b.dataset.f) : on.add(b.dataset.f);
    state.format = FORMATS.filter(f => on.has(f.id)).map(f => f.id).join(",") || null;
    update();
  });
  range.addEventListener("input", () => setGuests(+range.value));
  qa("[data-step]").forEach(b => b.addEventListener("click", () => setGuests((state.guests ?? 50) + +b.dataset.step)));
  q(".chips").addEventListener("click", e => { const b = e.target.closest(".chip"); if (b) setGuests(+b.dataset.g); });
  q(".sectors").addEventListener("click", e => {
    const b = e.target.closest(".sec"); if (!b) return;
    state.sector = b.dataset.s || null; update(); setTimeout(close, 200);
  });
  qa("[data-go]").forEach(b => b.addEventListener("click", () => {
    close();
    if (opts.onSubmit) opts.onSubmit(state, open);
  }));

  update(true);
  return {state, update, open, close};
};
