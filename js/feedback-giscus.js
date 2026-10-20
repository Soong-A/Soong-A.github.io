(function () {
  // Fill these in from https://giscus.app once Discussions is enabled on the repo.
  var cfg = {
    repo: "Soong-A/Soong-A.github.io",
    repoId: "R_kgDOPb2_jg",
    category: "Announcements",
    categoryId: "DIC_kwDOPb2_js4DJL4x"
  };
  var host = document.getElementById("px-comments");
  if (!host) return;

  // The site keeps its language in localStorage ("site-lang", see i18n/client.js);
  // ?lang= overrides it for one visit. giscus only ships "en" and "zh-CN".
  function siteLang() {
    var q = new URLSearchParams(location.search).get("lang");
    if (q === "en" || q === "zh") return q;
    try { return localStorage.getItem("site-lang") === "en" ? "en" : "zh"; } catch (e) { return "zh"; }
  }
  function giscusLang(l) { return l === "en" ? "en" : "zh-CN"; }
  function pickTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "transparent_dark" : "light";
  }
  function tell(config) {
    var frame = document.querySelector("iframe.giscus-frame");
    if (frame && frame.contentWindow) {
      frame.contentWindow.postMessage({ giscus: { setConfig: config } }, "https://giscus.app");
    }
  }

  if (!cfg.repoId || !cfg.categoryId) {
    host.innerHTML = siteLang() === "en"
      ? '<p class="px-notice"><b>SAVE POINT NOT CONNECTED</b>Comments are not set up yet: fill in the giscus repoId and categoryId in <code>source/js/feedback-giscus.js</code>.</p>'
      : '<p class="px-notice"><b>SAVE POINT NOT CONNECTED</b>留言功能还没接上：需要在 <code>source/js/feedback-giscus.js</code> 里填入 giscus 的 repoId 和 categoryId。</p>';
    return;
  }

  var s = document.createElement("script");
  s.src = "https://giscus.app/client.js";
  s.async = true;
  s.crossOrigin = "anonymous";
  var attrs = {
    "data-repo": cfg.repo, "data-repo-id": cfg.repoId,
    "data-category": cfg.category, "data-category-id": cfg.categoryId,
    "data-mapping": "specific", "data-term": "feedback",
    "data-strict": "0", "data-reactions-enabled": "1", "data-emit-metadata": "0",
    "data-input-position": "top", "data-theme": pickTheme(), "data-lang": giscusLang(siteLang()),
    "data-loading": "lazy"
  };
  for (var k in attrs) s.setAttribute(k, attrs[k]);
  host.appendChild(s);

  // Keep the comment box in step with the site's light/dark and 中 / EN switches.
  new MutationObserver(function () { tell({ theme: pickTheme() }); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  document.addEventListener("site-lang-change", function (e) {
    tell({ lang: giscusLang(e.detail && e.detail.lang) });
  });
})();
