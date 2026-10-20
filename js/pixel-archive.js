/* Archive as a two-column list of cards, each with the post's own cover image,
   date and title. The original title and date elements are moved into the cards
   (not copied), so the 中 / EN switch (i18n/client.js) keeps translating titles.
   Without JS the plain timeline is still shown. */
(function () {
  var SEEN_KEY = "pxm-visited";
  var UI = {
    zh: { bar: "全部文章", read: "已读" },
    en: { bar: "All posts", read: "Read" }
  };

  function currentLang() {
    var q = new URLSearchParams(location.search).get("lang");
    if (q === "en" || q === "zh") return q;
    var h = document.documentElement.getAttribute("data-lang");
    if (h === "en" || h === "zh") return h;
    try { return localStorage.getItem("site-lang") === "en" ? "en" : "zh"; } catch (e) { return "zh"; }
  }
  function loadSeen() {
    try { return JSON.parse(localStorage.getItem(SEEN_KEY) || "[]"); } catch (e) { return []; }
  }
  function saveSeen(list) {
    try { localStorage.setItem(SEEN_KEY, JSON.stringify(list)); } catch (e) {}
  }

  function build() {
    var archive = document.getElementById("archive");
    var sort = archive && archive.querySelector(".article-sort");
    if (!sort || archive.classList.contains("pxm-on")) return;

    var posts = [];
    Array.prototype.slice.call(sort.children).forEach(function (el) {
      if (!el.classList.contains("article-sort-item") || el.classList.contains("year")) return;
      var a = el.querySelector(".article-sort-item-title");
      var img = el.querySelector(".article-sort-item-img img");
      var time = el.querySelector("time");
      if (a) posts.push({ a: a, time: time, cover: img ? img.getAttribute("src") : "", href: a.getAttribute("href") });
    });
    if (!posts.length) return;

    var seen = loadSeen();
    var root = document.createElement("div");
    root.className = "pxi";
    root.innerHTML =
      '<div class="pxi-bar"><b class="pxi-bar-t"></b><span class="pxi-bar-s"><span class="pxi-rl"></span> <em class="pxi-rn"></em></span></div>' +
      '<ol class="pxi-grid"></ol>';
    var grid = root.querySelector(".pxi-grid");

    posts.forEach(function (p, i) {
      var li = document.createElement("li");
      li.className = "pxi-slot";
      var cover = document.createElement("span");
      cover.className = "pxi-cover";
      if (p.cover) {
        var img = document.createElement("img");
        img.src = p.cover;
        img.alt = "";
        img.loading = "lazy";
        img.onerror = function () { img.remove(); };
        cover.appendChild(img);
      }
      cover.insertAdjacentHTML("beforeend", '<i class="pxi-ok" aria-hidden="true">✓</i>' + (i === 0 ? '<em class="pxi-new">NEW</em>' : ""));

      var info = document.createElement("div");
      info.className = "pxi-info";
      var meta = document.createElement("span");
      meta.className = "pxi-meta";
      if (p.time) { p.time.removeAttribute("title"); meta.appendChild(p.time); }
      p.a.classList.add("pxi-title");
      p.a.removeAttribute("title");
      info.appendChild(meta);
      info.appendChild(p.a);

      li.appendChild(cover);
      li.appendChild(info);
      if (seen.indexOf(p.href) !== -1) li.classList.add("is-seen");
      p.a.addEventListener("click", function () {
        if (seen.indexOf(p.href) === -1) { seen.push(p.href); saveSeen(seen); }
        li.classList.add("is-seen");
        counts();
      });
      grid.appendChild(li);
    });

    function ui(key) { return UI[currentLang()][key]; }
    function counts() {
      var done = posts.filter(function (p) { return seen.indexOf(p.href) !== -1; }).length;
      root.querySelector(".pxi-rn").textContent = done + "/" + posts.length;
      root.querySelector(".pxi-rl").textContent = ui("read");
    }
    function texts() {
      root.querySelector(".pxi-bar-t").textContent = ui("bar") + " · " + posts.length;
      counts();
    }

    archive.classList.add("pxm-on");
    sort.parentNode.insertBefore(root, sort);
    sort.hidden = true;
    texts();
    document.addEventListener("site-lang-change", texts);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
