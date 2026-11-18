/* Beam site: menu, gallery tabs, section bar highlight, collapsible setup sections, back to top. */
(function () {
  var nav = document.querySelector("nav");
  var btn = document.querySelector(".menu-btn");
  if (nav && btn) {
    var setOpen = function (open) {
      nav.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    };
    btn.addEventListener("click", function () { setOpen(!nav.classList.contains("open")); });
    nav.querySelectorAll(".navlinks a").forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
  }

  document.querySelectorAll(".gallery").forEach(function (g) {
    var tabs = g.querySelectorAll(".gtab");
    var panels = g.querySelectorAll(".gpanel");
    var show = function (i) {
      tabs.forEach(function (t, j) {
        t.setAttribute("aria-selected", j === i ? "true" : "false");
        t.tabIndex = j === i ? 0 : -1;
      });
      panels.forEach(function (p, j) { p.hidden = j !== i; });
    };
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { show(i); });
      t.addEventListener("keydown", function (e) {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        var n = (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
        show(n);
        tabs[n].focus();
      });
    });
    show(0);
  });

  var sub = document.querySelector(".subnav");
  if (sub && "IntersectionObserver" in window) {
    var bar = sub.querySelector(".wrap");
    var links = Array.prototype.slice.call(sub.querySelectorAll('a[href^="#"]'));
    var byId = {};
    links.forEach(function (a) {
      var el = document.getElementById(a.getAttribute("href").slice(1));
      if (el) byId[el.id] = a;
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var a = byId[e.target.id];
        links.forEach(function (l) { l.classList.toggle("on", l === a); });
        if (a.offsetLeft < bar.scrollLeft || a.offsetLeft + a.offsetWidth > bar.scrollLeft + bar.clientWidth) {
          bar.scrollTo({ left: a.offsetLeft - 16, behavior: "smooth" });
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    Object.keys(byId).forEach(function (id) { io.observe(document.getElementById(id)); });
  }

  // A link to a collapsed setup section (#mega, #receiver, ...) opens it.
  var openTarget = function () {
    var id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    var el = document.getElementById(id);
    if (!el) return;
    var d = el.matches("details") ? el : el.querySelector("details.acc");
    if (d && !d.open) {
      d.open = true;
      el.scrollIntoView();
    }
  };
  window.addEventListener("hashchange", openTarget);
  openTarget();

  var top = document.querySelector(".totop");
  if (top) {
    var onScroll = function () { top.classList.toggle("show", window.scrollY > 900); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
})();
