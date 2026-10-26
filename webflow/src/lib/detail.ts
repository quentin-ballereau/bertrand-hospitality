/* Contenu détaillé d'un lieu pour la page immersive (cf. js/detail.js du POC), lu dans trois Collection Lists
   posées sur la page de template du lieu, chacune filtrée sur le lieu courant :

   Espaces  <div data-space>   slug, name, desc, image (img), thumb (img), event (img, facultatif),
                               assis, cocktail, reunion, dansant, hot (JSON des points de passage)
   Offres   <div data-offer>   group, name, note, ht, ttc
   Galerie  <div data-photo>   une image (le champ multi-image du lieu), son texte alternatif sert de légende

   Points de passage (hot) : [{"x":44,"y":52,"to":"bar"}] — position en % de l'image, « to » = slug de l'espace de destination. */
import {fields, type Caps} from "./venues";

export interface Hotspot { x: number; y: number; to: string }
export interface Space { id: string; name: string; desc: string; img: string; thumb: string; event: string; caps: Caps; hot: Hotspot[] }
export interface Offer { group: string; name: string; note: string; ht: string; ttc: string }
export interface Photo { src: string; alt: string }

const parseHot = (s: string): Hotspot[] => {
  try { const h = JSON.parse(s); return Array.isArray(h) ? h : []; } catch { return []; }
};

export function readSpaces(scope: ParentNode = document): Space[] {
  return [...scope.querySelectorAll("[data-space]")].map(item => {
    const {txt, num, src} = fields(item);
    const img = src("image");
    return {
      id: txt("slug"), name: txt("name"), desc: txt("desc"),
      img, thumb: src("thumb") || img, event: src("event"),
      caps: {assis:num("assis"), cocktail:num("cocktail"), reunion:num("reunion"), dansant:num("dansant")},
      hot: parseHot(txt("hot")),
    };
  }).filter(s => s.id && s.img);
}

export function readOffers(scope: ParentNode = document): {group: string; items: Offer[]}[] {
  const groups: {group: string; items: Offer[]}[] = [];
  scope.querySelectorAll("[data-offer]").forEach(item => {
    const {txt} = fields(item);
    const o = {group:txt("group"), name:txt("name"), note:txt("note"), ht:txt("ht"), ttc:txt("ttc")};
    if (!o.name) return;
    const g = groups.find(g => g.group === o.group) ?? groups[groups.push({group:o.group, items:[]}) - 1];
    g.items.push(o);
  });
  return groups;
}

export function readGallery(scope: ParentNode = document): Photo[] {
  return [...scope.querySelectorAll("[data-photo]")].map(item => {
    const img = item.matches("img") ? item : item.querySelector("img");
    return {src:img?.getAttribute("src") ?? "", alt:img?.getAttribute("alt") ?? ""};
  }).filter(p => p.src && !p.src.includes("placeholder"));
}
