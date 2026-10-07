/* Maalika Event — site interactions (no dependencies) */
(function () {
  "use strict";

  var WHATSAPP_NUMBER = "916202540010";

  var root = document.documentElement;
  var body = document.body;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Hero entrance ---------- */
  function markLoaded() {
    var add = function () { root.classList.add("is-loaded"); };
    requestAnimationFrame(add);
    setTimeout(add, 120); // rAF is paused in background tabs
  }
  var heroImg = document.querySelector(".hero-media img");
  if (heroImg && !heroImg.complete) {
    heroImg.addEventListener("load", markLoaded, { once: true });
    heroImg.addEventListener("error", markLoaded, { once: true });
    setTimeout(markLoaded, 1800); // never hold the page hostage to a slow image
  } else {
    markLoaded();
  }

  /* ---------- Sticky header + floating WhatsApp ---------- */
  var header = document.querySelector("[data-header]");
  var floatWa = document.querySelector("[data-float-wa]");
  var hero = document.querySelector(".hero");

  // Show the floating button between the hero and the contact section
  // (where the same actions are already on screen).
  var contact = document.querySelector("#contact");
  if (floatWa && hero && "IntersectionObserver" in window) {
    var heroVisible = true, contactVisible = false;
    var syncFloat = function () {
      floatWa.classList.toggle("is-visible", !heroVisible && !contactVisible);
    };
    new IntersectionObserver(function (entries) {
      heroVisible = entries[0].isIntersecting;
      syncFloat();
    }, { threshold: 0.2 }).observe(hero);
    if (contact) {
      new IntersectionObserver(function (entries) {
        contactVisible = entries[0].isIntersecting;
        syncFloat();
      }, { rootMargin: "0px 0px -30% 0px" }).observe(contact);
    }
  }

  function onScrollHeader() {
    header.classList.toggle("is-solid", window.scrollY > 40);
  }
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---------- Active nav link ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-list a"));
  if ("IntersectionObserver" in window && navLinks.length) {
    var byId = {};
    navLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (l) { l.removeAttribute("aria-current"); });
        var link = byId[e.target.id];
        if (link) link.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main > section[id]").forEach(function (s) { navIO.observe(s); });
  }

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-menu]");
  var toggleLabel = toggle && toggle.querySelector(".visually-hidden");

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    if (toggleLabel) toggleLabel.textContent = open ? "Close menu" : "Open menu";
    body.classList.toggle("no-scroll", open);
    body.classList.toggle("body-menu-open", open);
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(function () { menu.classList.add("is-open"); });
      var first = menu.querySelector("a");
      if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 50);
    } else {
      menu.classList.remove("is-open");
      setTimeout(function () { if (!menu.classList.contains("is-open")) menu.hidden = true; }, 500);
    }
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 961px)").addEventListener("change", function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    // Stagger siblings that enter together
    var revealIO = new IntersectionObserver(function (entries) {
      var batch = entries.filter(function (e) { return e.isIntersecting; });
      batch.forEach(function (e, i) {
        e.target.style.setProperty("--d", Math.min(i * 0.09, 0.45) + "s");
        e.target.classList.add("is-visible");
        revealIO.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { revealIO.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Subtle parallax ---------- */
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  var canParallax = !reduceMotion && window.matchMedia("(min-width: 700px)").matches;
  if (canParallax && parallaxEls.length) {
    var ticking = false;
    var update = function () {
      var vh = window.innerHeight;
      parallaxEls.forEach(function (el) {
        var host = el.parentElement;
        var r = host.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0;
        var offset = (r.top + r.height / 2 - vh / 2) * -speed;
        el.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0)";
      });
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- Before / after comparison ---------- */
  var ba = document.querySelector("[data-ba]");
  if (ba) {
    var range = ba.querySelector("[data-ba-range]");
    var setPos = function (v) { ba.style.setProperty("--pos", v + "%"); };
    range.addEventListener("input", function () { setPos(range.value); });

    // On first view, glide the divider to hint that it can be dragged.
    if ("IntersectionObserver" in window && !reduceMotion) {
      var hinted = false;
      new IntersectionObserver(function (entries, io) {
        if (!entries[0].isIntersecting || hinted) return;
        hinted = true;
        io.disconnect();
        var from = 88, to = 50, dur = 1800, t0 = null;
        var userMoved = false;
        range.addEventListener("pointerdown", function () { userMoved = true; }, { once: true });
        range.addEventListener("keydown", function () { userMoved = true; }, { once: true });
        var step = function (t) {
          if (userMoved) return;
          if (!t0) t0 = t;
          var p = Math.min((t - t0) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 4);
          var v = from + (to - from) * eased;
          setPos(v.toFixed(2));
          range.value = Math.round(v);
          if (p < 1) requestAnimationFrame(step);
        };
        setPos(from);
        setTimeout(function () { requestAnimationFrame(step); }, 350);
      }, { threshold: 0.45 }).observe(ba);
    }
  }

  /* ---------- Lightbox ---------- */
  var lb = document.querySelector("[data-lightbox-root]");
  var triggers = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  if (lb && triggers.length) {
    var lbImg = lb.querySelector("[data-lb-img]");
    var lbCat = lb.querySelector("[data-lb-cat]");
    var lbTitle = lb.querySelector("[data-lb-title]");
    var lbCount = lb.querySelector("[data-lb-count]");
    var closeBtn = lb.querySelector("[data-lb-close]");
    var current = 0;
    var lastFocus = null;

    var show = function (i) {
      current = (i + triggers.length) % triggers.length;
      var t = triggers[current];
      var thumb = t.querySelector("img");
      lbImg.classList.remove("is-ready");
      lbImg.alt = thumb ? thumb.alt : "";
      lbImg.onload = function () { lbImg.classList.add("is-ready"); };
      lbImg.src = t.getAttribute("href");
      if (lbImg.complete && lbImg.naturalWidth) lbImg.classList.add("is-ready");
      lbCat.textContent = t.getAttribute("data-category") || "";
      lbTitle.textContent = t.getAttribute("data-title") || "";
      lbCount.textContent = (current + 1) + " / " + triggers.length;
      // Warm the cache for neighbours
      [current + 1, current - 1].forEach(function (n) {
        var nb = triggers[(n + triggers.length) % triggers.length];
        var pre = new Image();
        pre.src = nb.getAttribute("href");
      });
    };
    var open = function (i) {
      lastFocus = document.activeElement;
      show(i);
      lb.hidden = false;
      body.classList.add("no-scroll");
      requestAnimationFrame(function () { lb.classList.add("is-open"); });
      closeBtn.focus({ preventScroll: true });
    };
    var close = function () {
      lb.classList.remove("is-open");
      body.classList.remove("no-scroll");
      setTimeout(function () { lb.hidden = true; lbImg.removeAttribute("src"); }, 400);
      if (lastFocus) lastFocus.focus({ preventScroll: true });
    };

    triggers.forEach(function (t, i) {
      t.addEventListener("click", function (e) {
        e.preventDefault();
        open(i);
      });
    });
    lb.querySelector("[data-lb-prev]").addEventListener("click", function () { show(current - 1); });
    lb.querySelector("[data-lb-next]").addEventListener("click", function () { show(current + 1); });
    closeBtn.addEventListener("click", close);
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target.classList.contains("lb-figure")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") show(current + 1);
      else if (e.key === "ArrowLeft") show(current - 1);
      else if (e.key === "Tab") {
        // Keep focus inside the dialog
        var f = Array.prototype.slice.call(lb.querySelectorAll("button"));
        var idx = f.indexOf(document.activeElement);
        e.preventDefault();
        var next = e.shiftKey ? idx - 1 : idx + 1;
        f[(next + f.length) % f.length].focus();
      }
    });

    // Swipe on touch screens
    var sx = 0, sy = 0;
    lb.addEventListener("touchstart", function (e) {
      sx = e.touches[0].clientX; sy = e.touches[0].clientY;
    }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - sx;
      var dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(current + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  /* ---------- Enquiry form → WhatsApp ---------- */
  var form = document.querySelector("[data-enquiry]");
  if (form) {
    var errorEl = form.querySelector("[data-form-error]");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.elements.name;
      var type = form.elements.type;
      var missing = [];
      [name, type].forEach(function (field) {
        var bad = !field.value.trim();
        field.setAttribute("aria-invalid", String(bad));
        if (bad) missing.push(field);
      });
      if (missing.length) {
        errorEl.textContent = "Please add your name and the type of event.";
        missing[0].focus();
        return;
      }
      errorEl.textContent = "";

      var date = form.elements.date.value;
      if (date) {
        var d = new Date(date + "T00:00:00");
        if (!isNaN(d)) date = d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
      }
      var lines = [
        "Hello Maalika Event!",
        "",
        "Name: " + name.value.trim(),
        "Event: " + type.value
      ];
      if (date) lines.push("Date: " + date);
      if (form.elements.venue.value.trim()) lines.push("Venue: " + form.elements.venue.value.trim());
      if (form.elements.notes.value.trim()) lines.push("Details: " + form.elements.notes.value.trim());
      lines.push("", "I'd love to discuss the decoration.");

      var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
      var win = null;
      try { win = window.open(url, "_blank"); } catch (err) { win = null; }
      if (win) {
        win.opener = null;
      } else {
        // Pop-up blocked (or not allowed here): offer a real link instead.
        fallback.href = url;
        fallback.hidden = false;
        fallback.focus();
      }
    });
    var fallback = document.createElement("a");
    fallback.className = "btn btn-outline btn-block";
    fallback.target = "_blank";
    fallback.rel = "noopener";
    fallback.hidden = true;
    fallback.textContent = "Open WhatsApp with your message";
    form.appendChild(fallback);
    form.addEventListener("input", function (e) {
      if (e.target.getAttribute("aria-invalid") === "true" && e.target.value.trim()) {
        e.target.setAttribute("aria-invalid", "false");
      }
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
