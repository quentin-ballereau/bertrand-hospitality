/* Page lieu immersive (portage de lieu.html) : la visite plein écran, le panneau du lieu et ses onglets.
   Les champs du lieu arrivent en props (liées au CMS sur la page de template) ;
   ses espaces, offres et photos sont lus dans les Collection Lists de la page (src/lib/detail.ts). */
import {useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties} from "react";
import gsap from "gsap";
import {FORMATS, fmtOf, fromQuery, toQuery, type Caps, type FormatId} from "../../lib/venues";
import {readGallery, readOffers, readSpaces, type Offer, type Photo, type Space} from "../../lib/detail";
import {createVisit} from "./visit";
import * as styles from "./VenueExperience.module.css";

export interface VenueExperienceProps {
  name: string;
  place: string;
  tagline: string;
  about: string;
  photo: string;
  assis: number;
  cocktail: number;
  reunion: number;
  dansant: number;
  address: string;
  access: string;
  contactName: string;
  contactRole: string;
  phone: string;
  email: string;
  siteUrl: string;
  siteLabel: string;
  instagramUrl: string;
  instagramLabel: string;
  brochureUrl: string;
  streetviewUrl: string;
  music: string;                 // identifiant de la vidéo YouTube
  quoteUrl: string;
  allUrl: string;
  interactive?: boolean;         // faux dans le canvas du Designer
  // banc d'essai : contenu fourni directement plutôt que lu dans la page
  spaces?: Space[];
  offers?: {group: string; items: Offer[]}[];
  gallery?: Photo[];
}

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const mobile = () => innerWidth < 768;
// « 100 assis · 100 cocktail · 60 réunion » : du repas à la réunion, toujours dans le même ordre
const SHORT: [FormatId, string][] = [["assis", "assis"], ["cocktail", "cocktail"], ["reunion", "réunion"], ["dansant", "dansant"]];
const capsTxt = (c: Caps) => SHORT.filter(([k]) => c[k]).map(([k, w]) => `${c[k]} ${w}`).join(" · ");
const Icon = ({d, box = 16}: {d: string; box?: number}) => <svg viewBox={`0 0 ${box} ${box}`} aria-hidden="true" dangerouslySetInnerHTML={{__html:d}} />;
const ICON = {
  link:'<path d="M6.5 9.5 9.5 6.5M7 4.5l1.2-1.2a2.8 2.8 0 0 1 4 4L11 8.5M9 11.5l-1.2 1.2a2.8 2.8 0 0 1-4-4L5 7.5"/>',
  insta:'<rect x="2" y="2" width="12" height="12" rx="3.5"/><circle cx="8" cy="8" r="2.8"/><circle cx="11.6" cy="4.4" r=".5"/>',
  phone:'<path d="M5.5 2h-2A1.5 1.5 0 0 0 2 3.5C2 9.3 6.7 14 12.5 14a1.5 1.5 0 0 0 1.5-1.5v-2l-3-1-1.5 1.5a8 8 0 0 1-4-4L7 5.5Z"/>',
  mail:'<rect x="2" y="3.5" width="12" height="9"/><path d="m2.5 4 5.5 4.5L13.5 4"/>',
};

export function VenueExperience(p: VenueExperienceProps) {
  const S = styles, interactive = p.interactive ?? true;
  const reduce = useMemo(() => matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  const filters = useMemo(() => fromQuery(), []);   // format et invités transmis depuis la recherche

  /* ---------- contenu : lu une fois dans la page ---------- */
  const [content, setContent] = useState<{spaces: Space[]; offers: {group: string; items: Offer[]}[]; gallery: Photo[]} | null>(null);
  useEffect(() => {
    setContent({spaces:p.spaces ?? readSpaces(), offers:p.offers ?? readOffers(), gallery:p.gallery ?? readGallery()});
  }, [p.spaces, p.offers, p.gallery]);
  const venueCaps: Caps = {assis:p.assis, cocktail:p.cocktail, reunion:p.reunion, dansant:p.dansant};
  // en attendant leur contenu, les lieux sans espaces s'ouvrent sur leur photo et leurs capacités
  const spaces: Space[] = content?.spaces.length ? content.spaces
    : p.photo ? [{id:"lieu", name:p.name, desc:p.tagline, img:p.photo, thumb:p.photo, event:"", caps:venueCaps, hot:[]}] : [];
  const offers = content?.offers ?? [], gallery = content?.gallery ?? [];
  const formats = FORMATS.filter(f => venueCaps[f.id]);
  const hasEvent = spaces.some(s => s.event);

  /* ---------- la visite ---------- */
  const rootRef = useRef<HTMLDivElement>(null), sceneRef = useRef<HTMLDivElement>(null);
  const visit = useRef<ReturnType<typeof createVisit> | null>(null);
  const [current, setCurrent] = useState<string | null>(null);
  const [hintOff, setHintOff] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const spacesKey = spaces.map(s => s.id).join();
  useEffect(() => {
    if (!content || !spaces.length) return;
    const v = visit.current = createVisit(sceneRef.current!, {styles:S, spaces, interactive, onShow:setCurrent, onDragStart:() => setHintOff(true)});
    // le premier espace : le plus petit qui accueille les invités dans le format recherché, sinon le premier
    const f = filters.format;
    const start = f ? [...spaces].filter(s => (s.caps[f] ?? 0) >= (filters.guests || 1)).sort((a, b) => a.caps[f]! - b.caps[f]!)[0] : null;
    v.show((start || spaces[0]).id, true);
    return () => { v.destroy(); visit.current = null; };
  }, [content, spacesKey, interactive]);
  const go = (id: string) => { visit.current?.show(id); if (mobile()) setPanelOpen(false); };
  useEffect(() => { const t = setTimeout(() => setHintOff(true), 4200); return () => clearTimeout(t); }, []);
  useEffect(() => { if (mobile()) setPanelOpen(false); }, []);

  // la page ne défile pas : tout se passe dans la visite et le panneau
  useEffect(() => {
    if (!interactive) return;
    const html = document.documentElement, prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => { html.style.overflow = prev; };
  }, [interactive]);

  /* ---------- arrivée ---------- */
  const panelRef = useRef<HTMLElement>(null), captionRef = useRef<HTMLDivElement>(null), cornerRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const els = [panelRef.current, captionRef.current, cornerRef.current];
    if (reduce || !interactive) return;
    const tl = gsap.timeline({defaults:{ease:"expo.out"}, delay:.2})
      // clearProps : une fois arrivé, le panneau rend la main au CSS, qui gère son repli
      .fromTo(els[0], {opacity:0, x:mobile() ? 0 : -24, y:mobile() ? 24 : 0}, {opacity:1, x:0, y:0, duration:1.4, clearProps:"transform,opacity"}, .5)
      .fromTo(els.slice(1), {opacity:0, y:10}, {opacity:1, y:0, duration:1.2, stagger:.08}, 1);
    return () => { tl.kill(); };
  }, []);

  /* ---------- panneau : présentation ---------- */
  const [aboutOpen, setAboutOpen] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);

  /* ---------- onglets ---------- */
  const TABS = [
    {id:"espaces", label:"Espaces", show:spaces.length > 1},
    {id:"capacites", label:"Capacités", show:formats.length > 0},
    {id:"offres", label:"Offres", show:offers.length > 0},
    {id:"infos", label:"Infos", show:true},
    {id:"avis", label:"Avis", show:true},
    {id:"galerie", label:"Galerie", show:gallery.length > 0},
  ].filter(t => t.show);
  const [tab, setTab] = useState<string | null>(null);
  // arrivé depuis une recherche : on ouvre directement les capacités
  const activeTab = tab && TABS.some(t => t.id === tab) ? tab : (filters.format || filters.guests) && TABS.some(t => t.id === "capacites") ? "capacites" : TABS[0]?.id;
  const tabsRef = useRef<HTMLDivElement>(null), bodyRef = useRef<HTMLDivElement>(null);
  const [moreTabs, setMoreTabs] = useState(false);
  const checkMore = () => { const t = tabsRef.current; if (t) setMoreTabs(t.scrollLeft + t.clientWidth < t.scrollWidth - 2); };
  useEffect(() => { checkMore(); addEventListener("resize", checkMore); return () => removeEventListener("resize", checkMore); }, [TABS.length]);
  const openTab = (id: string, btn: HTMLElement) => {
    setTab(id);
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
    btn.scrollIntoView({block:"nearest", inline:"nearest", behavior:"smooth"});
  };

  /* ---------- capacités : la jauge du lieu ---------- */
  const [cap, setCap] = useState<{format: FormatId | null; guests: number}>({format:null, guests:filters.guests || 50});
  const capFormat = cap.format ?? (filters.format && venueCaps[filters.format] ? filters.format : formats[0]?.id ?? null);
  const fits = capFormat ? spaces.filter(s => s.caps[capFormat]).sort((a, b) => a.caps[capFormat]! - b.caps[capFormat]!) : [];

  /* ---------- en événement : la même vue, remplie de monde ---------- */
  const [eventMode, setEventMode] = useState(false);
  const modeRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const m = modeRef.current, on = m?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!m || !on) return;
    m.style.setProperty("--kw", on.offsetWidth + "px");
    m.style.setProperty("--kx", on.offsetLeft + "px");
  }, [eventMode, hasEvent]);

  /* ---------- galerie : visionneuse plein écran (flèches, Échap, glisser sur mobile) ---------- */
  const [lb, setLb] = useState<number | null>(null);
  const [lbShown, setLbShown] = useState<{i: number; out: boolean}>({i:0, out:true});
  const lbBack = useRef<HTMLElement | null>(null), lbClose = useRef<HTMLButtonElement>(null);
  const openLb = (i: number, from: HTMLElement) => { lbBack.current = from; setLb(i); };
  const closeLb = () => { setLb(null); lbBack.current?.focus({preventScroll:true}); };
  const step = (d: number) => setLb(i => i === null ? i : (i + d + gallery.length) % gallery.length);
  useEffect(() => {
    if (lb === null) return;
    lbClose.current?.focus({preventScroll:true});
    // la photo précédente s'efface, la suivante apparaît une fois chargée ; la suivante encore est préchargée
    setLbShown(s => ({...s, out:true}));
    const img = new Image(); let t: ReturnType<typeof setTimeout>;
    img.onload = () => { t = setTimeout(() => setLbShown({i:lb, out:false}), 180); };
    img.src = gallery[lb].src;
    new Image().src = gallery[(lb + 1) % gallery.length].src;
    return () => { img.onload = null; clearTimeout(t); };
  }, [lb]);
  useEffect(() => {
    if (lb === null) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.stopImmediatePropagation(); closeLb(); }
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    addEventListener("keydown", key, true);
    return () => removeEventListener("keydown", key, true);
  }, [lb === null]);
  const touchX = useRef<number | null>(null);

  /* ---------- vue 360° ---------- */
  const [sv, setSv] = useState(false), [svLoaded, setSvLoaded] = useState(false);
  useEffect(() => {
    if (!sv) return;
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setSv(false); };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [sv]);

  /* ---------- musique d'ambiance : jamais en lecture automatique, montée et descente en fondu ---------- */
  const [playing, setPlaying] = useState(false);
  const yt = useRef<{player: any; vol: {v: number}}>({player:null, vol:{v:0}}), ytEl = useRef<HTMLDivElement>(null);
  const toggleMusic = () => setPlaying(x => !x);
  useEffect(() => {
    if (!p.music || !interactive) return;
    const key = (e: KeyboardEvent) => { if ((e.key === "m" || e.key === "M") && !(e.target as Element).closest?.("input")) toggleMusic(); };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [p.music, interactive]);
  useEffect(() => {
    if (!p.music) return;
    const r = yt.current, VOL = 40;
    const fadeTo = (to: number, done?: () => void) => gsap.to(r.vol, {v:to, duration:to ? 2.2 : 1.2, ease:"power1.inOut", overwrite:true,
      onUpdate:() => r.player?.setVolume?.(Math.round(r.vol.v)), onComplete:done});
    if (!r.player) {
      if (!playing) return;
      const w = window as any;
      const ready = new Promise<void>(res => {
        if (w.YT?.Player) return res();
        w.onYouTubeIframeAPIReady = res;
        const tag = document.createElement("script"); tag.src = "https://www.youtube.com/iframe_api"; document.head.appendChild(tag);
      });
      ready.then(() => {
        const host = document.createElement("div"); ytEl.current!.appendChild(host);
        r.player = new w.YT.Player(host, {videoId:p.music, playerVars:{autoplay:1, controls:0, loop:1, playlist:p.music, playsinline:1},
          events:{onReady:(e: any) => { e.target.setVolume(0); e.target.playVideo(); fadeTo(VOL); }}});
      });
      return;
    }
    if (playing) { r.player.playVideo(); fadeTo(VOL); } else fadeTo(0, () => r.player.pauseVideo());
  }, [playing]);
  useEffect(() => () => { yt.current.player?.destroy?.(); }, []);

  /* ---------- rendu ---------- */
  const back = toQuery(filters);
  const allHref = p.allUrl + (back ? (p.allUrl.includes("?") ? "&" : "?") + back : "");
  const currentSpace = spaces.find(s => s.id === current);
  const overlay = lb !== null || sv;   // la visionneuse et la vue 360° passent au-dessus de la navigation du site

  return (
    <div ref={rootRef} className={cx(S.root, !interactive && S.isStatic, eventMode && S.isEvent, !panelOpen && S.panelClosed)}
         style={overlay ? {zIndex:1000} : undefined}>
      <div ref={sceneRef} className={S.scene} aria-label="Visite du lieu" />
      <div className={S.shade} aria-hidden="true" />

      <aside ref={panelRef} className={cx(S.panel, !panelOpen && S.isClosed)} aria-label="Le lieu">
        <button className={S.pClose} type="button" aria-label={panelOpen ? "Replier le panneau" : "Déplier le panneau"} onClick={() => setPanelOpen(o => !o)}>
          <Icon box={14} d='<path d="M9 2 4 7l5 5"/>' />
        </button>
        <div className={S.pHead}>
          <p className={cx(S.caps, S.pPlace)}>{p.place}</p>
          <h1 className={S.pName}>{p.name}</h1>
          <p className={S.pTag}>{p.tagline}</p>
          {p.about && <>
            <div ref={aboutRef} className={S.pAbout} style={{height:aboutOpen ? aboutRef.current?.scrollHeight : 0}}><p>{p.about}</p></div>
            <button className={cx(S.more, S.ul, S.caps)} type="button" aria-expanded={aboutOpen} onClick={() => setAboutOpen(o => !o)}>{aboutOpen ? "Lire moins" : "Lire plus"}</button>
          </>}
          <div className={S.pCaps}>
            {formats.map(f => <span key={f.id} className={cx(S.capi, filters.format === f.id && S.isOn)} title={f.label}><Icon box={30} d={f.icon} />{venueCaps[f.id]}</span>)}
          </div>
        </div>

        <div ref={tabsRef} className={cx(S.tabs, moreTabs && S.isMore)} role="tablist" onScroll={checkMore}>
          {TABS.map(t => <button key={t.id} className={cx(S.tab, S.caps)} type="button" role="tab" aria-selected={t.id === activeTab}
            onClick={e => openTab(t.id, e.currentTarget)}>{t.label}</button>)}
        </div>

        <div ref={bodyRef} className={S.pBody}>
          <div key={activeTab} className={S.pane} role="tabpanel">
            {activeTab === "espaces" && <div className={S.spaces}>{spaces.map(s =>
              <button key={s.id} className={cx(S.space, s.id === current && S.isOn)} type="button" onClick={() => go(s.id)}>
                <div className={S.spaceImg}><img src={s.thumb} alt="" loading="lazy" />{s.event && <img className={S.evt} src={s.event} alt="" loading="lazy" />}</div>
                <p className={S.spaceName}>{s.name}</p><p className={S.spaceCap}>{capsTxt(s.caps)}</p>
              </button>)}</div>}

            {activeTab === "capacites" && <>
              <div className={S.fmts}>{formats.map(f =>
                <button key={f.id} className={S.fmt2} type="button" aria-pressed={f.id === capFormat} onClick={() => setCap(c => ({...c, format:f.id}))}>
                  <Icon box={30} d={f.icon} /><span className={S.caps}>{f.label}</span></button>)}</div>
              <div className={S.guests2}>
                <output>{cap.guests}</output><small>invités</small>
                <input className={S.range} type="range" min={10} max={600} step={10} value={cap.guests} aria-label="Nombre d’invités"
                  style={{"--p":(cap.guests - 10) / 590 * 100 + "%"} as CSSProperties} onChange={e => setCap(c => ({...c, guests:+e.target.value}))} />
              </div>
              <div className={S.fits}>{fits.length ? fits.map(s =>
                <button key={s.id} className={cx(S.fit, s.caps[capFormat!]! < cap.guests && S.isOut)} type="button" onClick={() => go(s.id)}>
                  <span>{s.name}</span><small>jusqu’à {s.caps[capFormat!]} {fmtOf(capFormat)!.unit}</small></button>)
                : <p className={S.emptyNote}>Ce format n’est pas proposé ici.</p>}</div>
            </>}

            {activeTab === "offres" && <>
              {offers.map(g => <div key={g.group} className={S.offerGroup}><h3 className={S.caps}>{g.group}</h3>{g.items.map(o =>
                <div key={o.name} className={S.offer}><div>{o.name}{o.note && <small>{o.note}</small>}</div>
                  <div className={S.price}>{o.ttc} € TTC<small>{o.ht} € HT</small></div></div>)}</div>)}
              <p className={S.legal}>L’abus d’alcool est dangereux pour la santé, à consommer avec modération.</p>
            </>}

            {activeTab === "infos" && (p.address ? <>
              <div className={S.infoBlock}><h3 className={S.caps}>Adresse</h3><p>{p.address}</p>{p.access && <p className={S.soft}>{p.access}</p>}</div>
              {p.contactName && <div className={S.infoBlock}><h3 className={S.caps}>{p.contactRole || "Votre interlocuteur"}</h3><p>{p.contactName}</p>
                <div className={S.infoLinks}>
                  {p.phone && <a href={`tel:${p.phone.replace(/\s/g, "")}`}><Icon d={ICON.phone} />{p.phone}</a>}
                  {p.email && <a href={`mailto:${p.email}`}><Icon d={ICON.mail} />{p.email}</a>}
                </div></div>}
              {(p.siteUrl || p.instagramUrl) && <div className={S.infoBlock}><h3 className={S.caps}>Le lieu en ligne</h3><div className={S.infoLinks}>
                {p.siteUrl && <a href={p.siteUrl} target="_blank" rel="noopener"><Icon d={ICON.link} />{p.siteLabel || p.siteUrl}</a>}
                {p.instagramUrl && <a href={p.instagramUrl} target="_blank" rel="noopener"><Icon d={ICON.insta} />{p.instagramLabel || "Instagram"}</a>}
              </div></div>}
            </> : <p className={S.emptyNote}>Les informations pratiques de {p.name} arrivent bientôt.</p>)}

            {activeTab === "avis" && <p className={S.emptyNote}>Les retours de vos clients, issus des questionnaires de satisfaction, s’afficheront ici, lieu par lieu.</p>}

            {activeTab === "galerie" && <div className={S.gal}>{gallery.map((g, i) =>
              <button key={g.src} type="button" aria-label={`Agrandir : ${g.alt}`} onClick={e => openLb(i, e.currentTarget)}><img src={g.src} alt={g.alt} loading="lazy" /></button>)}</div>}
          </div>
        </div>

        <div className={S.pFoot}>
          <a className={cx(S.go, S.caps)} href={p.quoteUrl}>Demander un devis</a>
          {p.brochureUrl && <a className={cx(S.ul, S.caps)} href={p.brochureUrl} target="_blank" rel="noopener">Plaquette</a>}
        </div>
      </aside>

      <button className={cx(S.reopen, !panelOpen && S.isOn)} type="button" aria-label="Rouvrir le panneau" onClick={() => setPanelOpen(true)}>
        <b>{p.name}</b><Icon box={14} d='<path d="m5 2 5 5-5 5"/>' />
      </button>

      <div ref={captionRef} className={S.caption} aria-live="polite">
        <small className={S.caps}>Vous êtes dans</small><b>{currentSpace?.name}</b><em className={S.caps}>Mise en situation · photo non contractuelle</em>
      </div>
      <div className={cx(S.hint, S.caps, hintOff && S.isOff)}>Glissez pour regarder autour</div>
      {hasEvent && <div ref={modeRef} className={S.mode} role="group" aria-label="Affichage"><span className={S.knob} aria-hidden="true" />
        <button className={S.caps} type="button" aria-pressed={!eventMode} onClick={() => setEventMode(false)}>Lieu vide</button>
        <button className={S.caps} type="button" aria-pressed={eventMode} onClick={() => setEventMode(true)}>En événement</button>
      </div>}
      <div ref={cornerRef} className={S.corner}>
        {p.music && <button className={cx(S.music, playing && S.isPlaying)} type="button" aria-pressed={playing} onClick={toggleMusic}>
          <svg viewBox="0 0 30 12" aria-hidden="true"><g className={S.amp}><path className={S.wave} d="M0 6 Q3 3.5 6 6 T12 6 T18 6 T24 6 T30 6 T36 6 T42 6" /></g></svg>
          <span className={S.caps}>Musique</span></button>}
        {p.streetviewUrl && <button className={cx(S.ul, S.caps, S.svOpen)} type="button" onClick={() => { setSvLoaded(true); setSv(true); }}>Vue 360°</button>}
        <a className={cx(S.ul, S.caps, S.allLink)} href={allHref}>Tous les lieux</a>
      </div>
      <div ref={ytEl} className={S.yt} aria-hidden="true" />

      <div className={cx(S.sv, sv && S.isOn)} aria-hidden={!sv}>
        {svLoaded && <iframe src={p.streetviewUrl} allowFullScreen loading="lazy" title={`Vue 360° de ${p.name}`} />}
        <button className={cx(S.svClose, S.ul, S.caps)} type="button" onClick={() => setSv(false)}>Fermer la vue 360°</button>
      </div>

      {gallery.length > 0 && <div className={cx(S.lb, lb !== null && S.isOn)} role="dialog" aria-modal="true" aria-label="Galerie"
          onClick={e => { if (e.target === e.currentTarget) closeLb(); }}
          onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={e => { if (touchX.current === null) return; const dx = e.changedTouches[0].clientX - touchX.current; touchX.current = null; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); }}>
        <div className={S.lbBar}><span className={S.caps}>{lb !== null && `${lb + 1} / ${gallery.length}`}</span>
          <button ref={lbClose} className={cx(S.lbClose, S.ul, S.caps)} type="button" onClick={closeLb}>Fermer</button></div>
        <img className={cx(S.lbImg, lbShown.out && S.isOut)} src={gallery[lbShown.i]?.src} alt={gallery[lbShown.i]?.alt} />
        <button className={cx(S.lbNav, S.lbPrev)} type="button" aria-label="Photo précédente" onClick={() => step(-1)}><Icon box={22} d='<path d="M14 3 6 11l8 8"/>' /></button>
        <button className={cx(S.lbNav, S.lbNext)} type="button" aria-label="Photo suivante" onClick={() => step(1)}><Icon box={22} d='<path d="m8 3 8 8-8 8"/>' /></button>
        <p className={S.lbCap}>{lb !== null && gallery[lb].alt}</p>
      </div>}
    </div>
  );
}
