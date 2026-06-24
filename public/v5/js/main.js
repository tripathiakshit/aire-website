/* AiRE Website V2 — minimal behaviour layer (no frameworks) */
(function () {
  "use strict";

  /* Mobile nav */
  var burger = document.getElementById("navBurger");
  var links = document.getElementById("navLinks");
  if (burger && links) {
    burger.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.textContent = open ? "✕" : "☰";
    });
  }

  /* Scroll reveal — belt-and-braces: if the observer never fires (odd WebViews),
     force-reveal anything still hidden 3 s after load so nothing stays blank. */
  window.addEventListener("load", function () {
    window.setTimeout(function () {
      document.querySelectorAll(".reveal:not(.in)").forEach(function (el) { el.classList.add("in"); });
    }, 3000);
  });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  /* Two-phase loader for heavy embeds (hook video, MP4 loops, demo iframes).
     Phase 1: nothing with data-defer-src is fetched, so text + hero paint at
     full bandwidth. Phase 2: after window load, an observer mounts each item
     in the background as it comes within ~600px of the viewport. */
  function mountDeferred(el) {
    var src = el.getAttribute("data-defer-src");
    if (!src) return;
    el.removeAttribute("data-defer-src");
    el.setAttribute("src", src);
    if (el.tagName === "VIDEO") {
      el.load();
      var p = el.play();
      if (p && p.catch) p.catch(function () { /* autoplay denied: poster stays */ });
    }
  }
  var deferred = document.querySelectorAll("[data-defer-src]");
  if (deferred.length) {
    var startDeferLoader = function () {
      if ("IntersectionObserver" in window) {
        var mio = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (e) {
              if (e.isIntersecting) { mountDeferred(e.target); mio.unobserve(e.target); }
            });
          },
          { rootMargin: "600px 0px" }
        );
        deferred.forEach(function (el) { mio.observe(el); });
      } else {
        deferred.forEach(mountDeferred);
      }
    };
    if (document.readyState === "complete") { startDeferLoader(); }
    else { window.addEventListener("load", startDeferLoader); }
  }

  /* Dark-mode toggle — button injected into the nav so no per-page HTML edits.
     The pre-paint <head> script already set data-theme (no flash); here we just
     build the control, flip the attribute, and persist the choice. */
  (function () {
    var root = document.documentElement;
    if (!root.getAttribute("data-theme")) {
      var saved = null;
      try { saved = localStorage.getItem("aire-theme"); } catch (e) {}
      root.setAttribute("data-theme",
        saved || (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
    }
    var navInner = document.querySelector(".nav-inner");
    if (!navInner) return;
    var btn = document.createElement("button");
    btn.className = "theme-toggle";
    btn.type = "button";
    btn.setAttribute("aria-label", "Toggle dark mode");
    btn.innerHTML =
      '<svg class="ic-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 13.2A8.3 8.3 0 1 1 10.8 3.5a6.6 6.6 0 0 0 9.7 9.7z"/></svg>' +
      '<svg class="ic-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.3"/><path d="M12 2v2.6M12 19.4V22M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M2 12h2.6M19.4 12H22M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8"/></svg>';
    function sync() {
      var dark = root.getAttribute("data-theme") === "dark";
      btn.setAttribute("aria-pressed", dark ? "true" : "false");
      btn.title = dark ? "Switch to light mode" : "Switch to dark mode";
    }
    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("aire-theme", next); } catch (e) {}
      sync();
    });
    var burger = document.getElementById("navBurger");
    if (burger) navInner.insertBefore(btn, burger); else navInner.appendChild(btn);
    sync();
  })();

  /* Founder video placeholder note (until the 90-second cut is dropped in) */
  var play = document.getElementById("playBtn");
  var note = document.getElementById("vidNote");
  if (play && note) {
    play.addEventListener("click", function () {
      note.classList.add("show");
      window.setTimeout(function () { note.classList.remove("show"); }, 3200);
    });
  }
})();
