/* Titres, sur tout le site : jamais un mot seul sur une ligne, jamais un mot composé coupé à son trait d'union.
   Le CSS (text-wrap: balance, css/base.css) égalise la longueur des lignes ; ce script compte les mots :
   1. les mots composés (petit-déjeuner, Champs-Élysées) ne se coupent plus au trait d'union ;
   2. si une ligne ne porte qu'un mot, il est lié à son voisin par une espace insécable, puis on remesure
      (titres de quatre mots ou plus : à trois mots sur deux lignes, un mot seul est inévitable).
   Règle de sûreté : une retouche ne doit jamais élargir le titre (sinon il sortirait de sa colonne) ; sinon on y renonce.
   Ne touche qu'aux titres en texte simple (les titres découpés en mots animés, comme ceux des héros, sont laissés tels quels).
   Relancé au redimensionnement, à partir du texte d'origine. */
(() => {
  const SEL = "h1,h2,h3,h4,blockquote,.t-h1,.t-h2,.t-h3,.t-h4,.t-h5,.lp-title,.sc-title,.of-title,.headline,.vcard-name,.fcard-name,.info-name,.p-name,.rv-quote";
  const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const width = el => el.getBoundingClientRect().width;

  function fix(el) {
    // texte d'origine ; si la page l'a changé depuis notre dernier passage (carrousel, filtres), on repart du nouveau
    if (el.textContent !== el.dataset.typoOut) {
      if (el.children.length && !el.querySelector(":scope > .tw")) return;   // titre composé d'éléments : on n'y touche pas
      el.dataset.typo = el.textContent;
    }
    const text = el.dataset.typo, words = text.trim().split(/[ \t\n]+/);   // les insécables d'origine lient déjà leurs mots
    el.textContent = el.dataset.typoOut = text;
    if (!el.offsetWidth || words.length < 2) return;
    const base = width(el), wider = () => width(el) > base + 1 || el.scrollWidth > el.clientWidth + 1;

    let nobr = words.some(w => w.includes("-"));
    const glue = new Set();   // espaces insécables ajoutées (entre le mot i et le mot i + 1)
    const render = () => {
      el.innerHTML = words.map((w, i) => `<span class="tw"${nobr && w.includes("-") ? ' style="white-space:nowrap"' : ""}>${esc(w)}</span>`
        + (i < words.length - 1 ? (glue.has(i) ? "&nbsp;" : " ") : "")).join("");
      el.dataset.typoOut = el.textContent;
    };
    // 1. les mots composés d'un seul tenant, si le titre le permet
    if (nobr) { render(); if (wider()) nobr = false; }
    if (words.length < 4) { if (nobr) render(); else el.textContent = el.dataset.typoOut = text; return; }
    render();

    // 2. pas de mot seul sur une ligne
    for (let pass = 0; pass < 4; pass++) {
      const lines = [];
      el.querySelectorAll(":scope > .tw").forEach((s, i) => {
        const top = Math.round(s.getBoundingClientRect().top), last = lines[lines.length - 1];
        if (last && Math.abs(last.top - top) < 6) last.words.push(i); else lines.push({top, words:[i]});
      });
      if (lines.length < 2) return;
      const lone = lines.find(l => l.words.length === 1);
      if (!lone) return;
      const w = lone.words[0], g = w > 0 ? w - 1 : w;   // le mot isolé rejoint la ligne d'avant (ou, s'il ouvre le titre, celle d'après)
      if (glue.has(g)) return;
      glue.add(g); render();
      if (wider()) { glue.delete(g); render(); return; }
    }
  }
  const run = () => document.querySelectorAll(SEL).forEach(fix);
  let t;
  const later = () => { clearTimeout(t); t = setTimeout(run, 120); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", later); else later();
  if (document.fonts) document.fonts.ready.then(later);
  addEventListener("load", later);
  addEventListener("resize", later);
  window.BH = window.BH || {}; BH.typo = run;   // à relancer après un rendu tardif
})();
