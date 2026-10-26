/* Carrousel 3D des lieux : portage fidèle de js/coverflow.js du POC.
   Les cartes sont posées à l'intérieur d'une roue, le regard au centre : toutes tournent ensemble,
   l'écart angulaire entre deux cartes est constant, elles ne peuvent donc jamais se chevaucher.
   Seules différences avec le POC : les classes viennent du module CSS (Shadow DOM), les données d'une Collection List,
   et tout ce qui est attaché à la fenêtre est retiré au démontage du composant. */
import gsap from "gsap";
import {capFor, fmtOf, type FormatId, type Venue} from "../../lib/venues";

export interface CoverflowEls {
  stage: HTMLElement;
  inner: HTMLElement;
  veil: HTMLElement;
  info: HTMLElement;
  place: HTMLElement;
  name: HTMLElement;
  tag: HTMLElement;
  cta: HTMLAnchorElement;
}

export interface CoverflowOpts {
  styles: Record<string, string>;
  wheel: "x" | "all";               // "all" : la page entière pilote le carrousel ; "x" : seul le geste horizontal sur la scène
  interactive: boolean;             // faux dans le canvas du Designer : ni molette, ni glisser, ni clavier
  format?: () => FormatId | null;
  query?: () => string;             // la recherche en cours suit le lieu ouvert
}

export function createCoverflow(root: HTMLElement, els: CoverflowEls, opts: CoverflowOpts) {
  const {stage, inner, veil, info} = els, S = opts.styles;
  const hrefOf = (v: Venue) => {
    const q = opts.query?.();
    return v.href + (q ? (v.href.includes("?") ? "&" : "?") + q : "");
  };
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = () => innerWidth < 768;
  const off: (() => void)[] = [];
  const on = <K extends keyof WindowEventMap>(t: EventTarget, type: K | string, fn: (e: any) => void, o?: AddEventListenerOptions) => {
    t.addEventListener(type, fn, o); off.push(() => t.removeEventListener(type, fn, o));
  };

  let list: Venue[] = [], cards: {el: HTMLAnchorElement; img: HTMLImageElement; veil: HTMLElement}[] = [];
  let n = 0, loop = false, W = 0, target = 0, active = -1;
  const st = {pos:0};                  // pos : index (fractionnaire) de la carte au centre
  let R = 1000, STEP = 0.5;            // rayon de la roue (px) et écart angulaire entre deux cartes (rad)

  /* ---------- géométrie ---------- */
  function measure() {
    const r = stage.getBoundingClientRect();
    // assez large pour l'image, assez étroit pour que les voisines inclinées restent visibles
    W = mobile() ? innerWidth * 0.62 : Math.min(innerWidth * 0.5, r.height * 0.86 * 16 / 9, 980);
    root.style.setProperty("--cw", W + "px");
    root.style.setProperty("--ch", W * 9 / 16 + "px");
    // la corde entre deux cartes voisines = largeur + un blanc : R découle de l'angle choisi
    const gap = mobile() ? 14 : 44;
    STEP = (mobile() ? 34 : 28) * Math.PI / 180;
    R = (W + gap) / (2 * Math.sin(STEP / 2));
    stage.style.perspective = R + "px";   // l'œil est sur l'axe de la roue
  }
  const wrap = (x: number) => loop ? ((x % n) + n * 1.5) % n - n / 2 : x;   // distance signée la plus courte
  const idxOf = (p: number) => loop ? ((Math.round(p) % n) + n) % n : Math.max(0, Math.min(n - 1, Math.round(p)));
  const stepPx = () => W * 1.05;                                             // geste (px) pour passer d'une carte à la suivante

  /* ---------- rendu image par image ---------- */
  function render() {
    const fadeFrom = 46 * Math.PI / 180, hideAt = 62 * Math.PI / 180;
    for (let i = 0; i < n; i++) {
      const c = cards[i], p = wrap(i - st.pos), th = p * STEP, a = Math.abs(th);
      const op = a >= hideAt ? 0 : a <= fadeFrom ? 1 : 1 - (a - fadeFrom) / (hideAt - fadeFrom);
      gsap.set(c.el, {
        x: R * Math.sin(th),
        z: R * (1 - Math.cos(th)),                                 // sur la paroi intérieure de la roue
        rotationY: -th * 180 / Math.PI,                             // tournée vers l'axe, donc vers nous
        opacity: op, zIndex: 50 - Math.round(Math.abs(p) * 10), visibility: op > 0.01 ? "visible" : "hidden"});
      gsap.set(c.img, {xPercent:-p * 4});                          // léger parallaxe dans l'image
      c.veil.style.opacity = String(Math.min(a / hideAt, 1) * 0.35);   // les côtés se fondent dans le crème
      if (Math.abs(p) < 3 && !c.img.src) c.img.src = c.img.dataset.src!;   // chargement progressif
    }
    const ai = idxOf(st.pos);
    if (ai !== active) setActive(ai);
  }

  /* ---------- fiche du lieu au centre ---------- */
  function fill(v: Venue) {
    const f = fmtOf(opts.format?.());
    els.place.textContent = f ? `${v.place} · ${v[f.id]} invités ${f.unit}` : `${v.place} · jusqu’à ${capFor(v)} invités`;
    els.name.textContent = v.name;
    els.tag.textContent = v.desc || v.tag;   // description longue quand elle existe, sinon l’accroche
    els.cta.href = hrefOf(v);
  }
  function setActive(i: number) {
    const first = active === -1; active = i;
    cards.forEach((c, k) => c.el.classList.toggle(S.isActive, k === i));
    const v = list[i]; if (!v) return;
    const parts = [els.place, els.name, els.tag, els.cta];
    if (first || reduce) { fill(v); return; }
    gsap.killTweensOf(parts);
    gsap.to(parts, {y:-8, opacity:0, duration:.22, ease:"power2.in", stagger:.02, onComplete:() => {
      fill(v);
      gsap.fromTo(parts, {y:14, opacity:0}, {y:0, opacity:1, duration:.8, ease:"expo.out", stagger:.05});
    }});
  }

  /* ---------- navigation ---------- */
  function go(t: number, dur = 1.1, ease = "expo.out") {
    if (!loop) t = Math.max(0, Math.min(n - 1, t));
    target = t;
    gsap.to(st, {pos:t, duration:reduce ? 0 : dur, ease, overwrite:"auto", onUpdate:render});
  }
  const goToCard = (i: number) => go(Math.round(target) + Math.round(wrap(i - Math.round(target))));

  if (opts.interactive) {
    // molette / trackpad : avance proportionnelle au geste, puis aimant quasi instantané à l'arrêt
    let snapT: ReturnType<typeof setTimeout>, dir = 0;
    on(opts.wheel === "x" ? stage : window, "wheel", (e: WheelEvent) => {
      if (!n || (e.target as Element)?.closest?.(".finder")) return;
      const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      if (opts.wheel === "x" && !horizontal) return;
      e.preventDefault();
      const d = horizontal ? e.deltaX : e.deltaY;
      if (!d) return;
      dir = Math.sign(d);
      target += d / (stepPx() * 1.2);
      if (!loop) target = Math.max(-0.3, Math.min(n - 0.7, target));
      gsap.to(st, {pos:target, duration:.5, ease:"power3.out", overwrite:"auto", onUpdate:render});
      clearTimeout(snapT);
      snapT = setTimeout(() => go(dir > 0 ? Math.ceil(target - 0.2) : Math.floor(target + 0.2), .75), 50);
    }, {passive:false});

    // glisser : les cartes suivent le doigt, l'élan est conservé au relâcher
    let drag: {x: number; pos: number; moved: boolean; hist: [number, number][]} | null = null;
    on(stage, "pointerdown", (e: PointerEvent) => {
      if (!n || e.button > 0) return;
      drag = {x:e.clientX, pos:st.pos, moved:false, hist:[[e.clientX, performance.now()]]};
      gsap.killTweensOf(st);
    });
    on(window, "pointermove", (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 5) { drag.moved = true; stage.classList.add(S.isDragging); stage.setPointerCapture?.(e.pointerId); }
      if (!drag.moved) return;
      st.pos = drag.pos - dx / stepPx();
      target = st.pos; render();
      drag.hist.push([e.clientX, performance.now()]); if (drag.hist.length > 6) drag.hist.shift();
    });
    on(window, "pointerup", () => {
      if (!drag) return;
      stage.classList.remove(S.isDragging);
      if (drag.moved) {
        const [x0, t0] = drag.hist[0], [x1, t1] = drag.hist[drag.hist.length - 1];
        const v = (x1 - x0) / Math.max(16, t1 - t0);                 // px/ms
        go(Math.round(st.pos - (v * 260) / stepPx()), 1.2);
        stage.dataset.justDragged = "1"; setTimeout(() => delete stage.dataset.justDragged, 60);   // évite d'ouvrir la carte au relâcher
      }
      drag = null;
    });
    on(inner, "click", (e: MouseEvent) => {
      const a = (e.target as Element).closest<HTMLElement>("[data-i]"); if (!a) return;
      if (stage.dataset.justDragged) { e.preventDefault(); return; }
      const i = +a.dataset.i!;
      if (i !== active) { e.preventDefault(); goToCard(i); }   // une voisine : on l'amène au centre
    });
    // flèches du clavier, seulement quand le carrousel est à l'écran
    on(window, "keydown", (e: KeyboardEvent) => {
      if (!n || (e.target as Element)?.closest?.(".finder")) return;
      const r = stage.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      if (e.key === "ArrowRight") go(Math.round(target) + 1);
      if (e.key === "ArrowLeft") go(Math.round(target) - 1);
    });
  }
  on(window, "resize", () => { if (n) { measure(); render(); } });

  /* ---------- construction ---------- */
  /* entrée : rien ne glisse ni ne se dévoile. Chaque photo apparaît en fondu en reculant légèrement,
     la carte centrale d'abord puis ses voisines, de proche en proche */
  function reveal(intro: boolean) {
    const order = cards.map((c, i) => ({c, d:Math.abs(wrap(i - st.pos))})).filter(o => o.d < 3);
    order.forEach(({c, d}) => {
      const delay = (intro ? 0.15 : 0) + d * 0.12;
      gsap.fromTo(c.img, {opacity:0}, {opacity:1, duration:1.2, ease:"power2.out", delay});
      gsap.fromTo(c.img, {scale:1.08}, {scale:1, duration:2, ease:"expo.out", delay});
    });
    cards.forEach(c => { if (!order.some(o => o.c === c)) gsap.set(c.img, {opacity:1}); });
    gsap.fromTo(info, {opacity:0, y:12}, {opacity:1, y:0, duration:1.2, ease:"expo.out", delay:intro ? 0.55 : 0.35});
  }
  function set(next: Venue[], {intro = false} = {}) {
    list = next; n = list.length; loop = n >= 5;
    info.style.visibility = n ? "visible" : "hidden";
    const esc = (s: string) => s.replace(/[&<>"]/g, c => `&#${c.charCodeAt(0)};`);
    inner.innerHTML = list.map((v, i) =>
      `<a class="${S.lcard}" data-i="${i}" href="${esc(hrefOf(v))}" draggable="false" aria-label="${esc(v.name)}, ${esc(v.place)}">
         <img data-src="${esc(v.image)}" alt="" draggable="false"><span class="${S.lcardVeil}"></span></a>`).join("");
    cards = [...inner.children].map(el => ({el:el as HTMLAnchorElement, img:el.querySelector("img")!, veil:el.querySelector<HTMLElement>(`.${S.lcardVeil}`)!}));
    active = -1; veil.style.opacity = "0";
    if (!n) return;
    measure();
    st.pos = 0; target = 0;
    if (!reduce) cards.forEach(c => gsap.set(c.img, {opacity:0}));
    render();
    if (!reduce) reveal(intro);
  }
  function refresh(next: Venue[]) {
    if (!n || reduce) return set(next);
    // sortie : les photos visibles s'effacent en fondu, puis la nouvelle sélection apparaît
    gsap.killTweensOf(st);
    const vis = cards.filter((c, i) => Math.abs(wrap(i - st.pos)) < 3);
    gsap.to(info, {opacity:0, y:-8, duration:.3, ease:"power2.in"});
    gsap.to(vis.map(c => c.img), {opacity:0, duration:.45, ease:"power2.in", stagger:.03, onComplete:() => set(next)});
  }
  function destroy() {
    off.forEach(f => f());
    gsap.killTweensOf([st, info, ...cards.flatMap(c => [c.el, c.img]), els.place, els.name, els.tag, els.cta]);
  }
  return {set, refresh, destroy, get size() { return n; }};
}
