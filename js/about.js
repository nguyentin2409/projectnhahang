/**
 * ==========================================================================
 * about.js - Trang Giới thiệu
 * Chức năng:
 * - Tạo hiệu ứng xuất hiện cho các thẻ đầu bếp khi cuộn trang.
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {

    // Lấy tất cả các thẻ đầu bếp
    const cards = document.querySelectorAll(".chef-card");

    // Nếu không có thẻ đầu bếp thì kết thúc
    if (cards.length === 0) return;

    // Theo dõi các phần tử khi xuất hiện trong vùng nhìn thấy
    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            // Thêm hoặc xóa class "show"
            entry.target.classList.toggle("show", entry.isIntersecting);

        });

    });

    // Đăng ký theo dõi từng thẻ đầu bếp
    cards.forEach(card => observer.observe(card));

});
