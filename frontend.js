/**
 * ShieldCare — Đại lý Bảo hiểm (frontend)
 * Lắng nghe sự kiện submit của Form đăng ký tư vấn bảo hiểm
 */

// Chờ DOM tải xong mới gắn sự kiện để chắc chắn element tồn tại
document.addEventListener("DOMContentLoaded", function () {
  // Lấy form tư vấn theo id
  const form = document.getElementById("consultation-form");
  if (!form) return; // Nếu không tìm thấy form thì dừng lại

  // Đăng ký lắng nghe sự kiện submit của form
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Ngăn reload trang mặc định của form

    // Lấy giá trị tên khách hàng từ input name
    const nameInput = form.querySelector('[name="name"]');
    const name = nameInput ? nameInput.value.trim() : "";

    // Hiển thị alert lời cảm ơn kèm tên người dùng
    alert(`Cảm ơn bạn${name ? ", " + name : ""}! Chúng tôi sẽ liên hệ tư vấn sớm nhất.`);

    // Reset lại form sau khi gửi
    form.reset();
  });
});
(function () {
  "use strict";

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function onDomReady() {
    console.log("Frontend ready");
    initNavScroll();
    initMobileNav();
    initSmoothScroll();
    initConsultationForm();
    initFooterYear();
  }

  function initNavScroll() {
    const header = document.getElementById("site-header");
    if (!header) return;

    function updateScrolled() {
      header.classList.toggle("is-scrolled", window.scrollY > 16);
    }

    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
  }

  function initMobileNav() {
    const header = document.getElementById("site-header");
    const toggle = document.getElementById("nav-toggle");
    const menu = document.getElementById("nav-menu");
    if (!header || !toggle || !menu) return;

    function setOpen(open) {
      header.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
      document.body.style.overflow = open ? "hidden" : "";
    }

    toggle.addEventListener("click", function () {
      setOpen(!header.classList.contains("nav-open"));
    });

    menu.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 768px)").matches) {
          setOpen(false);
        }
      });
    });

    window.addEventListener("resize", function () {
      if (!window.matchMedia("(max-width: 768px)").matches) {
        setOpen(false);
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && header.classList.contains("nav-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  function initSmoothScroll() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        const id = this.getAttribute("href");
        if (!id || id === "#") return;

        const target = document.querySelector(id);
        if (!target) return;

        e.preventDefault();
        const header = document.getElementById("site-header");
        const offset = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - offset - 8;

        window.scrollTo({
          top: Math.max(0, top),
          behavior: reduceMotion ? "auto" : "smooth",
        });

        if (history.replaceState) {
          history.replaceState(null, "", id);
        }
      });
    });
  }

  function initConsultationForm() {
    const form = document.getElementById("consultation-form");
    if (!form) return;

    const successEl = document.getElementById("form-success");

    const fields = [
      {
        input: document.getElementById("full-name"),
        errorId: "error-full-name",
        validate: function (v) {
          return v.trim() ? "" : "Vui lòng nhập họ và tên.";
        },
      },
      {
        input: document.getElementById("phone"),
        errorId: "error-phone",
        validate: function (v) {
          return v.trim() ? "" : "Vui lòng nhập số điện thoại.";
        },
      },
      {
        input: document.getElementById("email"),
        errorId: "error-email",
        validate: function (v) {
          if (!v.trim()) return "Vui lòng nhập email.";
          return EMAIL_REGEX.test(v.trim()) ? "" : "Email không hợp lệ.";
        },
      },
      {
        input: document.getElementById("insurance-type"),
        errorId: "error-insurance-type",
        validate: function (v) {
          return v ? "" : "Vui lòng chọn loại bảo hiểm.";
        },
      },
    ];

    function clearErrors() {
      fields.forEach(function (f) {
        if (!f.input) return;
        f.input.removeAttribute("aria-invalid");
        const err = document.getElementById(f.errorId);
        if (err) err.textContent = "";
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearErrors();
      if (successEl) successEl.hidden = true;

      let firstInvalid = null;

      fields.forEach(function (f) {
        if (!f.input) return;
        const msg = f.validate(f.input.value);
        if (msg) {
          f.input.setAttribute("aria-invalid", "true");
          const errEl = document.getElementById(f.errorId);
          if (errEl) errEl.textContent = msg;
          if (!firstInvalid) firstInvalid = f.input;
        }
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      form.reset();
      if (successEl) successEl.hidden = false;
    });
  }

  function initFooterYear() {
    const el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onDomReady);
  } else {
    onDomReady();
  }
})();
