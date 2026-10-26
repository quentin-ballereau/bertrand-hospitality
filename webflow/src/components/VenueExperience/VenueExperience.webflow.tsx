import {declareComponent, useWebflowContext} from "@webflow/react";
import {props} from "@webflow/data-types";
import {VenueExperience, type VenueExperienceProps} from "./VenueExperience";
import "./VenueExperience.module.css";

type Link = {href: string; target?: string; preload?: string};
type Img = {src: string; alt?: string};
type WebflowProps = Omit<VenueExperienceProps, "photo" | "siteUrl" | "instagramUrl" | "brochureUrl" | "streetviewUrl" | "quoteUrl" | "allUrl"> & {
  photo: Img; siteUrl: Link; instagramUrl: Link; brochureUrl: Link; streetviewUrl: Link; quoteUrl: Link; allUrl: Link;
};
const href = (l?: Link) => l?.href ?? "";
const src = (i?: Img) => i?.src ?? "";

// les liens et l'image arrivent de Webflow sous forme d'objets ; dans le canvas, la visite reste figée
function WebflowVenueExperience(p: WebflowProps) {
  const {interactive} = useWebflowContext();
  return <VenueExperience {...p} interactive={interactive}
    photo={src(p.photo)} siteUrl={href(p.siteUrl)} instagramUrl={href(p.instagramUrl)} brochureUrl={href(p.brochureUrl)}
    streetviewUrl={href(p.streetviewUrl)} quoteUrl={href(p.quoteUrl) || "https://evenement.groupe-bertrand.com/demande-de-devis/"} allUrl={href(p.allUrl) || "/lieux"} />;
}

export default declareComponent(WebflowVenueExperience, {
  name: "Venue Experience",
  description: "Page lieu immersive : visite plein écran et panneau du lieu. À poser sur la page de template Lieux, avec les Collection Lists Espaces (data-space), Offres (data-offer) et Galerie (data-photo).",
  group: "Bertrand Hospitality",
  props: {
    name: props.Text({name:"Nom", defaultValue:"Polpo"}),
    place: props.Text({name:"Quartier", defaultValue:"Levallois-Perret"}),
    tagline: props.Text({name:"Accroche", defaultValue:"La plus grande barge d’Europe"}),
    about: props.Text({name:"À propos", defaultValue:""}),
    photo: props.Image({name:"Photo principale"}),
    assis: props.Number({name:"Capacité assis", defaultValue:0}),
    cocktail: props.Number({name:"Capacité cocktail", defaultValue:0}),
    reunion: props.Number({name:"Capacité réunion", defaultValue:0}),
    dansant: props.Number({name:"Capacité dansant", defaultValue:0}),
    address: props.Text({name:"Adresse", defaultValue:""}),
    access: props.Text({name:"Accès", defaultValue:""}),
    contactName: props.Text({name:"Contact · nom", defaultValue:""}),
    contactRole: props.Text({name:"Contact · rôle", defaultValue:""}),
    phone: props.Text({name:"Contact · téléphone", defaultValue:""}),
    email: props.Text({name:"Contact · email", defaultValue:""}),
    siteUrl: props.Link({name:"Site · lien"}),
    siteLabel: props.Text({name:"Site · libellé", defaultValue:""}),
    instagramUrl: props.Link({name:"Instagram · lien"}),
    instagramLabel: props.Text({name:"Instagram · libellé", defaultValue:""}),
    brochureUrl: props.Link({name:"Plaquette"}),
    streetviewUrl: props.Link({name:"Vue 360° (Street View)"}),
    music: props.Text({name:"Musique (id YouTube)", defaultValue:""}),
    quoteUrl: props.Link({name:"Lien devis"}),
    allUrl: props.Link({name:"Lien tous les lieux"}),
  },
  options: {ssr:false},
});
