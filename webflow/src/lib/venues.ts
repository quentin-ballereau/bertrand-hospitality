/* Les lieux, lus dans la page plutôt que codés en dur (cf. js/data.js du POC).
   Un code component n'a pas accès au CMS : on pose dans la page une Collection List « Lieux » (masquée ou non),
   et le composant la lit au montage. Convention de balisage, à reproduire dans le Designer :

   <div data-venue>                                   ← le Collection Item
     <img data-field="image" src="…">                 ← champ image principale
     <a data-field="link" href="/lieux/polpo">         ← lien vers la page du lieu (template CMS)
     <div data-field="slug">polpo</div>               ← et autant de textes que de champs ci-dessous
     <div data-field="name">…</div> place, tag, desc, sector, assis, cocktail, reunion, dansant
   </div>

   Les capacités sont des nombres (0 ou vide = format non proposé). */

export type FormatId = "reunion" | "assis" | "cocktail" | "dansant";
export type Caps = Partial<Record<FormatId, number>>;

export interface Venue extends Required<Caps> {
  slug: string;
  name: string;
  place: string;
  tag: string;
  desc: string;
  sector: string;
  image: string;
  href: string;
}

export const FORMATS: {id: FormatId; label: string; unit: string; icon: string}[] = [
  {id:"reunion", label:"Séminaire", unit:"en réunion",
    icon:'<path d="M5 6h20v12H5z"/><path d="M15 18v6M10 27l5-3 5 3"/><path d="M9 10h7M9 13h11"/>'},
  {id:"assis", label:"Repas assis", unit:"assis",
    icon:'<circle cx="15" cy="15" r="7"/><circle cx="15" cy="15" r="4"/><path d="M4 6v6a2 2 0 0 0 2 2v10M6 6v5M8 6v6a2 2 0 0 1-2 2"/><path d="M25 6c-2 1-2.5 4-2.5 7h2.5v11"/>'},
  {id:"cocktail", label:"Cocktail", unit:"en cocktail",
    icon:'<path d="M7 6h16l-8 10z"/><path d="M15 16v9M10 25h10"/><path d="M19 4l-3 6"/>'},
  {id:"dansant", label:"Soirée dansante", unit:"en soirée dansante",
    icon:'<circle cx="15" cy="17" r="7.5"/><path d="M15 3v6.5M7.5 17h15M15 9.5c-2.5 2-2.5 13 0 15M15 9.5c2.5 2 2.5 13 0 15M9 13h12M9 21h12"/>'},
];

export const fmtOf = (id?: string | null) => FORMATS.find(f => f.id === id);
export const capFor = (v: Venue, f?: FormatId | null) => f ? v[f] : Math.max(v.assis, v.cocktail, v.reunion, v.dansant);

/* les filtres voyagent dans l'URL : ?format=cocktail&invites=120&secteur=rg */
export interface Filters { format: FormatId | null; guests: number | null; sector: string | null }
export function fromQuery(search = location.search): Filters {
  const q = new URLSearchParams(search);
  const f = q.get("format"), g = +(q.get("invites") ?? 0);
  return {format: fmtOf(f) ? f as FormatId : null, guests: g >= 10 ? Math.min(600, g) : null, sector: q.get("secteur")};
}
export function toQuery(st: Filters) {
  const q = new URLSearchParams();
  if (st.format) q.set("format", st.format);
  if (st.guests) q.set("invites", String(st.guests));
  if (st.sector) q.set("secteur", st.sector);
  return q.toString();
}

/* lecture d'un Collection Item : Webflow marque d'une classe w-dyn-bind-empty les éléments liés à un champ vide
   (une image vide garde même une image de remplacement) */
export function fields(item: Element) {
  const el = (k: string) => {
    const e = item.querySelector<HTMLElement>(`[data-field="${k}"]`);
    return e && !e.classList.contains("w-dyn-bind-empty") ? e : null;
  };
  return {
    el,
    txt: (k: string) => el(k)?.textContent?.trim() ?? "",
    num: (k: string) => parseInt(el(k)?.textContent ?? "", 10) || 0,
    src: (k: string) => el(k)?.getAttribute("src") ?? "",
    href: (k: string) => el(k)?.getAttribute("href") ?? "",
  };
}

export const DEFAULT_SELECTOR = "[data-venue]";

export function readVenues(selector = DEFAULT_SELECTOR, scope: ParentNode = document): Venue[] {
  return [...scope.querySelectorAll(selector)].map(item => {
    const {txt, num, src, href} = fields(item);
    const slug = txt("slug");
    return {
      slug,
      name: txt("name"),
      place: txt("place"),
      tag: txt("tag"),
      desc: txt("desc"),
      sector: txt("sector"),
      image: src("image"),
      href: href("link") || `/lieux/${slug}`,
      assis: num("assis"),
      cocktail: num("cocktail"),
      reunion: num("reunion"),
      dansant: num("dansant"),
    };
  }).filter(v => v.name);
}
