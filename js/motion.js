/* Mouvement commun à tout le site (sauf la fiche lieu immersive) : un seul réglage pour toutes les pages.
   1. Défilement doux Lenis, léger (celui de la home) : la page suit la molette de près, sans inertie appuyée.
   2. Parallaxe légère sur les photos : chaque image glisse de ±5 % dans son cadre pendant qu'elle traverse l'écran
      (agrandie à 110 % pour ne jamais découvrir de bord). Les héros et les photos qui ont déjà leur propre mouvement
      (carrousels, cartes des formats, appel final…) sont laissés à leur page.
   3. Apparition des contenus, comme sur la home : fondu et légère montée (24 px, 1,1 s), en décalé quand plusieurs
      éléments arrivent ensemble. Les éléments déjà animés par leur page (.rv, .of-fade, .nc-fade…) sont laissés tels quels.
   À charger en fin de page, après Lenis et GSAP s'ils sont utilisés. */
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;

  /* ---------- 1. défilement doux ---------- */
  if (!reduce && window.Lenis && !window.__lenis) {
    const lenis = new Lenis({lerp:.12, wheelMultiplier:1, smoothWheel:true});
    window.__lenis = lenis;   // le menu met le défilement en pause quand il est ouvert
    if (window.gsap) { gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }   // même horloge que les animations
    else { const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
    // liens internes (#questions, #formulaire…) : glissés eux aussi
    document.addEventListener("click", e => {
      const a = e.target.closest('a[href^="#"]'); if (!a || a.getAttribute("href").length < 2) return;
      const t = document.querySelector(a.getAttribute("href")); if (!t) return;
      e.preventDefault(); lenis.scrollTo(t, {offset:-24});
    });
  }
  if (reduce) return;

  /* ---------- 2. parallaxe des photos ---------- */
  // photos qui ont déjà leur mouvement, ou qui ne sont pas des photos de contenu
  const OWN = ".hero-slide img, .hero-bg img, .lp-hero-bg img, .rv-slide img, .acard-px, .of-band img, .cf img, .stage img, .pmap img, .pm-card img, .nc-logos img";
  const RANGE = .05, SCALE = 1.1;
  const framed = img => {
    const box = img.parentElement; if (!box) return null;
    const cs = getComputedStyle(box), ic = getComputedStyle(img);
    if (ic.objectFit !== "cover" || !/hidden|clip/.test(cs.overflow + cs.overflowY)) return null;
    const r = img.getBoundingClientRect(), b = box.getBoundingClientRect();
    return r.height >= b.height * .9 && r.width >= b.width * .9 ? box : null;   // l'image remplit son cadre
  };
  // le contenu de la page : <main>, ou tout le corps de page hors menu, en-tête et pied de page (la home n'a pas de <main>)
  const MAIN = document.querySelector("main") || document.body, OUT = "header, footer, .nav, .mnu, .foot, .loader";
  const live = new Set(), seen = new WeakSet();
  const watch = new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? live.add(e.target) : live.delete(e.target)), {rootMargin:"20% 0px"});
  const scan = () => MAIN.querySelectorAll("img").forEach(img => {
    if (seen.has(img) || img.matches(OWN) || img.closest(OUT)) return;
    if (!img.complete || !img.getBoundingClientRect().height) { img.addEventListener("load", scan, {once:true}); return; }
    const box = framed(img); if (!box) return;
    seen.add(img); img._box = box;
    img.style.scale = SCALE;
    watch.observe(img);
  });
  let ticking = false;
  const frame = () => {
    ticking = false;
    for (const img of live) {
      const b = img._box.getBoundingClientRect();
      const p = Math.max(-1, Math.min(1, (b.top + b.height / 2 - innerHeight / 2) / (innerHeight / 2 + b.height / 2)));
      img.style.translate = `0 ${(-p * b.height * RANGE).toFixed(1)}px`;
    }
  };
  const tick = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener("scroll", tick, {passive:true});
  addEventListener("resize", tick);

  /* ---------- 3. apparition des contenus ---------- */
  const OWN_RV = ".rv, .ev-fade, .of-fade, .nc-fade, .lp-rv, .lp-in, .mo-rv";
  const SKIP = ".hero, .sc-hero, .nc-hero, .lp-hero, .cf, .pmap, .pop, .faq-a, [hidden]";
  const BLOCKS = [".sec-head", ".pg-head", ".qa-head", ".faq-head > *", ".faq-list", ".closing-card", ".figs-row", ".vcard", ".gcard", ".fcard", ".fm-card",
    ".lp-step", ".lp-fmt", ".care-txt > *", ".hotels-txt > *", ".dv-head", ".dv-block", ".dv-send", ".vl-filter", ".tools", ".empty",
    "section > h2", "section > p", "figure"].join(",");
  const st = document.createElement("style");
  st.textContent = ".mo-rv{opacity:0;translate:0 24px}.mo-rv.is-in{opacity:1;translate:none;transition:opacity 1.1s var(--expo),translate 1.1s var(--expo);transition-delay:var(--rd,0s)}";
  document.head.appendChild(st);
  const show = new IntersectionObserver(es => {
    let k = 0;
    es.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
      .forEach(e => { e.target.style.setProperty("--rd", `${Math.min(k++, 6) * .08}s`); e.target.classList.add("is-in"); show.unobserve(e.target); });
  }, {rootMargin:"0px 0px -8% 0px"});
  const tag = () => MAIN.querySelectorAll(BLOCKS).forEach(el => {
    if (el.closest(OWN_RV) || el.querySelector(OWN_RV) || el.closest(SKIP) || el.closest(OUT)) return;
    const pos = getComputedStyle(el).position; if (pos === "fixed" || pos === "sticky") return;
    el.classList.add("mo-rv"); show.observe(el);
  });

  /* contenus rendus plus tard (grilles filtrées, cartes) : on les reprend à chaque changement */
  let again;
  new MutationObserver(() => { clearTimeout(again); again = setTimeout(() => { tag(); scan(); tick(); }, 60); })
    .observe(MAIN, {childList:true, subtree:true});
  tag(); scan(); tick();
  addEventListener("load", () => { scan(); tick(); });
})();
