/* Comparaison des typographies : trois options sur le même site, pour les montrer au client.
   ?typo=a  A · actuelle : rien ne change
   ?typo=b  B · retouchée : les mêmes polices (Ivar Display, Copperplate, Helvetica LT), tailles, graisses et interlettrages revus
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

  /* ---------- tables de l'option B (et C) ---------- */
  // Helvetica LT (textes) : +1,5 à +2 px sous 17 px, interlettrage −1 % (au lieu de −2 %), Light remplacé par Roman sous 15 px, interligne 1,55
  const SANS = s => s <= 11.5 ? s + 2 : s <= 12.5 ? 13.5 : s <= 13.5 ? 14.5 : s <= 14.5 ? 16 : s <= 16.5 ? 17 : s <= 19 ? s + 1 : s;
  // Copperplate (tags, boutons, liens en capitales) : +2,5 px (+1,5 au-delà de 15 px), interlettrage .15em, jamais en Light
  const CAPS = s => s <= 10.5 ? 13 : s <= 14.5 ? s + 2.5 : s + 1.5;
  // Ivar Display (titres) : les petits titres gagnent 1 à 2 px, les grands ne bougent pas ; interlettrage .03em
  const SERIF = s => s <= 22 ? s + 2 : s <= 26 ? s + 1 : s;

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
  // la barre de recherche a une largeur fixe : un peu plus large pour ses libellés agrandis (« Tous formats »)
  const bar = document.createElement("style");
  bar.textContent = "@media (min-width:768px){:root{--bar-w:640px}}";
  document.head.appendChild(bar);
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
  const SKIP = "script,style,svg *,[data-tv-ui],[data-tv-ui] *";

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
      let n = fam === "sans" ? SANS(s) : fam === "caps" ? CAPS(s) : SERIF(s);
      if (el.matches(".seg-value") && innerWidth < 768) n = Math.min(n, s + 1);   // barre de recherche du mobile : pas de place pour plus
      if (v === "c" && fam === "serif") n *= 1.08;   // Cormorant dessine ses capitales plus petites qu'Ivar
      const set = {"font-size": n.toFixed(1) + "px"};
      if (fam === "sans") {
        if (ls < 0) set["letter-spacing"] = "-.01em";
        if (fw === 300 && n < 15) set["font-weight"] = "400";
        if (lh && lh >= 1.3 && lh <= 1.47) set["line-height"] = "1.55";
      } else if (fam === "caps") {
        if (ls >= .06) set["letter-spacing"] = v === "c" ? ".14em" : ".15em";
        if (fw < 400) set["font-weight"] = "400";
        if (v === "c") set["font-weight"] = "500";
      } else {
        if (ls > .005 && ls < .035) set["letter-spacing"] = ".03em";
        if (v === "c") set["font-weight"] = "500";
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
