/**
 * reservation.js - Xử lý sự kiện gửi biểu mẫu đặt bàn và cập nhật trạng thái tương tác UI
 * MSSV: B2410751 - Họ tên: Võ Trọng Tình
 */

// CHỨC NĂNG BỔ SUNG: Tự động lấy danh sách món ăn từ trang Yêu Thích truyền sang qua URL
window.addEventListener("DOMContentLoaded", () => {
  // Đọc các tham số tìm kiếm từ URL (Ví dụ: reservation.html?items=Món%20Ăn%20A,%20Món%20B)
  const urlParams = new URLSearchParams(window.location.search);
  const items = urlParams.get("items"); // Nhận diện từ khóa 'items' được truyền qua

  if (items) {
    const noteInput = document.querySelector("#note");
    if (noteInput) {
      // Điền chuỗi theo định dạng yêu cầu vào ô ghi chú và giải mã ký tự đặc biệt (tiếng Việt có dấu)
      noteInput.value = `Muốn đặt các món: ${decodeURIComponent(items)}`;
    }
  }
});

// Lựa chọn form đặt bàn và nút xác nhận dựa trên ID và Class đã định nghĩa sẵn trong file HTML
const reservationForm = document.querySelector("#reservationForm");
const submitBtn = reservationForm.querySelector(".btn-primary");

/**
 * Lắng nghe sự kiện 'submit' (gửi form). Khi người dùng nhấn nút hoặc nhấn Enter,
 * trình duyệt sẽ thực hiện kiểm tra tính hợp lệ tự động (Validation) trước khi kích hoạt callback này.
 */
reservationForm.addEventListener("submit", (e) => {
  // Ngăn chặn hành vi mặc định của trình duyệt (Tải lại trang hoặc chuyển trang)
  e.preventDefault();

  // Lưu lại nội dung văn bản ban đầu của nút bấm ("Xác Nhận Đặt Bàn") bằng textContent
  const originalText = submitBtn.textContent;

  // Thay đổi nội dung hiển thị sang trạng thái thông báo thành công
  submitBtn.textContent = "Đặt Bàn Thành Công ✓";
  submitBtn.style.backgroundColor = "var(--color-muted)"; // Áp dụng biến màu nền trạng thái mờ của nhóm
  submitBtn.style.color = "var(--color-surface)";

  // Vô hiệu hóa khả năng tương tác chuột vào nút bấm
  submitBtn.style.pointerEvents = "none";

  // Reset toàn bộ dữ liệu hiện tại đang có trong các ô input về giá trị mặc định ban đầu
  reservationForm.reset();

  /**
   * Sử dụng hàm setTimeout để trì hoãn việc khôi phục trạng thái nút bấm sau 4000 mili-giây (4 giây)
   */
  setTimeout(() => {
    submitBtn.textContent = originalText; // Trả lại đoạn văn bản ban đầu bằng textContent
    submitBtn.style.backgroundColor = ""; // Xóa inline style để CSS kế thừa lại định dạng gốc
    submitBtn.style.color = "";
    submitBtn.style.pointerEvents = "auto"; // Mở khóa cho phép tương tác chuột trở lại
  }, 4000);
});
