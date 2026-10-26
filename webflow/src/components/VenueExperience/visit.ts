/* La visite : le lieu en plein écran (portage de la partie « la visite » de lieu.html).
   Chaque espace est un calque ; on « entre » dans le suivant pendant que le précédent s'efface.
   On regarde autour en glissant, avec un léger suivi du curseur. Les points de passage mènent d'un espace à l'autre. */
import gsap from "gsap";
import type {Space} from "../../lib/detail";

export interface VisitOpts {
  styles: Record<string, string>;
  spaces: Space[];
  interactive: boolean;
  onShow: (id: string) => void;     // l'espace affiché a changé (légende, vignettes)
  onDragStart: () => void;          // premier glisser : l'invite « Glissez pour regarder autour » s'efface
}

export function createVisit(scene: HTMLElement, opts: VisitOpts) {
  const {styles:S, spaces} = opts;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const off: (() => void)[] = [];
  const on = (t: EventTarget, type: string, fn: (e: any) => void) => { t.addEventListener(type, fn); off.push(() => t.removeEventListener(type, fn)); };
  const esc = (s: string) => s.replace(/[&<>"]/g, c => `&#${c.charCodeAt(0)};`);

  const SCALE = 1.16;                                  // l'image déborde un peu pour pouvoir regarder autour
  let layer: HTMLElement | null = null, current: string | null = null;
  const pan = {x:0, y:0}, follow = {x:0, y:0};
  let qx: gsap.QuickToFunc | null = null, qy: gsap.QuickToFunc | null = null;
  const limits = () => ({x:(SCALE - 1) / 2 * scene.clientWidth, y:(SCALE - 1) / 2 * scene.clientHeight});
  const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));
  const byId = (id: string) => spaces.find(s => s.id === id);
  function applyPan() {
    if (!qx || !qy) return;
    const L = limits();
    qx(clamp(pan.x + follow.x, L.x)); qy(clamp(pan.y + follow.y, L.y));
  }

  function show(id: string, first = false) {
    const s = byId(id); if (!s || s.id === current) return;
    current = s.id;
    const el = document.createElement("div");
    el.className = S.layer;
    el.innerHTML = `<img src="${esc(s.img)}" alt="${esc(s.name)}">` + (s.event ? `<img class="${S.evt}" src="${esc(s.event)}" alt="${esc(s.name)}, en événement">` : "") +
      s.hot.map(h => {
        const to = byId(h.to); if (!to) return "";
        return `<button class="${S.hot}" type="button" style="left:${+h.x}%;top:${+h.y}%" data-go="${esc(to.id)}" aria-label="${esc(to.name)}"><span class="${S.caps}">${esc(to.name)}</span></button>`;
      }).join("");
    scene.appendChild(el);
    const old = layer; layer = el;
    pan.x = pan.y = 0;
    // on « entre » dans l'espace : l'image arrive légèrement plus proche puis se pose
    gsap.set(el, {scale:SCALE, x:0, y:0});
    qx = gsap.quickTo(el, "x", {duration:1.1, ease:"expo.out"});
    qy = gsap.quickTo(el, "y", {duration:1.1, ease:"expo.out"});
    if (reduce) old?.remove();
    else {
      gsap.fromTo(el, {opacity:0, scale:SCALE * 1.07}, {opacity:1, scale:SCALE, duration:first ? 2.4 : 1.5, ease:"expo.out"});
      if (old) gsap.to(old, {opacity:0, duration:1, ease:"power2.out", onComplete:() => old.remove()});
    }
    opts.onShow(s.id);
  }

  // regarder autour : glisser, et un léger suivi du curseur
  let drag: {x: number; y: number; px: number; py: number} | null = null, dragged = false;
  if (opts.interactive) {
    on(scene, "pointerdown", (e: PointerEvent) => {
      if (e.button > 0) return;
      drag = {x:e.clientX, y:e.clientY, px:pan.x, py:pan.y}; dragged = false;
    });
    on(window, "pointermove", (e: PointerEvent) => {
      if (drag) {
        const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (!dragged && Math.hypot(dx, dy) > 4) { dragged = true; scene.classList.add(S.isDragging); opts.onDragStart(); }
        if (dragged) { const L = limits(); pan.x = clamp(drag.px + dx, L.x); pan.y = clamp(drag.py + dy, L.y); applyPan(); }
      } else if (e.pointerType === "mouse") {
        const L = limits();
        follow.x = -(e.clientX / innerWidth - 0.5) * L.x * 0.5;
        follow.y = -(e.clientY / innerHeight - 0.5) * L.y * 0.5;
        applyPan();
      }
    });
    on(window, "pointerup", () => {
      if (!drag) return;
      drag = null; scene.classList.remove(S.isDragging);
      setTimeout(() => dragged = false, 0);
    });
    // un point de passage mène à l'espace suivant, sauf au relâcher d'un glisser
    on(scene, "click", (e: MouseEvent) => {
      const b = (e.target as Element).closest<HTMLElement>("[data-go]");
      if (b && !dragged) show(b.dataset.go!);
    });
  }

  return {
    show,
    get current() { return current; },
    destroy() { off.forEach(f => f()); gsap.killTweensOf(scene.children); scene.innerHTML = ""; },
  };
}
