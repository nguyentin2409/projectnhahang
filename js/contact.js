/** 
 * ===========================================================================
 * contact.js - Trang Liên Hệ (contact.html)
 * MSSV: B2404886 - Họ tên: Võ Quỳnh Trân 
 * ==========================================================================
 *
 * CHỨC NĂNG CỦA FILE NÀY:
 * Xử lí thao tác cho khách hàng gửi các thông tin cần liên hệ.
 * Khi khách hàng nhập các thông tin trong biểu mẫu (họ tên, email, chủ đề, nôi dung phản hồi) 
 * và bấm gửi thì giao diện sẽ hiện lên bảng thông báo "Đã gửi góp ý thành công. Cảm ơn Thực Khách." giúp khách hàng 
 * xác nhận thông tin của mình đã được gửi.
  */

 // Dùng biến const để lưu trữ thông tin phần tử DOM,
// Vì sao không dùng biến let => Dùng const để lưu trữ các giá trị cố định không thay đổi trong suốt quá trình chạy, giúp code an toàn không bị ghi đè dữ liệu 
//Dùng hàm querySelector để tìm tên class được định nghĩa sẳn bên contact.html 
//Lưu thông tin tìm được vào biến contactForm, submitBnt để sử dụng cho phần dưới.
const contactForm = document.querySelector(".contact-form"); 
const submitBtn = document.querySelector(".btn-submit");

//Thông tin vừa tìm kiếm trong biến contactForm gọi hàm addEventListener
/**  Hàm addEventListener có 2 tham số *(tên sự kiện, hàm xử lí) có chức năng lắng nghe sự kiện "submit",
 * khi người dùng bấm gửi thông tin hàm xử lí sẽ được kích hoạt và chạy các lệnh bên trong hàm*/
contactForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Gọi hàm ngăn chặn chế độ chuyển trang hay tải trang web sau khi nhấn submit.
  alert("Đã gửi góp ý thành công. Cảm ơn Thực Khách.") //hàm alert() hiển thị bảng thông báo khi khách hàng nhấn Gửi.
});
