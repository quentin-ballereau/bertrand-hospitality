/* Titres, sur tout le site : jamais un mot seul sur une ligne.
   Le CSS (text-wrap: balance, css/base.css) égalise la longueur des lignes ; ce script compte les mots :
   si une ligne n'en porte qu'un, il le lie à son voisin par une espace insécable, puis remesure.
   Ne s'applique qu'aux titres de quatre mots ou plus (à trois mots sur deux lignes, un mot seul est inévitable)
   et faits de texte simple (les titres découpés en mots animés, comme celui du hero de la home, sont laissés tels quels).
   Relancé au redimensionnement, à partir du texte d'origine. */
(() => {
  const SEL = "h1,h2,h3,h4,blockquote,.t-h1,.t-h2,.t-h3,.t-h4,.t-h5,.lp-title,.sc-title,.of-title,.headline,.vcard-name,.fcard-name,.info-name,.p-name,.rv-quote";
  const NBSP = " ";
  // les mots, par ligne affichée
  const lines = el => {
    const out = [], node = el.firstChild, re = /[^ \t\n]+/g; let m, i = 0;   // les espaces insécables d'origine lient déjà leurs mots
    while ((m = re.exec(node.data))) {
      const r = document.createRange(); r.setStart(node, m.index); r.setEnd(node, m.index + m[0].length);
      const top = Math.round(r.getClientRects()[0]?.top ?? 0);
      const last = out[out.length - 1];
      if (last && Math.abs(last.top - top) < 6) last.words.push(i); else out.push({top, words:[i]});
      i++;
    }
    return out;
  };
  function fix(el) {
    if (el.childNodes.length !== 1 || el.firstChild.nodeType !== 3) return;   // texte simple seulement
    // texte d'origine ; si la page l'a changé depuis notre dernier passage (carrousel, filtres), on repart du nouveau
    if (el.textContent !== el.dataset.typoOut) el.dataset.typo = el.textContent;
    const words = el.dataset.typo.trim().split(/[ \t\n]+/);
    el.textContent = el.dataset.typoOut = el.dataset.typo;
    if (words.length < 4 || !el.offsetWidth) return;
    const glue = new Set();   // indices des espaces devenues insécables (entre le mot i et i + 1)
    for (let pass = 0; pass < 4; pass++) {
      const L = lines(el);
      if (L.length < 2) return;
      const lone = L.find(l => l.words.length === 1);
      if (!lone) return;
      const w = lone.words[0];
      // le mot isolé rejoint la ligne d'avant (ou, s'il ouvre le titre, celle d'après)
      glue.add(w > 0 ? w - 1 : w);
      const render = () => el.textContent = el.dataset.typoOut = words.map((x, i) => x + (i < words.length - 1 ? (glue.has(i) ? NBSP : " ") : "")).join("");
      render();
      // jamais au prix d'un débordement : si le groupe de mots ne tient plus dans la largeur, on renonce
      if (el.scrollWidth > el.clientWidth + 1) { glue.delete(w > 0 ? w - 1 : w); render(); return; }
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
