/* Retours d'expérience (Figma 6577-2089) : un écran plein, la photo du lieu, le dégradé des héros, l'avis posé en bas.
   Les avis défilent comme les photos du hero de la home (la suivante pousse la précédente vers la gauche),
   au rythme de lecture (calculé ci-dessous d'après la longueur moyenne des avis). Pause seulement hors de l'écran (la section fait un écran : la souris y est forcément).

   ⚠ EXEMPLES À REMPLACER : ces textes sont rédigés pour la maquette. Les vrais avis viendront des questionnaires
   de satisfaction, présélectionnés par Bertrand Hospitality (décision du weekly du 14/10/2026).

   Photos : chaque maison en situation d'événement (sélection JB d'octobre 2026).

   BH.reviews(el, {items}) — items : [{quote, who, venue, img}] */
BH.REVIEWS = [
  {quote:"Notre séminaire de 80 personnes à Polpo s’est déroulé sans le moindre accroc : une salle baignée de lumière, un déjeuner remarqué par toute l’équipe et une interlocutrice disponible.",
   who:"Directrice des ressources humaines, séminaire d’entreprise", venue:"Polpo", img:"assets/evenement/polpo.webp"},
  {quote:"Dîner de fin d’année sous la coupole pour 200 collaborateurs : un service d’une précision rare, et la piste du Dancing pour finir la soirée.",
   who:"Office manager, soirée de fin d’année", venue:"La Coupole", img:"assets/evenement/coupole.webp"},
  {quote:"Nos clients ont été saisis par le décor du salon historique. Le menu était à la hauteur du lieu, et tout était prêt à l’heure dite.",
   who:"Directeur commercial, dîner clients", venue:"Le Procope", img:"assets/evenement/procope.webp"},
  {quote:"Une journée de travail au calme, au bord de l’eau, puis un dîner devant la cheminée : exactement l’esprit que nous cherchions pour notre comité de direction.",
   who:"Assistante de direction, comité de direction", venue:"L’Île", img:"assets/evenement/ile.webp"},
];

BH.reviews = (root, opts = {}) => {
  const items = opts.items || BH.REVIEWS;
  /* un même rythme pour tous les avis, calé sur leur longueur moyenne : 238 mots par minute en lecture silencieuse
     (Brysbaert, 2019, méta-analyse de 190 études). L'avis se lit dès la seconde moitié du glissement :
     pause = temps de lecture moyen − ½ glissement. Pour 27 mots en moyenne : 6,7 s de lecture, un avis toutes les 7,4 s. */
  const WPM = 238, SLIDE = 1.4;
  const words = items.reduce((n, r) => n + r.quote.split(/\s+/).length, 0) / items.length;
  const HOLD = Math.round(words / WPM * 60000 - SLIDE * 500);
  root.classList.add("rv-sec");
  root.innerHTML = `
    <p class="rv-tag t-cta">${opts.tag || "Retours d’expérience"}</p>
    <div class="rv-track">${items.map((r, i) => `
      <figure class="rv-slide"${i ? ' aria-hidden="true"' : ""}>
        <img ${i ? "data-src" : "src"}="${r.img}" alt="" loading="lazy">
        <blockquote class="rv-quote">« ${r.quote} »</blockquote>
        <figcaption class="rv-who">${r.who} · ${r.venue}</figcaption>
      </figure>`).join("")}</div>
    <div class="rv-dots" role="tablist" aria-label="Avis">${items.map((r, i) => `<button type="button" role="tab" aria-label="Avis ${i + 1} : ${r.venue}" aria-selected="${!i}"><i></i></button>`).join("")}</div>`;
  const slides = [...root.querySelectorAll(".rv-slide")], dots = [...root.querySelectorAll(".rv-dots button")];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const load = s => { const im = s.querySelector("img"); if (im.dataset.src) { im.src = im.dataset.src; delete im.dataset.src; } return im.decode ? im.decode().catch(() => {}) : Promise.resolve(); };
  let cur = 0, timer = null, visible = false, busy = false;
  if (window.gsap) gsap.set(slides, {xPercent:i => i ? 100 : 0});

  // le trait sous l'avis en cours se remplit pendant la lecture
  const mark = i => dots.forEach((d, j) => {
    d.setAttribute("aria-selected", j === i);
    const bar = d.firstElementChild;
    if (window.gsap) { gsap.killTweensOf(bar); gsap.set(bar, {scaleX:j < i ? 1 : 0}); }
  });
  // le trait se remplit jusqu'à l'arrivée de l'avis suivant (glissement compris, sauf pour le premier, déjà en place)
  const fill = (dur = HOLD / 1000 + SLIDE) => { const bar = dots[cur].firstElementChild; if (window.gsap && !reduce) gsap.fromTo(bar, {scaleX:0}, {scaleX:1, duration:dur, ease:"none"}); };

  function go(i, dir = 1) {
    if (busy || i === cur) return;
    busy = true; clearTimeout(timer);
    const prev = cur; cur = (i + items.length) % items.length;
    load(slides[cur]).then(() => {
      slides[cur].removeAttribute("aria-hidden"); slides[prev].setAttribute("aria-hidden", "true");
      mark(cur);
      if (reduce || !window.gsap) { slides.forEach((s, j) => s.style.transform = `translateX(${j === cur ? 0 : 100}%)`); busy = false; schedule(); return; }
      gsap.set(slides[cur], {xPercent:100 * dir});
      gsap.to(slides[prev], {xPercent:-100 * dir, duration:SLIDE, ease:"power3.inOut"});
      gsap.to(slides[cur], {xPercent:0, duration:SLIDE, ease:"power3.inOut", onComplete:() => { busy = false; schedule(); }});
      fill();
    });
  }
  const schedule = () => { clearTimeout(timer); if (visible && !document.hidden) timer = setTimeout(() => go(cur + 1), HOLD); };
  dots.forEach((d, i) => d.addEventListener("click", () => go(i, i > cur ? 1 : -1)));
  new IntersectionObserver(es => {
    const was = visible; visible = es[0].isIntersecting;
    if (visible && !was) { slides.slice(1).forEach(load); if (!busy) { mark(cur); fill(HOLD / 1000); } schedule(); }
    if (!visible) clearTimeout(timer);
  }, {threshold:.4}).observe(root);
  document.addEventListener("visibilitychange", schedule);
};
