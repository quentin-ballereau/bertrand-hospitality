import {useEffect, useRef, useState} from "react";
import {readVenues, DEFAULT_SELECTOR, type FormatId, type Venue} from "../../lib/venues";
import {createCoverflow} from "./coverflow";
import * as styles from "./VenueCoverflow.module.css";

export interface VenueCoverflowProps {
  dataSelector?: string;
  wheel?: "horizontal" | "page";
  layout?: "section" | "fill";
  ctaLabel?: string;
  introOnScroll?: boolean;
  interactive?: boolean;            // faux dans le canvas du Designer
  // réservés à l'usage en React (page des lieux, banc d'essai), non exposés dans Webflow
  venues?: Venue[];
  format?: () => FormatId | null;
  query?: () => string;
}

export function VenueCoverflow({
  dataSelector = DEFAULT_SELECTOR, wheel = "horizontal", layout = "section", ctaLabel = "Découvrir le lieu",
  introOnScroll = true, interactive = true, venues, format, query,
}: VenueCoverflowProps) {
  const root = useRef<HTMLDivElement>(null), stage = useRef<HTMLDivElement>(null), inner = useRef<HTMLDivElement>(null),
        veil = useRef<HTMLDivElement>(null), info = useRef<HTMLDivElement>(null), place = useRef<HTMLParagraphElement>(null),
        name = useRef<HTMLHeadingElement>(null), tag = useRef<HTMLParagraphElement>(null), cta = useRef<HTMLAnchorElement>(null);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    const list = venues ?? readVenues(dataSelector);
    setEmpty(!list.length);
    if (!list.length) return;
    const cf = createCoverflow(root.current!, {
      stage:stage.current!, inner:inner.current!, veil:veil.current!, info:info.current!,
      place:place.current!, name:name.current!, tag:tag.current!, cta:cta.current!,
    }, {styles, wheel:wheel === "page" ? "all" : "x", interactive, format, query});

    // le carrousel entre en scène quand son haut passe aux deux tiers de l'écran, comme les autres sections de la home
    let io: IntersectionObserver | undefined;
    if (introOnScroll && interactive) {
      io = new IntersectionObserver(entries => {
        if (!entries.some(e => e.isIntersecting)) return;
        io!.disconnect();
        cf.set(list, {intro:true});
      }, {rootMargin:"0px 0px -34% 0px"});
      io.observe(root.current!);
    } else cf.set(list, {intro:interactive});
    return () => { io?.disconnect(); cf.destroy(); };
  }, [venues, dataSelector, wheel, interactive, introOnScroll]);

  if (empty) return (
    <div className={styles.root}>
      <p className={styles.empty}>Aucun lieu trouvé. Ajoutez sur la page une Collection List « Lieux » dont chaque item porte
        l’attribut <code>data-venue</code> (sélecteur actuel : <code>{dataSelector}</code>).</p>
    </div>
  );

  return (
    <div ref={root} className={`${styles.root} ${styles[layout]}`}>
      <div ref={stage} className={styles.stage} aria-roledescription="carrousel" aria-label="Nos lieux">
        <div ref={inner} className={styles.inner} />
        <div ref={veil} className={styles.veil} />
      </div>
      <div ref={info} className={styles.info}>
        <p ref={place} className={`${styles.caps} ${styles.place}`} />
        <h3 ref={name} className={styles.name} />
        <p ref={tag} className={styles.tag} />
        <a ref={cta} className={`${styles.caps} ${styles.ul} ${styles.cta}`}>{ctaLabel}</a>
      </div>
    </div>
  );
}
