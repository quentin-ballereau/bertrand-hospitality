/* Carte de la home (section « Nos adresses ») : plan de Paris vectoriel de vectormap.net (CC0, rues, eau, parcs), restylé dans la palette
   et servi à part (assets/paris-plan.svg). Il est en projection web (Mercator, niveau 13) : la position des lieux s'en déduit exactement,
   calée sur la Seine. pts = lieux, labels = repères, en unités de la carte. */
BH.PARIS = {"vb":[-42.926,-40.337,1955.461,1837.545],"img":"assets/paris-plan.svg","pts":{"amanie":[605.2,971.2],"angelina-alma":[648.1,780.1],"angelina-rivoli":[809.6,779.9],"angelina-versailles":[-382.2,1321.4],"au-pied-de-cochon":[898.7,794.0],"auteuil-brasserie":[409.9,928.5],"bofinger":[1039.3,878.8],"copenhague":[637.0,710.2],"dancing-coupole":[807.5,981.6],"flora-danica":[637.0,710.2],"grand-cafe-capucines":[839.8,727.0],"hotel-norman":[646.2,704.4],"la-coupole":[807.5,981.6],"la-flottille-versailles":[-466.4,1287.7],"lalsace":[677.9,736.4],"les-2-stations":[404.7,937.1],"lesmarionnettes":[834.3,930.9],"lile":[397.4,1133.4],"lipp":[832.9,880.0],"lorraine":[636.8,666.5],"meida":[837.4,364.8],"pavillon-lile":[397.4,1133.4],"polpo":[525.5,475.3],"procope":[869.6,886.4],"public-house":[820.5,736.1],"rosalie-disney-village-77":[3431.4,742.5],"sirwinston":[613.6,716.6],"terminus-nord":[966.0,650.7],"terrasse-de-madame":[870.6,936.4],"vaudeville":[878.0,743.1]},"labels":[["Champs-Élysées",629.4,764.7,"end"],["Opéra",844.9,687.6,"middle"],["Saint-Germain",810.0,858.5,"end"],["Montparnasse",780.8,1009.0,"end"],["Bastille",1066.3,909.0,"start"],["Gare du Nord",996.4,628.3,"start"],["Auteuil",431.3,962.1,"middle"],["Levallois",565.3,475.0,"start"],["Saint-Ouen",879.9,365.1,"start"],["Issy",431.3,1165.6,"start"],["Paris",1246.9,838.2,"middle"]]};



/* Monuments, pour se repérer : position calculée dans la même projection que les lieux (Mercator, niveau 13).
   Pictogrammes au trait, dans le style des pictos de formats. */
BH.MONUMENTS = [
  {name:"Arc de Triomphe", x:615.1, y:702.7, icon:'<path d="M7 25V9h16v16M7 9V6h16v3M11 25v-7a4 4 0 0 1 8 0v7M5 25h20"/>'},
  {name:"Tour Eiffel", x:611.8, y:839.3, icon:'<path d="M15 3v4M13 7h4l3 18M13 7l-3 18M11 17h8M8 25h4a3 3 0 0 1 6 0h4"/>'},
  {name:"Grand Palais", x:716.7, y:770.9, icon:'<path d="M5 25h20M7 25V16h16v9M8 16a7 7 0 0 1 14 0M15 9V6M11 25v-5M19 25v-5"/>'},
  {name:"Invalides", x:717.2, y:869.0, icon:'<path d="M5 25h20M7 25v-7h16v7M10 18a5 5 0 0 1 10 0M15 13V8M13.5 9.5h3M12 25v-4M18 25v-4"/>'},
  {name:"Opéra Garnier", x:828.2, y:718.9, icon:'<path d="M4 25h22M6 25V15h18v10M6 15l9-5 9 5M9 25v-6M13 25v-6M17 25v-6M21 25v-6M15 10V7"/>'},
  {name:"Louvre", x:852.8, y:815.5, icon:'<path d="M4 25h22M7 25l8-15 8 15M11 25l4-7.5 4 7.5"/>'},
  {name:"Sacré-Cœur", x:894.8, y:588.2, icon:'<path d="M5 25h20M8 25v-8h14v8M10 17a5 5 0 0 1 10 0M15 12V6M13.5 7.5h3M7 17a2 2 0 0 1 2-3M23 17a2 2 0 0 0-2-3"/>'},
  {name:"Notre-Dame", x:935.1, y:887.1, icon:'<path d="M5 25h20M7 25V9h5v16M18 25V9h5v16M12 14h6M13 25v-5a2 2 0 0 1 4 0v5M7 9h5M18 9h5"/>'},
  {name:"Panthéon", x:911.9, y:946.9, icon:'<path d="M5 25h20M7 25v-8h16v8M10 25v-6M15 25v-6M20 25v-6M9 17a6 6 0 0 1 12 0M15 11V7"/>'},
  {name:"Bastille", x:1047.0, y:884.6, icon:'<path d="M11 25h8M12 25v-3h6v3M14 22V9h2v13M13 9h4M15 9V5l2 1.5"/>'},
];

/* La carte (home, pages Secteur), dans l'esprit de sireos.com/projets : on la fait glisser, on zoome
   (boutons, double clic, Ctrl ou ⌘ + molette, pincement à deux doigts ; la molette seule fait défiler la page),
   les adresses proches se regroupent en pastilles numérotées qui s'ouvrent au clic.
   Les quartiers s'éclairent au survol et mènent à leur page Secteur ; les monuments servent de repères.
   Les pastilles, les monuments et les noms gardent leur taille à l'écran : ils sont posés au-dessus du plan, en HTML.
   opts.focus : l'id d'un secteur, mis en avant et cadré (pages Secteur). */
BH.parisMap = (box, opts = {}) => {
  const M = BH.PARIS, {VENUES, SECTORS, capFor} = BH;
  if (!M || !box) return;
  const [X0, Y0, MW, MH] = M.vb;
  const SEC = {"Champs-Élysées":"ouest", "Auteuil":"ouest", "Opéra":"centre", "Bastille":"centre", "Gare du Nord":"centre",
    "Saint-Germain":"rg", "Montparnasse":"rg", "Levallois":"seine", "Saint-Ouen":"seine", "Issy":"seine"};

  // un point par adresse ; Versailles et Disney Village, hors du plan, vont en bord de carte
  const groups = {}, outside = [];
  VENUES.forEach(v => {
    const pt = M.pts[v.slug]; if (!pt) return;
    const [x, y] = pt;
    if (x < X0 || x > X0 + MW || y < Y0 || y > Y0 + MH) { outside.push(v); return; }
    const k = pt.join(); (groups[k] = groups[k] || {x, y, list:[]}).list.push(v);
  });
  const G = Object.values(groups);

  /* les quartiers : une forme souple autour de leurs adresses (enveloppe convexe épaissie) ; un quartier éclaté
     (les bords de Seine) a une forme par groupe d'adresses */
  const hull = pts => {
    if (pts.length < 3) return pts;
    const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], up = [];
    for (const q of p) { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
    for (const q of p.reverse()) { while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
    return lo.slice(0, -1).concat(up.slice(0, -1));
  };
  const areaOf = id => {
    const pts = VENUES.filter(v => v.s === id && M.pts[v.slug] && groups[M.pts[v.slug].join()]).map(v => M.pts[v.slug]);
    const parts = [];   // regroupe les adresses distantes de moins de 260 unités
    pts.forEach(p => { const g = parts.find(c => c.some(q => Math.hypot(q[0] - p[0], q[1] - p[1]) < 260)); g ? g.push(p) : parts.push([p]); });
    return parts.map(c => { const h = hull(c); return "M" + h.map(p => p.join(" ")).join("L") + (h.length < 3 ? "l.1 0" : "Z"); }).join(" ");
  };
  const areas = SECTORS.map(s => ({...s, d:areaOf(s.id), n:VENUES.filter(v => v.s === s.id).length})).filter(a => a.d);

  box.classList.add("pm");
  box.innerHTML = `
    <svg class="pm-svg" preserveAspectRatio="none" aria-hidden="true">
      <image class="pm-plan" x="${X0}" y="${Y0}" width="${MW}" height="${MH}" preserveAspectRatio="none"/>
      <g class="pm-areas">${areas.map(a => `<path class="pm-zone" data-s="${a.id}" d="${a.d}"/>`).join("")}</g>
    </svg>
    <div class="pm-layer" aria-label="Carte de nos adresses à Paris">
      ${BH.MONUMENTS.map(m => `<span class="pm-mon" data-x="${m.x}" data-y="${m.y}"><svg viewBox="0 0 30 30" aria-hidden="true">${m.icon}</svg><span class="pm-mon-name">${m.name}</span></span>`).join("")}
      ${M.labels.map(([t, x, y, an]) => SEC[t]
        ? `<a class="pm-lbl pm-lbl--${an}" href="secteur.html?s=${SEC[t]}" data-s="${SEC[t]}" data-x="${x}" data-y="${y}"><span>${t}</span></a>`
        : `<span class="pm-city" data-x="${x}" data-y="${y}"><span>${t}</span></span>`).join("")}
      <div class="pm-pins"></div>
    </div>
    <div class="pm-frame" aria-hidden="true"></div>
    <p class="pm-zone-tip" aria-hidden="true"></p>
    <div class="pm-ctrl">
      <button type="button" data-zoom="in" aria-label="Zoomer"><svg viewBox="0 0 14 14"><path d="M7 1v12M1 7h12"/></svg></button>
      <button type="button" data-zoom="out" aria-label="Dézoomer"><svg viewBox="0 0 14 14"><path d="M1 7h12"/></svg></button>
      <button type="button" data-zoom="reset" aria-label="Recentrer la carte"><svg viewBox="0 0 14 14"><circle cx="7" cy="7" r="4.5"/><path d="M7 0v3M7 11v3M0 7h3M11 7h3"/></svg></button>
    </div>
    <p class="pm-hint t-mini" aria-hidden="true"></p>
    ${edge(outside.filter(v => v.place.includes("Versailles")), "pm-edge--w", "Versailles", "l")}${edge(outside.filter(v => !v.place.includes("Versailles")), "pm-edge--e", "Disney Village", "r")}
    <div class="pm-tip" aria-live="polite"></div>`;
  function edge(list, cls, label, arrow) {
    return list.length ? `<p class="pm-edge ${cls} t-mini">${arrow === "l" ? "← " : ""}<a href="secteur.html?s=hors">${label}</a>&nbsp;: ${list.map(v => `<a href="lieu.html?l=${v.slug}">${v.name}</a>`).join(", ")}${arrow === "r" ? " →" : ""}</p>` : "";
  }
  const q = s => box.querySelector(s), qa = s => box.querySelectorAll(s);
  const svg = q(".pm-svg"), pinsEl = q(".pm-pins"), tip = q(".pm-tip"), hint = q(".pm-hint"), ztip = q(".pm-zone-tip");
  const placed = [...qa("[data-x]")];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (opts.focus) { box.classList.add("has-focus"); qa(`.pm-zone[data-s="${opts.focus}"], .pm-lbl[data-s="${opts.focus}"]`).forEach(e => e.classList.add("is-focus")); }

  /* ---------- la vue : un rectangle du plan (x, y, largeur), à l'échelle du cadre ---------- */
  const MIN_W = 300, MAX_W = MW;
  const ratio = () => box.clientHeight / box.clientWidth;
  const fit = (pts, pad = 1.6, min = MIN_W) => {   // cadrer un ensemble de points, avec de l'air
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    const w = Math.max(min, (Math.max(...xs) - Math.min(...xs)) * pad, (Math.max(...ys) - Math.min(...ys)) * pad / ratio());
    return {x:cx - w / 2, y:cy - w * ratio() / 2, w};
  };
  // à l'arrivée : un peu plus serré que le plan entier, sur le cœur de Paris (ou sur le quartier de la page)
  const home = () => {
    if (opts.focus) { const pts = VENUES.filter(v => v.s === opts.focus && M.pts[v.slug]).map(v => M.pts[v.slug]).filter(p => p[0] > X0 && p[0] < X0 + MW); if (pts.length) return fit(pts, 2.2, 640); }
    const w = innerWidth < 768 ? 820 : 1080;
    return {x:770 - w / 2, y:800 - w * ratio() / 2, w};
  };
  const clampV = v => {
    const w = Math.min(MAX_W, Math.max(MIN_W, v.w)), h = w * ratio();
    return {w, x:Math.min(X0 + MW - w, Math.max(X0, v.x)), y:Math.min(Y0 + MH - h, Math.max(Y0, v.y))};
  };
  let view = clampV(home()), lastW = 0;
  const toScreen = (x, y) => [(x - view.x) / view.w * box.clientWidth, (y - view.y) / view.w * box.clientWidth];
  const toMap = (sx, sy) => [view.x + sx / box.clientWidth * view.w, view.y + sy / box.clientWidth * view.w];

  function render() {
    svg.setAttribute("viewBox", `${view.x} ${view.y} ${view.w} ${view.w * ratio()}`);
    box.style.setProperty("--k", (box.clientWidth / view.w).toFixed(4));   // échelle, pour les noms de monuments
    box.classList.toggle("is-close", box.clientWidth / view.w > 1.55);   // de près (échelle à l'écran) : les noms des monuments s'affichent
    if (Math.abs(view.w - lastW) > .5) { lastW = view.w; cluster(); }
    for (const el of placed) { const [sx, sy] = toScreen(+el.dataset.x, +el.dataset.y); el.style.transform = `translate(${sx.toFixed(1)}px,${sy.toFixed(1)}px)`; }
  }

  /* ---------- les adresses : regroupées quand elles se touchent à l'écran ---------- */
  function cluster() {
    hide();
    const R = 30, done = new Set(), out = [];
    const S = G.map(g => toScreen(g.x, g.y));
    G.forEach((g, i) => {
      if (done.has(i)) return;
      const members = [i]; done.add(i);
      G.forEach((h, j) => { if (!done.has(j) && Math.hypot(S[i][0] - S[j][0], S[i][1] - S[j][1]) < R) { members.push(j); done.add(j); } });
      const x = members.reduce((a, m) => a + G[m].x, 0) / members.length, y = members.reduce((a, m) => a + G[m].y, 0) / members.length;
      out.push({x, y, members, n:members.reduce((a, m) => a + G[m].list.length, 0)});
    });
    pinsEl.innerHTML = out.map((c, i) => {
      const venues = c.members.flatMap(m => G[m].list);
      const dim = opts.focus && !venues.some(v => v.s === opts.focus) ? " is-dim" : "";
      return c.members.length > 1
        ? `<button class="pm-cl${dim}" type="button" data-c="${i}" data-x="${c.x}" data-y="${c.y}" aria-label="${c.n} lieux : ${venues.map(v => v.name).join(", ")}. Zoomer">${c.n}</button>`
        : `<button class="pm-pin${dim}" type="button" data-c="${i}" data-x="${c.x}" data-y="${c.y}" aria-label="${venues.map(v => v.name).join(", ")}"><i></i></button>`;
    }).join("");
    pinsEl.querySelectorAll("[data-x]").forEach(el => { placed.push(el); });
    for (let k = placed.length - 1; k >= 0; k--) if (!placed[k].isConnected) placed.splice(k, 1);
    clusters = out;
  }
  let clusters = [];

  /* ---------- déplacements animés (zoom, recentrage) ---------- */
  let anim = null;
  function goTo(target, dur = 600) {
    target = clampV(target);
    if (reduce) { view = target; render(); return; }
    const from = {...view}, t0 = performance.now();
    cancelAnimationFrame(anim);
    const step = now => {
      const t = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - t, 3);
      view = {x:from.x + (target.x - from.x) * e, y:from.y + (target.y - from.y) * e, w:from.w + (target.w - from.w) * e};
      render(); if (t < 1) anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
  }
  const zoomAt = (f, sx = box.clientWidth / 2, sy = box.clientHeight / 2, animate = true) => {
    const [mx, my] = toMap(sx, sy), w = Math.min(MAX_W, Math.max(MIN_W, view.w * f));
    const t = {w, x:mx - sx / box.clientWidth * w, y:my - sy / box.clientWidth * w};
    animate ? goTo(t, 450) : (view = clampV(t), render());
  };
  q(".pm-ctrl").addEventListener("click", e => {
    const b = e.target.closest("[data-zoom]"); if (!b) return;
    if (b.dataset.zoom === "reset") goTo(home(), 800); else zoomAt(b.dataset.zoom === "in" ? 1 / 1.6 : 1.6);
  });

  /* ---------- glisser (souris, stylet) ---------- */
  let drag = null, moved = false;
  box.addEventListener("pointerdown", e => {
    if (e.pointerType === "touch" || e.button > 0 || e.target.closest(".pm-ctrl, .pm-tip, .pm-edge")) return;
    drag = {sx:e.clientX, sy:e.clientY, x:view.x, y:view.y}; moved = false;
  });
  addEventListener("pointermove", e => {
    if (!drag) return;
    const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
    if (!moved && Math.hypot(dx, dy) > 4) { moved = true; box.classList.add("is-dragging"); hide(); }
    if (moved) { const k = view.w / box.clientWidth; view = clampV({w:view.w, x:drag.x - dx * k, y:drag.y - dy * k}); render(); }
  });
  addEventListener("pointerup", () => { if (!drag) return; drag = null; box.classList.remove("is-dragging"); setTimeout(() => moved = false, 0); });
  box.addEventListener("dblclick", e => { if (e.target.closest(".pm-ctrl, .pm-tip")) return; const r = box.getBoundingClientRect(); zoomAt(1 / 1.8, e.clientX - r.left, e.clientY - r.top); });

  /* ---------- molette : la page défile, Ctrl ou ⌘ zoome (le pincement du pavé tactile passe aussi par là) ---------- */
  let hintT;
  const say = txt => { hint.textContent = txt; hint.classList.add("is-on"); clearTimeout(hintT); hintT = setTimeout(() => hint.classList.remove("is-on"), 1400); };
  const mac = /Mac|iPhone|iPad/.test(navigator.platform);
  box.addEventListener("wheel", e => {
    if (!(e.ctrlKey || e.metaKey)) { say(`Maintenez ${mac ? "⌘" : "Ctrl"} et faites défiler pour zoomer`); return; }
    e.preventDefault(); e.stopPropagation();
    const r = box.getBoundingClientRect();
    zoomAt(Math.exp(e.deltaY * (e.deltaMode ? .05 : .0025)), e.clientX - r.left, e.clientY - r.top, false);
  }, {passive:false});

  /* ---------- mobile : un doigt fait défiler la page, deux doigts déplacent et zooment ---------- */
  let pinch = null;
  const mid = t => [(t[0].clientX + t[1].clientX) / 2, (t[0].clientY + t[1].clientY) / 2], dist = t => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
  box.addEventListener("touchstart", e => {
    if (e.touches.length === 2) { const r = box.getBoundingClientRect(), [cx, cy] = mid(e.touches); pinch = {d:dist(e.touches), view:{...view}, at:toMap(cx - r.left, cy - r.top)}; hide(); }
    else if (e.touches.length === 1 && !e.target.closest(".pm-pin, .pm-cl, .pm-ctrl, .pm-tip, a")) say("Utilisez deux doigts pour déplacer la carte");
  }, {passive:true});
  box.addEventListener("touchmove", e => {
    if (!pinch || e.touches.length !== 2) return;
    e.preventDefault();
    const r = box.getBoundingClientRect(), [cx, cy] = mid(e.touches), sx = cx - r.left, sy = cy - r.top;
    const w = Math.min(MAX_W, Math.max(MIN_W, pinch.view.w * pinch.d / dist(e.touches)));
    view = clampV({w, x:pinch.at[0] - sx / box.clientWidth * w, y:pinch.at[1] - sy / box.clientWidth * w}); render();
  }, {passive:false});
  box.addEventListener("touchend", e => { if (e.touches.length < 2) pinch = null; });

  /* ---------- les fiches : au survol d'une adresse, au toucher ; une pastille zoome sur son groupe ---------- */
  let pinned = null;
  const card = v => `<a class="pm-card" href="lieu.html?l=${v.slug}"><img src="assets/lieux/${v.slug}.jpg" alt="" loading="lazy">
      <span class="t-mini">${v.place} · jusqu’à ${capFor(v)} invités</span><span class="t-h5">${v.name}</span></a>`;
  function show(el, keep) {
    const c = clusters[+el.dataset.c]; if (!c) return;
    const venues = c.members.flatMap(m => G[m].list);
    qa(".pm-pin").forEach(p => p.classList.toggle("is-on", p === el));
    box.classList.add("is-hover");
    tip.innerHTML = venues.map(card).join("");
    const r = el.getBoundingClientRect(), b = box.getBoundingClientRect();
    const x = r.left + r.width / 2 - b.left, y = r.top + r.height / 2 - b.top;
    tip.style.left = Math.min(Math.max(x, 140), b.width - 140) + "px"; tip.style.top = y + "px";
    tip.classList.toggle("is-below", y < b.height * .45);
    tip.classList.add("is-on");
    if (keep) pinned = el;
  }
  function hide() { pinned = null; tip.classList.remove("is-on"); box.classList.remove("is-hover"); qa(".pm-pin.is-on").forEach(p => p.classList.remove("is-on")); }
  pinsEl.addEventListener("mouseover", e => { const el = e.target.closest(".pm-pin"); if (el && !pinned && !drag) show(el); });
  pinsEl.addEventListener("focusin", e => { const el = e.target.closest(".pm-pin"); if (el) show(el); });
  pinsEl.addEventListener("click", e => {
    if (moved) return;
    const cl = e.target.closest(".pm-cl");
    if (cl) { const c = clusters[+cl.dataset.c]; goTo(fit(c.members.map(m => [G[m].x, G[m].y]))); return; }
    const el = e.target.closest(".pm-pin"); if (!el) return;
    const venues = clusters[+el.dataset.c].members.flatMap(m => G[m].list);
    // souris sur une seule maison : on y va ; toucher ou adresse partagée : la fiche reste ouverte
    if (e.pointerType === "mouse" && venues.length === 1 && !matchMedia("(hover: none)").matches) location.href = `lieu.html?l=${venues[0].slug}`;
    else show(el, true);
  });
  box.addEventListener("mouseleave", () => { if (!pinned) hide(); clearZone(); });
  pinsEl.addEventListener("mouseout", e => { if (!pinned && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(".pm-pin, .pm-tip"))) hide(); });
  document.addEventListener("click", e => { if (pinned && !e.target.closest(".pm-pin, .pm-tip")) hide(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") hide(); });

  /* ---------- les quartiers : survol mis en avant, clic vers la page Secteur ---------- */
  let zoneOn = null;
  const setZone = id => {
    if (zoneOn === id) return; zoneOn = id;
    qa(".pm-zone, .pm-lbl").forEach(z => z.classList.toggle("is-on", z.dataset.s === id));
    box.classList.toggle("is-zone", !!id);
    const a = areas.find(x => x.id === id);
    ztip.innerHTML = a ? `${a.name}<small>${a.n} lieu${a.n > 1 ? "x" : ""} · voir le quartier →</small>` : "";
  };
  const clearZone = () => { setZone(null); ztip.classList.remove("is-on"); };
  svg.addEventListener("mousemove", e => {
    if (drag && moved) return;
    const z = e.target.closest(".pm-zone");
    if (!z) { clearZone(); return; }
    setZone(z.dataset.s);
    const b = box.getBoundingClientRect();
    ztip.style.transform = `translate(${e.clientX - b.left + 16}px,${e.clientY - b.top + 16}px)`; ztip.classList.add("is-on");
  });
  svg.addEventListener("mouseleave", clearZone);
  svg.addEventListener("click", e => { const z = e.target.closest(".pm-zone"); if (z && !moved) location.href = `secteur.html?s=${z.dataset.s}`; });
  qa(".pm-lbl").forEach(l => { l.addEventListener("mouseenter", () => setZone(l.dataset.s)); l.addEventListener("mouseleave", clearZone); });
  // les liens ne s'ouvrent pas à la fin d'un glissement
  box.addEventListener("click", e => { if (moved && e.target.closest("a")) e.preventDefault(); }, true);

  addEventListener("resize", () => { hide(); lastW = 0; view = clampV(view); render(); });
  render();

  // le plan (≈ 1 Mo compressé) n'est demandé qu'à l'approche de la section, puis apparaît en fondu
  const plan = q(".pm-plan");
  plan.addEventListener("load", () => box.classList.add("is-loaded"));
  const near = new IntersectionObserver(es => { if (es.some(x => x.isIntersecting)) { plan.setAttribute("href", M.img); near.disconnect(); } }, {rootMargin:"1200px 0px"});
  near.observe(box);
  // les adresses apparaissent quand la carte arrive à l'écran
  const io = new IntersectionObserver(es => { if (es.some(x => x.isIntersecting)) { box.classList.add("is-in"); io.disconnect(); } }, {threshold:.25});
  io.observe(box);
};
