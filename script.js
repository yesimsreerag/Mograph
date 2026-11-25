/* =====================================================
   EDIT YOUR WORKS HERE
   - thumb : image shown in the grid  (e.g. "images/squirrel.jpg")
   - src   : video (.mp4) or image opened on click (e.g. "videos/reel1.mp4")
   - size  : "" (normal) | "tall" | "wide"
   - a / b : fallback gradient colours while you have no thumbnail
   Add, remove or reorder lines freely.
   ===================================================== */
const works = [
  { title:"Nissan",     thumb:"LINKS/WORKS/Thumbnails/NISSAN.png", src:"LINKS/WORKS/NISSAN.MP4", size:"wide", a:"#2d6a1f", b:"#0c2a08" },
  { title:"Night Sky",    thumb:"WORKS/THUMPNAILS/THUMP-KineticTypography.png", src:"WORKS/KINETIC TYPOGRAPHY.mp4", size:"",     a:"#3b2a4a", b:"#0b0b16" },
  { title:"Factory",      thumb:"", src:"", size:"",     a:"#6b5a44", b:"#1d1812" },
  { title:"Mahindra",   thumb:"LINKS/WORKS/Thumbnails/Mahindra.png", src:"LINKS/WORKS/Mahindra.MP4", size:"tall", a:"#555",    b:"#222"    },
  { title:"Cityscape",    thumb:"", src:"", size:"",     a:"#1f2f4a", b:"#0a1020" },
  { title:"Cup",          thumb:"", src:"", size:"",     a:"#c9ced6", b:"#3a3d44" },
  { title:"Studio",       thumb:"", src:"", size:"",     a:"#3a2d28", b:"#120e0c" },
  { title:"Portrait II",  thumb:"", src:"", size:"tall", a:"#8a6a5a", b:"#2a1c16" },
  { title:"Water",        thumb:"", src:"", size:"",     a:"#2a5c8a", b:"#0d2238" },
  { title:"Neon Desk",    thumb:"", src:"", size:"",     a:"#6a3fd1", b:"#1c0f3d" },
  { title:"Warm Light",   thumb:"", src:"", size:"",     a:"#7a4a2a", b:"#1c1008" },
  { title:"Friends",      thumb:"", src:"", size:"wide", a:"#8a6f3a", b:"#241a0a" },
  { title:"Forest",       thumb:"", src:"", size:"",     a:"#2f5a2a", b:"#0c1a0a" },
  { title:"Frame",        thumb:"", src:"", size:"",     a:"#444",    b:"#111"    }
];
/* ===================================================== */

const $ = s => document.querySelector(s);
let lenis;
const grid = $("#grid"), wrap = $("#gridWrap"), more = $("#seeMore");

// Build the grid
works.forEach(w => {
  const t = document.createElement("button");
  t.className = "tile " + (w.size || "");
  t.style.setProperty("--a", w.a); t.style.setProperty("--b", w.b);
  t.setAttribute("aria-label", "Open " + w.title);
  t.innerHTML = (w.thumb ? `<img src="${w.thumb}" alt="${w.title}" loading="lazy">` : "") + `<span class="play"></span>`;
  t.addEventListener("click", () => openViewer(w));
  grid.appendChild(t);
});

// Tiles reveal as they scroll in
const io = new IntersectionObserver(es => es.forEach((e, i) => {
  if (e.isIntersecting) { setTimeout(() => e.target.classList.add("show"), (i % 4) * 90); io.unobserve(e.target); }
}), { threshold: .1 });
document.querySelectorAll(".tile").forEach(t => io.observe(t));

// See more / less
more.addEventListener("click", () => {
  const open = !wrap.classList.contains("open");
  wrap.style.setProperty("--full", grid.scrollHeight + "px");
  wrap.classList.toggle("open", open);
  more.setAttribute("aria-expanded", open);
  more.querySelector("span").textContent = open ? "See Less" : "See More";
  document.querySelectorAll(".tile").forEach(t => t.classList.add("show"));
});

// Viewer (click a tile)
const viewer = $("#viewer"), body = $("#viewerBody");
function openViewer(w) {
  if (!w.src) body.innerHTML = `<p>Add your video or image path for “${w.title}” in script.js (the <b>src</b> field).</p>`;
  else if (/\.(mp4|webm|mov)$/i.test(w.src)) body.innerHTML = `<video src="${w.src}" controls autoplay playsinline></video>`;
  else body.innerHTML = `<img src="${w.src}" alt="${w.title}">`;
  viewer.showModal();
}
const closeViewer = () => { viewer.close(); body.innerHTML = ""; };
$("#closeViewer").addEventListener("click", closeViewer);
viewer.addEventListener("click", e => { if (e.target === viewer) closeViewer(); });
viewer.addEventListener("close", () => body.innerHTML = "");

// Glass buttons: light follows the pointer
document.querySelectorAll(".glass").forEach(el => el.addEventListener("pointermove", e => {
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", (e.clientX - r.left) + "px");
  el.style.setProperty("--my", (e.clientY - r.top) + "px");
}));

// Nav turns to glass after scrolling
const nav = $("#nav");
const onScroll = () => nav.classList.toggle("scrolled", scrollY > 40);
addEventListener("scroll", onScroll, { passive: true }); onScroll();

// Smooth scrolling (Apple-style inertia) + gentle hero image parallax
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (window.Lenis && !reduce) {
  lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
  const img = document.querySelector(".hero-img img");
  lenis.on("scroll", ({ scroll }) => { if (img && scroll < innerHeight) img.style.transform = `translateY(${scroll * .08}px) scale(1.06)`; });
  const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
}

// Let's Connect popup: tap the button to open, tap anywhere outside the glass bar to close
const connect = $("#connect"), connectBtn = $("#connectBtn");
function openConnect() {
  connect.showModal();
  connectBtn.setAttribute("aria-expanded", "true");
  document.documentElement.style.overflow = "hidden";
  if (lenis) lenis.stop();
}
function closeConnect() {
  if (!connect.open || connect.classList.contains("closing")) return;
  connect.classList.add("closing");
  setTimeout(() => {
    connect.close(); connect.classList.remove("closing");
    connectBtn.setAttribute("aria-expanded", "false");
    document.documentElement.style.overflow = "";
    if (lenis) lenis.start();
  }, reduce ? 0 : 240);
}
connectBtn.addEventListener("click", openConnect);
connect.addEventListener("click", e => { if (!e.target.closest(".panel") || e.target.closest(".app")) closeConnect(); });
connect.addEventListener("cancel", e => { e.preventDefault(); closeConnect(); });
