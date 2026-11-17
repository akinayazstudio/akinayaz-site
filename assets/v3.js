/* akinayaz.com — v3: karanlık giriş, beyaz katalog */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var ALL = window.WORKS || [], GROUPS = window.GROUPS || {}, RATIO = window.RATIO || {};
  var byId = {}; ALL.forEach(function (w) { byId[w.id] = w; });
  var CURRENT = Object.keys(GROUPS).filter(function (k) { return GROUPS[k].current; }).map(Number);
  var WORKS = ALL.filter(function (w) { return w.section === "works"; });
  var PROJ = ALL.filter(function (w) { return w.section === "projects"; });
  var PHOTO = ALL.filter(function (w) { return w.section === "photo"; });
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  var T = {
    tr: {
      resim: "Resim", arsiv: "Arşiv", fotograf: "Fotoğraf", projeler: "Projeler", atolye: "Atölye", sergiler: "Sergiler", hakkinda: "Hakkında",
      about: "Hakkında", studio: "Atölye", statement: "Sanatçı beyanı", cv: "Özgeçmiş", contact: "İletişim", education: "Eğitim",
      s_solo: "Kişisel sergi", s_group: "Seçili karma sergiler", s_res: "Rezidans ve sanatçı programları",
      scroll: "Kaydır", close: "Kapat", prev: "Önceki", next: "Sonraki", grid: "Görsel", list: "Liste", untitled: "İsimsiz",
      studio_cap: "Atölye, Eskişehir", studio_note: "Eskişehir'deki atölye. Resimler, heykeller ve videolar burada başlıyor.",
      arsiv_note: "Bugüne gelirken: deformasyondan bulanıklığa geçiş, baskı denemeleri ve önceki dönem işler, tekniğe göre.",
      fotograf_note: "Yıllardır çektiğim fotoğraflar bir arşive dönüştü: buzlu camın, perdenin, karşı ışığın ardında kaybolan figürler, gündelik nesnelerin gözden kaçan ayrıntıları. Hem kendi başına bir üretim alanı hem de resimlerimin doğrudan kaynağı.",
      projeler_note: "Mekâna özgü yerleştirmeler, video işleri ve Co-Operative Art kolektifiyle yapılanlar.",
      sergiler_note: "Kişisel ve karma sergiler, rezidans ve sanatçı programları.",
      intro_k: "Son dönem resimler, 2026", intro_q: "Bir imge ne kadar silinir, örtülür ya da uzaklaştırılırsa hâlâ tanınır? Tanımanın bittiği, tekinsizliğin başladığı eşik nerede?",
      intro_m: "Tek renkli sprey boya ve toz pastel; perde, pencere gölgesi, figür.", intro_more: "Süren araştırma →",
      sub_install: "Mekâna özgü yerleştirmeler", sub_video: "Video işleri", sub_collective: "Kolektif", sub_proposal: "Öneriler", sub_text: "Metin ve ses",
      year: "Yıl", tech: "Teknik", size: "Ölçü", place: "Yer", other: "Diğer", photos: "fotoğraf", works: "iş", video: "Video",
      next_sec: "Sonraki bölüm"
    },
    en: {
      resim: "Painting", arsiv: "Archive", fotograf: "Photography", projeler: "Projects", atolye: "Studio", sergiler: "Exhibitions", hakkinda: "About",
      about: "About", studio: "Studio", statement: "Artist statement", cv: "CV", contact: "Contact", education: "Education",
      s_solo: "Solo exhibition", s_group: "Selected group exhibitions", s_res: "Residencies and artist programmes",
      scroll: "Scroll", close: "Close", prev: "Previous", next: "Next", grid: "Images", list: "List", untitled: "Untitled",
      studio_cap: "Studio, Eskişehir", studio_note: "The studio in Eskişehir. Paintings, sculptures and videos begin here.",
      arsiv_note: "On the way here: the shift from deformation to blur, print trials and earlier work, grouped by technique.",
      fotograf_note: "Over the years my photographs have become an archive: figures vanishing behind frosted glass, curtains and backlight, overlooked details of everyday objects. It is a field of work in its own right and a direct source for my paintings.",
      projeler_note: "Site-specific installations, video works, and work made with the Co-Operative Art collective.",
      sergiler_note: "Solo and group exhibitions, residencies and artist programmes.",
      intro_k: "Recent paintings, 2026", intro_q: "How far can an image be erased, veiled or pushed away and still be recognised? Where is the threshold at which recognition ends and the uncanny begins?",
      intro_m: "Monochrome spray paint and soft pastel; curtain, window shadow, figure.", intro_more: "Ongoing research →",
      sub_install: "Site-specific installations", sub_video: "Video works", sub_collective: "Collective", sub_proposal: "Proposals", sub_text: "Text & sound",
      year: "Year", tech: "Medium", size: "Size", place: "Place", other: "Other", photos: "photographs", works: "works", video: "Video",
      next_sec: "Next section"
    }
  };
  var lang = "tr";
  try { lang = localStorage.getItem("lang") || (/^tr/i.test(navigator.language || "tr") ? "tr" : "en"); } catch (e) {}
  if (!T[lang]) lang = "tr";
  function t(k) { return T[lang][k] || T.tr[k] || k; }
  function title(w) { return (lang === "en" && w.en) || w.title || t("untitled"); }
  function medium(w) { return w.medium ? (w.medium[lang] || w.medium.tr) : ""; }
  function tx(o) { return o ? (o[lang] || o.tr) : ""; }
  function src(n) { return "assets/w/" + n + ".jpg"; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function yrange(list) {
    var ys = list.map(function (w) { return +String(w.year).slice(0, 4); }).filter(Boolean);
    if (!ys.length) return "";
    var a = Math.min.apply(null, ys), b = Math.max.apply(null, ys); return a === b ? String(a) : a + "–" + b;
  }

  var ROUTES = ["resim", "arsiv", "fotograf", "projeler", "atolye", "sergiler", "hakkinda"];

  /* ---------- üst menü ---------- */
  function renderNav() {
    $("#nav").innerHTML = ROUTES.map(function (r) { return '<a href="#' + r + '" data-r="' + r + '">' + esc(t(r)) + "</a>"; }).join("");
  }
  $("#menu-btn").addEventListener("click", function () { document.body.classList.toggle("menu-open"); });

  /* ---------- giriş sahneleri ---------- */
  var NOW = []; CURRENT.forEach(function (g) { NOW = NOW.concat(WORKS.filter(function (w) { return w.grp === g; })); });
  var homeItems = [{ src: "assets/w/atolye-1.jpg", bw: true, studio: true }].concat(NOW.slice(0, 6).map(function (w) { return { src: src(w.img[0]), w: w }; }));
  var stage = $("#stage"), scenes = homeItems.map(function (it) {
    var d = document.createElement("div"); d.className = "scene" + (it.bw ? " bw" : "");
    d.innerHTML = '<img class="base" alt="" decoding="async"><img class="sharp" alt="" decoding="async">';
    stage.appendChild(d); return d;
  });
  var hi = -1, lock = false, autoT = 0;
  function loadScene(k) { var el = scenes[k]; if (!el || el.dataset.l) return; el.dataset.l = 1; $$("img", el).forEach(function (im) { im.src = homeItems[k].src; }); }
  function goHome(k, instant) {
    var n = homeItems.length; k = ((k % n) + n) % n;
    var prev = scenes[hi];
    if (prev && k !== hi) { prev.classList.remove("on"); prev.classList.add("out"); setTimeout(function () { prev.classList.remove("out"); }, 1600); }
    hi = k; loadScene(k); loadScene((k + 1) % n);
    var el = scenes[k];
    if (instant) { el.style.transition = "none"; el.classList.add("on"); el.offsetWidth; el.style.transition = ""; } else el.classList.add("on");
    $("#home-title").classList.toggle("gone", k !== 0);
    var it = homeItems[k], c = $("#home-cap");
    if (it.studio) c.innerHTML = '<a href="#atolye"><span class="m">' + esc(t("studio_cap")) + " →</span></a>";
    else c.innerHTML = '<a href="#resim"><span class="t">' + esc(title(it.w)) + '</span><span class="m">' + esc([it.w.year, medium(it.w)].filter(Boolean).join(" · ")) + "</span></a>";
    $("#home-count").innerHTML = "<b>" + pad(k + 1) + "</b> / " + pad(n);
    clearTimeout(autoT); autoT = setTimeout(function () { if (route === "home") goHome(hi + 1); }, 8000);
  }
  function stepHome(d) { if (lock) return; lock = true; setTimeout(function () { lock = false; }, reduce ? 200 : 1200); goHome(hi + d); }
  var wheelAcc = 0, wheelT = 0, touchY = null;
  window.addEventListener("wheel", function (e) {
    if (route !== "home" || document.body.classList.contains("menu-open")) return;
    e.preventDefault(); wheelAcc += e.deltaY; clearTimeout(wheelT); wheelT = setTimeout(function () { wheelAcc = 0; }, 160);
    if (Math.abs(wheelAcc) > 45) { stepHome(wheelAcc > 0 ? 1 : -1); wheelAcc = 0; }
  }, { passive: false });
  window.addEventListener("touchstart", function (e) { touchY = e.touches[0].clientY; }, { passive: true });
  window.addEventListener("touchend", function (e) {
    if (route !== "home" || touchY == null) return;
    var d = touchY - e.changedTouches[0].clientY; touchY = null; if (Math.abs(d) > 40) stepHome(d > 0 ? 1 : -1);
  }, { passive: true });
  var lens = { x: innerWidth / 2, y: innerHeight / 2, r: 0, tr: 0, last: 0 };
  document.addEventListener("pointermove", function (e) { lens.x = e.clientX; lens.y = e.clientY; lens.last = performance.now(); lens.tr = Math.max(150, Math.min(innerWidth, innerHeight) * 0.26); });
  (function tick() {
    if (route === "home") {
      if (performance.now() - lens.last > 1400) lens.tr = 0;
      lens.r += (lens.tr - lens.r) * 0.08;
      var el = scenes[hi];
      if (el) { el.style.setProperty("--mx", lens.x + "px"); el.style.setProperty("--my", lens.y + "px"); el.style.setProperty("--r", lens.r.toFixed(1) + "px"); }
    }
    requestAnimationFrame(tick);
  })();

  /* ---------- katalog parçaları ---------- */
  var LISTS = {}; // lightbox gezinmesi için: liste adı -> eser dizisi
  function tile(w, listKey, opts) {
    opts = opts || {};
    var n = w.img && w.img[0], extra = (w.img ? w.img.length : 0) + (w.video ? 1 : 0) + (w.vfiles ? w.vfiles.length : 0);
    var badge = w.video || w.vfiles ? t("video") : "";
    var meta = [w.year, medium(w)].filter(Boolean).join(" · ");
    return '<a class="tile" href="#" data-l="' + listKey + '" data-id="' + w.id + '"><div class="ph">' +
      (n ? '<img loading="lazy" alt="' + esc(title(w)) + '" src="' + src(n) + '">' : "") + (badge ? '<span class="badge">' + badge + "</span>" : "") +
      '</div><span class="cap"><b>' + esc(title(w)) + "</b><span>" + esc(meta) + (w.size ? "<br>" + esc(w.size) : "") + (extra > 1 && !opts.noCount ? " · " + extra + " ↗" : "") + "</span></span></a>";
  }
  function row(w, listKey) {
    var n = w.img && w.img[0];
    return '<div class="row" data-l="' + listKey + '" data-id="' + w.id + '" tabindex="0"><span class="y">' + esc(w.year) + '</span><span class="t">' + esc(title(w)) + '</span><span class="m">' + esc(medium(w)) + "</span>" +
      '<span class="th">' + (n ? '<img loading="lazy" alt="" src="' + src(n) + '">' : "") + "</span></div>";
  }
  function groupHTML(g, i, listKey, big) {
    return '<section class="grp" id="' + g.anchor + '"><div class="grp-l"><span class="n">' + pad(i + 1) + '</span><h2>' + esc(g.title) + '</h2><span class="r">' + esc([g.range, g.list.length + " " + t("works")].filter(Boolean).join(" · ")) + "</span>" +
      (g.note ? "<p>" + esc(g.note) + "</p>" : "") + '</div><div class="grp-r"><div class="grid' + (big ? " big" : "") + '">' + g.list.map(function (w) { return tile(w, listKey); }).join("") +
      '</div><div class="rows">' + g.list.map(function (w) { return row(w, listKey); }).join("") + "</div></div></section>";
  }
  function headHTML(r, withView) {
    return '<div class="page-head"><h1>' + esc(t(r)) + "</h1>" + (withView ? '<div class="view"><button type="button" data-v="grid">' + esc(t("grid")) + '</button><button type="button" data-v="list">' + esc(t("list")) + "</button></div>" : "") +
      (T.tr[r + "_note"] ? "<p>" + esc(t(r + "_note")) + "</p>" : "") + "</div>";
  }
  function jumpHTML(groups) {
    return '<nav class="jump">' + groups.map(function (g) { return '<a href="#' + g.anchor + '" data-jump="' + g.anchor + '">' + esc(g.title) + "<small>" + g.list.length + "</small></a>"; }).join("") + "</nav>";
  }
  function setList(key, groups) { LISTS[key] = [].concat.apply([], groups.map(function (g) { return g.list; })); }

  function groupsByGrp(list, filter) {
    var by = {};
    list.forEach(function (w) { if (filter && !filter(w)) return; (by[w.grp || 0] = by[w.grp || 0] || []).push(w); });
    return Object.keys(by).map(Number).map(function (g) {
      var G = GROUPS[g] || {}, l = by[g];
      return { g: g, anchor: "g" + g, title: G[lang] || G.tr || t("other"), note: tx(G.note), order: G.order || 99, list: l, range: yrange(l), to: Math.max.apply(null, l.map(function (w) { return w.year; })) };
    });
  }

  function renderResim() {
    var groups = groupsByGrp(WORKS, function (w) { return CURRENT.indexOf(w.grp) >= 0; }).sort(function (a, b) { return CURRENT.indexOf(a.g) - CURRENT.indexOf(b.g); });
    groups.forEach(function (g) { g.anchor = "r" + g.g; });
    setList("resim", groups);
    $("#p-resim").innerHTML =
      '<div class="intro"><div><p class="eyebrow">' + esc(t("intro_k")) + "</p><h1>" + (lang === "en" ? "<i>Blur</i>" : "<i>Bulanık</i>") + "</h1></div>" +
      '<div><p class="q">' + esc(t("intro_q")) + '</p><p class="m">' + esc(t("intro_m")) + '</p><a href="#hakkinda" data-to="arastirma">' + esc(t("intro_more")) + "</a></div></div>" +
      jumpHTML(groups) + groups.map(function (g, i) { return groupHTML(g, i, "resim", true); }).join("");
  }
  function renderArsiv() {
    var groups = groupsByGrp(WORKS, function (w) { return CURRENT.indexOf(w.grp) < 0; })
      .sort(function (a, b) { return (a.g === 0) - (b.g === 0) || a.order - b.order || b.to - a.to; });
    setList("arsiv", groups);
    $("#p-arsiv").innerHTML = headHTML("arsiv", true) + jumpHTML(groups) + groups.map(function (g, i) { return groupHTML(g, i, "arsiv"); }).join("");
  }
  function renderFoto() {
    var groups = PHOTO.map(function (p) { return { anchor: p.id, title: p.num + " · " + title(p), list: p.img.map(function (n, k) { return { p: p, k: k }; }), p: p }; });
    LISTS.fotograf = PHOTO;
    $("#p-fotograf").innerHTML = headHTML("fotograf") + '<nav class="jump">' + groups.map(function (g) { return '<a href="#' + g.anchor + '" data-jump="' + g.anchor + '">' + esc(g.title) + "<small>" + g.list.length + "</small></a>"; }).join("") + "</nav>" +
      '<div class="photo">' + groups.map(function (g, i) {
        var p = g.p;
        return '<section class="grp" id="' + g.anchor + '"><div class="grp-l"><span class="n">' + p.num + '</span><h2>' + esc(title(p)) + '</h2><span class="r">' + esc(p.year + " · " + p.img.length + " " + t("photos")) + "</span><p>" +
          esc([tx(p.text), medium(p)].filter(Boolean).join(" ")) + '</p></div><div class="grp-r"><div class="grid">' +
          p.img.map(function (n, k) { return '<a class="tile" href="#" data-l="fotograf" data-id="' + p.id + '" data-k="' + k + '"><div class="ph"><img loading="lazy" alt="' + esc(title(p)) + '" src="' + src(n) + '"></div></a>'; }).join("") +
          "</div></div></section>";
      }).join("") + "</div>";
  }
  function renderProjeler() {
    var SUBS = ["install", "video", "collective", "proposal", "text"];
    var groups = SUBS.map(function (s) {
      var l = PROJ.filter(function (w) { return w.sub === s; }).sort(function (a, b) { return (a.vno || 0) - (b.vno || 0) || (a.pri || 99) - (b.pri || 99) || b.year - a.year; });
      return l.length ? { anchor: "s-" + s, title: t("sub_" + s), list: l, range: yrange(l) } : null;
    }).filter(Boolean);
    setList("projeler", groups);
    $("#p-projeler").innerHTML = headHTML("projeler", true) + jumpHTML(groups) + groups.map(function (g, i) { return groupHTML(g, i, "projeler"); }).join("");
  }
  function renderSergiler() {
    var groups = $$(".page-about .cv-list[data-shows]").map(function (ul, i) {
      var rows = $$("li", ul).map(function (li) {
        var y = $("span", li).textContent, tr = $('[lang="tr"]', li), en = $('[lang="en"]', li);
        return '<div class="row"><span class="y">' + esc(y) + '</span><span class="t">' + esc((lang === "en" && en ? en : tr).textContent) + "</span></div>";
      }).join("");
      return '<section class="grp shows" id="sh' + i + '"><div class="grp-l"><span class="n">' + pad(i + 1) + "</span><h2>" + esc(t(ul.dataset.shows)) + '</h2></div><div class="grp-r">' + rows + "</div></section>";
    }).join("");
    $("#p-sergiler").innerHTML = headHTML("sergiler") + groups;
  }
  function renderAll() {
    renderResim(); renderArsiv(); renderFoto(); renderProjeler(); renderSergiler();
    $$(".tile").forEach(function (el) { var im = $("img", el); if (!im) return el.classList.add("in");
      if (im.complete && im.naturalWidth) el.classList.add("in"); else im.addEventListener("load", function () { el.classList.add("in"); }); });
    $$(".page-index").forEach(function (pg) {
      var key = "view-" + pg.dataset.page, v = "grid"; try { v = localStorage.getItem(key) || "grid"; } catch (e) {}
      setView(pg, v);
    });
  }
  function setView(pg, v) {
    pg.classList.toggle("list-mode", v === "list");
    $$(".view button", pg).forEach(function (b) { b.classList.toggle("on", b.dataset.v === v); });
    try { localStorage.setItem("view-" + pg.dataset.page, v); } catch (e) {}
  }

  /* tıklamalar */
  document.addEventListener("click", function (e) {
    var vb = e.target.closest && e.target.closest(".view button");
    if (vb) { setView(vb.closest(".page"), vb.dataset.v); return; }
    var j = e.target.closest && e.target.closest("[data-jump]");
    if (j) { e.preventDefault(); var tg = document.getElementById(j.dataset.jump); if (tg) tg.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); return; }
    var to = e.target.closest && e.target.closest("[data-to]");
    if (to) { pendingAnchor = to.dataset.to; }
    var a = e.target.closest && e.target.closest("[data-l][data-id]");
    if (a) { e.preventDefault(); openLb(a.dataset.l, a.dataset.id, a.dataset.k ? +a.dataset.k : 0); }
    if (e.target.closest && e.target.closest(".nav a")) document.body.classList.remove("menu-open");
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target.classList && e.target.classList.contains("row")) e.target.click();
  });

  /* grup çubuğunda bulunduğun yeri işaretle */
  var spy = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (!en.isIntersecting) return;
      var pg = en.target.closest(".page"); if (!pg) return;
      $$(".jump a", pg).forEach(function (a) { a.classList.toggle("cur", a.dataset.jump === en.target.id); });
      var cur = $(".jump a.cur", pg); if (cur && cur.scrollIntoView) { var bar = cur.parentNode; bar.scrollLeft = cur.offsetLeft - 40; }
    });
  }, { rootMargin: "-30% 0px -60% 0px" }) : null;
  function watchGroups() { if (!spy) return; spy.disconnect(); $$(".page-index .grp[id]").forEach(function (s) { spy.observe(s); }); }

  /* ---------- eser penceresi ---------- */
  var lb = { list: [], i: 0, slides: [], s: 0 };
  function slidesOf(w) {
    var s = [];
    if (w.video) s.push({ yt: w.video });
    (w.vfiles || []).forEach(function (v) { s.push({ vf: v }); });
    (w.img || []).forEach(function (n) { s.push({ img: n }); });
    return s;
  }
  function openLb(key, id, k) {
    lb.list = LISTS[key] || [byId[id]];
    lb.i = Math.max(0, lb.list.map(function (w) { return w.id; }).indexOf(id));
    showWork(k || 0);
    document.body.classList.add("lb-open"); $("#lb").setAttribute("aria-hidden", "false");
  }
  function showWork(k) {
    var w = lb.list[lb.i]; lb.slides = slidesOf(w);
    var start = k || 0; if (w.video && k) start = k + 1;
    $("#lb-thumbs").innerHTML = lb.slides.length > 1 ? lb.slides.map(function (s, i) {
      return '<button type="button" data-s="' + i + '">' + (s.img ? '<img alt="" src="' + src(s.img) + '">' : s.vf ? '<img alt="" src="assets/v/' + s.vf.f + '.jpg">' : '<span class="vid">▶</span>') + "</button>";
    }).join("") : "";
    var dl = [[t("year"), w.year], [t("tech"), medium(w)], [t("size"), w.size], [t("place"), w.place ? (w.place.split(" / ")[lang === "en" ? 1 : 0] || w.place) : ""]].filter(function (r) { return r[1]; });
    $("#lb-meta").innerHTML = '<h2 class="t">' + esc(title(w)) + "</h2><dl>" + dl.map(function (r) { return "<dt>" + esc(r[0]) + "</dt><dd>" + esc(r[1]) + "</dd>"; }).join("") + "</dl>" +
      (w.text ? '<p class="x">' + esc(tx(w.text)) + "</p>" : "");
    $("#lb-count").textContent = pad(lb.i + 1) + " / " + pad(lb.list.length);
    $("#lb-prev").disabled = lb.i === 0; $("#lb-next").disabled = lb.i === lb.list.length - 1;
    showSlide(Math.min(start, lb.slides.length - 1));
  }
  function showSlide(s) {
    lb.s = s; var it = lb.slides[s], m = $("#lb-media"), h = "";
    $$("#lb video").forEach(function (v) { v.pause(); });
    if (!it) { m.innerHTML = ""; return; }
    if (it.yt) h = '<iframe src="https://www.youtube-nocookie.com/embed/' + it.yt + '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
    else if (it.vf) h = '<video controls playsinline preload="metadata" poster="assets/v/' + it.vf.f + '.jpg" src="assets/v/' + it.vf.f + '.mp4"></video>';
    else h = '<img alt="" src="' + src(it.img) + '">';
    if (lb.slides.length > 1 && !it.yt && !it.vf) h += '<span class="zone l" data-z="-1"></span><span class="zone r" data-z="1"></span>';
    m.innerHTML = h;
    var el = $("img,video", m);
    if (el) { var done = function () { el.classList.add("in"); }; if (el.tagName === "IMG") { if (el.complete) setTimeout(done, 30); else el.onload = done; } else setTimeout(done, 60); }
    $$("#lb-thumbs button").forEach(function (b, i) { b.classList.toggle("on", i === s); });
    var on = $("#lb-thumbs button.on"); if (on) on.parentNode.scrollLeft = on.offsetLeft - 60;
  }
  function stepWork(d) { var n = lb.i + d; if (n < 0 || n >= lb.list.length) return; lb.i = n; showWork(0); }
  function stepSlide(d) { var n = lb.s + d; if (n < 0 || n >= lb.slides.length) return false; showSlide(n); return true; }
  function closeLb() { document.body.classList.remove("lb-open"); $("#lb").setAttribute("aria-hidden", "true"); $$("#lb video").forEach(function (v) { v.pause(); }); setTimeout(function () { if (!document.body.classList.contains("lb-open")) $("#lb-media").innerHTML = ""; }, 400); }
  $("#lb-x").addEventListener("click", closeLb);
  $("#lb-prev").addEventListener("click", function () { stepWork(-1); });
  $("#lb-next").addEventListener("click", function () { stepWork(1); });
  $("#lb-thumbs").addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) showSlide(+b.dataset.s); });
  $("#lb-media").addEventListener("click", function (e) { var z = e.target.closest(".zone"); if (z) stepSlide(+z.dataset.z); });
  document.addEventListener("keydown", function (e) {
    if (document.body.classList.contains("lb-open")) {
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowRight") { e.preventDefault(); if (!stepSlide(1)) stepWork(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); if (!stepSlide(-1)) stepWork(-1); }
      return;
    }
    if (e.key === "Escape") document.body.classList.remove("menu-open");
    if (route === "home" && ["ArrowDown", "ArrowRight", "PageDown", " "].indexOf(e.key) >= 0) { e.preventDefault(); stepHome(1); }
    if (route === "home" && ["ArrowUp", "ArrowLeft", "PageUp"].indexOf(e.key) >= 0) { e.preventDefault(); stepHome(-1); }
  });
  var tsx = null;
  $("#lb-media").addEventListener("touchstart", function (e) { tsx = e.touches[0].clientX; }, { passive: true });
  $("#lb-media").addEventListener("touchend", function (e) { if (tsx == null) return; var d = tsx - e.changedTouches[0].clientX; tsx = null; if (Math.abs(d) > 40) { if (!stepSlide(d > 0 ? 1 : -1)) stepWork(d > 0 ? 1 : -1); } }, { passive: true });

  /* ---------- yönlendirme ---------- */
  var route = "", pendingAnchor = "";
  function onRoute() {
    var h = location.hash.replace(/^#\/?/, "").split("/")[0], r = h || "home";
    if (r !== "home" && ROUTES.indexOf(r) < 0) {
      // grup çapası (#g11 gibi): sayfa değişmeden kaydır
      var tg = document.getElementById(r); if (tg) { tg.scrollIntoView(); return; }
      r = "home";
    }
    if (document.body.classList.contains("lb-open")) closeLb();
    document.body.classList.remove("menu-open");
    var changed = r !== route; route = r;
    if (changed) {
      $$(".page").forEach(function (p) { p.classList.toggle("on", p.dataset.page === r); });
      document.body.classList.toggle("is-home", r === "home");
      window.scrollTo(0, 0);
      var nx = ROUTES[(ROUTES.indexOf(r) + 1) % ROUTES.length];
      $("#foot-next").href = "#" + nx; $("#foot-next").textContent = t("next_sec") + ": " + t(nx) + " →";
    }
    $$("#nav a").forEach(function (a) { a.classList.toggle("cur", a.dataset.r === r); });
    if (r === "home" && hi < 0) goHome(0, true);
    if (pendingAnchor) { var an = document.getElementById(pendingAnchor); pendingAnchor = ""; if (an) setTimeout(function () { an.scrollIntoView({ behavior: "smooth" }); }, 350); }
  }
  window.addEventListener("hashchange", onRoute);

  /* ---------- dil ---------- */
  function setLang(l) {
    lang = l; document.documentElement.lang = l;
    try { localStorage.setItem("lang", l); } catch (e) {}
    $$("[data-i]").forEach(function (el) { if (T[l][el.dataset.i]) el.textContent = T[l][el.dataset.i]; });
    $$(".lang button").forEach(function (b) { b.classList.toggle("on", b.dataset.l === l); });
    renderNav(); renderAll(); watchGroups();
    $$("#nav a").forEach(function (a) { a.classList.toggle("cur", a.dataset.r === route); });
    if (hi >= 0) { var k = hi; hi = -1; goHome(k, true); }
    if (route && route !== "home") { var nx = ROUTES[(ROUTES.indexOf(route) + 1) % ROUTES.length]; $("#foot-next").textContent = t("next_sec") + ": " + t(nx) + " →"; }
  }
  $$(".lang button").forEach(function (b) { b.addEventListener("click", function () { setLang(b.dataset.l); }); });

  setLang(lang);
  onRoute();
})();
