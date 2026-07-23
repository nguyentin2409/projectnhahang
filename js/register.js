const form = document.getElementById("registerForm");

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    document.getElementById("fullnameError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("phoneError").textContent = "";
    document.getElementById("passwordError").textContent = "";
    document.getElementById("confirmError").textContent = "";

    let valid = true;

    if (fullname === "") {
        document.getElementById("fullnameError").textContent = "Vui lòng nhập họ và tên";
        valid = false;
    }

    if (email === "") {
        document.getElementById("emailError").textContent = "Vui lòng nhập Email";
        valid = false;
    }

    if (phone === "") {
        document.getElementById("phoneError").textContent = "Vui lòng nhập số điện thoại";
        valid = false;
    }

    if (password === "") {
        document.getElementById("passwordError").textContent = "Vui lòng nhập mật khẩu";
        valid = false;
    }

    if (confirmPassword === "") {
        document.getElementById("confirmError").textContent = "Vui lòng xác nhận mật khẩu";
        valid = false;
    }

    if (password !== confirmPassword) {
        document.getElementById("confirmError").textContent = "Mật khẩu xác nhận không khớp";
        valid = false;
    }

    if (!valid) return;

    // Kiểm tra đã tồn tại tài khoản chưa
     const oldAccount = JSON.parse(localStorage.getItem("account"));

    if (oldAccount && oldAccount.email === email) {
    document.getElementById("emailError").textContent =
        "Email đã được sử dụng";
    return;
    }
    const account = {
        fullname,
        email,
        phone,
        password
    };

    localStorage.setItem("account", JSON.stringify(account));

    alert("Đăng ký thành công!");

    window.location.href = "login.html";

});