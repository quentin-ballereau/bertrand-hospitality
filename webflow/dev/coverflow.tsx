/* Reconstitue la Collection List Webflow à partir des données du POC (js/data.js),
   puis monte le carrousel deux fois : version home (section, molette horizontale) et version page des lieux (fill). La molette « page » capte tout le défilement : elle se teste sur une page dédiée. */
import {createRoot} from "react-dom/client";
import {VenueCoverflow} from "../src/components/VenueCoverflow/VenueCoverflow";

declare global { interface Window { BH: {VENUES: Record<string, string | number>[]} } }

const esc = (s: unknown) => String(s).replace(/[&<>"]/g, c => `&#${c.charCodeAt(0)};`);
document.getElementById("cms")!.innerHTML = window.BH.VENUES.map(v => `
  <div data-venue>
    <img data-field="image" src="/assets/lieux/${esc(v.slug)}.jpg" alt="">
    <a data-field="link" href="/lieu.html?l=${esc(v.slug)}"></a>
    ${["slug", "name", "place", "tag", "desc", "assis", "cocktail", "reunion", "dansant"].map(k => `<div data-field="${k}">${esc(v[k] ?? "")}</div>`).join("")}
    <div data-field="sector">${esc(v.s)}</div>
  </div>`).join("");

createRoot(document.getElementById("home")!).render(<VenueCoverflow />);
createRoot(document.getElementById("lieux")!).render(<VenueCoverflow layout="fill" />);
