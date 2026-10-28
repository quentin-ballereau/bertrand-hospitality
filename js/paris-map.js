/* Carte de la home (section « Nos adresses ») : plan de Paris vectoriel de vectormap.net (CC0, rues, eau, parcs), restylé dans la palette
   et servi à part (assets/paris-plan.svg). Il est en projection web (Mercator, niveau 13) : la position des lieux s'en déduit exactement,
   calée sur la Seine. pts = lieux, labels = repères, en unités de la carte. */
BH.PARIS = {"vb":[-42.926,-40.337,1955.461,1837.545],"img":"assets/paris-plan.svg","pts":{"amanie":[605.2,971.2],"angelina-alma":[648.1,780.1],"angelina-rivoli":[809.6,779.9],"angelina-versailles":[-382.2,1321.4],"au-pied-de-cochon":[898.7,794.0],"auteuil-brasserie":[409.9,928.5],"bofinger":[1039.3,878.8],"copenhague":[637.0,710.2],"dancing-coupole":[807.5,981.6],"flora-danica":[637.0,710.2],"grand-cafe-capucines":[839.8,727.0],"hotel-norman":[646.2,704.4],"la-coupole":[807.5,981.6],"la-flottille-versailles":[-466.4,1287.7],"lalsace":[677.9,736.4],"les-2-stations":[404.7,937.1],"lesmarionnettes":[834.3,930.9],"lile":[397.4,1133.4],"lipp":[832.9,880.0],"lorraine":[636.8,666.5],"meida":[837.4,364.8],"pavillon-lile":[397.4,1133.4],"polpo":[525.5,475.3],"procope":[869.6,886.4],"public-house":[820.5,736.1],"rosalie-disney-village-77":[3431.4,742.5],"sirwinston":[613.6,716.6],"terminus-nord":[966.0,650.7],"terrasse-de-madame":[870.6,936.4],"vaudeville":[878.0,743.1]},"labels":[["Champs-Élysées",629.4,764.7,"end"],["Opéra",844.9,687.6,"middle"],["Saint-Germain",810.0,858.5,"end"],["Montparnasse",780.8,1009.0,"end"],["Bastille",1066.3,909.0,"start"],["Gare du Nord",996.4,628.3,"start"],["Auteuil",431.3,962.1,"middle"],["Levallois",565.3,475.0,"start"],["Saint-Ouen",879.9,365.1,"start"],["Issy",431.3,1165.6,"start"],["Paris",1246.9,838.2,"middle"]]};

/* la carte (home, pages Secteur) : un point par adresse (deux maisons à la même adresse partagent un point) ; le plan de rues
   remplit le cadre (recadré, jamais déformé) ; au survol ou au toucher, la fiche du lieu. opts.focus : l'id d'un secteur à mettre en avant. */
BH.parisMap = (box, opts = {}) => {

  const M = BH.PARIS, {VENUES, capFor} = BH, $ = id => document.getElementById(id);
  if (!box) return;
  const [X0, Y0, MW, MH] = M.vb;
  const groups = {}, outside = [];
  VENUES.forEach(v => {
    const pt = M.pts[v.slug]; if (!pt) return;
    const [x, y] = pt;
    if (x < X0 || x > X0 + MW || y < Y0 || y > Y0 + MH) { outside.push(v); return; }
    const k = pt.join(); (groups[k] = groups[k] || {x, y, list:[]}).list.push(v);
  });
  const G = Object.values(groups);
  // vue centrée sur nos adresses ; le cadre la recadre selon sa forme (preserveAspectRatio slice)
  // page Secteur : la vue se centre sur les adresses du quartier, les autres s'estompent
  const F = opts.focus ? G.filter(g => g.list.some(v => v.s === opts.focus)) : [], C = F.length ? F : G;
  const xs = C.map(g => g.x), ys = C.map(g => g.y);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2 + (F.length ? 0 : 40), cy = (Math.min(...ys) + Math.max(...ys)) / 2, VW = 1480, VH = 980;
  // chaque repère de quartier mène à la page de son secteur (en production /secteurs/[secteur])
  const SEC = {"Champs-Élysées":"ouest", "Auteuil":"ouest", "Opéra":"centre", "Bastille":"centre", "Gare du Nord":"centre",
    "Saint-Germain":"rg", "Montparnasse":"rg", "Levallois":"seine", "Saint-Ouen":"seine", "Issy":"seine"};
  const txt = ([t, x, y, an]) => SEC[t]
    ? `<a class="pm-area" href="secteur.html?s=${SEC[t]}"><text class="pm-lbl" x="${x}" y="${y}" text-anchor="${an}">${t}</text></a>`
    : `<text class="pm-city" x="${x}" y="${y}" text-anchor="${an}">${t}</text>`;
  const pins = G.map((g, i) => `<g class="pm-pin${F.length && !F.includes(g) ? " is-dim" : ""}" tabindex="0" role="button" data-i="${i}" transform="translate(${g.x} ${g.y})" style="--d:${(i * .03).toFixed(2)}s"
      aria-label="${g.list.map(v => v.name).join(", ")}"><circle class="pm-hit" r="16"/><circle class="pm-dot" r="5.5"/></g>`).join("");
  const edge = (list, cls, label, arrow) => list.length ? `<p class="pm-edge ${cls} t-mini">${arrow === "l" ? "← " : ""}${label}&nbsp;: ${list.map(v => `<a href="lieu.html?l=${v.slug}">${v.name}</a>`).join(", ")}${arrow === "r" ? " →" : ""}</p>` : "";
  box.innerHTML = `<svg viewBox="${(cx - VW / 2).toFixed(0)} ${(cy - VH / 2).toFixed(0)} ${VW} ${VH}" preserveAspectRatio="xMidYMid slice" role="group" aria-label="Carte de nos adresses à Paris">
      <image class="pm-plan" x="${X0}" y="${Y0}" width="${MW}" height="${MH}" preserveAspectRatio="none"/>
      <g>${M.labels.map(txt).join("")}</g>
      <g class="pm-pins">${pins}</g></svg>
    <div class="pm-frame" aria-hidden="true"></div>
    ${edge(outside.filter(v => v.place.includes("Versailles")), "pm-edge--w", "Versailles", "l")}${edge(outside.filter(v => !v.place.includes("Versailles")), "pm-edge--e", "Disney Village", "r")}
    <div class="pm-tip" id="pmTip" aria-live="polite"></div>`;
  const tip = $("pmTip"), svg = box.querySelector("svg");
  let pinned = null;
  const card = v => `<a class="pm-card" href="lieu.html?l=${v.slug}"><img src="assets/lieux/${v.slug}.jpg" alt="" loading="lazy">
      <span class="t-mini">${v.place} · jusqu’à ${capFor(v)} invités</span><span class="t-h5">${v.name}</span></a>`;
  const show = (el, keep) => {
    const g = G[+el.dataset.i], r = el.querySelector(".pm-dot").getBoundingClientRect(), b = box.getBoundingClientRect();
    box.querySelectorAll(".pm-pin").forEach(p => p.classList.toggle("is-on", p === el));
    box.classList.add("is-hover");
    tip.innerHTML = g.list.map(card).join("");
    const x = r.left + r.width / 2 - b.left, y = r.top + r.height / 2 - b.top;
    tip.style.left = Math.min(Math.max(x, 140), b.width - 140) + "px"; tip.style.top = y + "px";
    tip.classList.toggle("is-below", y < b.height * .45);
    tip.classList.add("is-on");
    if (keep) pinned = el;
  };
  const hide = () => { pinned = null; tip.classList.remove("is-on"); box.classList.remove("is-hover"); box.querySelectorAll(".pm-pin.is-on").forEach(p => p.classList.remove("is-on")); };
  box.querySelectorAll(".pm-pin").forEach(el => {
    el.addEventListener("mouseenter", () => { if (!pinned) show(el); });
    el.addEventListener("focus", () => show(el));
    el.addEventListener("click", e => {
      const g = G[+el.dataset.i];
      // souris sur une seule maison : on y va ; toucher ou adresse partagée : la fiche reste ouverte
      if (e.pointerType === "mouse" && g.list.length === 1 && !matchMedia("(hover: none)").matches) location.href = `lieu.html?l=${g.list[0].slug}`;
      else show(el, true);
    });
    el.addEventListener("keydown", e => { if (e.key === "Enter") location.href = `lieu.html?l=${G[+el.dataset.i].list[0].slug}`; });
  });
  svg.addEventListener("mouseleave", e => { if (!pinned && !tip.contains(e.relatedTarget)) hide(); });
  tip.addEventListener("mouseleave", e => { if (!pinned && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(".pm-pin"))) hide(); });
  document.addEventListener("click", e => { if (pinned && !e.target.closest(".pm-pin, .pm-tip")) hide(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") hide(); });
  addEventListener("resize", hide);
  // le plan (≈ 1 Mo compressé) n'est demandé qu'à l'approche de la section, puis apparaît en fondu
  const plan = box.querySelector(".pm-plan");
  plan.addEventListener("load", () => box.classList.add("is-loaded"));
  const near = new IntersectionObserver(es => { if (es.some(x => x.isIntersecting)) { plan.setAttribute("href", M.img); near.disconnect(); } }, {rootMargin:"1200px 0px"});
  near.observe(box);
  // les points apparaissent un à un quand la carte arrive à l'écran
  const io = new IntersectionObserver(es => { if (es.some(x => x.isIntersecting)) { box.classList.add("is-in"); io.disconnect(); } }, {threshold:.25});
  io.observe(box);
  };
