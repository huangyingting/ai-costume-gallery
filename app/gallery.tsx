"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import catalog from "@/gallery.json";

const collections = [
  { name: "Spring", original: "春", tone: "spring", number: "01" },
  { name: "Summer", original: "夏", tone: "summer", number: "02" },
  { name: "Autumn", original: "秋", tone: "autumn", number: "03" },
  { name: "Winter", original: "冬", tone: "winter", number: "04" },
  { name: "Lingerie", original: "ランジェリー", tone: "lingerie", number: "05" },
  { name: "Party", original: "パーティ", tone: "party", number: "06" },
  { name: "Swimwear", original: "水着", tone: "swimwear", number: "07" },
  { name: "Statement", original: "セクシー", tone: "statement", number: "08" },
];
const aliases: Record<string, string> = {
  白: "white", 黒: "black", 赤: "red", 青: "blue", 緑: "green",
  黄: "yellow", ピンク: "pink", ベージュ: "beige", アイボリー: "ivory",
  ドレス: "dress", ワンピース: "dress", スカート: "skirt",
  ジャケット: "jacket", コート: "coat", ニット: "knit", レース: "lace",
  デニム: "denim", リボン: "ribbon", ブーツ: "boots", バッグ: "bag",
};
const PAGE_SIZE = 48;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
type Outfit = (typeof catalog.entries)[number];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Gallery() {
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<Outfit | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const filtered = useMemo(() => {
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return catalog.entries.filter((entry) => {
      if (category && entry.カテゴリ !== category) return false;
      const collection = collections.find((item) => item.original === entry.カテゴリ)!;
      const keywords = entry.キーワード.split(" ");
      return terms.every((term) =>
        entry.id.toLowerCase().includes(term) ||
        entry.カテゴリ.includes(term) ||
        collection.name.toLowerCase().startsWith(term) ||
        keywords.some((keyword) => keyword.startsWith(aliases[term] || term)),
      );
    });
  }, [category, query]);

  useEffect(() => {
    if (!selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [selected]);

  function open(outfit: Outfit) {
    setSelected(outfit);
    dialog.current?.showModal();
  }

  function step(direction: number) {
    const index = filtered.findIndex((entry) => entry.id === selected?.id);
    const next = filtered[index + direction];
    if (next) setSelected(next);
  }

  function reset() {
    setCategory("");
    setQuery("");
    setLimit(PAGE_SIZE);
  }

  return (
    <>
      <a className="skip-link" href="#catalog">Skip to catalog</a>
      <header className="site-header">
        <a className="brand" href="./" aria-label="Costume Index home">
          <span className="brand-mark" aria-hidden="true">C<span>i</span></span>
          <span>COSTUME INDEX<span className="brand-sub">AN OUTFIT REFERENCE LIBRARY</span></span>
        </a>
        <a className="source-link" href={catalog.source} target="_blank" rel="noreferrer">
          Original gallery <Arrow />
        </a>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span /> THE REFERENCE EDIT / VOL. 01</p>
            <h1 id="hero-title">A wardrobe of<br /><em>possibilities.</em></h1>
            <p className="intro">Find the details that define your next idea. Explore a curated index of AI-generated outfits, from everyday layers to statement pieces.</p>
            <a className="browse-link" href="#catalog">Explore the collections <span aria-hidden="true">↓</span></a>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-grid" />
            <div className="art-caption">THE SHAPE OF AN IDEA</div>
            <svg className="outfit" viewBox="0 0 360 400" fill="none">
              <path d="m140 62 40 20 40-20 62 46-31 70-32-14 17 102H124l17-102-32 14-31-70 62-46Z" fill="#ede3d2" stroke="#584f42" strokeWidth="1.5" />
              <path d="m140 62 40 20-23 45-25-38m88-27-40 20 23 45 25-38M180 83v181m-52-43h105" stroke="#8a7c69" strokeWidth="1.5" />
              <path d="M124 277h112l33 89H91l33-89Z" fill="#68796b" stroke="#3b5140" strokeWidth="1.5" />
              <path d="m146 279-10 85m29-85-3 85m32-85 4 85m16-85 12 85" stroke="#c0c6b8" />
              <circle cx="187" cy="155" r="2" fill="#584f42" /><circle cx="187" cy="186" r="2" fill="#584f42" />
              <path d="M275 233h41v53h-41zm8 0v-12a12 12 0 0 1 24 0v12" stroke="#584f42" strokeWidth="2" />
              <path d="M43 319h27v39H43z" fill="#ede3d2" stroke="#584f42" />
              <path d="M43 357h29l8 13H40l3-13Z" fill="#584f42" />
            </svg>
            <span className="art-label">A STUDY IN<br />FORM &amp; TEXTURE</span>
            <span className="art-number">001 / ∞</span>
          </div>
        </section>

        <section className="catalog" id="catalog" aria-labelledby="catalog-title">
          <div className="section-heading">
            <div><p className="eyebrow">THE COMPLETE INDEX</p><h2 id="catalog-title">Find your inspiration.</h2></div>
            <p className="collection-total"><strong>{catalog.entries.length.toLocaleString("en-US")}</strong> references <span>/</span> 8 collections</p>
          </div>
          <div className="filters">
            <div className="categories" role="group" aria-label="Filter by collection">
              <button className={!category ? "active" : ""} aria-pressed={!category} onClick={() => { setCategory(""); setLimit(PAGE_SIZE); }}>All outfits <span>{catalog.entries.length}</span></button>
              {collections.map((item) => (
                <button key={item.original} className={category === item.original ? "active" : ""} aria-pressed={category === item.original} onClick={() => { setCategory(item.original); setLimit(PAGE_SIZE); }}>
                  {item.name} <span>{catalog.metadata.counts[item.original as keyof typeof catalog.metadata.counts]}</span>
                </button>
              ))}
            </div>
            <div className="search-row">
              <label className="search">
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>
                <input type="search" aria-label="Search outfits" placeholder="Search a color, garment, or outfit ID…" value={query} onChange={(event) => { setQuery(event.target.value); setLimit(PAGE_SIZE); }} />
              </label>
              <p className="result-count" role="status">{filtered.length.toLocaleString("en-US")} {filtered.length === 1 ? "reference" : "references"} found</p>
            </div>
          </div>
          <p className="source-notice">Select an outfit to explore the details. Full-resolution PNGs are available from the <a href={catalog.source} target="_blank" rel="noreferrer">original gallery <Arrow /></a>.</p>

          <div className="outfit-grid">
            {filtered.slice(0, limit).map((entry) => {
              const collection = collections.find((item) => item.original === entry.カテゴリ)!;
              return (
                <article className={`outfit-card ${collection.tone}`} key={entry.id}>
                  <button className="thumbnail" onClick={() => open(entry)} aria-label={`Preview ${entry.id}`}>
                    <Image src={`${basePath}/${entry.サムネ}`} alt={`${collection.name} outfit: ${entry.キーワード}`} width={320} height={480} />
                    <span className="preview-label">Explore outfit <Arrow /></span>
                  </button>
                  <div className="card-content">
                  <div className="card-top"><span className="collection-tag">{collection.name} <span lang="ja">{entry.カテゴリ}</span></span><span className="collection-number">{collection.number}</span></div>
                  <p className="outfit-id">{entry.id}</p>
                  <h3>{entry.キーワード}</h3>
                  <div className="card-links">
                    <button onClick={() => open(entry)} aria-label={`View ${entry.id}`}>View outfit <Arrow /></button>
                    <a className="png-link" href={new URL(entry.原寸, catalog.source).href} target="_blank" rel="noreferrer" aria-label={`Open original PNG for ${entry.id}`}>PNG <Arrow /></a>
                  </div>
                  </div>
                </article>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="empty"><p className="eyebrow">A CLEAN SLATE</p><h3>No matching outfits.</h3><p>Try a different color, garment, or collection.</p><button onClick={reset}>Clear all filters</button></div>
          )}
          {filtered.length > limit && (
            <div className="load-more"><p>Showing {Math.min(limit, filtered.length)} of {filtered.length.toLocaleString("en-US")} references</p><button onClick={() => setLimit((value) => value + PAGE_SIZE)}>Discover more <span aria-hidden="true">+</span></button></div>
          )}
        </section>
      </main>
      <dialog ref={dialog} className="preview-dialog" aria-labelledby="preview-title" onClose={() => setSelected(null)} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }} onKeyDown={(event) => {
        if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
        if (event.key === "ArrowRight") { event.preventDefault(); step(1); }
      }}>
        {selected && (
          <div className="preview-layout">
            <div className="preview-image">
              <Image key={selected.id} src={`${basePath}/${selected.画像}`} alt={selected.キーワード} width={800} height={1200} />
            </div>
            <div className="preview-details">
              <button className="close-preview" aria-label="Close preview" onClick={() => dialog.current?.close()}>×</button>
              <p className="eyebrow">{collections.find((item) => item.original === selected.カテゴリ)?.name} COLLECTION</p>
              <h2 id="preview-title">{selected.id}</h2>
              <p className="preview-description">{selected.キーワード}</p>
              <a className="original-png" href={new URL(selected.原寸, catalog.source).href} target="_blank" rel="noreferrer">Open full-resolution PNG <Arrow /></a>
              <p className="download-note">Opens the original PNG on the source gallery. Save the image from your browser.</p>
              <div className="preview-navigation">
                <button aria-label="Previous outfit" disabled={filtered[0]?.id === selected.id} onClick={() => step(-1)}>← Previous</button>
                <button aria-label="Next outfit" disabled={filtered.at(-1)?.id === selected.id} onClick={() => step(1)}>Next →</button>
              </div>
              <p className="download-note">Use arrow keys to browse. Press Escape to close.</p>
            </div>
          </div>
        )}
      </dialog>
      <footer>
        <div><span className="footer-title">Costume Index</span><p>A little reference. A lot of possibility.</p></div>
        <p>Original artwork by <a href="https://x.com/giaaibusi" target="_blank" rel="noreferrer">ギア <Arrow /></a><br /><a href={catalog.source} target="_blank" rel="noreferrer">Source gallery &amp; usage terms <Arrow /></a></p>
        <p className="footer-note">AI-generated, fictional outfits.<br />Artwork rights remain with the creator.</p>
      </footer>
    </>
  );
}
