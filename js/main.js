
/* ============================================================
   JENNIFER ANISTON — A TRIBUTE  |  main.js
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Preloader ---------- */
  window.addEventListener("load", function () {
    var pre = document.getElementById("preloader");
    if (pre) setTimeout(function () { pre.classList.add("done"); }, 500);
  });

  /* ---------- Sticky header + back-to-top ---------- */
  var header = document.querySelector("header");
  var toTop = document.getElementById("toTop");
  window.addEventListener("scroll", function () {
    if (header) header.classList.toggle("scrolled", window.scrollY > 60);
    if (toTop) toTop.classList.toggle("show", window.scrollY > 500);
  }, { passive: true });
  if (toTop) toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Mobile nav ---------- */
  var burger = document.querySelector(".burger");
  var nav = document.querySelector("nav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      burger.classList.toggle("open");
      nav.classList.toggle("open");
      document.body.style.overflow = nav.classList.contains("open") ? "hidden" : "";
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        burger.classList.remove("open");
        nav.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Hero slider (Ken Burns crossfade) ---------- */
  var slides = document.querySelectorAll(".hero-slide");
  var dotsWrap = document.querySelector(".hero-dots");
  if (slides.length && dotsWrap) {
    var idx = 0, timer;
    slides.forEach(function (_, i) {
      var b = document.createElement("button");
      if (i === 0) b.classList.add("active");
      b.addEventListener("click", function () { go(i); restart(); });
      dotsWrap.appendChild(b);
    });
    var dots = dotsWrap.querySelectorAll("button");
    function go(n) {
      slides[idx].classList.remove("active");
      dots[idx].classList.remove("active");
      idx = (n + slides.length) % slides.length;
      slides[idx].classList.add("active");
      dots[idx].classList.add("active");
    }
    function restart() { clearInterval(timer); timer = setInterval(function () { go(idx + 1); }, 5500); }
    restart();
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll(".num[data-count]");
  if (counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        cio.unobserve(el);
        var target = parseFloat(el.getAttribute("data-count"));
        var suffix = el.getAttribute("data-suffix") || "";
        var dur = 1800, start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- Film filter ---------- */
  var filterBtns = document.querySelectorAll(".filter-btn");
  var films = document.querySelectorAll(".film");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var f = btn.getAttribute("data-filter");
      films.forEach(function (film) {
        var show = f === "all" || film.getAttribute("data-cat") === f;
        film.classList.toggle("hide", !show);
        if (show) {
          film.style.animation = "none";
          void film.offsetWidth;
          film.style.animation = "fadeUp .6s var(--ease) both";
        }
      });
    });
  });

  /* ---------- Quote rotator ---------- */
  var quotes = document.querySelectorAll(".quote");
  var qPrev = document.querySelector(".q-prev");
  var qNext = document.querySelector(".q-next");
  if (quotes.length) {
    var qi = 0, qTimer;
    function showQ(n) {
      quotes[qi].classList.remove("active");
      qi = (n + quotes.length) % quotes.length;
      quotes[qi].classList.add("active");
    }
    function qRestart() { clearInterval(qTimer); qTimer = setInterval(function () { showQ(qi + 1); }, 7000); }
    if (qPrev) qPrev.addEventListener("click", function () { showQ(qi - 1); qRestart(); });
    if (qNext) qNext.addEventListener("click", function () { showQ(qi + 1); qRestart(); });
    qRestart();
  }

  /* ---------- Gallery lightbox ---------- */
  var gItems = Array.prototype.slice.call(document.querySelectorAll(".g-item"));
  var lb = document.querySelector(".lightbox");
  if (gItems.length && lb) {
    var lbImg = lb.querySelector("img");
    var lbCap = lb.querySelector(".lb-cap");
    var li = 0;
    function openLb(n) {
      li = n;
      var img = gItems[li].querySelector("img");
      lbImg.src = img.getAttribute("src");
      lbImg.alt = img.alt;
      lbCap.textContent = gItems[li].getAttribute("data-cap") || img.alt;
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function closeLb() { lb.classList.remove("open"); document.body.style.overflow = ""; }
    function navLb(d) { openLb((li + d + gItems.length) % gItems.length); }
    gItems.forEach(function (item, i) {
      item.addEventListener("click", function () { openLb(i); });
    });
    lb.querySelector(".lb-close").addEventListener("click", closeLb);
    lb.querySelector(".lb-prev").addEventListener("click", function (e) { e.stopPropagation(); navLb(-1); });
    lb.querySelector(".lb-next").addEventListener("click", function (e) { e.stopPropagation(); navLb(1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") navLb(-1);
      if (e.key === "ArrowRight") navLb(1);
    });
  }

  /* ---------- Parallax on banner images ---------- */
  var banners = document.querySelectorAll(".banner");
  if (banners.length) {
    window.addEventListener("scroll", function () {
      banners.forEach(function (b) {
        var r = b.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) {
          b.style.backgroundPositionY = (25 + (r.top / window.innerHeight) * 12) + "%";
        }
      });
    }, { passive: true });
  }

  /* ---------- Contact form (demo) ---------- */
  var form = document.getElementById("fanForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = document.querySelector(".form-msg");
      var name = form.querySelector("#f-name").value.trim();
      if (!name) { msg.textContent = "Please tell us your name."; return; }
      msg.textContent = "Thank you, " + name + ". Your message has been noted (demo form).";
      form.reset();
    });
  }

  /* ---------- Footer year ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- VIP Fan Circle signup (browser demo) ---------- */
  var vipForm = document.getElementById("vipForm");
  if (vipForm) {
    var vipMsg = vipForm.querySelector(".form-msg");
    var vipStorageKey = "jaVipFanCircle";

    function setVipMessage(type, message) {
      if (!vipMsg) return;
      vipMsg.className = "form-msg " + type;
      vipMsg.textContent = message;
    }

    try {
      var savedVip = JSON.parse(localStorage.getItem(vipStorageKey) || "null");
      if (savedVip && savedVip.name && savedVip.email) {
        setVipMessage(
          "success",
          "Welcome back, " + savedVip.name + ". Your VIP Fan Circle signup is saved in this browser."
        );
      }
    } catch (err) {}

    vipForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var nameInput = vipForm.querySelector("[name='vip-name']");
      var emailInput = vipForm.querySelector("[name='vip-email']");
      var favoriteInput = vipForm.querySelector("[name='vip-favorite']");
      var agreeInput = vipForm.querySelector("#vip-agree");

      var name = nameInput ? nameInput.value.trim() : "";
      var email = emailInput ? emailInput.value.trim() : "";
      var favorite = favoriteInput ? favoriteInput.value : "";
      var agreed = agreeInput ? agreeInput.checked : false;

      if (!name) {
        setVipMessage("error", "Please enter your name.");
        nameInput.focus();
        return;
      }

      if (!email || email.indexOf("@") < 1 || email.indexOf(".") < 0) {
        setVipMessage("error", "Please enter a valid email address.");
        emailInput.focus();
        return;
      }

      if (!agreed) {
        setVipMessage("error", "Please confirm that you understand this demo signup.");
        agreeInput.focus();
        return;
      }

      var vipRecord = {
        name: name,
        email: email,
        favorite: favorite,
        joined: new Date().toISOString()
      };

      try {
        localStorage.setItem(vipStorageKey, JSON.stringify(vipRecord));
      } catch (err) {}

      setVipMessage(
        "success",
        "Welcome to the VIP Fan Circle, " + name + "! Your signup has been saved in this browser."
      );
    });
  }

})();
