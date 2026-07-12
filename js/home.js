/** * home.js - Xử lý tương tác menu trên thiết bị di động và hiệu ứng nút quay lại đầu trang
 * MSSV: [Điền MSSV] - Họ tên: [Điền Họ Tên] 
 */

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // KHỐI 1: TỰ ĐỘNG ĐÓNG MENU MOBILE KHI BẤM VÀO 1 LINK ĐIỀU HƯỚNG
  // ==========================================
  // Việc MỞ/ĐÓNG menu khi bấm nút hamburger (#nav-toggle) đã được xử lý
  // SẴN trong shared.js (dùng chung cho MỌI trang, xem shared.js khối 4)
  // -> KHÔNG được gắn thêm 1 listener click nữa cho #nav-toggle ở đây.
  //
  // Lý do: nếu cả shared.js VÀ home.js cùng gắn listener click riêng cho
  // CÙNG 1 nút, mỗi lần bấm classList.toggle("open") / toggle("nav-mobile-open")
  // sẽ chạy 2 LẦN LIÊN TIẾP (1 lần từ mỗi file) -> bật rồi tắt ngay trong
  // cùng 1 click -> NHÌN NHƯ NÚT KHÔNG PHẢN ỨNG GÌ (đây chính là bug đã
  // gặp: bấm hamburger ở trang chủ không thấy mở menu).
  //
  // home.js chỉ nên xử lý phần RIÊNG cho trang chủ mà shared.js chưa có:
  // tự đóng menu khi khách bấm chọn 1 link điều hướng (UX tốt hơn, khỏi
  // phải tự bấm hamburger đóng lại sau khi đã chọn xong).
  const menuToggle = document.getElementById("nav-toggle");
  const body = document.body;
  const navLinks = document.querySelectorAll(".nav-links a");

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