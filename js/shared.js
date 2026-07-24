/**
 * shared.js - Header/footer dùng chung cho mọi trang + các xử lý chung
 * MSSV: B2405536 - Họ tên: Nguyễn Bảo Tín
 *
 * Mỗi trang chỉ để 2 chỗ trống <div id="site-header"> và <div id="site-footer">,
 * file này dựng header/footer bằng DOM API rồi thay vào 2 chỗ trống đó bằng parentNode.replaceChild().
 */
document.addEventListener("DOMContentLoaded", () => {
 const username = localStorage.getItem("vingon_username");
const STORAGE_KEY = username
    ? `vingon_favorites_${username}`
    : "vingon_favorites_guest";
  // Tạo 1 phần tử DOM: gán các thuộc tính trong "attrs" (key camelCase tự đổi
  // sang kebab-case) và thêm chữ bằng createTextNode 
  function createEl(tag, attrs = {}, text = "") {
    const el = document.createElement(tag);
    Object.keys(attrs).forEach((key) => {
      const attrName = key.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());
      el.setAttribute(attrName, attrs[key]);
    });
    if (text) el.appendChild(document.createTextNode(text));
    return el;
  }

  // Thay 1 phần tử placeholder (VD <div id="site-header">) bằng phần tử mới dựng xong
  function replaceElement(oldEl, newEl) {
    oldEl.parentNode.replaceChild(newEl, oldEl);
  }

  // ===== 1. HEADER =====
  // Dựng toàn bộ thanh header: logo, menu điều hướng, nút đăng nhập, icon
  // yêu thích + badge, nút "Đặt Bàn Ngay", nút hamburger cho mobile
  function buildHeader() {
    const header = createEl("header", { class: "site-header", id: "site-header" });

    const logoLink = createEl("a", { href: "../index.html", class: "header-logo" });
    const logoTextWrap = document.createElement("div");
    logoTextWrap.appendChild(createEl("span", { class: "logo-name" }, "Vị Ngon"));
    logoTextWrap.appendChild(createEl("span", { class: "logo-sub" }, "Fine Dining"));
    logoLink.appendChild(createEl("div", { class: "logo-icon" }, "V"));
    logoLink.appendChild(logoTextWrap);

    const nav = createEl("nav", { class: "nav-links", id: "nav-links" });
    [
      { href: "/index.html", page: "home", text: "Trang Chủ" },
      { href: "/pages/menu.html", page: "menu", text: "Thực Đơn" },
      { href: "/pages/reservation.html", page: "reservation", text: "Đặt Bàn" },
      { href: "/pages/about.html", page: "about", text: "Giới Thiệu" },
      { href: "/pages/contact.html", page: "contact", text: "Liên Hệ" },
    ].forEach(({ href, page, text }) => nav.appendChild(createEl("a", { href, dataPage: page }, text)));

    const actions = createEl("div", { class: "header-actions" });
    // Nút đăng nhập
    const loginLink = createEl("a", {
      href: "/pages/login.html",
      class: "btn-login-header",
      id: "login-btn",
      ariaLabel: "Đăng nhập",
    }, "Đăng nhập");
    // Icon ♥ + badge số lượng món yêu thích -> trỏ sang trang favorite.html
    const favLink = createEl("a", {
      href: "/pages/favorite.html",
      class: "btn-favorite-header",
      id: "favorite-header-btn",
      ariaLabel: "Xem món yêu thích",
    });
    favLink.appendChild(document.createTextNode("♥ "));
    favLink.appendChild(createEl("span", { class: "favorite-badge hidden", id: "favorite-badge" }, "0"));

    const reserveLink = createEl("a", { href: "/pages/reservation.html", class: "btn-reserve" }, "Đặt Bàn Ngay");

    const navToggle = createEl("button", { class: "nav-toggle", id: "nav-toggle", ariaLabel: "Menu" });
    for (let i = 0; i < 3; i++) navToggle.appendChild(document.createElement("span"));

    actions.appendChild(loginLink);
    actions.appendChild(favLink);
    actions.appendChild(reserveLink);
    actions.appendChild(navToggle);

    header.appendChild(logoLink);
    header.appendChild(nav);
    header.appendChild(actions);
    return header;
  }

  const headerPlaceholder = document.getElementById("site-header");
  if (headerPlaceholder) replaceElement(headerPlaceholder, buildHeader());

  // ===== 2. FOOTER =====
  // Dựng 1 cột footer gồm tiêu đề + danh sách link (dùng lại cho "Khám Phá", "Giờ Mở Cửa"...)
  function buildFooterColumn(title, linkItems) {
    const col = createEl("div", { class: "footer-col" });
    col.appendChild(createEl("h4", {}, title));
    const ul = document.createElement("ul");
    linkItems.forEach(({ href, text }) => {
      const li = document.createElement("li");
      li.appendChild(href ? createEl("a", { href }, text) : createEl("a", {}, text));
      ul.appendChild(li);
    });
    col.appendChild(ul);
    return col;
  }

  // Dựng toàn bộ footer: cột thương hiệu, khám phá, giờ mở cửa, liên hệ
  function buildFooter() {
    const footer = createEl("footer", { class: "site-footer", id: "site-footer" });
    const grid = createEl("div", { class: "footer-grid" });

    const brandCol = createEl("div", { class: "footer-brand" });
    brandCol.appendChild(createEl("div", { class: "logo-name" }, "Vị Ngon"));
    brandCol.appendChild(
      createEl("p", {}, "Nơi ẩm thực truyền thống Việt Nam gặp gỡ nghệ thuật bếp núc hiện đại."),
    );

    const exploreCol = buildFooterColumn("Khám Phá", [
      { href: "/index.html", text: "Trang Chủ" },
      { href: "/pages/menu.html", text: "Thực Đơn" },
      { href: "/pages/reservation.html", text: "Đặt Bàn" },
      { href: "/pages/about.html", text: "Giới Thiệu" },
      { href: "/pages/contact.html", text: "Liên Hệ" },
    ]);

    const hoursCol = buildFooterColumn("Giờ Mở Cửa", [
      { href: "", text: "T2 – T5: 10:00 – 22:00" },
      { href: "", text: "T6 – T7: 10:00 – 23:00" },
      { href: "", text: "Chủ Nhật: 10:00 – 21:00" },
    ]);

    const contactCol = createEl("div", { class: "footer-col" });
    contactCol.appendChild(createEl("h4", {}, "Liên Hệ"));
    const contactList = document.createElement("ul");

    const phoneLi = document.createElement("li");
    phoneLi.appendChild(createEl("a", { href: "tel:+84901234567" }, "0901 234 567"));
    contactList.appendChild(phoneLi);

    const emailLi = document.createElement("li");
    emailLi.appendChild(createEl("a", { href: "mailto:info@vingon.vn" }, "info@vingon.vn"));
    contactList.appendChild(emailLi);

    const addressLi = document.createElement("li");
    const addressLink = document.createElement("a");
    addressLink.appendChild(document.createTextNode("123 Đường Ẩm Thực,"));
    addressLink.appendChild(document.createElement("br"));
    addressLink.appendChild(document.createTextNode("Q.1, TP. HCM"));
    addressLi.appendChild(addressLink);
    contactList.appendChild(addressLi);
    contactCol.appendChild(contactList);

    grid.appendChild(brandCol);
    grid.appendChild(exploreCol);
    grid.appendChild(hoursCol);
    grid.appendChild(contactCol);
    footer.appendChild(grid);
    return footer;
  }

  const footerPlaceholder = document.getElementById("site-footer");
  if (footerPlaceholder) replaceElement(footerPlaceholder, buildFooter());

  // ===== 3. ACTIVE LINK theo trang đang xem =====
  // So khớp URL hiện tại với href của từng link nav, gắn class "active" cho link đúng trang
  const currentPath = window.location.pathname;
  document.querySelectorAll(".nav-links a[data-page]").forEach((link) => {
    const href = link.getAttribute("href");
    if (
      currentPath.endsWith(href) ||
      (currentPath.endsWith("/") && href.includes("index.html")) ||
      (currentPath === "/" && href.includes("index.html"))
    ) {
      link.classList.add("active");
    }
  });

  // ===== 4. MENU MOBILE (hamburger) =====
  // Bấm nút hamburger thì mở/đóng menu điều hướng trên mobile
  const navToggle = document.getElementById("nav-toggle");
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      document.body.classList.toggle("nav-mobile-open");
      navToggle.classList.toggle("open");
    });
  }

  // ===== 5. HIỆU ỨNG HEADER KHI CUỘN TRANG =====
  // Cuộn xuống quá 40px thì đổi nền header đậm hơn + thêm bóng đổ
  const header = document.getElementById("site-header");
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 40) {
        header.style.background = "rgba(240, 222, 190, 0.98)";
        header.style.boxShadow = "0 4px 20px rgba(45, 35, 24, 0.15)";
      } else {
        header.style.background = "rgba(253, 248, 242, 0.95)";
        header.style.boxShadow = "0 2px 12px rgba(184, 137, 58, 0.07)";
      }
    });
  }

  // ===== 6. BADGE SỐ LƯỢNG MÓN YÊU THÍCH TRÊN HEADER =====
  // Đọc localStorage, đếm số món yêu thích hợp lệ, cập nhật số + ẩn/hiện badge
  function updateFavoriteBadge() {
    const badge = document.getElementById("favorite-badge");
    if (!badge) return;

    let favorites = [];
    try {
      const parsed = JSON.parse(localStorage.getItem(FAVORITE_STORAGE_KEY)) || [];
      favorites = parsed.filter((item) => item && typeof item === "object" && typeof item.id === "string");
    } catch (err) {
      favorites = [];
    }

    while (badge.firstChild) badge.removeChild(badge.firstChild);

    if (favorites.length > 0) {
      badge.appendChild(document.createTextNode(String(favorites.length)));
      badge.classList.remove("hidden");
    } else {
      badge.appendChild(document.createTextNode("0"));
      badge.classList.add("hidden");
    }
  }

  // Cho phép các file JS khác (menu.js, favorite.js) gọi lại hàm cập nhật badge
  window.updateFavoriteBadge = updateFavoriteBadge;

  // ===== 7. HIỂN THỊ ĐĂNG NHẬP / ĐĂNG XUẤT =====
  // Dựa vào trạng thái đăng nhập lưu trong localStorage để đổi nút thành
  // "Đăng nhập" hoặc "Đăng xuất" (đăng xuất thì xoá localStorage + tải lại trang)
  const loginBtn = document.getElementById("login-btn");

  if (loginBtn) {
    const isLoggedIn = localStorage.getItem("vingon_logged_in") === "true";

    // Đổi chữ hiển thị trên nút đăng nhập/đăng xuất (không dùng textContent)
    function setLoginBtnText(text) {
      while (loginBtn.firstChild) loginBtn.removeChild(loginBtn.firstChild);
      loginBtn.appendChild(document.createTextNode(text));
    }

    if (isLoggedIn) {
      setLoginBtnText("Đăng xuất");
      loginBtn.href = "#";

      loginBtn.addEventListener("click", (e) => {
        e.preventDefault();

        if (confirm("Bạn có muốn đăng xuất không?")) {
          localStorage.removeItem("vingon_logged_in");
          localStorage.removeItem("vingon_username");

          location.reload();
        }
      });
    } else {
      setLoginBtnText("Đăng nhập");
      loginBtn.href = "/pages/login.html";
    }
  }

  updateFavoriteBadge();
});
