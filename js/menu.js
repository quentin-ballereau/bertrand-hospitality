/* Menu principal, commun aux trois pages : s'ouvre depuis le bouton « menu » en haut à gauche.
   Maquette Figma « Navigation · 01 Menu ouvert » : rubriques de l'arborescence, liens secondaires, devis.
   Ouverture reprise de cartier.com (mêmes durées et courbes) :
   - le bouton reste en place : ses traits forment une croix (0,4 s), « menu » s'efface (0,3 s) puis « Fermer » apparaît dans un flou (0,8 s) ;
   - voile 0,5 s ; panneau depuis la gauche 0,8 s cubic-bezier(.5,0,0,1), son ombre en fondu sur la même durée ;
   - fermeture : panneau 0,3 s cubic-bezier(1,0,1,1), voile retardé de 0,2 s.
   La photo de droite n'apparaît qu'au survol d'une rubrique. */
(() => {
  const ARROW = '<svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true"><path d="M0 5h15M11 1l4 4-4 4" stroke="currentColor"/></svg>';
  const ITEMS = [
    {label:"Nos lieux", href:"lieux.html", img:"assets/menu/nos-lieux.webp?v=2"},
    {label:"Événements", href:"offres.html", img:"assets/menu/evenements.webp?v=2"},
    {label:"Nous connaître", href:"nous-connaitre.html", img:"assets/menu/nous-connaitre.webp?v=2"},
    {label:"Engagement RSE", href:"engagement.html", img:"assets/menu/engagement-rse.webp?v=2"},
    {label:"Hôtels", href:"hotels.html", img:"assets/menu/hotels.webp?v=2"},
    {label:"Journal", href:"blog.html", img:"assets/menu/journal.webp?v=2"},
  ];
  // deux lignes de liens, comme dans le Figma
  const SECONDARY = [[["FAQ", "faq.html"], ["Coffrets cadeaux", "https://groupebertrand.bonkdo.com/fr/destinations/"]], [["Nous rejoindre", "https://recrutement.bertrand-hospitality.com/fr"], ["Bertrand Hospitality", "https://bertrand-hospitality.com/"]]];
  const EASE = {smooth:"cubic-bezier(.5,0,0,1)", accelerate:"cubic-bezier(1,0,1,1)", out:"cubic-bezier(.17,.17,.25,1)", in:"cubic-bezier(.17,0,.83,.83)"};
  const link = ([l, h]) => `<a class="ul" href="${h}"${/^http/.test(h) ? ' target="_blank" rel="noopener"' : ""}>${l}</a>`;

  const root = document.createElement("div");
  root.className = "mnu"; root.setAttribute("aria-hidden", "true");
  root.innerHTML = `
    <div class="mnu-veil"></div>
    <div class="mnu-media" aria-hidden="true">${ITEMS.map((it, i) => `<img data-src="${it.img}" alt="" data-i="${i}">`).join("")}</div>
    <aside class="mnu-panel" role="dialog" aria-modal="true" aria-label="Menu">
      <div class="mnu-glow"></div>
      <div class="mnu-inner" data-lenis-prevent>
        <div class="mnu-top"><p class="mnu-lang caps"><b>FR</b><a href="#">EN</a></p></div>
        <nav aria-label="Navigation principale">
          <ul class="mnu-list">${ITEMS.map((it, i) => `<li><a class="mnu-link" href="${it.href}" data-i="${i}">${it.label}</a></li>`).join("")}</ul>
        </nav>
        <div class="mnu-foot">
          ${SECONDARY.map(row => `<p class="mnu-sec caps">${row.map(link).join("")}</p>`).join("")}
          <a class="mnu-quote caps" href="devis.html">Demander un devis${ARROW}</a>
          <p class="mnu-tel"><span>Ou appelez-nous</span><a class="ul caps" href="tel:+33764070661">07 64 07 06 61</a></p>
        </div>
      </div>
    </aside>
    <button class="mnu-btn caps" type="button" aria-label="Fermer le menu"><i class="nav-ico" aria-hidden="true"></i><span class="mnu-btn-lbl"><span class="lbl-menu">menu</span><span class="lbl-close">Fermer</span></span></button>`;
  document.body.appendChild(root);

  const $ = s => root.querySelector(s), $$ = s => root.querySelectorAll(s);
  const panel = $(".mnu-panel"), glow = $(".mnu-glow"), veil = $(".mnu-veil"), media = $(".mnu-media"), imgs = $$(".mnu-media img"), list = $(".mnu-list");
  const btn = $(".mnu-btn"), lblMenu = $(".lbl-menu"), lblClose = $(".lbl-close");
  const trigger = document.querySelector(".nav-menu");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let open = false, shown = -1;

  function lockScroll(on) {
    document.documentElement.style.overflow = on ? "hidden" : "";
    if (window.__lenis) on ? window.__lenis.stop() : window.__lenis.start();
  }

  // le bouton du menu se superpose exactement à celui de la page (position, taille de texte, couleur de départ),
  // et la ligne FR / EN se cale sur sa hauteur
  function placeButton() {
    if (!trigger) return;
    const r = trigger.getBoundingClientRect(), cs = getComputedStyle(trigger);
    Object.assign(btn.style, {left:r.left + "px", top:r.top + "px", height:r.height + "px", fontSize:cs.fontSize});
    btn.style.setProperty("--btn-c", cs.color);
    btn.querySelector(".mnu-btn-lbl").style.display = trigger.querySelector("span") && getComputedStyle(trigger.querySelector("span")).display === "none" ? "none" : "";
    const top = $(".mnu-top"), lang = $(".mnu-lang");
    top.style.setProperty("--cy", "0px");
    const l = lang.getBoundingClientRect(), p = panel.getBoundingClientRect();
    top.style.setProperty("--cy", `${((r.top + r.height / 2) - (l.top - p.top + l.height / 2)).toFixed(1)}px`);
  }

  // photo de la rubrique survolée, transition reprise de springs.estate : la nouvelle photo se pose au-dessus de la précédente,
  // se dévoile du bas vers le haut et se dézoome de 113 % à 100 %, en 0,8 s cubic-bezier(.25,.74,.22,.99) ;
  // la précédente reste dessous sans bouger puis disparaît. En quittant la liste, la photo du dessus se replie vers le bas.
  const REVEAL = {duration:800, easing:"cubic-bezier(.25,.74,.22,.99)", fill:"both"};
  const SHUT = "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)", OPEN = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
  let z = 0;
  function showImg(i) {
    if (i === shown) return;
    shown = i;
    const im = imgs[i];
    im.getAnimations().forEach(a => a.cancel());
    Object.assign(im.style, {zIndex:++z, visibility:"visible"});
    if (reduce) { im.style.clipPath = OPEN; return; }
    im.animate([{clipPath:SHUT}, {clipPath:OPEN}], REVEAL);
    im.animate([{transform:"scale(1.13)"}, {transform:"scale(1)"}], REVEAL).finished.then(() => {
      if (shown === i) imgs.forEach(o => { if (o !== im) o.style.visibility = "hidden"; });
    }).catch(() => {});
  }
  function hideImg() {
    if (shown === -1) return;
    const im = imgs[shown]; shown = -1;
    const done = () => { if (shown === -1) imgs.forEach(o => { o.getAnimations().forEach(a => a.cancel()); o.style.visibility = "hidden"; }); };
    if (reduce) return done();
    im.animate([{clipPath:OPEN}, {clipPath:SHUT}], {duration:600, easing:"cubic-bezier(.25,.74,.22,.99)", fill:"both"}).finished.then(done).catch(() => {});
  }

  // animations natives du navigateur : elles acceptent les courbes cubic-bezier de Cartier telles quelles
  const run = [];
  const anim = (el, frames, duration, easing, delay = 0) => { const a = el.animate(frames, {duration:reduce ? 0 : duration, easing, delay:reduce ? 0 : delay, fill:"both"}); run.push(a); return a; };
  const stop = () => { run.forEach(a => { try { a.commitStyles(); } catch (e) {} a.cancel(); }); run.length = 0; };

  function openMenu() {
    if (open) return; open = true;
    imgs.forEach(im => { if (!im.src) im.src = im.dataset.src; });   // photos chargées à la première ouverture seulement
    placeButton();
    root.classList.add("is-open"); root.setAttribute("aria-hidden", "false");
    if (trigger) { trigger.style.visibility = "hidden"; trigger.setAttribute("aria-expanded", "true"); }
    lockScroll(true);
    requestAnimationFrame(() => btn.classList.add("is-x"));   // la croix et le passage au noir : transitions CSS de 0,4 s
    stop();
    anim(veil, [{opacity:0}, {opacity:1}], 500, "ease");
    anim(panel, [{transform:"translateX(-100%)"}, {transform:"none"}], 800, EASE.smooth);
    anim(glow, [{opacity:0}, {opacity:1}], 800, "ease");
    anim(lblMenu, [{opacity:1}, {opacity:0}], 300, EASE.in);
    anim(lblClose, [{opacity:0, filter:"blur(5px)"}, {opacity:1, filter:"blur(0)"}], 800, EASE.out, 300);
    btn.focus({preventScroll:true});
  }
  function closeMenu() {
    if (!open) return; open = false;
    hideImg();
    btn.classList.remove("is-x");
    stop();
    anim(lblClose, [{opacity:0}], 300, EASE.in);
    const back = anim(lblMenu, [{opacity:0, filter:"blur(5px)"}, {opacity:1, filter:"blur(0)"}], 800, EASE.out, 300);
    anim(panel, [{transform:"translateX(-100%)"}], 300, EASE.accelerate);
    anim(glow, [{opacity:0}], 300, "ease");
    const last = anim(veil, [{opacity:0}], 500, "ease", 200);
    Promise.all([last.finished, back.finished]).then(() => {   // le bouton cloné reste jusqu'à la fin du fondu de « menu »
      if (open) return;
      root.classList.remove("is-open"); root.setAttribute("aria-hidden", "true"); lockScroll(false);
      if (trigger) { trigger.style.visibility = ""; trigger.setAttribute("aria-expanded", "false"); trigger.focus({preventScroll:true}); }
    }).catch(() => {});
  }

  $$(".mnu-link").forEach(a => {
    a.addEventListener("mouseenter", () => showImg(+a.dataset.i));
    a.addEventListener("focus", () => showImg(+a.dataset.i));
  });
  list.addEventListener("mouseleave", hideImg);
  list.addEventListener("focusout", e => { if (!list.contains(e.relatedTarget)) hideImg(); });
  if (trigger) {
    trigger.setAttribute("aria-expanded", "false");
    trigger.addEventListener("click", openMenu);
  }
  btn.addEventListener("click", closeMenu);
  veil.addEventListener("click", closeMenu);
  document.addEventListener("keydown", e => { if (e.key === "Escape" && open) closeMenu(); });
  addEventListener("resize", () => { if (open) placeButton(); });
  BH.menu = {open:openMenu, close:closeMenu};
})();
