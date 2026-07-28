/**
 * ===========================================================================
 * register.js - Trang Đăng Ký (register.html)
 * MSSV: B2408835 - Họ tên: Trần Lý An
 * ===========================================================================
 *
 * CHỨC NĂNG CỦA FILE NÀY:
 * 1. Kiểm tra dữ liệu người dùng nhập vào.
 * 2. Kiểm tra định dạng email và xác nhận mật khẩu.
 * 3. Kiểm tra email đã được đăng ký hay chưa.
 * 4. Lưu thông tin tài khoản vào localStorage.
 * 5. Chuyển người dùng sang trang Đăng nhập khi đăng ký thành công.
 */

// Lấy form đăng ký.
const form = document.getElementById("registerForm");

// Bắt sự kiện khi người dùng nhấn nút Đăng ký.
form.addEventListener("submit", function (e) {

    // Ngăn form gửi dữ liệu theo mặc định.
    e.preventDefault();

    // Lấy dữ liệu người dùng nhập từ các ô.
    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    // Xóa các thông báo lỗi cũ.
    document.getElementById("fullnameError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("phoneError").textContent = "";
    document.getElementById("passwordError").textContent = "";
    document.getElementById("confirmError").textContent = "";

    // Biến kiểm tra dữ liệu hợp lệ.
    let valid = true;

    // Kiểm tra họ và tên.
    if (fullname === "") {
        document.getElementById("fullnameError").textContent =
            "Vui lòng nhập họ và tên";
        valid = false;
    }

    // Biểu thức chính quy kiểm tra định dạng email.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Kiểm tra email.
    if (email === "") {

        document.getElementById("emailError").textContent =
            "Vui lòng nhập Email";
        valid = false;

    }
    // Kiểm tra email có đúng định dạng hay không.
    else if (!emailRegex.test(email)) {

        document.getElementById("emailError").textContent =
            "Email không đúng định dạng";
        valid = false;

    }

  // Kiểm tra số điện thoại.
    if (phone === "") {
        document.getElementById("phoneError").textContent =
            "Vui lòng nhập số điện thoại";
        valid = false;
    } else if (!/^0\d{9}$/.test(phone)) {
        document.getElementById("phoneError").textContent =
            "Số điện thoại không đúng định dạng";
        valid = false;
    } else {
        document.getElementById("phoneError").textContent = "";
    }

    // Kiểm tra mật khẩu.
    if (password === "") {
        document.getElementById("passwordError").textContent =
            "Vui lòng nhập mật khẩu";
        valid = false;
    }

    // Kiểm tra xác nhận mật khẩu.
    if (confirmPassword === "") {
        document.getElementById("confirmError").textContent =
            "Vui lòng xác nhận mật khẩu";
        valid = false;
    }

    // Kiểm tra hai mật khẩu có khớp nhau hay không.
    if (password !== confirmPassword) {
        document.getElementById("confirmError").textContent =
            "Mật khẩu xác nhận không khớp";
        valid = false;
    }

    // Nếu dữ liệu không hợp lệ thì dừng xử lý.
    if (!valid) return;

    // Lấy tài khoản đã lưu trong localStorage.
    const oldAccount = JSON.parse(localStorage.getItem("account"));

    // Kiểm tra email đã được đăng ký hay chưa.
    if (oldAccount && oldAccount.email === email) {

        document.getElementById("emailError").textContent =
            "Email đã được sử dụng";

        return;
    }

    // Tạo đối tượng lưu thông tin tài khoản.
    const account = {
        fullname,
        email,
        phone,
        password
    };

    // Lưu tài khoản vào localStorage.
    localStorage.setItem("account", JSON.stringify(account));

    // Thông báo đăng ký thành công.
    alert("Đăng ký thành công!");

    // Chuyển sang trang đăng nhập.
    window.location.href = "login.html";

});
