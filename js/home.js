/** * home.js - Xử lý tương tác menu trên thiết bị di động và hiệu ứng nút quay lại đầu trang
 * MSSV: [Điền MSSV] - Họ tên: [Điền Họ Tên] 
 */

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // KHỐI 1: XỬ LÝ MENU MOBILE
  // ==========================================
  // Sửa lỗi: Đổi ID từ "mobile-menu-toggle" thành "nav-toggle" để khớp với phần tử thực tế
  const menuToggle = document.getElementById("nav-toggle");
  const body = document.body;
  const navLinks = document.querySelectorAll(".nav-links a");

  // Sự kiện mở/đóng menu khi nhấn vào nút toggle (hamburger icon)
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("open");
      body.classList.toggle("nav-mobile-open");
    });
  }

  // Sự kiện tự động đóng menu khi người dùng click vào một đường dẫn bất kỳ
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (body.classList.contains("nav-mobile-open")) {
        menuToggle.classList.remove("open");
        body.classList.remove("nav-mobile-open");
      }
    });
  });

  // ==========================================
  // KHỐI 2: XỬ LÝ NÚT QUAY LẠI ĐẦU TRANG (BACK TO TOP)
  // ==========================================
  const backToTopBtn = document.querySelector(".back-to-top");

  if (backToTopBtn) {
    // Cài đặt style mặc định cho nút để hỗ trợ hiệu ứng chuyển đổi (transition)
    backToTopBtn.style.opacity = "0";
    backToTopBtn.style.visibility = "hidden";
    backToTopBtn.style.transition = "opacity 0.3s, visibility 0.3s";

    // Sự kiện cuộn chuột: Hiển thị nút khi cuộn xuống quá 300px, ngược lại thì ẩn đi
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopBtn.style.opacity = "1";
        backToTopBtn.style.visibility = "visible";
      } else {
        backToTopBtn.style.opacity = "0";
        backToTopBtn.style.visibility = "hidden";
      }
    });

    // Sự kiện click: Cuộn mượt mà lên vị trí trên cùng của trang
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }
});
