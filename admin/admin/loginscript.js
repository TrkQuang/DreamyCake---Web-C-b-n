document.addEventListener("DOMContentLoaded", () => {
  // Hiển thị mặc định form đăng nhập
  document.querySelector(".login").style.display = "block";
  // document.querySelector(".dangky").style.display = "none";

  // Tạo tài khoản admin mặc định
  if (!localStorage.getItem("adminAccounts")) {
    const defaultAdmins = [
      { username: "admin1", password: "123456" },
      { username: "admin2", password: "654321" },
      { username: "nhuquynh", password: "21022006" },
    ];
    localStorage.setItem("adminAccounts", JSON.stringify(defaultAdmins));
  }

  const form = document.getElementById("adminLoginForm");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      const accounts = JSON.parse(localStorage.getItem("adminAccounts")) || [];

      const matched = accounts.find(
        (acc) => acc.username === username && acc.password === password
      );
      if (matched) {
        localStorage.setItem("loggedInAdmin", username);
        alert("✅ Đăng nhập thành công!");
        window.location.href = "admin-index.html"; // đổi đường dẫn nếu cần
        if (document.getElementById("rememberMe").checked) {
          localStorage.setItem("rememberedAdminUsername", username);
          localStorage.setItem("rememberedAdminPassword", password);
        } else {
          localStorage.removeItem("rememberedAdminUsername");
          localStorage.removeItem("rememberedAdminPassword");
        }
      } else {
        alert("❌ Sai tên đăng nhập hoặc mật khẩu!");
      }
    });
  } else {
    console.error("Không tìm thấy form có id='adminLoginForm'");
  }
});
window.addEventListener("load", () => {
  // Tự động điền nếu đã lưu thông tin
  const savedUsername = localStorage.getItem("rememberedAdminUsername");
  const savedPassword = localStorage.getItem("rememberedAdminPassword");

  if (savedUsername && savedPassword) {
    document.getElementById("username").value = savedUsername;
    document.getElementById("password").value = savedPassword;
    document.getElementById("rememberMe").checked = true;
  }
});

// // Chuyển đổi form
// function showRegister() {
//   document.querySelector(".login").style.display = "none";
//   // document.querySelector(".dangky").style.display = "block";
// }

// function showLogin() {
//   document.querySelector(".dangky").style.display = "none";
//   document.querySelector(".login").style.display = "block";
// }
