"use client";

import { useEffect } from "react";

/*
  Scroll'ga bog'langan (scrub) animatsiya. Kutubxonasiz.

  [data-scene="pin"]  sticky sahna: progress 0..1 sahna ekranga kirishidan boshlanadi.
  [data-scene="top"]  hero: progress = qancha scroll qilingani (parallaks uchun).
  Element atributlari (hammasi ixtiyoriy):
    data-a / data-b  animatsiya boshlanish va tugash nuqtasi (sahna progressida)
    data-x, data-y   boshlang'ich siljish (px), data-yp: % da
    data-s           boshlang'ich scale, data-rx: boshlang'ich rotateX (deg)
    data-o           boshlang'ich opacity
    data-ease="back" kichik sakrash bilan
    data-out         chiqish: yuqoriga ketib yo'qoladi
    data-par         hero ichida parallaks tezligi
  Har bir elementga --t (0..1), sahnaga --p (0..1) yoziladi, CSS ham ishlatishi mumkin.
*/

// Barcha diapazonlarni siqadi: animatsiya sahnaning birinchi ~60% ida tugaydi.
const SPEED = 0.62;
const SMOOTH = 0.22;

type Item = {
  n: HTMLElement;
  a: number;
  b: number;
  x: number;
  y: number;
  yp: number | null;
  s: number;
  rx: number;
  o: number | null;
  back: boolean;
  out: boolean;
};
type Scene = { el: HTMLElement; mode: string; dark: boolean; sp: number; last: number; items: Item[] };

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeBack = (t: number) => 1 + 2.7 * Math.pow(t - 1, 3) + 1.7 * Math.pow(t - 1, 2);

function parse(n: HTMLElement): Item {
  const d = n.dataset;
  const num = (v: string | undefined, f: number) => (v === undefined ? f : Number(v));
  return {
    n,
    a: num(d.a, 0) * SPEED,
    b: num(d.b, 1) * SPEED,
    x: num(d.x, 0),
    y: num(d.y, 0),
    yp: d.yp === undefined ? null : Number(d.yp),
    s: num(d.s, 1),
    rx: num(d.rx, 0),
    o: d.o === undefined ? null : Number(d.o),
    back: d.ease === "back",
    out: "out" in d,
  };
}

function progress(s: Scene) {
  const r = s.el.getBoundingClientRect();
  if (s.mode === "top") return clamp(-r.top / r.height);
  const vh = window.innerHeight;
  const start = vh * 0.92; // sahna ekranga kirishi bilan boshlanadi
  return clamp((start - r.top) / (r.height - vh + start));
}

function apply(s: Scene) {
  const p = s.sp;
  s.el.style.setProperty("--p", p.toFixed(4));
  for (const it of s.items) {
    const raw = clamp((p - it.a) / (it.b - it.a));
    if (it.out) {
      const e = easeOut(raw);
      it.n.style.transform = `translateY(${-80 * e}px)`;
      it.n.style.opacity = String(1 - e);
      continue;
    }
    const t = clamp((it.back ? easeBack : easeOut)(raw));
    const k = 1 - t;
    it.n.style.setProperty("--t", t.toFixed(3));
    const tf: string[] = [];
    if (it.x) tf.push(`translateX(${it.x * k}px)`);
    if (it.yp !== null) tf.push(`translateY(${it.yp * k}%)`);
    else if (it.y) tf.push(`translateY(${it.y * k}px)`);
    if (it.rx) tf.push(`rotateX(${it.rx * k}deg)`);
    if (it.s !== 1) tf.push(`scale(${lerp(it.s, 1, (it.back ? easeBack : easeOut)(raw))})`);
    if (tf.length) it.n.style.transform = tf.join(" ");
    if (it.o !== null) it.n.style.opacity = String(clamp(lerp(it.o, 1, clamp(raw * 1.4))));
  }
}

export function ScrollEngine() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nav = document.getElementById("site-nav");
    const hero = document.getElementById("hero");
    const go = requestAnimationFrame(() => hero?.classList.add("go"));

    const scenes: Scene[] = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]")).map(
      (el) => ({
        el,
        mode: el.dataset.scene ?? "pin",
        dark: "dark" in el.dataset,
        sp: 0,
        last: -1,
        items: Array.from(el.querySelectorAll<HTMLElement>("[data-a]")).map(parse),
      }),
    );
    const pars = Array.from(document.querySelectorAll<HTMLElement>("[data-par]"));

    if (reduce) {
      for (const s of scenes) {
        s.sp = 1;
        apply(s);
      }
      return () => cancelAnimationFrame(go);
    }

    let raf = 0;
    const loop = () => {
      let dark = false;
      for (const s of scenes) {
        const target = progress(s);
        s.sp += (target - s.sp) * SMOOTH;
        if (Math.abs(target - s.sp) < 0.0004) s.sp = target;
        if (s.sp !== s.last) {
          apply(s);
          s.last = s.sp;
        }
        if (s.dark) {
          const r = s.el.getBoundingClientRect();
          if (r.top < 60 && r.bottom > 60) dark = true;
        }
      }
      const hp = scenes[0]?.mode === "top" ? scenes[0].sp : 0;
      for (const e of pars) e.style.translate = `0 ${-hp * Number(e.dataset.par) * 2}px`;
      nav?.classList.toggle("dk", dark);
      nav?.classList.toggle("sc", window.scrollY > 40);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(go);
    };
  }, []);

  return null;
}
