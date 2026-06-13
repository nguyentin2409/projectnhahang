document.addEventListener('DOMContentLoaded', () => {
  const headerPlaceholder = document.getElementById('site-header');
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
          <a href="../index.html"         data-page="home">Trang Chủ</a>
          <a href="../pages/menu.html"    data-page="menu">Thực Đơn</a>
          <a href="../pages/reservation.html" data-page="reservation">Đặt Bàn</a>
          <a href="../pages/about.html"   data-page="about">Giới Thiệu</a>
          <a href="../pages/contact.html" data-page="contact">Liên Hệ</a>
        </nav>

        <a href="../pages/reservation.html" class="btn-reserve">Đặt Bàn Ngay</a>

        <button class="nav-toggle" id="nav-toggle" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </header>`;
  }
  const footerPlaceholder = document.getElementById('site-footer');
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
              <li><a href="../index.html">Trang Chủ</a></li>
              <li><a href="../pages/menu.html">Thực Đơn</a></li>
              <li><a href="../pages/reservation.html">Đặt Bàn</a></li>
              <li><a href="../pages/about.html">Giới Thiệu</a></li>
              <li><a href="../pages/contact.html">Liên Hệ</a></li>
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
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-links a[data-page]');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (
      currentPath.endsWith(href) ||
      (currentPath.endsWith('/') && href.includes('index.html')) ||
      (currentPath === '/' && href.includes('index.html'))
    ) {
      link.classList.add('active');
    }
  });
  const navToggle = document.getElementById('nav-toggle');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      document.body.classList.toggle('nav-mobile-open');
      navToggle.classList.toggle('open');
    });
  }
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.style.background = 'rgba(15,13,11,0.98)';
      } else {
        header.style.background = 'rgba(15,13,11,0.92)';
      }
    }, { passive: true });
  }

});
