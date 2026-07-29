/**
 * reservation.js - Xử lý sự kiện gửi biểu mẫu đặt bàn và cập nhật trạng thái tương tác UI
 * MSSV: B2410751 - Họ tên: Võ Trọng Tình
 */

// Lấy món ăn từ trang yêu thích khi DOM đã sẵn sàng
window.addEventListener("DOMContentLoaded", () => {
  // Quét truy vấn trên thanh địa chỉ bằng URLSearchParams
  const urlParams = new URLSearchParams(window.location.search);
  // Lấy danh sách món ăn từ tham số 'dishes'
  const dishes = urlParams.get("dishes");

  if (dishes) {
    const noteInput = document.querySelector("#note");
    // Quét tìm ô có id="note" và điền danh sách món ăn (urlParams.get đã tự decode)
    if (noteInput) {
      noteInput.value = `Muốn đặt các món: ${decodeURIComponent(dishes)}`;
    }
  }
});

// Lựa chọn form đặt bàn và nút xác nhận dựa trên ID và Class
const reservationForm = document.querySelector("#reservationForm");
const submitBtn = reservationForm
  ? reservationForm.querySelector(".btn-primary")
  : null;

/**
 * Lắng hệ sự kiện 'submit' (gửi form).
 */
if (reservationForm) {
  reservationForm.addEventListener("submit", (e) => {
    // Ngăn chặn hành vi mặc định của trình duyệt (Tải lại trang)
    e.preventDefault();

    // 1. Kiểm tra chính xác trạng thái đăng nhập dựa trên key 'vingon_logged_in' từ login.js
    const isLoggedIn = localStorage.getItem("vingon_logged_in");

    // Nếu chưa đăng nhập hoặc giá trị không phải là "true"
    if (isLoggedIn !== "true") {
      alert("Vui lòng đăng nhập để thực hiện đặt bàn!");
      window.location.href = "login.html"; // Chuyển hướng sang trang đăng nhập
      return;
    }

    if (!submitBtn) return;

    // 2. Xóa danh sách món ăn yêu thích trong localStorage sau khi đã đặt thành công
    localStorage.removeItem("vingon_favorites");

    // 3. Cập nhật badge trên Header về 0
    if (typeof window.updateFavoriteBadge === "function") {
      window.updateFavoriteBadge();
    }

    // 4. Xử lý giao diện nút và Reset Form
    const originalText = submitBtn.textContent;

    // Thay đổi trạng thái hiển thị của nút bấm
    submitBtn.textContent = "Đặt Bàn Thành Công ✓";
    submitBtn.style.backgroundColor = "var(--color-muted)";
    submitBtn.style.color = "var(--color-surface)";
    submitBtn.style.pointerEvents = "none"; // Khóa tương tác tạm thời

    // Reset toàn bộ dữ liệu trong các ô input về mặc định
    reservationForm.reset();

    // Khôi phục lại trạng thái nút bấm sau 4 giây
    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.style.backgroundColor = "";
      submitBtn.style.color = "";
      submitBtn.style.pointerEvents = "auto";
    }, 4000);
  });
}
