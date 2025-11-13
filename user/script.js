//Tên các id, class
const pagehome = document.getElementById("page-home"); // Trang chủ
const pageproducts = document.getElementById("page-products"); // Trang sản phẩm
const pagecart = document.getElementById("page-cart"); // Trang giỏ hàng
const pagecontact = document.getElementById("page-contact"); // Trang liên hệ
const pagehistory = document.getElementById("page-history"); //trang đơn đặt hàng

// Sidebar và overlay
const sidebar = document.getElementById("thanhcongcu");
const overlay = document.getElementById("overlay");
const menuIcon = document.querySelectorAll(".quickbox-item")[2]; // Icon menu (thứ 3)

//productlist + nút di chuyển
const productList = document.querySelector(".product-list");

function openMenu() {
  sidebar.classList.add("active");
  overlay.classList.add("active");
}

function closeMenu() {
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
}

//Ẩn hiện khung chat
function toggleChat() {
  const chatWidget = document.querySelector(".chat-widget");
  chatWidget.classList.toggle("active");
}
const pageprofile = document.getElementById("page-profile");
//HÀM CHUYỂN TRANG (nhận vào 1 trang cần hiển thị)
function LoadPage(page) {
  // Ẩn tất cả các trang bằng cách thêm class hidden
  const pages = document.querySelectorAll(".page-content");
  pages.forEach((p) => p.classList.add("hidden"));
  // Hiện trang được chọn bằng cách xóa class hidden
  page.classList.remove("hidden");
  // Đóng sidebar nếu đang mở
  if (sidebar) {
    sidebar.classList.remove("active");
  }
  if (overlay) {
    overlay.classList.remove("active");
  }
  // Scroll về đầu trang
  window.scrollTo({ top: 0, behavior: "smooth" });
}

//TÍNH NĂNG
const openLogin = document.getElementById("openLogin");
const loginForm = document.getElementById("loginForm"); //trang đăng nhập
const DangKyOverlay = document.getElementById("DangKyOverlay"); //trang đăng ký
const registerForm = document.getElementById("registerForm");

//click vào đăng nhập/đăng kí trên tính năng
openLogin.addEventListener("click", function () {
  loginForm.style.display = "flex";
  sidebar.style.display = "none";
});

//đóng form đăng nhập khi click ra ngoài
loginForm.addEventListener("click", function (e) {
  if (e.target === this) {
    this.style.display = "none";
    sidebar.style.display = "block";
  }
});

//click vào đăng kí và đăng nhập
function DangKy() {
  // Ẩn form đăng nhập
  loginForm.style.display = "none";
  // Hiện form đăng ký
  DangKyOverlay.style.display = "flex";
  sidebar.style.display = "none";
}

const editbtn = document.getElementById("editBtn");
const savebtn = document.getElementById("saveBtn");

// Đóng form đăng ký khi click ra ngoài
DangKyOverlay.addEventListener("click", function (e) {
  if (e.target === this) {
    this.style.display = "none";
    sidebar.style.display = "block"; // hiện lại thanh công cụ
  }
});

function DangNhap() {
  // Ẩn form đăng ký
  DangKyOverlay.style.display = "none";
  // Hiện form đăng nhập
  loginForm.style.display = "flex";
  sidebar.style.display = "none";
}

//========= ĐĂNG KÝ ==========
//mắt
const eyes = document.querySelectorAll(".eyePassword");
eyes.forEach((eye) => {
  // Duyệt từng icon trong danh sách
  eye.addEventListener("click", function () {
    const passwordRow = this.closest(".password-row");
    const passwordInput = passwordRow.querySelector("input");
    // Kiểm tra loại input để đổi giữa password và text
    if (passwordInput.type === "password") {
      passwordInput.type = "text"; // Hiện mật khẩu
      this.classList.add("fa-eye");
      this.classList.remove("fa-eye-slash");
    } else {
      passwordInput.type = "password"; // Ẩn mật khẩu
      this.classList.add("fa-eye-slash");
      this.classList.remove("fa-eye");
    }
  });
});

//check trong form đăng ký
registerForm.addEventListener("submit", (e) => {
  e.preventDefault(); //ngăn reload trang mặc định
  const hoten = document.getElementById("hoten").value.trim();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const sdt = document.getElementById("sdt").value.trim();
  const address = document.getElementById("address").value.trim();
  const password = document.getElementById("registerPassword").value.trim();
  const confirm = document
    .getElementById("registerConfirmPassword")
    .value.trim();
  const ngaysinh = document.getElementById("ngaysinh").value;
  const gioitinh = document.getElementById("gioitinh").value;

  const usernameError = document.getElementById("usernameError");
  //xóa lỗi cũ trước khi kiểm tra
  usernameError.textContent = "";
  usernameError.style.display = "none";

  const users = JSON.parse(localStorage.getItem("users")) || [];
  //kiểm tra nếu tên tài khoản đã tồn tại
  if (users.some((u) => u.username === username)) {
    usernameError.textContent = "Tên tài khoản đã tồn tại!";
    usernameError.style.display = "block";
    return;
  }

  const emailError = document.getElementById("emailError");
  emailError.textContent = "";
  emailError.style.display = "none";
  //kiểm tra nếu tên email đã tồn tại
  if (users.some((u) => u.email === email)) {
    emailError.textContent = "Email đã được sử dụng!";
    emailError.style.display = "block";
    return;
  }

  //kiểm tra xác nhận mật khẩu đã khớp chưa
  const confirmPass = document.getElementById("confirmPass");
  //xóa lỗi cũ trước khi check
  confirmPass.style.display = "none";
  confirmPass.textContent = "";
  if (password !== confirm) {
    confirmPass.textContent = "Mật khẩu xác nhận không khớp!";
    confirmPass.style.display = "block";
    return;
  }
  //tạo object chứa thông tin user
  const user = {
    hoten,
    email,
    sdt,
    address,
    password,
    ngaysinh,
    gioitinh,
    username,
    avat: "../img/avt.jpg",
    isLocked: false, // Mặc định tài khoản không bị khóa
  };

  users.push(user); //thêm user mới vào ds
  localStorage.setItem("users", JSON.stringify(users)); //lưu vào localStorage
  localStorage.setItem("currentUser", JSON.stringify(user)); //lưu người dùng hiện tại
  alert("Đăng ký thành công!");
  //chuyển sang form đăng nhập
  DangNhap();
  registerForm.reset();
});

//ẩn dòng lỗi khi click vào ô tên tài khoản (tên đã tồn tại)
const usernameInput = document.getElementById("username");
usernameInput.addEventListener("focus", function () {
  const usernameError = document.getElementById("usernameError");
  usernameError.textContent = "";
  usernameError.style.display = "none";
});

//ẩn dòng lỗi khi click vào ô email (email đã tồn tại)
const emailInputs = document.getElementById("email");
emailInputs.addEventListener("focus", function () {
  const emailError = document.getElementById("emailError");
  emailError.textContent = "";
  emailError.style.display = "none";
});

// Khi gõ lại trong ô xác nhận → ẩn dòng báo lỗi
const confirmPasswordInput = document.getElementById("registerConfirmPassword");
const confirmPassErrorEl = document.getElementById("confirmPass"); // id hiển thị lỗi

if (confirmPasswordInput) {
  //ktr xem ô xác nhận mk có tồn tại trong html hay k
  confirmPasswordInput.addEventListener("focus", function () {
    // ẩn dòng lỗi khi click vào ô xác nhận
    if (confirmPassErrorEl) {
      confirmPassErrorEl.style.display = "none";
      confirmPassErrorEl.textContent = "";
    }
    // xóa giá trị ô xác nhận
    this.value = "";
  });
}

//tên tài khoản ko được có dấu
const usernameInputs = document.querySelectorAll('input[name="username"]');
usernameInputs.forEach((input) => {
  const errorText = input.nextElementSibling; //p.error liền sau input
  input.addEventListener("input", function () {
    const regex = /^[A-Za-z0-9_]+$/;
    const val = this.value.trim();
    if (val === "") {
      // ô trống-> ẩn lỗi
      errorText.textContent = "";
      errorText.style.display = "none";
    } else if (!regex.test(val)) {
      errorText.style.display = "block";
      errorText.textContent =
        "Tên tài khoản không được chứa dấu hoặc kí tự đặc biệt!";
    } else {
      errorText.textContent = "";
      errorText.style.display = "none";
    }
  });
  //Khi rời khỏi ô nhập (blur)
  input.addEventListener("blur", function () {
    if (this.value.trim() === "") {
      errorText.textContent = "";
      errorText.style.display = "none";
    }
  });
});

//số điện thoại
const phoneInput = document.querySelector('input[name="sdt"]');
const phoneError = phoneInput.nextElementSibling;
phoneInput.addEventListener("input", function () {
  const regex = /^0[0-9]*$/; //chỉ cho phép số
  if (!regex.test(this.value) || this.value.length != 10) {
    phoneError.style.display = "block";
    phoneError.textContent =
      "Số điện thoại phải chứa 10 chữ số và bắt đầu bằng số 0";
  } else {
    phoneError.style.display = "none";
    phoneError.textContent = "";
  }
});
//khi rời khỏi ô nhập (blur)
phoneInput.addEventListener("blur", function () {
  if (this.value.trim() === "") {
    phoneError.style.display = "none";
    phoneError.textContent = "";
  }
});

//email
const emailInput = document.querySelector('input[name="email"]');
const emailError = emailInput.nextElementSibling;
emailInput.addEventListener("input", function () {
  const val = this.value.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (val === "") {
    emailError.textContent = "";
    emailError.style.display = "none";
  } else if (!regex.test(val)) {
    emailError.style.display = "block";
    emailError.textContent = "Email không hợp lệ!";
  } else {
    emailError.textContent = "";
    emailError.style.display = "none";
  }
});
//khi rời khỏi ô nhập
emailInput.addEventListener("blur", function () {
  if (this.value.trim() === "") {
    emailError.style.display = "none";
    emailError.textContent = "";
  }
});

//mật khẩu mạnh
const passwordInput = document.querySelector('input[name="registerPassword"]');
if (passwordInput) {
  const passwordError =
    passwordInput.closest(".password-row").nextElementSibling;
  passwordInput.addEventListener("input", function () {
    const val = this.value.trim();
    const lengthReq = val.length >= 6;
    const numberReq = /[0-9]/.test(val);
    const upperReq = /[A-Z]/.test(val);
    const lowerReq = /[a-z]/.test(val);
    //A-Za-z chỉ chữ latin không dấu
    const latinReq = /^[A-Za-z0-9!@#$%^&*()_+\-={}[\]|\\:;"'<>,.?]+$/.test(val);
    if (val === "") {
      passwordError.style.display = "none";
      passwordError.textContent = "";
    } else if (!lengthReq) {
      passwordError.textContent = "Mật khẩu phải ít nhất 6 ký tự!";
      passwordError.style.display = "block";
    } else if (!upperReq) {
      passwordError.textContent = "Mật khẩu phải có ít nhất 1 chữ hoa!";
      passwordError.style.display = "block";
    } else if (!lowerReq) {
      passwordError.textContent = "Mật khẩu phải có ít nhất 1 chữ thường!";
      passwordError.style.display = "block";
    } else if (!numberReq) {
      passwordError.textContent = "Mật khẩu phải có ít nhất 1 chữ số!";
      passwordError.style.display = "block";
    } else if (!latinReq) {
      passwordError.textContent = "Mật khẩu không được chứa dấu tiếng Việt!";
      passwordError.style.display = "block";
    } else {
      //nếu all đúng
      passwordError.textContent = "";
      passwordError.style.display = "none";
    }
  });
}

// Khi tải trang, nếu trước đó người dùng đã chọn "ghi nhớ" thì tự động điền
window.addEventListener("load", () => {
  const savedUser = localStorage.getItem("rememberedUser");
  const savedPass = localStorage.getItem("rememberedPass");

  if (savedUser && savedPass) {
    document.getElementById("username1").value = savedUser;
    document.getElementById("password").value = savedPass;
    document.getElementById("rememberMe").checked = true;
  }
});

// Khi người dùng đăng nhập
document.querySelector("#loginForm form").addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username1").value.trim();
  const password = document.getElementById("password").value;
  const remember = document.getElementById("rememberMe").checked;
  const errorMsg = document.getElementById("errorMsg");
  const errorMsgPass = document.getElementById("errorMsgPass");

  errorMsg.textContent = "";
  errorMsg.style.display = "none";

  // Lấy ds tài khoản đã đăng ký
  const users = JSON.parse(localStorage.getItem("users")) || [];
  //ktr xem tên đăng nhập có tồn tại ko
  const foundUser = users.find((user) => user.username === username);
  if (!foundUser) {
    errorMsg.textContent = "Tên đăng nhập không tồn tại!";
    errorMsg.style.display = "block";
    return;
  }

  // Kiểm tra tài khoản có bị khóa không
  if (foundUser.isLocked) {
    errorMsg.textContent =
      "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên!";
    errorMsg.style.display = "block";
    return;
  }

  if (foundUser.password !== password) {
    errorMsgPass.textContent = "Sai mật khẩu!";
    errorMsgPass.style.display = "block";
    return;
  }

  //Nếu đăng nhập thành công
  localStorage.setItem("currentUser", JSON.stringify(foundUser)); // Lưu người đang đăng nhập

  // Nếu người dùng chọn "Ghi nhớ"
  if (remember) {
    localStorage.setItem("rememberedUser", username);
    localStorage.setItem("rememberedPass", password);
  } else {
    localStorage.removeItem("rememberedUser");
    localStorage.removeItem("rememberedPass");
  }

  //chuyển qua trang chủ
  window.location.href = "index.html";
});

//TRANG THÔNG TIN TÀI KHOẢN
const avatarPreview = document.getElementById("avatarPreview");
const avatarInput = document.getElementById("avatarInput");
const OpenProfile = document.getElementById("OpenProfile");
const pageProfile = document.getElementById("page-profile");

//đổi avatar
avatarInput.addEventListener("change", function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return;
  const file = this.files[0]; //lấy file đầu tiên
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      avatarPreview.src = e.target.result; //đổi src của ảnh
      currentUser.avat = avatarPreview.src;
      // Lưu lại vào localStorage
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      // Cập nhật danh sách users
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const updatedUsers = users.map((u) => {
        if (u.username === currentUser.username) {
          // Nếu là user hiện tại thì cập nhật thông tin mới
          return currentUser;
        } else {
          // Các user khác giữ nguyên
          return u;
        }
      });
      localStorage.setItem("users", JSON.stringify(updatedUsers));
    };
    reader.readAsDataURL(file); //đọc file từ ảnh
  }
});

// ===== HIỂN THỊ THÔNG TIN NGƯỜI DÙNG =====
function loadProfile() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return;
  document.getElementById("avatarPreview").src = currentUser.avat;
  document.getElementById("profileHoten").textContent = currentUser.hoten;
  document.getElementById("profileUsername").textContent = currentUser.username;
  document.getElementById("profileEmail").textContent = currentUser.email;
  document.getElementById("profileSdt").textContent = currentUser.sdt;
  document.getElementById("profileAddress").textContent = currentUser.address;
  document.getElementById("profileNgaysinh").textContent = currentUser.ngaysinh;
  document.getElementById("profileGioitinh").textContent = currentUser.gioitinh;

  // Ẩn nút Lưu lúc đầu
  document.getElementById("saveBtn").style.display = "none";
}
window.addEventListener("load", loadProfile);

// ===== NÚT CHỈNH SỬA =====
function enableEdit() {
  const editBtn = document.getElementById("editBtn");
  const saveBtn = document.getElementById("saveBtn");

  editBtn.style.display = "none";
  saveBtn.style.display = "inline-block";

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return;

  document.getElementById(
    "profileHoten"
  ).innerHTML = `<input type="text" id="changeHoten" value="${currentUser.hoten}">`;
  document.getElementById(
    "profileUsername"
  ).innerHTML = `<input type="text" id="changeUsername" value="${currentUser.username}" disabled>`;
  document.getElementById(
    "profileEmail"
  ).innerHTML = `<input type="email" id="changeEmail" value="${currentUser.email}">`;
  document.getElementById(
    "profileSdt"
  ).innerHTML = `<input type="text" id="changeSdt" value="${currentUser.sdt}">`;
  document.getElementById(
    "profileAddress"
  ).innerHTML = `<input type="text" id="changeAddress" value="${currentUser.address}">`;
  document.getElementById(
    "profileNgaysinh"
  ).innerHTML = `<input type="date" id="changeNgaysinh" value="${currentUser.ngaysinh}">`;
  document.getElementById("profileGioitinh").innerHTML = `
    <select id="changeGioitinh">
      <option value="nam" ${
        currentUser.gioitinh === "nam" ? "selected" : ""
      }>Nam</option>
      <option value="nu" ${
        currentUser.gioitinh === "nu" ? "selected" : ""
      }>Nữ</option>
      <option value="khac" ${
        currentUser.gioitinh === "khac" ? "selected" : ""
      }>Khác</option>
    </select>
  `;
}

// ===== NÚT LƯU =====
function enableSave() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return;

  // Lấy giá trị mới từ input
  const newHoten = document.getElementById("changeHoten").value.trim();
  const newUsername = document.getElementById("changeUsername").value.trim();
  const newEmail = document.getElementById("changeEmail").value.trim();
  const newSdt = document.getElementById("changeSdt").value.trim();
  const newAddress = document.getElementById("changeAddress").value.trim();
  const newNgaysinh = document.getElementById("changeNgaysinh").value;
  const selectGioitinh = document.getElementById("changeGioitinh");

  // Lấy text hiển thị ("Nam", "Nữ", "Khác")
  const newGioitinh = selectGioitinh.options[selectGioitinh.selectedIndex].text;

  const editEmail = document.getElementById("editEmail");
  const editPhone = document.getElementById("editPhone");

  //lấy ds tài khoản đã đăng ký
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // ====== KIỂM TRA TRÙNG EMAIL ======
  const emailExists = users.some(
    (u) => u.email === newEmail && u.username !== currentUser.username
  );
  if (emailExists) {
    editEmail.textContent = "Tên email đã tồn tại! Vui lòng nhập email khác.";
    editEmail.style.display = "block";
    return;
  } else {
    editEmail.textContent = "";
    editEmail.style.display = "none";
  }

  // ====== KIỂM TRA ĐỊNH DẠNG SỐ ĐIỆN THOẠI ======
  const phonePattern = /^0\d{9}$/; // Bắt đầu bằng 0 và có 10 số
  if (!phonePattern.test(newSdt)) {
    editPhone.textContent =
      "Số điện thoại phải bắt đầu bằng 0 và có đủ 10 chữ số.";
    editPhone.style.display = "block";
    return;
  } else {
    editPhone.textContent = " ";
    editPhone.style.display = "none";
  }

  // ====== CẬP NHẬT THÔNG TIN ======
  currentUser.hoten = newHoten;
  currentUser.username = newUsername;
  currentUser.email = newEmail;
  currentUser.sdt = newSdt;
  currentUser.address = newAddress;
  currentUser.ngaysinh = newNgaysinh;
  currentUser.gioitinh = newGioitinh;

  // Cập nhật currentUser trong localStorage
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  // Cập nhật danh sách users
  const updatedUsers = users.map((u) => {
    if (u.username === currentUser.username) {
      return currentUser; // nếu đúng username, trả về currentUser
    } else {
      return u; // nếu không đúng, giữ nguyên user cũ
    }
  });
  localStorage.setItem("users", JSON.stringify(updatedUsers));

  // Cập nhật lại giao diện
  loadProfile();

  // Chuyển nút
  document.getElementById("editBtn").style.display = "inline-block";
  document.getElementById("saveBtn").style.display = "none";

  alert("Đã lưu thay đổi thành công!");
}

// ===== ĐĂNG XUẤT =====
window.addEventListener("load", function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const loginItem = document.getElementById("loginItem");
  const profileItem = document.getElementById("profileItem");
  const ordersItem = document.getElementById("ordersItem");
  const logoutItem = document.getElementById("logoutItem");
  const logoutBtn = document.getElementById("logoutBtn");

  // Cập nhật hiển thị menu
  function updateMenu(isLoggedIn) {
    if (isLoggedIn) {
      loginItem.style.display = "none";
      profileItem.style.display = "block";
      ordersItem.style.display = "block";
      logoutItem.style.display = "block";
    } else {
      loginItem.style.display = "block";
      profileItem.style.display = "none";
      ordersItem.style.display = "none";
      logoutItem.style.display = "none";
    }
  }

  // Khi load trang -> cập nhật menu theo trạng thái đăng nhập
  const isLoggedIn = !!currentUser; // Chuyển currentUser thành boolean
  updateMenu(isLoggedIn); // Cập nhật menu

  // Xử lý nút đăng xuất
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("currentUser");
      updateMenu(false); // cập nhật lại menu
      LoadPage(pagehome); // quay về trang chủ
    });
  }
});

// ==================== HIỂN THỊ DANH SÁCH ĐƠN HÀNG ====================
function hienThiDonHang() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const ordersList = document.getElementById("orders-list");
  const ordersTable = document.querySelector(".ordersTable");

  if (!ordersList || !ordersTable) return;

  // Xóa toàn bộ nội dung cũ
  ordersList.innerHTML = "";

  // Xóa dòng thông báo cũ nếu có
  const oldMsg = ordersTable.querySelector(".no-orders-msg");
  if (oldMsg) oldMsg.remove();

  // Lọc đơn của người dùng
  let userOrders = [];
  if (currentUser) {
    userOrders = orders.filter(
      (order) => order.username === currentUser.username
    );
  }

  // Tạo hàng header
  const headerRow = document.createElement("div");
  headerRow.classList.add("orders-grid");
  headerRow.innerHTML = `
    <div class="orders-column"><div class="column-header">Mã đơn</div></div>
    <div class="orders-column"><div class="column-header">Ngày đặt</div></div>
    <div class="orders-column"><div class="column-header">Trạng thái</div></div>
    <div class="orders-column"><div class="column-header">Thành tiền</div></div>
  `;
  ordersList.appendChild(headerRow);

  if (userOrders.length === 0) {
    const msg = document.createElement("p");
    msg.className = "no-orders-msg";
    msg.style.textAlign = "center";
    msg.style.marginTop = "20px";
    msg.textContent = "Chưa có đơn hàng nào.";
    ordersList.style.borderBottom = "none";
    ordersTable.appendChild(msg);
    return;
  }

  // Tạo từng hàng đơn
  userOrders.forEach((order, index) => {
    const orderRow = document.createElement("div");
    orderRow.classList.add("orders-grid");
    orderRow.innerHTML = `
      <div class="orders-column"><div class="column-value">${
        order.orderId
      }</div></div>
      <div class="orders-column"><div class="column-value">${
        order.date
      }</div></div>
      <div class="orders-column"><div class="column-value">${
        order.status
      }</div></div>
      <div class="orders-column"><div class="column-value">${dinhDangGia(
        order.total
      )}</div></div>
    `;
    // Nếu là dòng cuối cùng, thêm border-bottom
    if (index === userOrders.length - 1) {
      orderRow.style.borderBottom = "1px solid #ccc";
    }
    ordersList.appendChild(orderRow);
  });

  // Xóa border-bottom mặc định của container để không bị dày
  ordersList.style.borderBottom = "none";
}

// ==================== KHI CLICK VÀO NÚT "ĐƠN HÀNG" ====================
document.getElementById("openOrders")?.addEventListener("click", function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    alert("Vui lòng đăng nhập để xem đơn hàng!");
    return;
  }

  LoadPage(pagehistory);
  hienThiDonHang();
});

// ==================== CHẶN VÀO GIỎ HÀNG KHI CHƯA ĐĂNG NHẬP + KHỞI TẠO ====================
document.addEventListener("DOMContentLoaded", function () {
  const iconCart = document.getElementById("iconCart");

  if (iconCart) {
    iconCart.addEventListener("click", function (e) {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser) {
        e.preventDefault();
        alert("Vui lòng đăng nhập để xem giỏ hàng!");
        return;
      }
      // Nếu đã đăng nhập thì chuyển trang
      LoadPage(pagecart);
    });
  }
});

function dangXuat() {
  localStorage.removeItem("currentUser");
  gioHang = []; // reset giỏ hàng
  capNhatBadgeGioHang(); // cập nhật badge
  updateMenu(false); // cập nhật menu
  LoadPage(pagehome); // quay về trang chủ
}
