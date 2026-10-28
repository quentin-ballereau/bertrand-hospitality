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


/* La carte (home, pages Secteur), dans l'esprit de sireos.com/projets.
   — On la fait glisser (avec un peu d'élan), on zoome : boutons, double clic, Ctrl ou ⌘ + molette, pincement du pavé tactile,
     deux doigts sur mobile. La molette seule et un doigt seul font défiler la page : la carte ne la piège jamais.
   — Le plan est une image (assets/plan/, tirée du SVG de vectormap.net) : une vue d'ensemble, puis des tuiles plus nettes
     chargées pour la seule partie visible quand on zoome, comme sur les cartes en ligne. Il est déplacé par une
     transformation (GPU) ; les 39 000 tracés du SVG d'origine ne sont plus jamais recalculés pendant les gestes.
   — Les adresses proches se regroupent en pastilles numérotées ; le regroupement est recalculé quand le zoom se pose,
     et les pastilles se séparent ou se rejoignent en glissant (jamais de saut).
   — Les quartiers s'éclairent au survol et mènent à leur page ; les monuments servent de repères.
   Les pastilles, les monuments et les noms sont posés au-dessus du plan, en HTML : ils gardent leur taille à l'écran.
   opts.focus : l'id d'un secteur, mis en avant et cadré (pages Secteur). */
BH.parisMap = (box, opts = {}) => {
  const M = BH.PARIS, {VENUES, SECTORS, capFor} = BH;
  if (!M || !box) return;
  const [X0, Y0, MW, MH] = M.vb;
  const SEC = {"Champs-Élysées":"ouest", "Auteuil":"ouest", "Opéra":"centre", "Bastille":"centre", "Gare du Nord":"centre",
    "Saint-Germain":"rg", "Montparnasse":"rg", "Levallois":"seine", "Saint-Ouen":"seine", "Issy":"seine"};
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const MIN_W = 300;           // zoom maximal : 300 unités de plan dans la largeur du cadre
  const CLUSTER_PX = 32;       // deux adresses plus proches que cela à l'écran se regroupent
  const HIDE_DELAY = 260;      // la fiche d'un lieu attend un peu avant de partir (le temps d'y glisser la souris)

  /* ---------- les données : un point par adresse, Versailles et Disney Village en bord de carte ---------- */
  const byKey = {}, outside = [];
  VENUES.forEach(v => {
    const pt = M.pts[v.slug]; if (!pt) return;
    const [x, y] = pt;
    if (x < X0 || x > X0 + MW || y < Y0 || y > Y0 + MH) { outside.push(v); return; }
    (byKey[pt.join()] = byKey[pt.join()] || {x, y, list:[]}).list.push(v);
  });
  const G = Object.values(byKey).sort((a, b) => a.x - b.x || a.y - b.y);   // ordre fixe : regroupement stable

  // les quartiers : une forme souple autour de leurs adresses (enveloppe convexe épaissie), une par groupe d'adresses
  const hull = pts => {
    if (pts.length < 3) return pts;
    const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], up = [];
    for (const q of p) { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
    for (const q of p.reverse()) { while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
    return lo.slice(0, -1).concat(up.slice(0, -1));
  };
  const shapeOf = id => {
    const parts = [];
    G.filter(g => g.list.some(v => v.s === id)).forEach(g => {
      const c = parts.find(c => c.some(q => Math.hypot(q[0] - g.x, q[1] - g.y) < 260));
      c ? c.push([g.x, g.y]) : parts.push([[g.x, g.y]]);
    });
    return parts.map(c => { const h = hull(c); return "M" + h.map(p => p.join(" ")).join("L") + (h.length < 3 ? "l.1 0" : "Z"); }).join(" ");
  };
  const areas = SECTORS.map(s => ({...s, d:shapeOf(s.id), n:VENUES.filter(v => v.s === s.id).length})).filter(a => a.d);
  const areaById = id => areas.find(a => a.id === id);

  /* ---------- la structure ---------- */
  const edge = (list, cls, label, left) => list.length
    ? `<p class="pm-edge ${cls} t-mini">${left ? "← " : ""}<a href="secteur.html?s=hors">${label}</a>&nbsp;: ${list.map(v => `<a href="lieu.html?l=${v.slug}">${v.name}</a>`).join(", ")}${left ? "" : " →"}</p>` : "";
  box.classList.add("pm");
  box.innerHTML = `
    <div class="pm-stage" aria-hidden="true">
      <img class="pm-plan" alt="" width="${MW}" height="${MH}" decoding="async">
      <div class="pm-tiles"></div>
      <svg class="pm-svg" width="${MW}" height="${MH}" viewBox="${X0} ${Y0} ${MW} ${MH}">
        <g>${areas.map(a => `<path class="pm-zone" data-s="${a.id}" d="${a.d}"/>`).join("")}</g>
      </svg>
    </div>
    <div class="pm-layer" role="group" aria-label="Carte de nos adresses à Paris">
      ${BH.MONUMENTS.map(m => `<span class="pm-mon" data-x="${m.x}" data-y="${m.y}"><svg viewBox="0 0 30 30" aria-hidden="true">${m.icon}</svg><span class="pm-mon-name">${m.name}</span></span>`).join("")}
      ${M.labels.map(([t, x, y, an]) => SEC[t]
        ? `<a class="pm-lbl pm-lbl--${an}" href="secteur.html?s=${SEC[t]}" data-s="${SEC[t]}" data-x="${x}" data-y="${y}"><span>${t}</span></a>`
        : `<span class="pm-city" data-x="${x}" data-y="${y}"><span>${t}</span></span>`).join("")}
      <div class="pm-pins"></div>
    </div>
    <div class="pm-frame" aria-hidden="true"></div>
    <a class="pm-zone-tip" href="#" tabindex="-1"></a>
    <div class="pm-ctrl">
      <button type="button" data-zoom="in" aria-label="Zoomer"><svg viewBox="0 0 14 14"><path d="M7 1v12M1 7h12"/></svg></button>
      <button type="button" data-zoom="out" aria-label="Dézoomer"><svg viewBox="0 0 14 14"><path d="M1 7h12"/></svg></button>
      <button type="button" data-zoom="reset" aria-label="Recentrer la carte"><svg viewBox="0 0 14 14"><circle cx="7" cy="7" r="4.5"/><path d="M7 0v3M7 11v3M0 7h3M11 7h3"/></svg></button>
    </div>
    <p class="pm-hint t-mini" aria-hidden="true"></p>
    ${edge(outside.filter(v => v.place.includes("Versailles")), "pm-edge--w", "Versailles", true)}${edge(outside.filter(v => !v.place.includes("Versailles")), "pm-edge--e", "Disney Village", false)}
    <div class="pm-tip" aria-live="polite"></div>`;
  const q = s => box.querySelector(s), qa = s => box.querySelectorAll(s);
  const stage = q(".pm-stage"), pinsEl = q(".pm-pins"), tip = q(".pm-tip"), hint = q(".pm-hint"), ztip = q(".pm-zone-tip");
  const fixed = [...qa(".pm-layer > [data-x]")];   // monuments et noms : toujours là
  if (opts.focus) qa(`.pm-zone[data-s="${opts.focus}"], .pm-lbl[data-s="${opts.focus}"]`).forEach(e => e.classList.add("is-focus"));

  /* ---------- la vue : un rectangle du plan (x, y, largeur) ; k = pixels d'écran par unité de plan ---------- */
  let W = 0, H = 0;
  let view = {x:0, y:0, w:1};
  const k = () => W / view.w;
  const maxW = () => Math.min(MW, MH * W / H);
  const clampV = v => {
    const w = Math.min(maxW(), Math.max(MIN_W, v.w)), h = w * H / W;
    return {w, x:Math.min(X0 + MW - w, Math.max(X0, v.x)), y:Math.min(Y0 + MH - h, Math.max(Y0, v.y))};
  };
  const toScreen = (x, y) => [(x - view.x) * k(), (y - view.y) * k()];
  const toMap = (sx, sy) => [view.x + sx / k(), view.y + sy / k()];
  const fit = (pts, pad, min) => {   // cadrer des points, avec de l'air
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    const w = Math.max(min, (Math.max(...xs) - Math.min(...xs)) * pad, (Math.max(...ys) - Math.min(...ys)) * pad * W / H);
    return clampV({w, x:cx - w / 2, y:cy - w * H / W / 2});
  };
  // à l'arrivée : un peu plus serré que le plan entier, sur le cœur de Paris (ou sur le quartier de la page)
  const home = () => {
    const pts = opts.focus ? G.filter(g => g.list.some(v => v.s === opts.focus)).map(g => [g.x, g.y]) : [];
    if (pts.length) return fit(pts, 2.2, 640);
    const w = W < 768 ? 820 : 1080;
    return clampV({w, x:770 - w / 2, y:800 - w * H / W / 2});
  };

  /* ---------- une seule boucle d'affichage, une image à la fois ---------- */
  let anim = null, raf = 0, settleT = 0, lastK = 0;
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
  function frame(now) {
    raf = 0;
    if (anim) {
      const done = anim.step(now);
      if (done) anim = null; else kick();
    }
    draw();
    // geste en cours : le plan reste sur sa couche GPU ; dès qu'il se pose, on le redessine net et on regroupe
    box.classList.add("is-moving");
    clearTimeout(settleT);
    settleT = setTimeout(settle, anim ? 400 : 140);
  }
  function draw() {
    const kk = k();
    stage.style.transform = `translate3d(${(-(view.x - X0) * kk).toFixed(2)}px,${(-(view.y - Y0) * kk).toFixed(2)}px,0) scale(${kk.toFixed(5)})`;
    for (const el of fixed) place(el);
    for (const n of nodes.values()) place(n.el);
    for (const el of leaving) place(el);
    if (tipFor) placeTip();
    box.classList.toggle("is-close", kk > 1.55);   // de près, les noms des monuments s'affichent
  }
  function place(el) { const [sx, sy] = toScreen(+el.dataset.x, +el.dataset.y); el.style.transform = `translate3d(${sx.toFixed(1)}px,${sy.toFixed(1)}px,0)`; }
  function settle() {
    if (anim || drag || pinch) return;
    box.classList.remove("is-moving");
    if (Math.abs(k() - lastK) > 1e-4) recluster(true);
    tiles();
  }

  /* ---------- le plan : vue d'ensemble, puis tuiles nettes de la partie visible ---------- */
  const TILE = 512, LEVELS = {2:[3911, 3675], 4:[7822, 7350]};   // taille du plan à chaque niveau (pixels)
  const tileEls = new Map(), tilesEl = q(".pm-tiles");
  let planReady = false;
  function tiles() {
    if (!planReady) return;
    const need = k() * (devicePixelRatio || 1);
    const lv = need > 3 ? 4 : need > 1.2 ? 2 : 0;   // pixels de plan par pixel affiché : la vue d’ensemble suffit jusqu’à 1,2
    const want = new Set();
    if (lv) {
      const unit = TILE / lv, [pw, ph] = LEVELS[lv], h = view.w * H / W, m = view.w * .15;   // un peu de marge autour de la vue
      const nx = Math.ceil(pw / TILE), ny = Math.ceil(ph / TILE);
      const tx0 = Math.max(0, Math.floor((view.x - m - X0) / unit)), tx1 = Math.min(nx - 1, Math.floor((view.x + view.w + m - X0) / unit));
      const ty0 = Math.max(0, Math.floor((view.y - m - Y0) / unit)), ty1 = Math.min(ny - 1, Math.floor((view.y + h + m - Y0) / unit));
      for (let ty = ty0; ty <= ty1; ty++) for (let tx = tx0; tx <= tx1; tx++) {
        const key = `${lv}-${tx}-${ty}`; want.add(key);
        if (tileEls.has(key)) continue;
        const img = new Image(), w = Math.min(TILE, pw - tx * TILE) / lv, hh = Math.min(TILE, ph - ty * TILE) / lv;
        img.className = "pm-tile"; img.alt = ""; img.decoding = "async";
        img.style.cssText = `left:${tx * unit}px;top:${ty * unit}px;width:${w + .6}px;height:${hh + .6}px`;   // +0,6 : pas de jour entre deux tuiles
        img.onload = () => { img.classList.add("is-on"); prune(); };
        img.src = `assets/plan/${key}.webp`;
        tilesEl.appendChild(img); tileEls.set(key, img);
      }
    }
    curWant = want; curLv = lv;
    prune();
  }
  // les tuiles hors de la vue partent tout de suite ; celles d'un autre niveau, une fois le niveau voulu chargé (jamais de trou)
  let curWant = new Set(), curLv = 0;
  function prune() {
    const ready = [...curWant].every(key => tileEls.get(key) && tileEls.get(key).classList.contains("is-on"));
    for (const [key, img] of tileEls) {
      if (curWant.has(key)) continue;
      if (ready || key.startsWith(curLv + "-")) { img.remove(); tileEls.delete(key); }
    }
  }
  const setView = v => { view = clampV(v); kick(); };

  // déplacement animé (recentrage, ouverture d'une pastille) : courbe douce
  function goTo(target, dur = 700) {
    target = clampV(target); hide(true);
    if (reduce) { view = target; kick(); return; }
    const from = {...view}, t0 = performance.now();
    anim = {step(now) {
      const t = Math.min(1, (now - t0) / dur), e = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      view = clampV({x:from.x + (target.x - from.x) * e, y:from.y + (target.y - from.y) * e, w:from.w + (target.w - from.w) * e});
      return t >= 1;
    }};
    kick();
  }
  // zoom autour d'un point fixe de l'écran (molette, boutons, double clic) : la largeur glisse vers sa cible
  let zoomTo = null;
  function zoomAt(f, sx = W / 2, sy = H / 2) {
    hide(true);
    const [ax, ay] = toMap(sx, sy);
    const tw = Math.min(maxW(), Math.max(MIN_W, (zoomTo ? zoomTo.w : view.w) * f));
    zoomTo = {w:tw, ax, ay, sx, sy};
    if (reduce) { setView({w:tw, x:ax - sx * tw / W, y:ay - sy * tw / W}); zoomTo = null; return; }
    anim = {step() {
      const w = view.w + (zoomTo.w - view.w) * .2;
      const close = Math.abs(zoomTo.w - w) < .5, ww = close ? zoomTo.w : w;
      view = clampV({w:ww, x:zoomTo.ax - zoomTo.sx * ww / W, y:zoomTo.ay - zoomTo.sy * ww / W});
      if (close) zoomTo = null;
      return close;
    }};
    kick();
  }
  // l'élan après un glissement : la vue continue, en ralentissant
  function glide(vx, vy) {
    if (reduce || Math.hypot(vx, vy) < .05) return;
    let last = performance.now();
    anim = {step(now) {
      const dt = Math.min(32, now - last); last = now;
      const f = Math.pow(.88, dt / 16);
      vx *= f; vy *= f;
      setView({w:view.w, x:view.x - vx * dt / k(), y:view.y - vy * dt / k()});
      return Math.hypot(vx, vy) < .02;
    }};
    kick();
  }

  /* ---------- les adresses : points et pastilles, recalculés quand le zoom se pose ---------- */
  let nodes = new Map(), leaving = new Set(), owner = new Map();   // clé du groupe → nœud ; adresse → clé
  const keyOf = members => members.join("-");
  function recluster(animate) {
    lastK = k();
    const S = G.map(g => toScreen(g.x, g.y)), done = new Set(), out = [];
    G.forEach((g, i) => {
      if (done.has(i)) return;
      const members = [i]; done.add(i);
      for (let j = i + 1; j < G.length; j++) if (!done.has(j) && members.some(m => Math.hypot(S[m][0] - S[j][0], S[m][1] - S[j][1]) < CLUSTER_PX)) { members.push(j); done.add(j); }
      members.sort((a, b) => a - b);
      out.push({members, x:members.reduce((a, m) => a + G[m].x, 0) / members.length, y:members.reduce((a, m) => a + G[m].y, 0) / members.length,
        venues:members.flatMap(m => G[m].list)});
    });
    const next = new Map(), nextOwner = new Map();
    for (const c of out) {
      const key = keyOf(c.members);
      let n = nodes.get(key);
      if (!n) {
        n = {el:make(c)};
        pinsEl.appendChild(n.el); place(n.el);
        // une pastille qui se sépare : ses morceaux partent de sa position ; des points qui se rejoignent : la pastille naît au milieu d'eux
        const was = nodes.get(owner.get(c.members[0]));
        if (animate && was && !reduce) slide(n.el, was.el, true);
      }
      n.c = c; next.set(key, n);
      c.members.forEach(m => nextOwner.set(m, key));
    }
    for (const [key, n] of nodes) {
      if (next.has(key)) continue;
      if (tipFor === n) hide(true);
      const to = next.get(nextOwner.get(n.c.members[0]));
      n.el.tabIndex = -1;
      if (animate && to && !reduce) { leaving.add(n.el); slide(n.el, to.el, false); setTimeout(() => { leaving.delete(n.el); n.el.remove(); }, 450); }
      else n.el.remove();
    }
    nodes = next; owner = nextOwner;
  }
  // glissé d'une position d'écran à une autre (propriété « translate », indépendante du placement)
  function slide(el, ref, arriving) {
    const a = ref.style.transform.match(/-?[\d.]+/g), b = el.style.transform.match(/-?[\d.]+/g);
    const dx = a[0] - b[0], dy = a[1] - b[1];
    if (arriving) {
      el.style.transition = "none"; el.style.translate = `${dx}px ${dy}px`; el.style.opacity = "0";
      el.getBoundingClientRect();
      el.style.transition = ""; el.style.translate = "0 0"; el.style.opacity = "";
    } else { el.style.translate = `${dx}px ${dy}px`; el.style.opacity = "0"; el.style.pointerEvents = "none"; }
  }
  function make(c) {
    const el = document.createElement("button");
    el.type = "button";
    el.dataset.x = c.x; el.dataset.y = c.y;
    const names = c.venues.map(v => v.name).join(", ");
    if (opts.focus && !c.venues.some(v => v.s === opts.focus)) el.classList.add("is-dim");
    if (c.members.length > 1) { el.className += " pm-cl"; el.textContent = c.venues.length; el.setAttribute("aria-label", `${c.venues.length} lieux : ${names}. Zoomer`); }
    else { el.className += " pm-pin"; el.innerHTML = "<i></i>"; el.setAttribute("aria-label", names); }
    return el;
  }

  /* ---------- la fiche d'un lieu : elle apparaît vite, part sans hâte, suit son point si la carte bouge ---------- */
  let tipFor = null, pinned = false, showT = 0, hideT = 0;
  const card = v => `<a class="pm-card" href="lieu.html?l=${v.slug}"><img src="assets/lieux/${v.slug}.jpg" alt="" loading="lazy">
      <span class="t-mini">${v.place} · jusqu’à ${capFor(v)} invités</span><span class="t-h5">${v.name}</span></a>`;
  function show(n, keep) {
    clearTimeout(hideT); clearTimeout(showT);
    if (tipFor !== n) {
      if (tipFor) tipFor.el.classList.remove("is-on");
      tipFor = n; n.el.classList.add("is-on");
      tip.innerHTML = n.c.venues.map(card).join("");
      placeTip();
    }
    pinned = !!keep;
    box.classList.add("is-hover"); tip.classList.add("is-on");
  }
  function placeTip() {
    const [sx, sy] = toScreen(+tipFor.el.dataset.x, +tipFor.el.dataset.y);
    const half = tip.offsetWidth / 2 + 12;
    tip.style.left = Math.min(Math.max(sx, half), W - half) + "px"; tip.style.top = sy + "px";
    tip.classList.toggle("is-below", sy < H * .45);
  }
  function hide(now) {
    clearTimeout(showT); clearTimeout(hideT);
    const go = () => { if (tipFor) tipFor.el.classList.remove("is-on"); tipFor = null; pinned = false; tip.classList.remove("is-on"); box.classList.remove("is-hover"); };
    if (now) go(); else hideT = setTimeout(go, HIDE_DELAY);
  }
  const nodeOf = el => { for (const n of nodes.values()) if (n.el === el) return n; };
  pinsEl.addEventListener("pointerover", e => {
    const el = e.target.closest(".pm-pin"); if (!el || e.pointerType !== "mouse" || drag || pinned) return;
    const n = nodeOf(el); if (!n) return;
    tipFor ? show(n) : (clearTimeout(showT), showT = setTimeout(() => show(n), 70));   // une fiche déjà ouverte change tout de suite
  });
  pinsEl.addEventListener("pointerout", e => {
    if (e.pointerType !== "mouse" || !e.target.closest(".pm-pin") || pinned) return;
    if (e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(".pm-tip")) return;
    hide();
  });
  tip.addEventListener("pointerenter", () => clearTimeout(hideT));
  tip.addEventListener("pointerleave", e => { if (e.pointerType === "mouse" && !pinned) hide(); });
  pinsEl.addEventListener("focusin", e => { const n = nodeOf(e.target.closest(".pm-pin")); if (n) show(n); });
  pinsEl.addEventListener("focusout", e => { if (!(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(".pm-tip"))) hide(); });
  let lastPointer = "mouse";
  box.addEventListener("pointerdown", e => lastPointer = e.pointerType, true);
  pinsEl.addEventListener("click", e => {
    if (dragged) return;
    const el = e.target.closest(".pm-pin, .pm-cl"); if (!el) return;
    const n = nodeOf(el); if (!n) return;
    if (el.classList.contains("pm-cl")) { goTo(fit(n.c.members.map(m => [G[m].x, G[m].y]), 2, MIN_W)); return; }
    // souris ou clavier sur une seule maison : on y va ; au doigt, ou adresse partagée : la fiche reste ouverte (un second appui la ferme)
    if (lastPointer !== "touch" && n.c.venues.length === 1) { location.href = `lieu.html?l=${n.c.venues[0].slug}`; return; }
    tipFor === n && pinned ? hide(true) : show(n, true);
  });
  document.addEventListener("pointerdown", e => { if (pinned && !box.contains(e.target)) hide(true); });
  box.addEventListener("pointerdown", e => { if (pinned && !e.target.closest(".pm-pin, .pm-cl, .pm-tip")) hide(true); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { hide(true); clearZone(); } });

  /* ---------- glisser à la souris, avec élan ---------- */
  let drag = null, dragged = false;
  box.addEventListener("pointerdown", e => {
    if (e.pointerType === "touch" || e.button > 0 || e.target.closest(".pm-ctrl, .pm-tip, .pm-edge, .pm-zone-tip")) return;
    anim = null; zoomTo = null;
    drag = {sx:e.clientX, sy:e.clientY, x:view.x, y:view.y, t:performance.now(), vx:0, vy:0, lx:e.clientX, ly:e.clientY}; dragged = false;
  });
  addEventListener("pointermove", e => {
    if (!drag) return;
    const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
    if (!dragged && Math.hypot(dx, dy) > 4) { dragged = true; box.classList.add("is-dragging"); hide(true); clearZone(); }
    if (!dragged) return;
    const now = performance.now(), dt = Math.max(1, now - drag.t);
    drag.vx = drag.vx * .6 + (e.clientX - drag.lx) / dt * .4; drag.vy = drag.vy * .6 + (e.clientY - drag.ly) / dt * .4;
    drag.t = now; drag.lx = e.clientX; drag.ly = e.clientY;
    setView({w:view.w, x:drag.x - dx / k(), y:drag.y - dy / k()});
  });
  const endDrag = () => {
    if (!drag) return;
    const d = drag; drag = null; box.classList.remove("is-dragging");
    if (dragged && performance.now() - d.t < 80) glide(d.vx, d.vy);
    setTimeout(() => dragged = false, 0);
  };
  addEventListener("pointerup", endDrag);
  addEventListener("pointercancel", endDrag);   // appui interrompu (alerte système, changement de fenêtre)
  box.addEventListener("click", e => { if (dragged && e.target.closest("a")) e.preventDefault(); }, true);   // pas de lien ouvert en fin de glissement
  box.addEventListener("dblclick", e => {
    if (e.target.closest(".pm-ctrl, .pm-tip, .pm-pin, .pm-cl")) return;
    const r = box.getBoundingClientRect(); zoomAt(1 / 1.8, e.clientX - r.left, e.clientY - r.top);
  });

  /* ---------- boutons ---------- */
  q(".pm-ctrl").addEventListener("click", e => {
    const b = e.target.closest("[data-zoom]"); if (!b) return;
    b.dataset.zoom === "reset" ? goTo(home(), 800) : zoomAt(b.dataset.zoom === "in" ? 1 / 1.7 : 1.7);
  });

  /* ---------- molette : la page défile ; Ctrl ou ⌘ (et le pincement du pavé tactile) zooment ---------- */
  let hintT = 0, hintAt = 0;
  const say = txt => {
    if (performance.now() - hintAt < 2500 && hint.classList.contains("is-on")) return;
    hintAt = performance.now(); hint.textContent = txt; hint.classList.add("is-on");
    clearTimeout(hintT); hintT = setTimeout(() => hint.classList.remove("is-on"), 1500);
  };
  const mac = /Mac|iPhone|iPad/.test(navigator.platform);
  box.addEventListener("wheel", e => {
    if (!(e.ctrlKey || e.metaKey)) { if (Math.abs(e.deltaY) > 4) say(`Maintenez ${mac ? "⌘" : "Ctrl"} et faites défiler pour zoomer`); return; }
    e.preventDefault(); e.stopPropagation();
    const r = box.getBoundingClientRect(), d = Math.max(-60, Math.min(60, e.deltaMode ? e.deltaY * 16 : e.deltaY));
    zoomAt(Math.exp(d * .0045), e.clientX - r.left, e.clientY - r.top);
  }, {passive:false});

  /* ---------- mobile : un doigt fait défiler la page, deux doigts déplacent et zooment ---------- */
  let pinch = null, touch1 = null;
  const mid = t => [(t[0].clientX + t[1].clientX) / 2, (t[0].clientY + t[1].clientY) / 2];
  const dist = t => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
  box.addEventListener("touchstart", e => {
    if (e.touches.length === 2) {
      anim = null; zoomTo = null; touch1 = null; hide(true); clearZone();
      const r = box.getBoundingClientRect(), [cx, cy] = mid(e.touches);
      pinch = {d:dist(e.touches), w:view.w, at:toMap(cx - r.left, cy - r.top)};
    } else if (e.touches.length === 1) touch1 = {x:e.touches[0].clientX, y:e.touches[0].clientY, said:false};
  }, {passive:true});
  box.addEventListener("touchmove", e => {
    if (pinch && e.touches.length === 2) {
      e.preventDefault();
      const r = box.getBoundingClientRect(), [cx, cy] = mid(e.touches), sx = cx - r.left, sy = cy - r.top;
      const w = Math.min(maxW(), Math.max(MIN_W, pinch.w * pinch.d / dist(e.touches)));
      setView({w, x:pinch.at[0] - sx * w / W, y:pinch.at[1] - sy * w / W});
    } else if (touch1 && !touch1.said && e.touches.length === 1) {
      // un geste plutôt horizontal à un doigt : on rappelle comment déplacer la carte
      const dx = Math.abs(e.touches[0].clientX - touch1.x), dy = Math.abs(e.touches[0].clientY - touch1.y);
      if (dx > 14 && dx > dy * 1.5) { touch1.said = true; say("Utilisez deux doigts pour déplacer la carte"); }
    }
  }, {passive:false});
  box.addEventListener("touchend", e => { if (e.touches.length < 2) { if (pinch) kick(); pinch = null; } if (!e.touches.length) touch1 = null; });

  /* ---------- les quartiers : survol mis en avant, clic vers la page Secteur (au doigt : premier appui pour voir, second pour y aller) ---------- */
  let zoneOn = null;
  function setZone(id, sx, sy) {
    if (zoneOn !== id) {
      zoneOn = id;
      qa(".pm-zone, .pm-lbl").forEach(z => z.classList.toggle("is-on", !!id && z.dataset.s === id));
      const a = id && areaById(id);
      if (a) { ztip.innerHTML = `${a.name}<small>${a.n} lieu${a.n > 1 ? "x" : ""} · voir le quartier →</small>`; ztip.href = `secteur.html?s=${id}`; }
    }
    ztip.classList.toggle("is-on", !!id && sx != null);
    if (id && sx != null) ztip.style.transform = `translate(${Math.min(sx + 16, W - ztip.offsetWidth - 8)}px,${Math.min(sy + 16, H - ztip.offsetHeight - 8)}px)`;
  }
  const clearZone = () => setZone(null);
  stage.addEventListener("pointermove", e => {
    if (e.pointerType !== "mouse" || drag) return;
    const z = e.target.closest(".pm-zone"), r = box.getBoundingClientRect();
    z ? setZone(z.dataset.s, e.clientX - r.left, e.clientY - r.top) : clearZone();
  });
  stage.addEventListener("pointerleave", e => { if (e.pointerType === "mouse") clearZone(); });
  stage.addEventListener("click", e => {
    if (dragged) return;
    const z = e.target.closest(".pm-zone");
    if (!z) { clearZone(); return; }
    if (lastPointer !== "touch" || zoneOn === z.dataset.s) { location.href = `secteur.html?s=${z.dataset.s}`; return; }
    const r = box.getBoundingClientRect(); setZone(z.dataset.s, e.clientX - r.left, e.clientY - r.top);
  });
  qa(".pm-lbl").forEach(l => {
    l.addEventListener("pointerenter", e => { if (e.pointerType === "mouse") setZone(l.dataset.s); });
    l.addEventListener("pointerleave", e => { if (e.pointerType === "mouse") clearZone(); });
  });

  /* ---------- mise en route ---------- */
  // au premier affichage, la vue d'arrivée ; ensuite, la même portion de plan dans le nouveau cadre
  let started = false;
  const layout = () => {
    const w0 = W, h0 = H; W = box.clientWidth; H = box.clientHeight;
    if (!W || !H || (started && W === w0 && H === h0)) return;
    view = started ? clampV({...view, w:view.w * W / w0}) : home();
    started = true; hide(true); recluster(false); kick();
  };
  layout();                                   // tout de suite si le cadre a déjà sa taille
  new ResizeObserver(layout).observe(box);    // puis à chaque changement de taille

  // le plan (330 Ko) n'est demandé qu'à l'approche de la section, puis apparaît en fondu ; les tuiles suivent
  const plan = q(".pm-plan");
  plan.addEventListener("load", () => { box.classList.add("is-loaded"); planReady = true; tiles(); });
  const near = new IntersectionObserver(es => { if (es.some(x => x.isIntersecting)) { plan.src = "assets/plan/plan-1.webp"; near.disconnect(); } }, {rootMargin:"1200px 0px"});
  near.observe(box);
  // les adresses apparaissent quand la carte arrive à l'écran
  const io = new IntersectionObserver(es => { if (es.some(x => x.isIntersecting)) { box.classList.add("is-in"); io.disconnect(); } }, {threshold:.25});
  io.observe(box);
};
