const form = document.getElementById("loginForm");

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    document.getElementById("emailError").textContent = "";
    document.getElementById("passwordError").textContent = "";

    let valid = true;

    if (email === "") {
        document.getElementById("emailError").textContent = "Vui lòng nhập Email.";
        valid = false;
    }

    if (password === "") {
        document.getElementById("passwordError").textContent = "Vui lòng nhập mật khẩu.";
        valid = false;
    }

    if (!valid) return;

    const account = JSON.parse(localStorage.getItem("account"));

    if (account == null) {
        alert("Chưa có tài khoản. Vui lòng đăng ký!");
        window.location.href = "register.html";
        return;
    }

    if (email === account.email && password === account.password) {

        sessionStorage.setItem("loginUser", account.fullname);

        localStorage.setItem("vingon_logged_in", "true");
        localStorage.setItem("vingon_username", account.fullname);

        alert("Đăng nhập thành công!");

        window.location.href = "../index.html";

    } else {

        document.getElementById("passwordError").textContent =
            "Email hoặc mật khẩu không đúng.";

    }

});