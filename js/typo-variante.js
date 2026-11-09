/* Comparaison des typographies : trois options sur le même site, pour les montrer au client.
   ?typo=a  A · actuelle : rien ne change
   ?typo=b  B · retouchée : le site actuel, à deux détails près : le texte courant (Helvetica Light) un peu plus grand
            et un peu plus nourri, les petites capitales (mini-tags surtout) un peu plus grandes ; le reste ne bouge pas
   ?typo=c  C · Google Fonts : Cormorant Garamond (titres) et Instrument Sans (textes et capitales), avec les tailles de B
   Le choix suit la navigation (sessionStorage) ; une pastille en bas à gauche permet de passer de l'une à l'autre.
   Sans paramètre ni choix dans la session, ce script ne fait rien.

   Les tailles du site sont écrites en dur dans chaque règle : plutôt que de dupliquer tout le CSS, on lit la taille
   réelle de chaque élément et on applique les tables ci-dessous (à régler ensemble : c'est ici que tout se joue). */
(() => {
  const KEY = "bh-typo", OPTS = ["a", "b", "c"];
  let q = null; try { q = new URLSearchParams(location.search).get("typo"); } catch {}
  let stored = null; try { stored = sessionStorage.getItem(KEY); } catch {}
  const embedded = window !== window.top;   // dans la page de comparaison : seul le paramètre compte, rien n'est retenu, pas de pastille
  const v = OPTS.includes(q) ? q : !embedded && OPTS.includes(stored) ? stored : null;
  if (!v) return;
  if (!embedded) try { sessionStorage.setItem(KEY, v); } catch {}
  const html = document.documentElement;
  html.dataset.typo = v;

  /* ---------- réglages de l'option B (et C) ---------- */
  // texte courant, Helvetica LT Light seulement : +1 px (12 → 13, 13 → 14, 14 → 15), au-delà rien ne change
  const SANS = s => s <= 14.5 ? s + 1 : s;
  // un trait de 0,2 px autour des lettres : le Light gagne un peu de corps sans passer au Roman, plus lourd
  const STROKE = ".2px";
  // petites capitales Copperplate : les mini-tags (12 px et moins) +1 px, les tags de 13–14 px +0,5 px ; interlettrage inchangé
  const CAPS = s => s <= 12.5 ? s + 1 : s <= 14.5 ? s + .5 : s;

  if (v === "a") { ui(); return; }

  /* ---------- option C : les polices Google ---------- */
  // les noms « BH… » n'existent pas : ils servent à reconnaître la famille d'origine de chaque élément
  if (v === "c") {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Instrument+Sans:wght@400;500&display=swap";
    document.head.appendChild(l);
    const st = document.createElement("style");
    st.textContent = `:root{--serif:"BHSerif","Cormorant Garamond",Georgia,serif;--caps:"BHCaps","Instrument Sans",Helvetica,sans-serif;--sans:"BHSans","Instrument Sans",Helvetica,sans-serif}`;
    document.head.appendChild(st);
  }
  // pendant le premier réglage, la page reste masquée (au plus 1,2 s)
  const hide = document.createElement("style");
  hide.textContent = "html[data-typo] body{opacity:0}";
  document.head.appendChild(hide);
  const show = () => hide.remove();
  setTimeout(show, 1200);

  const familyOf = cs => {
    const f = cs.fontFamily;
    if (/BHSerif|Ivar/i.test(f)) return "serif";
    if (/BHCaps|Copperplate/i.test(f)) return "caps";
    if (/BHSans|Helvetica/i.test(f)) return "sans";
    return null;
  };
  const touched = new Set();
  const SKIP = "script,style,svg *,[data-tv-ui],[data-tv-ui] *,.seg-value";   // la barre de recherche a des cases de largeur fixe

  function adjust(root) {
    const els = root.nodeType === 1 ? [root, ...root.querySelectorAll("*")] : [...root.querySelectorAll("*")];
    // 1. tout lire avant d'écrire : un enfant qui hérite de son parent garde la taille de son parent, on ne le touche pas
    const plan = [];
    for (const el of els) {
      if (touched.has(el) || el.matches(SKIP)) continue;
      const cs = getComputedStyle(el), fam = familyOf(cs); if (!fam) continue;
      const p = el.parentElement && getComputedStyle(el.parentElement);
      const own = !p || el === document.body ||
        cs.fontSize !== p.fontSize || cs.fontFamily !== p.fontFamily || cs.letterSpacing !== p.letterSpacing || cs.fontWeight !== p.fontWeight;
      if (!own) continue;
      plan.push([el, cs.fontSize, cs.letterSpacing, cs.fontWeight, cs.lineHeight, fam]);
    }
    // 2. écrire
    for (const [el, fsS, lsS, fwS, lhS, fam] of plan) {
      const s = parseFloat(fsS), ls = lsS === "normal" ? 0 : parseFloat(lsS) / s, fw = +fwS;
      const lh = lhS === "normal" ? null : parseFloat(lhS) / s;
      const set = {};
      if (fam === "sans") {
        if (fw === 300 && SANS(s) !== s) { set["font-size"] = SANS(s) + "px"; set["-webkit-text-stroke"] = STROKE + " currentColor"; }
        else if (fw !== 300) set["-webkit-text-stroke"] = "0";   // un mot en Roman ou en gras dans le texte reste tel quel
      } else {
        set["-webkit-text-stroke"] = "0";   // un tag ou un titre posé dans un texte n'hérite pas du trait
        if (fam === "caps" && CAPS(s) !== s) set["font-size"] = CAPS(s) + "px";
        if (v === "c") {
          set["font-weight"] = "500";
          if (fam === "serif") set["font-size"] = (s * 1.08).toFixed(1) + "px";   // Cormorant dessine ses capitales plus petites qu'Ivar
        }
      }
      el._tvOld = {};
      for (const k in set) { el._tvOld[k] = el.style.getPropertyValue(k); el.style.setProperty(k, set[k]); }
      touched.add(el);
    }
  }
  function reset() {
    for (const el of touched) { for (const k in el._tvOld) el.style.setProperty(k, el._tvOld[k]); delete el._tvOld; }
    touched.clear();
  }

  function start() {
    adjust(document.body);
    show(); ui();
    // contenus ajoutés plus tard (carrousels, menus, filtres)
    new MutationObserver(ms => {
      for (const m of ms) for (const nd of m.addedNodes) if (nd.nodeType === 1 && nd.isConnected) adjust(nd);
    }).observe(document.body, {childList:true, subtree:true});
    // les tailles d'origine changent avec l'écran : on repart de zéro
    let t, w = innerWidth;
    addEventListener("resize", () => { clearTimeout(t); t = setTimeout(() => { if (innerWidth === w) return; w = innerWidth; reset(); adjust(document.body); }, 200); });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", start) : start();

  /* ---------- pastille : passer d'une option à l'autre ---------- */
  function ui() {
    if (embedded) return;
    const go = () => {
      if (document.querySelector("[data-tv-ui]")) return;
      const box = document.createElement("div");
      box.setAttribute("data-tv-ui", "");
      box.setAttribute("aria-label", "Option typographique");
      box.style.cssText = "position:fixed;left:16px;bottom:16px;z-index:9999;display:flex;align-items:center;gap:2px;padding:4px;background:rgba(29,29,27,.88);color:#fff;border-radius:999px;font:500 11px/1 Helvetica,Arial,sans-serif;letter-spacing:.04em;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)";
      const label = {a:"A · Actuelle", b:"B · Retouchée", c:"C · Google Fonts"};
      box.innerHTML = `<a href="typographies.html" style="padding:7px 10px;opacity:.7;color:#fff;text-decoration:none;white-space:nowrap">Typo</a>` +
        OPTS.map(o => `<a href="?typo=${o}" title="${label[o]}" style="padding:7px 10px;border-radius:999px;color:${o === v ? "#1d1d1b" : "#fff"};background:${o === v ? "#fff" : "transparent"};text-decoration:none;white-space:nowrap">${o.toUpperCase()}</a>`).join("");
      // garder les autres paramètres de la page (lieu, filtres)
      box.querySelectorAll('a[href^="?typo"]').forEach(a => {
        const u = new URL(location.href); u.searchParams.set("typo", a.getAttribute("href").slice(6)); a.href = u.pathname + u.search + u.hash;
      });
      document.body.appendChild(box);
    };
    document.body ? go() : document.addEventListener("DOMContentLoaded", go);
  }
})();
