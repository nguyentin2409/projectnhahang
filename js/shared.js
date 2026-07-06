/**
 * shared.js - Script dùng chung cho TẤT CẢ các trang trong website
 * MSSV: B2405536 - Họ tên: Nguyễn Bảo Tín
 *
 * Các chức năng chính:
 *  1. Chèn header (menu điều hướng) vào mọi trang qua thẻ <div id="site-header">
 *  2. Chèn footer vào mọi trang qua thẻ <div id="site-footer">
 *  3. Gắn class "active" cho link điều hướng ứng với trang đang xem
 *  4. Xử lý mở/đóng menu điều hướng trên di động (nút hamburger .nav-toggle)
 *  5. Đổi màu nền header khi người dùng cuộn trang xuống
 *  6. Hiện số lượng "món yêu thích" (do trang Menu lưu vào localStorage)
 *     lên icon ♥ trên header, để khách thấy được ở BẤT KỲ trang nào,
 *     không riêng gì trang Menu.
 */
document.addEventListener("DOMContentLoaded", () => {
  const FAVORITE_STORAGE_KEY = "vingon_favorites";

  // ===== 1. CHÈN HEADER =====
  // Tìm khung chứa header (mỗi trang HTML đều có <div id="site-header">)
  // rồi thay thế bằng nội dung header đầy đủ (logo, menu, icon yêu thích,
  // nút đặt bàn, nút hamburger)
  const headerPlaceholder = document.getElementById("site-header");
  if (headerPlaceholder) {
    headerPlaceholder.outerHTML = `
      <header class="site-header" id="site-header">
        <a href="../index.html" class="header-logo">
          <div class="logo-icon">V</div>
          <div>
            <span class="logo-name">Vị Ngon</span>
            <span class="logo-sub">Fine Dining</span>
          </div>
        </a>

        <nav class="nav-links" id="nav-links">
          <a href="/index.html"         data-page="home">Trang Chủ</a>
          <a href="/pages/menu.html"    data-page="menu">Thực Đơn</a>
          <a href="/pages/reservation.html" data-page="reservation">Đặt Bàn</a>
          <a href="/pages/about.html"   data-page="about">Giới Thiệu</a>
          <a href="/pages/contact.html" data-page="contact">Liên Hệ</a>
        </nav>

        <div class="header-actions">
          <a
            href="/pages/menu.html#favorite"
            class="btn-favorite-header"
            id="favorite-header-btn"
            aria-label="Xem món yêu thích"
          >
            ♥
            <span class="favorite-badge hidden" id="favorite-badge">0</span>
          </a>

          <a href="/pages/reservation.html" class="btn-reserve">Đặt Bàn Ngay</a>

          <button class="nav-toggle" id="nav-toggle" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>`;
  }

  // ===== 2. CHÈN FOOTER =====
  // Tương tự header: tìm <div id="site-footer"> và thay bằng nội dung footer đầy đủ
  const footerPlaceholder = document.getElementById("site-footer");
  if (footerPlaceholder) {
    footerPlaceholder.outerHTML = `
      <footer class="site-footer" id="site-footer">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="logo-name">Vị Ngon</div>
            <p>Nơi ẩm thực truyền thống Việt Nam gặp gỡ nghệ thuật bếp núc hiện đại. Trải nghiệm từng bữa ăn như một hành trình.</p>
          </div>

          <div class="footer-col">
            <h4>Khám Phá</h4>
            <ul>
              <li><a href="/index.html">Trang Chủ</a></li>
              <li><a href="/pages/menu.html">Thực Đơn</a></li>
              <li><a href="/pages/reservation.html">Đặt Bàn</a></li>
              <li><a href="/pages/about.html">Giới Thiệu</a></li>
              <li><a href="/pages/contact.html">Liên Hệ</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Giờ Mở Cửa</h4>
            <ul>
              <li><a>T2 – T5: 10:00 – 22:00</a></li>
              <li><a>T6 – T7: 10:00 – 23:00</a></li>
              <li><a>Chủ Nhật: 10:00 – 21:00</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Liên Hệ</h4>
            <ul>
              <li><a href="tel:+84901234567">0901 234 567</a></li>
              <li><a href="mailto:info@vingon.vn">info@vingon.vn</a></li>
              <li><a>123 Đường Ẩm Thực,<br>Q.1, TP. HCM</a></li>
            </ul>
          </div>
        </div>
      </footer>`;
  }

  // ===== 3. ĐÁNH DẤU LINK ĐANG ĐƯỢC XEM (active state) =====
  // So sánh đường dẫn URL hiện tại với thuộc tính href của từng link điều hướng
  // Nếu trùng khớp -> thêm class "active" để CSS bôi màu/gạch chân link đó
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

  // ===== 4. MENU DI ĐỘNG (hamburger) =====
  // Khi bấm nút .nav-toggle: bật/tắt class "nav-mobile-open" trên <body>
  // (CSS dựa vào class này để hiện/ẩn menu dạng dropdown trên màn hình nhỏ)
  // đồng thời đổi class "open" trên chính nút để tạo hiệu ứng chuyển icon hamburger -> dấu X
  const navToggle = document.getElementById("nav-toggle");
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      document.body.classList.toggle("nav-mobile-open");
      navToggle.classList.toggle("open");
    });
  }

  // ===== 5. HIỆU ỨNG HEADER KHI CUỘN TRANG =====
  // Khi cuộn xuống quá 40px, header sẽ có nền tối/đậm hơn để dễ đọc chữ
  // Dùng { passive: true } để tối ưu hiệu năng cuộn trang
  const header = document.getElementById("site-header");
  if (header) {
    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > 40) {
          header.style.background = "rgba(15,13,11,0.98)";
        } else {
          header.style.background = "rgba(15,13,11,0.92)";
        }
      },
      { passive: true },
    );
  }

  // ===== 6. SỐ LƯỢNG MÓN YÊU THÍCH TRÊN ICON HEADER =====
  // Đọc danh sách món yêu thích (do menu.js lưu vào localStorage khi khách
  // bấm ♥ ở trang Menu) rồi hiện số lượng lên badge cạnh icon ♥ trên header.
  // Hàm này được gắn vào window để menu.js có thể gọi lại ngay khi khách
  // thêm/bỏ món yêu thích, mà không cần tải lại trang.
  function updateFavoriteBadge() {
    const badge = document.getElementById("favorite-badge");
    if (!badge) return;

    let favorites = [];
    try {
      favorites = JSON.parse(localStorage.getItem(FAVORITE_STORAGE_KEY)) || [];
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
  updateFavoriteBadge(); // Hiện đúng số lượng ngay khi vừa tải trang
});
