/**
 * ===========================================================================
 * login.js - Trang Đăng Nhập (login.html)
 * MSSV: B2408835 - Họ tên: Trần Lý An
 * ===========================================================================
 *
 * CHỨC NĂNG CỦA FILE NÀY:
 * 1. Kiểm tra dữ liệu người dùng nhập vào.
 * 2. Xác thực tài khoản đã lưu trong localStorage.
 * 3. Lưu trạng thái đăng nhập vào sessionStorage và localStorage.
 * 4. Chuyển người dùng đến trang chủ khi đăng nhập thành công.
 */

// Lấy form đăng nhập.
const form = document.getElementById("loginForm");

// Bắt sự kiện khi người dùng nhấn nút Đăng nhập.
form.addEventListener("submit", function (e) {

    // Ngăn form gửi dữ liệu theo mặc định.
    e.preventDefault();

    // Lấy email và mật khẩu người dùng nhập.
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Xóa các thông báo lỗi cũ.
    document.getElementById("emailError").textContent = "";
    document.getElementById("passwordError").textContent = "";

    // Biến kiểm tra dữ liệu hợp lệ.
    let valid = true;

    // Kiểm tra email có được nhập hay không.
    if (email === "") {
        document.getElementById("emailError").textContent =
            "Vui lòng nhập Email.";
        valid = false;
    }

    // Kiểm tra mật khẩu có được nhập hay không.
    if (password === "") {
        document.getElementById("passwordError").textContent =
            "Vui lòng nhập mật khẩu.";
        valid = false;
    }

    // Nếu dữ liệu không hợp lệ thì dừng xử lý.
    if (!valid) return;

    // Lấy thông tin tài khoản đã lưu trong localStorage.
    const account = JSON.parse(localStorage.getItem("account"));

    // Nếu chưa có tài khoản thì chuyển sang trang đăng ký.
    if (account == null) {

        alert("Chưa có tài khoản. Vui lòng đăng ký!");

        window.location.href = "register.html";

        return;
    }

    // Kiểm tra email và mật khẩu có đúng hay không.
    if (email === account.email && password === account.password) {

        // Lưu tên người dùng trong phiên đăng nhập.
        sessionStorage.setItem("loginUser", account.fullname);

        // Lưu trạng thái đăng nhập để các trang khác sử dụng.
        localStorage.setItem("vingon_logged_in", "true");
        localStorage.setItem("vingon_username", account.fullname);

        // Thông báo đăng nhập thành công.
        alert("Đăng nhập thành công!");

        // Chuyển về trang chủ.
        window.location.href = "../index.html";

    } else {

        // Hiển thị thông báo khi email hoặc mật khẩu không đúng.
        document.getElementById("passwordError").textContent =
            "Email hoặc mật khẩu không đúng.";

    }

});
