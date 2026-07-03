document.addEventListener('DOMContentLoaded', () => {
  // === 1. XỬ LÝ MENU MOBILE ===
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const body = document.body;
  const navLinks = document.querySelectorAll('.nav-links a');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      // Toggle class 'open' trên nút để tạo hiệu ứng chuyển dấu X (đã có trong shared.css)
      menuToggle.classList.toggle('open');
      // Toggle class 'nav-mobile-open' trên body để hiển thị menu (đã có trong shared.css)
      body.classList.toggle('nav-mobile-open');
    });
  }

  // Tự động đóng menu khi người dùng click vào một đường link link bất kỳ
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (body.classList.contains('nav-mobile-open')) {
        menuToggle.classList.remove('open');
        body.classList.remove('nav-mobile-open');
      }
    });
  });


  // === 2. XỬ LÝ NÚT BACK TO TOP ===
  const backToTopBtn = document.querySelector('.back-to-top');

  if (backToTopBtn) {
    // Ẩn nút khi mới tải trang bằng CSS trực tiếp qua JS để không làm vỡ giao diện gốc
    backToTopBtn.style.opacity = '0';
    backToTopBtn.style.visibility = 'hidden';
    backToTopBtn.style.transition = 'opacity 0.3s, visibility 0.3s';

    window.addEventListener('scroll', () => {
      // Nếu cuộn xuống quá 300px thì hiện nút, ngược lại thì ẩn đi
      if (window.scrollY > 300) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.visibility = 'visible';
      } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.visibility = 'hidden';
      }
    });
  }
});