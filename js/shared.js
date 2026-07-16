/**
 * ==========================================================================
 * shared.js - Script dùng chung cho TẤT CẢ các trang trong website
 * MSSV: B2405536 - Họ tên: Nguyễn Bảo Tín
 * ==========================================================================
 * CÁC CHỨC NĂNG CHÍNH TRONG FILE NÀY (đánh số theo từng khối code bên dưới):
 *  1. Chèn header vào mọi trang qua <div id="site-header">
 *  2. Chèn footer vào mọi trang qua <div id="site-footer">
 *  3. Tự động gắn class "active" cho link điều hướng của TRANG ĐANG XEM
 *  4. Xử lý mở/đóng menu điều hướng trên di động (nút hamburger)
 *  5. Đổi màu nền header khi cuộn trang (hiệu ứng thẩm mỹ)
 *  6. Hiện số lượng "món yêu thích" lên icon ♥ trên header
 */
document.addEventListener("DOMContentLoaded", () => {
  const FAVORITE_STORAGE_KEY = "vingon_favorites";

  // ==========================================================================
  // HÀM TIỆN ÍCH DÙNG CHUNG: tạo 1 phần tử bằng DOM API (KHÔNG dùng chuỗi HTML)
  // ==========================================================================
  /**
   * createEl(tag, attrs, text): tạo và trả về 1 phần tử HTML mới.
   * - tag: tên thẻ, vd "div", "a", "span"
   * - attrs: object chứa các thuộc tính cần gắn, vd { href: "...", class: "..." }
   *   (dùng setAttribute cho từng cặp key-value, KHÔNG parse chuỗi HTML)
   * - text: chữ hiển thị bên trong thẻ (gán bằng textContent, an toàn, không
   *   parse HTML nên không lo lỗi XSS như khi dùng innerHTML)
   * Hàm này giúp code ngắn gọn hơn thay vì phải gọi createElement +
   * setAttribute lặp lại nhiều lần cho mỗi phần tử.
   */
  function createEl(tag, attrs = {}, text = "") {
    const el = document.createElement(tag);
    Object.keys(attrs).forEach((key) => {
      el.setAttribute(key, attrs[key]);
    });
    if (text) {
      el.textContent = text;
    }
    return el;
  }

  // ==========================================================================
  // 1. DỰNG HEADER bằng DOM API rồi chèn vào <div id="site-header">
  // ==========================================================================
  function buildHeader() {
    const header = createEl("header", { class: "site-header", id: "site-header" });

    // ----- Logo -----
    const logoLink = createEl("a", { href: "../index.html", class: "header-logo" });
    const logoIcon = createEl("div", { class: "logo-icon" }, "V");
    const logoTextWrap = document.createElement("div");
    logoTextWrap.appendChild(createEl("span", { class: "logo-name" }, "Vị Ngon"));
    logoTextWrap.appendChild(createEl("span", { class: "logo-sub" }, "Fine Dining"));
    logoLink.appendChild(logoIcon);
    logoLink.appendChild(logoTextWrap);

    // ----- Menu điều hướng -----
    const nav = createEl("nav", { class: "nav-links", id: "nav-links" });
    const navItems = [
      { href: "/index.html", page: "home", text: "Trang Chủ" },
      { href: "/pages/menu.html", page: "menu", text: "Thực Đơn" },
      { href: "/pages/reservation.html", page: "reservation", text: "Đặt Bàn" },
      { href: "/pages/about.html", page: "about", text: "Giới Thiệu" },
      { href: "/pages/contact.html", page: "contact", text: "Liên Hệ" },
    ];
    navItems.forEach(({ href, page, text }) => {
      nav.appendChild(createEl("a", { href, "data-page": page }, text));
    });

    // ----- Nhóm bên phải: icon yêu thích, nút đặt bàn, nút hamburger -----
    const actions = createEl("div", { class: "header-actions" });

    // Icon ♥ hiện SỐ LƯỢNG món yêu thích (khối số 6 bên dưới cập nhật).
    // Bấm vào chuyển thẳng tới trang riêng pages/favorite.html.
    const favLink = createEl("a", {
      href: "/pages/favorite.html",
      class: "btn-favorite-header",
      id: "favorite-header-btn",
      "aria-label": "Xem món yêu thích",
    });
    // Icon ♥ là 1 text node, badge số lượng là 1 <span> riêng - phải
    // appendChild từng phần, không thể gộp thành 1 chuỗi textContent vì
    // sẽ mất đi thẻ <span id="favorite-badge"> cần cho khối số 6.
    favLink.appendChild(document.createTextNode("♥ "));
    favLink.appendChild(createEl("span", { class: "favorite-badge hidden", id: "favorite-badge" }, "0"));

    const reserveLink = createEl("a", { href: "/pages/reservation.html", class: "btn-reserve" }, "Đặt Bàn Ngay");

    const navToggle = createEl("button", { class: "nav-toggle", id: "nav-toggle", "aria-label": "Menu" });
    // 3 gạch ngang của icon hamburger - mỗi gạch là 1 thẻ <span> rỗng
    navToggle.appendChild(document.createElement("span"));
    navToggle.appendChild(document.createElement("span"));
    navToggle.appendChild(document.createElement("span"));

    actions.appendChild(favLink);
    actions.appendChild(reserveLink);
    actions.appendChild(navToggle);

    header.appendChild(logoLink);
    header.appendChild(nav);
    header.appendChild(actions);

    return header;
  }

  const headerPlaceholder = document.getElementById("site-header");
  if (headerPlaceholder) {
    // replaceWith(): thay THẲNG phần tử <div id="site-header"> bằng thẻ
    // <header> vừa dựng xong - đây là phương thức DOM thật (Node.replaceWith),
    // KHÔNG phải gán chuỗi HTML như outerHTML trước đây.
    headerPlaceholder.replaceWith(buildHeader());
  }

  // ==========================================================================
  // 2. DỰNG FOOTER bằng DOM API rồi chèn vào <div id="site-footer">
  // ==========================================================================
  function buildFooter() {
    const footer = createEl("footer", { class: "site-footer", id: "site-footer" });
    const grid = createEl("div", { class: "footer-grid" });

    // ----- Cột giới thiệu thương hiệu -----
    const brandCol = createEl("div", { class: "footer-brand" });
    brandCol.appendChild(createEl("div", { class: "logo-name" }, "Vị Ngon"));
    brandCol.appendChild(
      createEl(
        "p",
        {},
        "Nơi ẩm thực truyền thống Việt Nam gặp gỡ nghệ thuật bếp núc hiện đại. Trải nghiệm từng bữa ăn như một hành trình.",
      ),
    );

    // Hàm dùng chung: tạo 1 cột footer có tiêu đề <h4> + danh sách <ul><li><a>
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

    // ----- Cột liên hệ (địa chỉ có xuống dòng <br>, cần dựng riêng) -----
    const contactCol = createEl("div", { class: "footer-col" });
    contactCol.appendChild(createEl("h4", {}, "Liên Hệ"));
    const contactList = document.createElement("ul");

    const phoneLi = document.createElement("li");
    phoneLi.appendChild(createEl("a", { href: "tel:+84901234567" }, "0901 234 567"));
    contactList.appendChild(phoneLi);

    const emailLi = document.createElement("li");
    emailLi.appendChild(createEl("a", { href: "mailto:info@vingon.vn" }, "info@vingon.vn"));
    contactList.appendChild(emailLi);

    // Địa chỉ có 1 dấu xuống dòng <br> ở giữa - không thể gán bằng
    // textContent (sẽ mất định dạng xuống dòng), nên phải dựng bằng 2
    // text node + 1 thẻ <br> nối lại bằng appendChild.
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
  if (footerPlaceholder) {
    footerPlaceholder.replaceWith(buildFooter());
  }

  // ==========================================================================
  // 3. ĐÁNH DẤU LINK ĐANG ĐƯỢC XEM (active state trên menu điều hướng)
  // ==========================================================================
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".nav-links a[data-page]");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (
      currentPath.endsWith(href) ||
      (currentPath.endsWith("/") && href.includes("index.html")) ||
      (currentPath === "/" && href.includes("index.html"))
    ) {
      link.classList.add("active");
    }
  });

  // ==========================================================================
  // 4. MENU DI ĐỘNG (hamburger) — ẨN/HIỆN menu dạng dropdown trên màn hình nhỏ
  // ==========================================================================
  const navToggle = document.getElementById("nav-toggle");
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      document.body.classList.toggle("nav-mobile-open");
      navToggle.classList.toggle("open");
    });
  }

  // ==========================================================================
  // 5. HIỆU ỨNG HEADER KHI CUỘN TRANG (đổi độ đậm màu nền)
  // ==========================================================================
  const header = document.getElementById("site-header");
  if (header) {
    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > 40) {
          header.style.background = "rgba(240, 222, 190, 0.98)";
          header.style.boxShadow = "0 4px 20px rgba(45, 35, 24, 0.15)";
        } else {
          header.style.background = "rgba(253, 248, 242, 0.95)";
          header.style.boxShadow = "0 2px 12px rgba(184, 137, 58, 0.07)";
        }
      },
      { passive: true },
    );
  }

  // ==========================================================================
  // 6. SỐ LƯỢNG MÓN YÊU THÍCH TRÊN ICON HEADER (đồng bộ với trang Menu)
  // ==========================================================================
  function updateFavoriteBadge() {
    const badge = document.getElementById("favorite-badge");
    if (!badge) return;

    let favorites = [];
    try {
      const parsed = JSON.parse(localStorage.getItem(FAVORITE_STORAGE_KEY)) || [];
      favorites = parsed.filter(
        (item) => item && typeof item === "object" && typeof item.id === "string",
      );
    } catch (err) {
      favorites = [];
    }

    if (favorites.length > 0) {
      badge.textContent = favorites.length;
      badge.classList.remove("hidden");
    } else {
      badge.classList.add("hidden");
    }
  }

  window.updateFavoriteBadge = updateFavoriteBadge;
  updateFavoriteBadge();
});