"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import catalog from "@/gallery.json";
import { translateKeywords } from "./keywords";

const collections = [
  { name: "春季", english: "Spring", original: "春", tone: "spring", number: "01" },
  { name: "夏季", english: "Summer", original: "夏", tone: "summer", number: "02" },
  { name: "秋季", english: "Autumn", original: "秋", tone: "autumn", number: "03" },
  { name: "冬季", english: "Winter", original: "冬", tone: "winter", number: "04" },
  { name: "内衣", english: "Lingerie", original: "ランジェリー", tone: "lingerie", number: "05" },
  { name: "派对", english: "Party", original: "パーティ", tone: "party", number: "06" },
  { name: "泳装", english: "Swimwear", original: "水着", tone: "swimwear", number: "07" },
  { name: "性感", english: "Statement", original: "セクシー", tone: "statement", number: "08" },
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
      const chinese = translateKeywords(entry.キーワード);
      return terms.every((term) =>
        entry.id.toLowerCase().includes(term) ||
        entry.カテゴリ.includes(term) ||
        collection.name.includes(term) ||
        collection.english.toLowerCase().startsWith(term) ||
        chinese.includes(term) ||
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
      <a className="skip-link" href="#catalog">跳转到服装图库</a>
      <header className="site-header">
        <a className="brand" href="./" aria-label="衣装灵感库首页">
          <span className="brand-mark" aria-hidden="true">C<span>i</span></span>
          <span>衣装灵感库<span className="brand-sub">AI 服装参考图库</span></span>
        </a>
        <a className="source-link" href={catalog.source} target="_blank" rel="noreferrer">
          原始图库 <Arrow />
        </a>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span /> 衣装参考特辑 / 第 01 辑</p>
            <h1 id="hero-title">一间衣橱，<br /><em>无限灵感。</em></h1>
            <p className="intro">从日常叠穿到个性造型，探索 AI 生成的服装参考。在色彩、材质与细节之间，找到点亮下一次创作的灵感。</p>
            <a className="browse-link" href="#catalog">探索服装分类 <span aria-hidden="true">↓</span></a>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-grid" />
            <div className="art-caption">让灵感，有迹可循</div>
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
            <span className="art-label">探索廓形<br />感受质地</span>
            <span className="art-number">001 / ∞</span>
          </div>
        </section>

        <section className="catalog" id="catalog" aria-labelledby="catalog-title">
          <div className="section-heading">
            <div><p className="eyebrow">全部服装参考</p><h2 id="catalog-title">寻找你的穿搭灵感。</h2></div>
            <p className="collection-total"><strong>{catalog.entries.length.toLocaleString("zh-CN")}</strong> 套服装 <span>/</span> 8 大分类</p>
          </div>
          <div className="filters">
            <div className="categories" role="group" aria-label="按服装分类筛选">
              <button className={!category ? "active" : ""} aria-pressed={!category} onClick={() => { setCategory(""); setLimit(PAGE_SIZE); }}>全部服装 <span>{catalog.entries.length}</span></button>
              {collections.map((item) => (
                <button key={item.original} className={category === item.original ? "active" : ""} aria-pressed={category === item.original} onClick={() => { setCategory(item.original); setLimit(PAGE_SIZE); }}>
                  {item.name} <span>{catalog.metadata.counts[item.original as keyof typeof catalog.metadata.counts]}</span>
                </button>
              ))}
            </div>
            <div className="search-row">
              <label className="search">
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>
                <input type="search" aria-label="搜索服装" placeholder="搜索颜色、服饰或编号，如：白色、denim…" value={query} onChange={(event) => { setQuery(event.target.value); setLimit(PAGE_SIZE); }} />
              </label>
              <p className="result-count" role="status">找到 {filtered.length.toLocaleString("zh-CN")} 套服装</p>
            </div>
          </div>
          <p className="source-notice">点击服装查看细节。全分辨率 PNG 原图由<a href={catalog.source} target="_blank" rel="noreferrer">原始图库 <Arrow /></a>提供。</p>

          <div className="outfit-grid">
            {filtered.slice(0, limit).map((entry) => {
              const collection = collections.find((item) => item.original === entry.カテゴリ)!;
              return (
                <article className={`outfit-card ${collection.tone}`} key={entry.id}>
                  <button className="thumbnail" onClick={() => open(entry)} aria-label={`预览 ${entry.id}`}>
                    <Image src={`${basePath}/${entry.サムネ}`} alt={`${collection.name}服装：${translateKeywords(entry.キーワード)}`} width={320} height={480} />
                    <span className="preview-label">查看服装 <Arrow /></span>
                  </button>
                  <div className="card-content">
                  <div className="card-top"><span className="collection-tag">{collection.name}</span><span className="collection-number">{collection.number}</span></div>
                  <p className="outfit-id">{entry.id}</p>
                  <h3>{translateKeywords(entry.キーワード)}</h3>
                  <div className="card-links">
                    <button onClick={() => open(entry)} aria-label={`查看 ${entry.id}`}>查看服装 <Arrow /></button>
                    <a className="png-link" href={new URL(entry.原寸, catalog.source).href} target="_blank" rel="noreferrer" aria-label={`打开 ${entry.id} 的 PNG 原图`}>PNG 原图 <Arrow /></a>
                  </div>
                  </div>
                </article>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="empty"><p className="eyebrow">换个思路，发现更多</p><h3>没有找到匹配的服装。</h3><p>试试其他颜色、服饰关键词或分类。</p><button onClick={reset}>清除所有筛选</button></div>
          )}
          {filtered.length > limit && (
            <div className="load-more"><p>已显示 {Math.min(limit, filtered.length)} 套，共 {filtered.length.toLocaleString("zh-CN")} 套</p><button onClick={() => setLimit((value) => value + PAGE_SIZE)}>发现更多 <span aria-hidden="true">+</span></button></div>
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
              <Image key={selected.id} src={`${basePath}/${selected.画像}`} alt={translateKeywords(selected.キーワード)} width={800} height={1200} />
            </div>
            <div className="preview-details">
              <button className="close-preview" aria-label="关闭预览" onClick={() => dialog.current?.close()}>×</button>
              <p className="eyebrow">{collections.find((item) => item.original === selected.カテゴリ)?.name}系列</p>
              <h2 id="preview-title">{selected.id}</h2>
              <p className="preview-description">{translateKeywords(selected.キーワード)}</p>
              <a className="original-png" href={new URL(selected.原寸, catalog.source).href} target="_blank" rel="noreferrer">打开全分辨率 PNG 原图 <Arrow /></a>
              <p className="download-note">将在新标签页打开原始图库中的 PNG 图片，可通过浏览器保存。</p>
              <div className="preview-navigation">
                <button aria-label="上一套服装" disabled={filtered[0]?.id === selected.id} onClick={() => step(-1)}>← 上一套</button>
                <button aria-label="下一套服装" disabled={filtered.at(-1)?.id === selected.id} onClick={() => step(1)}>下一套 →</button>
              </div>
              <p className="download-note">使用左右方向键切换，按 Esc 键关闭预览。</p>
            </div>
          </div>
        )}
      </dialog>
      <footer>
        <div><span className="footer-title">衣装灵感库</span><p>一点参考，无限可能。</p></div>
        <p>原作：<a href="https://x.com/giaaibusi" target="_blank" rel="noreferrer">ギア <Arrow /></a><br /><a href={catalog.source} target="_blank" rel="noreferrer">原始图库与使用条款 <Arrow /></a></p>
        <p className="footer-note">服装均由 AI 生成，非实物商品。<br />图片版权归创作者所有。</p>
      </footer>
    </>
  );
}
