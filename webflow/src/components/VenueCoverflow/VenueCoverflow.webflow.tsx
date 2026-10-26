import {declareComponent, useWebflowContext} from "@webflow/react";
import {props} from "@webflow/data-types";
import {VenueCoverflow, type VenueCoverflowProps} from "./VenueCoverflow";
import "./VenueCoverflow.module.css";

// dans le canvas du Designer, le carrousel s'affiche sans capter la molette, le glisser ni le clavier
function WebflowVenueCoverflow(p: VenueCoverflowProps) {
  const {interactive} = useWebflowContext();
  return <VenueCoverflow {...p} interactive={interactive} />;
}

export default declareComponent(WebflowVenueCoverflow, {
  name: "Venue Coverflow",
  description: "Carrousel 3D des lieux, alimenté par une Collection List « Lieux » présente sur la page (items marqués data-venue).",
  group: "Bertrand Hospitality",
  props: {
    dataSelector: props.Text({name:"Sélecteur des lieux", defaultValue:"[data-venue]"}),
    wheel: props.Variant({name:"Molette", options:["horizontal", "page"], defaultValue:"horizontal"}),
    layout: props.Variant({name:"Hauteur", options:["section", "fill"], defaultValue:"section"}),
    ctaLabel: props.Text({name:"Libellé du lien", defaultValue:"Découvrir le lieu"}),
    introOnScroll: props.Boolean({name:"Entrée au défilement", defaultValue:true}),
  },
  options: {ssr:false},
});
