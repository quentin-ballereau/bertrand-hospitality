/* Monte la page lieu avec le contenu du POC (js/data.js + js/detail.js), sans passer par le CMS.
   ?l=polpo (défaut) : lieu complet ; ?l=la-coupole : lieu sans contenu détaillé (une seule vue, la photo principale) */
import {createRoot} from "react-dom/client";
import {VenueExperience} from "../src/components/VenueExperience/VenueExperience";

const BH = (window as any).BH;
const slug = new URLSearchParams(location.search).get("l") || "polpo";
const v = BH.VENUES.find((x: any) => x.slug === slug) ?? BH.VENUES[0], D = BH.DETAIL[v.slug];
const abs = (p: string) => "/" + p;

createRoot(document.getElementById("app")!).render(
  <VenueExperience
    name={v.name} place={v.place} tagline={D?.tagline ?? v.tag} about={D?.about ?? ""} photo={`/assets/lieux/${v.slug}.jpg`}
    assis={v.assis} cocktail={v.cocktail} reunion={v.reunion} dansant={v.dansant}
    address={D?.address.join("\n") ?? ""} access={D?.access ?? ""}
    contactName={D?.contact.name ?? ""} contactRole={D?.contact.role ?? ""} phone={D?.contact.phone ?? ""} email={D?.contact.email ?? ""}
    siteUrl={D?.site.url ?? ""} siteLabel={D?.site.label ?? ""} instagramUrl={D?.instagram.url ?? ""} instagramLabel={D?.instagram.label ?? ""}
    brochureUrl={D?.brochure ?? ""} streetviewUrl={D?.streetview ?? ""} music={D?.music.youtube ?? ""}
    quoteUrl="https://evenement.groupe-bertrand.com/demande-de-devis/" allUrl="/coverflow.html"
    spaces={D ? D.scenes.map((s: any) => ({id:s.id, name:s.name, desc:s.desc, img:abs(s.img), thumb:abs(s.thumb), event:"", caps:s.caps, hot:s.hot})) : []}
    offers={D?.offers ?? []}
    gallery={D ? D.gallery.map((g: any) => ({src:abs(g.src), alt:g.alt})) : []}
  />
);
