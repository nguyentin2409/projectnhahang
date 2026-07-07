/**
 * ===========================================================================
 * about.js - Trang Giới Thiệu (about.html)
 * MSSV: B2408835 - Họ tên: Trần Lý An
 * ===========================================================================
 *
 * CHỨC NĂNG CỦA FILE NÀY:
 * Tạo hiệu ứng xuất hiện cho các thẻ đầu bếp khi người dùng cuộn trang.
 * Khi mỗi thẻ đầu bếp xuất hiện trong vùng hiển thị của trình duyệt,
 * hệ thống sẽ tự động thêm class "show" để kích hoạt hiệu ứng CSS.
 * Nếu thẻ ra khỏi vùng hiển thị thì class "show" sẽ được gỡ bỏ.
 */

// Đợi toàn bộ nội dung HTML tải xong rồi mới thực hiện các lệnh JavaScript.
/** Hàm addEventListener với sự kiện "DOMContentLoaded"
 * giúp đảm bảo các phần tử HTML đã được tạo xong trước khi thao tác. */
document.addEventListener("DOMContentLoaded", () => {

    // Dùng biến const để lưu danh sách các thẻ đầu bếp.
    /** Vì sao dùng const?
     * Vì biến chỉ dùng để lưu danh sách phần tử và không cần gán lại
     * trong suốt quá trình chương trình chạy. */
    
    // Dùng hàm querySelectorAll để tìm tất cả phần tử có class ".chef-card"
    // và lưu vào biến cards.
    const cards = document.querySelectorAll(".chef-card");

    // Kiểm tra xem trang có thẻ đầu bếp hay không.
    /** Nếu số lượng phần tử bằng 0 thì dừng chương trình,
     * tránh tạo Observer không cần thiết. */
    if (cards.length === 0) return;

    // Tạo đối tượng IntersectionObserver để theo dõi các thẻ đầu bếp.
    /** IntersectionObserver giúp phát hiện khi một phần tử
     * xuất hiện hoặc rời khỏi vùng nhìn thấy của trình duyệt. */
    const observer = new IntersectionObserver((entries) => {

        // Duyệt lần lượt từng phần tử được theo dõi.
        entries.forEach(entry => {

            // Thêm hoặc xóa class "show".
            /** Nếu phần tử đang nằm trong vùng hiển thị
             * thì thêm class "show".
             * Nếu không còn nằm trong vùng hiển thị
             * thì tự động xóa class "show". */
            entry.target.classList.toggle("show", entry.isIntersecting);

        });

    });

    // Đăng ký theo dõi từng thẻ đầu bếp.
    /** Dùng hàm forEach để lần lượt đưa từng phần tử
     * vào IntersectionObserver theo dõi. */
    cards.forEach(card => observer.observe(card));

});
