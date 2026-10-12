
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

  /* ---------- LolaVie shop demo ---------- */
  var productCards = document.querySelectorAll(".product-card[data-product-id]");
  var cartPanel = document.getElementById("shop-cart");
  var cartToggle = document.querySelector(".cart-toggle");
  var cartClose = document.querySelector(".cart-close");
  var cartItems = document.querySelector(".cart-items");
  var cartEmpty = document.querySelector(".cart-empty");
  var cartCount = document.querySelector(".cart-count");
  var cartSubtotal = document.querySelector(".cart-subtotal");
  var checkoutModal = document.querySelector(".checkout-modal");
  var checkoutForm = document.getElementById("checkout-form");
  var checkoutOrder = document.querySelector(".checkout-order");
  var shopStorageKey = "jaLolaVieShopCart";
  var shopCart = {};

  if (productCards.length && cartPanel && cartItems && cartToggle) {
    try {
      var savedShopCart = JSON.parse(localStorage.getItem(shopStorageKey) || "{}");
      if (savedShopCart && typeof savedShopCart === "object") shopCart = savedShopCart;
    } catch (err) {}

    function money(amount) {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
    }

    function productById(id) {
      return Array.prototype.find.call(productCards, function (card) {
        return card.getAttribute("data-product-id") === id;
      });
    }

    function persistShopCart() {
      try { localStorage.setItem(shopStorageKey, JSON.stringify(shopCart)); } catch (err) {}
    }

    function cartTotals() {
      return Object.keys(shopCart).reduce(function (totals, id) {
        var card = productById(id);
        var quantity = Math.max(0, parseInt(shopCart[id], 10) || 0);
        if (!card || !quantity) return totals;
        totals.quantity += quantity;
        totals.subtotal += Number(card.getAttribute("data-price")) * quantity;
        return totals;
      }, { quantity: 0, subtotal: 0 });
    }

    function buildCartLine(id, quantity, card) {
      var line = document.createElement("div");
      line.className = "cart-line";

      var image = card.querySelector(".product-visual img").cloneNode();
      image.alt = "";
      image.removeAttribute("loading");
      line.appendChild(image);

      var details = document.createElement("div");
      var title = document.createElement("h4");
      title.textContent = card.getAttribute("data-product-name");
      var price = document.createElement("p");
      price.textContent = money(Number(card.getAttribute("data-price"))) + " each";
      var controls = document.createElement("div");
      controls.className = "quantity-control";

      var decrease = document.createElement("button");
      decrease.type = "button";
      decrease.textContent = "-";
      decrease.setAttribute("aria-label", "Remove one " + title.textContent);
      decrease.addEventListener("click", function () { changeShopQuantity(id, -1); });

      var quantityLabel = document.createElement("span");
      quantityLabel.textContent = quantity;
      quantityLabel.setAttribute("aria-label", "Quantity " + quantity);

      var increase = document.createElement("button");
      increase.type = "button";
      increase.textContent = "+";
      increase.setAttribute("aria-label", "Add one " + title.textContent);
      increase.addEventListener("click", function () { changeShopQuantity(id, 1); });

      var remove = document.createElement("button");
      remove.type = "button";
      remove.className = "cart-remove";
      remove.textContent = "Remove";
      remove.addEventListener("click", function () { delete shopCart[id]; renderShopCart(); });

      controls.appendChild(decrease);
      controls.appendChild(quantityLabel);
      controls.appendChild(increase);
      controls.appendChild(remove);
      details.appendChild(title);
      details.appendChild(price);
      details.appendChild(controls);
      line.appendChild(details);

      var lineTotal = document.createElement("strong");
      lineTotal.className = "cart-line-total";
      lineTotal.textContent = money(Number(card.getAttribute("data-price")) * quantity);
      line.appendChild(lineTotal);
      return line;
    }

    function renderCheckoutOrder() {
      if (!checkoutOrder) return;
      checkoutOrder.textContent = "";
      Object.keys(shopCart).forEach(function (id) {
        var card = productById(id);
        var quantity = Math.max(0, parseInt(shopCart[id], 10) || 0);
        if (!card || !quantity) return;
        var row = document.createElement("div");
        row.className = "checkout-order-line";
        var name = document.createElement("span");
        name.textContent = card.getAttribute("data-product-name") + " × " + quantity;
        var price = document.createElement("strong");
        price.textContent = money(Number(card.getAttribute("data-price")) * quantity);
        row.appendChild(name);
        row.appendChild(price);
        checkoutOrder.appendChild(row);
      });
      var totalRow = document.createElement("div");
      totalRow.className = "checkout-order-line total";
      totalRow.innerHTML = "<span>Subtotal</span><strong></strong>";
      totalRow.querySelector("strong").textContent = money(cartTotals().subtotal);
      checkoutOrder.appendChild(totalRow);
    }

    function renderShopCart(animateBag) {
      cartItems.textContent = "";
      var totals = cartTotals();
      Object.keys(shopCart).forEach(function (id) {
        var quantity = Math.max(0, parseInt(shopCart[id], 10) || 0);
        var card = productById(id);
        if (card && quantity) cartItems.appendChild(buildCartLine(id, quantity, card));
      });
      cartCount.textContent = totals.quantity;
      cartToggle.setAttribute("aria-label", "Open shopping bag, " + totals.quantity + (totals.quantity === 1 ? " item" : " items"));
      cartToggle.classList.toggle("is-visible", totals.quantity > 0);
      if (animateBag && totals.quantity > 0) {
        cartToggle.classList.remove("pop");
        void cartToggle.offsetWidth;
        cartToggle.classList.add("pop");
      }
      cartSubtotal.textContent = money(totals.subtotal);
      cartEmpty.hidden = totals.quantity > 0;
      cartItems.hidden = totals.quantity === 0;
      document.querySelectorAll(".checkout-button").forEach(function (button) {
        if (button.closest(".shop-cart")) button.disabled = totals.quantity === 0;
      });
      persistShopCart();
    }

    function changeShopQuantity(id, amount, animateBag) {
      shopCart[id] = (parseInt(shopCart[id], 10) || 0) + amount;
      if (shopCart[id] <= 0) delete shopCart[id];
      renderShopCart(animateBag);
    }

    function setCartOpen(open) {
      cartPanel.hidden = !open;
      cartToggle.setAttribute("aria-expanded", String(open));
    }

    productCards.forEach(function (card) {
      var addButton = card.querySelector(".add-to-cart");
      addButton.addEventListener("click", function () {
        changeShopQuantity(card.getAttribute("data-product-id"), 1, true);
        addButton.textContent = "Added to bag";
        window.setTimeout(function () { addButton.textContent = "Add to bag"; }, 900);
      });
    });

    cartToggle.addEventListener("click", function () {
      setCartOpen(cartPanel.hidden);
    });
    if (cartClose) cartClose.addEventListener("click", function () { setCartOpen(false); });

    document.querySelectorAll(".shop-cart .checkout-button").forEach(function (button) {
      button.addEventListener("click", function () {
        if (!checkoutModal || !cartTotals().quantity) return;
        renderCheckoutOrder();
        checkoutModal.showModal();
        var success = checkoutModal.querySelector(".checkout-success");
        if (success) success.hidden = true;
      });
    });

    if (checkoutModal) {
      checkoutModal.querySelector(".checkout-close").addEventListener("click", function () { checkoutModal.close(); });
      checkoutModal.addEventListener("click", function (event) {
        if (event.target === checkoutModal) checkoutModal.close();
      });
    }

    if (checkoutForm) {
      checkoutForm.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!checkoutForm.reportValidity()) return;
        var customerName = checkoutForm.querySelector("[name='name']").value.trim();
        var success = checkoutForm.querySelector(".checkout-success");
        success.textContent = "Thanks, " + customerName + ". Your demo order is ready to review. No payment was taken and no order was placed.";
        success.hidden = false;
      });
    }

    renderShopCart();
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
