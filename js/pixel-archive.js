/* Turns the archive timeline into a pixel "world map": one world per year,
   one numbered stage per post, joined by a dotted road. The post elements are
   moved, not copied, so the 中 / EN switch (i18n/client.js) keeps translating
   their titles. Without JS the plain timeline is still there. */
(function () {
  function build() {
    var archive = document.getElementById("archive");
    var sort = archive && archive.querySelector(".article-sort");
    if (!sort || archive.classList.contains("pxm-on")) return;

    var worlds = [];
    var cur = null;
    Array.prototype.slice.call(sort.children).forEach(function (el) {
      if (!el.classList.contains("article-sort-item")) return;
      if (el.classList.contains("year")) {
        cur = { year: el.textContent.trim(), items: [] };
        worlds.push(cur);
      } else {
        if (!cur) { cur = { year: "", items: [] }; worlds.push(cur); }
        cur.items.push(el);
      }
    });
    if (!worlds.length) return;

    var map = document.createElement("div");
    map.className = "pxm";
    var seen = 0;

    worlds.forEach(function (w, wi) {
      var worldNo = worlds.length - wi; // oldest year is World 1
      var section = document.createElement("section");
      section.className = "pxm-world t" + (wi % 4);

      var banner = document.createElement("div");
      banner.className = "pxm-banner";
      banner.innerHTML = '<span class="pxm-w">WORLD ' + worldNo + "</span><b>" + (w.year || "?") +
        '</b><i class="pxm-n">' + w.items.length + " STAGES</i>";
      section.appendChild(banner);

      var road = document.createElement("ol");
      road.className = "pxm-road";
      w.items.forEach(function (item, i) {
        var li = document.createElement("li");
        li.className = "pxm-node " + (seen % 2 ? "is-right" : "is-left") + " c" + (seen % 4);
        var pin = document.createElement("span");
        pin.className = "pxm-pin";
        pin.setAttribute("aria-hidden", "true");
        pin.textContent = worldNo + "-" + (w.items.length - i);
        if (wi === 0 && i === 0) {
          var badge = document.createElement("em");
          badge.className = "pxm-new";
          badge.textContent = "NEW";
          pin.appendChild(badge);
        }
        item.classList.add("pxm-card");
        li.appendChild(pin);
        li.appendChild(item);
        road.appendChild(li);
        seen++;
      });
      section.appendChild(road);
      map.appendChild(section);
    });

    var start = document.createElement("div");
    start.className = "pxm-start";
    start.innerHTML = '<span class="pxm-flag" aria-hidden="true"></span><b>START</b>';
    map.appendChild(start);

    archive.classList.add("pxm-on");
    sort.parentNode.insertBefore(map, sort);
    sort.hidden = true;
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
