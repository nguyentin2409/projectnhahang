/**
 * ==========================================================================
 * shared.js - Script dùng chung cho TẤT CẢ các trang trong website
 * MSSV: B2405536 - Họ tên: Nguyễn Bảo Tín
 * ==========================================================================
 *
 * TẠI SAO CẦN 1 FILE "DÙNG CHUNG" RIÊNG?
 *  - Header (logo, menu điều hướng, icon yêu thích, nút đặt bàn) và footer
 *    giống nhau y hệt ở TẤT CẢ các trang (index.html, menu.html, about.html...).
 *  - Nếu copy-dán HTML header/footer vào từng trang, sau này sửa 1 chỗ (vd
 *    đổi số điện thoại) sẽ phải sửa lại ở TẤT CẢ các file HTML — dễ sót,
 *    dễ sai lệch giữa các trang.
 *  - Giải pháp: mỗi trang HTML chỉ để 2 "chỗ trống" là
 *    <div id="site-header"></div> và <div id="site-footer"></div>,
 *    rồi shared.js sẽ TỰ ĐỘNG chèn đầy đủ nội dung HTML thật vào 2 chỗ
 *    trống đó ngay khi trang vừa load — đây gọi là kỹ thuật "template
 *    JavaScript" / "component dùng chung", rất phổ biến khi làm web tĩnh
 *    (không dùng framework) mà vẫn muốn tránh lặp code.
 *
 * CÁC CHỨC NĂNG CHÍNH TRONG FILE NÀY (đánh số theo từng khối code bên dưới):
 *  1. Chèn header vào mọi trang qua <div id="site-header">
 *  2. Chèn footer vào mọi trang qua <div id="site-footer">
 *  3. Tự động gắn class "active" cho link điều hướng của TRANG ĐANG XEM
 *     (để CSS bôi đậm/gạch chân đúng link đó trong menu)
 *  4. Xử lý mở/đóng menu điều hướng trên di động (nút hamburger)
 *  5. Đổi màu nền header khi cuộn trang (hiệu ứng thẩm mỹ)
 *  6. Hiện số lượng "món yêu thích" lên icon ♥ trên header — icon này
 *     hiện ở MỌI trang (vì nằm trong header dùng chung), không chỉ ở
 *     trang Menu, để khách thấy được số món mình đã thích dù đang ở
 *     trang nào của website.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Khoá localStorage phải TRÙNG KHỚP TUYỆT ĐỐI với khoá bên menu.js
  // (biến STORAGE_KEY ở file đó), vì 2 file JS này không hề "gọi" nhau
  // trực tiếp — chúng chỉ "giao tiếp" gián tiếp qua cùng 1 khoá lưu trong
  // localStorage của trình duyệt. Nếu đặt tên khoá khác nhau, shared.js
  // sẽ đọc nhầm chỗ không có dữ liệu và luôn hiện số 0.
  const FAVORITE_STORAGE_KEY = "vingon_favorites";

  // ==========================================================================
  // 1. CHÈN HEADER
  // ==========================================================================
  // Tìm phần tử <div id="site-header"> (đã có sẵn, để trống, trong mỗi
  // file HTML), sau đó GHI ĐÈ nó bằng đoạn HTML <header>...</header> đầy
  // đủ, chứa logo, menu điều hướng, icon yêu thích, nút đặt bàn, nút hamburger.
  //
  // outerHTML (khác với innerHTML): thay luôn CẢ THẺ <div id="site-header">
  // bằng thẻ mới, không giữ lại thẻ div bọc ngoài — vì <header> cần là thẻ
  // gốc để CSS .site-header { position: fixed... } hoạt động đúng.
  const headerPlaceholder = document.getElementById("site-header");
  if (headerPlaceholder) {
    // Dùng template string (dấu backtick `...`) để viết được HTML nhiều
    // dòng ngay trong JavaScript một cách dễ đọc, giống hệt cú pháp HTML
    // thường, thay vì phải nối chuỗi bằng dấu + rất khó đọc.
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

        <!-- Nhóm các phần tử bên phải header: icon yêu thích, nút đặt bàn,
             nút hamburger. Gom vào 1 div .header-actions để dễ dàng canh
             layout flexbox (xem css/shared.css) mà không ảnh hưởng .nav-links -->
        <div class="header-actions">
          <!--
            Icon ♥ hiện SỐ LƯỢNG món yêu thích (đọc từ localStorage, do
            khối code số 6 ở cuối file này cập nhật). Bấm vào sẽ chuyển
            tới menu.html kèm "#favorite" ở cuối URL — menu.js đọc phần
            "#favorite" này để tự động mở đúng tab "Yêu Thích" cho khách,
            không phải tự bấm tab thêm lần nữa.
          -->
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

  // ==========================================================================
  // 2. CHÈN FOOTER
  // ==========================================================================
  // Hoàn toàn tương tự cách chèn header ở trên: tìm <div id="site-footer">
  // rồi thay bằng nội dung <footer> đầy đủ (thông tin liên hệ, giờ mở cửa,
  // các liên kết điều hướng lặp lại ở footer cho tiện truy cập).
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

  // ==========================================================================
  // 3. ĐÁNH DẤU LINK ĐANG ĐƯỢC XEM (active state trên menu điều hướng)
  // ==========================================================================
  // Ý tưởng: so sánh đường dẫn URL hiện tại (window.location.pathname, vd
  // "/pages/menu.html") với thuộc tính href của TỪNG link trong menu, nếu
  // trùng khớp thì thêm class "active" -> CSS (shared.css) sẽ tô màu vàng
  // và gạch chân link đó, giúp khách biết mình đang ở trang nào.
  //
  // Đoạn code này PHẢI đặt SAU đoạn chèn header ở trên, vì lúc này header
  // (và các link .nav-links a) mới thực sự tồn tại trong DOM để querySelectorAll
  // tìm thấy được — nếu đặt trước, querySelectorAll sẽ trả về danh sách RỖNG.
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".nav-links a[data-page]");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (
      // Trường hợp thường gặp: URL hiện tại kết thúc đúng bằng href của link
      // (vd currentPath = "/pages/menu.html", href = "/pages/menu.html")
      currentPath.endsWith(href) ||
      // Trường hợp đặc biệt cho Trang Chủ: khi vào bằng đường dẫn gốc "/"
      // (không có "index.html" trong URL), vẫn phải nhận diện đúng link Trang Chủ.
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
      // Bật/tắt (toggle) class "nav-mobile-open" trên <body> — CSS dựa vào
      // class này trên body để quyết định hiện/ẩn .nav-links dạng dropdown
      // (xem shared.css, khối ".nav-mobile-open .nav-links").
      document.body.classList.toggle("nav-mobile-open");

      // Bật/tắt class "open" trên chính nút hamburger để chạy hiệu ứng
      // CSS biến 3 gạch ngang thành hình dấu X (xem shared.css, khối
      // ".nav-toggle.open span:nth-child(...)").
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
        // window.scrollY: số pixel đã cuộn xuống kể từ đầu trang.
        // Cuộn quá 40px -> header có nền đậm/tối hơn 1 chút để chữ trong
        // header luôn đủ tương phản, dễ đọc dù nội dung trang cuộn qua nền sáng.
        if (window.scrollY > 40) {
          header.style.background = "rgba(15,13,11,0.98)";
        } else {
          header.style.background = "rgba(15,13,11,0.92)";
        }
      },
      // { passive: true }: báo cho trình duyệt biết sự kiện này KHÔNG bao
      // giờ gọi event.preventDefault(), nhờ đó trình duyệt tối ưu được
      // hiệu năng cuộn trang (không phải chờ hàm callback chạy xong mới
      // cuộn tiếp) — nên luôn thêm option này cho sự kiện "scroll".
      { passive: true },
    );
  }

  // ==========================================================================
  // 6. SỐ LƯỢNG MÓN YÊU THÍCH TRÊN ICON HEADER (đồng bộ với trang Menu)
  // ==========================================================================
  /**
   * Đọc danh sách món yêu thích từ localStorage (do menu.js LƯU khi khách
   * bấm ♥ ở trang Menu) rồi hiện SỐ LƯỢNG lên badge tròn cạnh icon ♥ trên
   * header — icon này có mặt ở MỌI trang vì nằm trong header dùng chung.
   *
   * TẠI SAO PHẢI GẮN HÀM NÀY VÀO window (window.updateFavoriteBadge = ...)?
   *  - menu.js và shared.js là 2 FILE HOÀN TOÀN ĐỘC LẬP, không có câu lệnh
   *    import/export nào giữa 2 file (vì đây là JavaScript thuần load
   *    trực tiếp bằng <script>, không dùng module).
   *  - Khi khách bấm ♥ ở trang Menu, menu.js cần "nhờ" shared.js vẽ lại
   *    badge trên header NGAY LẬP TỨC (không đợi tải lại trang).
   *  - Cách duy nhất để 2 file JS "gọi hàm của nhau" trong tình huống này
   *    là gắn hàm đó vào đối tượng "window" — window là đối tượng TOÀN CỤC
   *    (global) mà MỌI file JS trong cùng 1 trang đều truy cập được. Sau
   *    dòng "window.updateFavoriteBadge = updateFavoriteBadge;" ở cuối,
   *    menu.js chỉ cần gọi window.updateFavoriteBadge() là chạy được hàm
   *    này, dù nó được ĐỊNH NGHĨA bên trong shared.js.
   *  - Đây là kỹ thuật cơ bản để chia sẻ dữ liệu/hàm giữa các file JS
   *    thuần (vanilla JS) không dùng framework/module — thầy có thể hỏi
   *    "làm sao 2 file JS này liên kết với nhau" thì đây chính là câu trả lời.
   */
  function updateFavoriteBadge() {
    const badge = document.getElementById("favorite-badge");
    // Phòng trường hợp hàm này được gọi trước khi header kịp chèn xong
    // (về lý thuyết không xảy ra vì đã ở trong DOMContentLoaded, nhưng
    // vẫn kiểm tra cho an toàn — nếu không có badge thì dừng, không lỗi).
    if (!badge) return;

    let favorites = [];
    try {
      favorites = JSON.parse(localStorage.getItem(FAVORITE_STORAGE_KEY)) || [];
    } catch (err) {
      // localStorage trống (null) hoặc dữ liệu hỏng -> coi như chưa có
      // món yêu thích nào, không để lỗi làm crash cả trang.
      favorites = [];
    }

    if (favorites.length > 0) {
      badge.textContent = favorites.length;
      badge.classList.remove("hidden");
    } else {
      // Chưa thích món nào -> ẩn hẳn badge đi (không hiện số "0" cho gọn
      // giao diện, chỉ hiện icon ♥ trơn).
      badge.classList.add("hidden");
    }
  }

  // Gắn hàm lên window để menu.js gọi lại được (giải thích chi tiết ở
  // phần comment ngay trên hàm updateFavoriteBadge).
  window.updateFavoriteBadge = updateFavoriteBadge;

  // Gọi ngay 1 lần khi trang vừa tải xong, để hiện đúng số lượng đã lưu
  // từ trước (nếu khách đã từng thích món ở lần truy cập trước đó).
  updateFavoriteBadge();
});
