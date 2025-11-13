// ==================== KHAI BÁO DỮ LIỆU ====================
let gioHang = [];
let currentUser = JSON.parse(localStorage.getItem("currentUser"));
let danhSachDiaChi = [];

if (currentUser && currentUser.address) {
  // Nếu user có địa chỉ → đặt mặc định
  danhSachDiaChi.push({
    name: currentUser.hoten,
    phone: currentUser.sdt,
    address: currentUser.address,
    macDinh: true,
  });
}

// ==================== CẬP NHẬT BADGE GIỎ HÀNG ====================
function capNhatBadgeGioHang() {
  const badge = document.getElementById("cart-badge");
  if (badge) {
    const tongSoLuong = gioHang.reduce((total, item) => total + item.sl, 0);
    badge.textContent = tongSoLuong;
    if (tongSoLuong > 0) {
      badge.style.display = "flex";
    } else {
      badge.style.display = "none";
    }
  }
}

// ==================== HIỂN THỊ SẢN PHẨM ====================
function hienThiSanPham() {
  const ds = document.getElementById("product-list");
  if (!ds) return;
  ds.innerHTML = "";
  sanPham.forEach((sp) => {
    const div = document.createElement("div");
    div.classList.add("product-item");
    div.innerHTML = `
      <img src="${sp.hinhAnh}" alt="${sp.ten}">
      <h3>${sp.ten}</h3>
      <p>${dinhDangGia(sp.gia)}</p>
      <button class="btn-add" onclick="themVaoGioHang(${
        sp.id
      })">🛒 Thêm vào giỏ hàng</button>
    `;
    ds.appendChild(div);
  });
}

// ==================== THÊM VÀO GIỎ HÀNG ====================
function themVaoGioHang(tenOrId, gia, hinhAnh) {
  let sanPham;

  // Nếu chỉ truyền 1 tham số (id từ giohang.js)
  if (arguments.length === 1) {
    sanPham = window.sanPham?.find((p) => p.id === tenOrId);
    if (!sanPham) return;
  }
  // Nếu truyền 3 tham số (tên, giá, hình ảnh từ trang sản phẩm)
  else {
    sanPham = {
      id: tenOrId, // Dùng tên làm id tạm thời
      ten: tenOrId,
      gia: gia,
      hinhAnh: hinhAnh,
    };
  }

  // ✅ KIỂM TRA TỒN KHO TRƯỚC KHI THÊM
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const productInStock = products.find((p) => p.name === sanPham.ten);

  console.log("🔍 Kiểm tra tồn kho:", {
    tenSanPham: sanPham.ten,
    timThay: !!productInStock,
    tonKho: productInStock ? productInStock.amount : "Không tìm thấy",
  });

  // Tìm sản phẩm trong giỏ hàng (dựa vào tên hoặc id)
  const tonTai = gioHang.find(
    (p) => p.ten === sanPham.ten || p.id === sanPham.id
  );

  const soLuongHienTai = tonTai ? tonTai.sl : 0;
  const tonKho = productInStock ? productInStock.amount || 0 : 999; // Nếu không tìm thấy, cho phép thêm

  // Kiểm tra nếu vượt quá tồn kho
  if (productInStock && soLuongHienTai + 1 > tonKho) {
    alert(
      `⚠️ Không thể thêm! Sản phẩm "${sanPham.ten}" chỉ còn ${tonKho} cái trong kho.\nBạn đã có ${soLuongHienTai} trong giỏ hàng.`
    );
    return;
  }

  if (tonTai) {
    tonTai.sl++;
  } else {
    gioHang.push({
      id: sanPham.id,
      ten: sanPham.ten,
      gia: sanPham.gia,
      hinhAnh: sanPham.hinhAnh,
      sl: 1,
    });
  }

  // Lưu vào localStorage
  localStorage.setItem("gioHang", JSON.stringify(gioHang));

  // Cập nhật badge
  capNhatBadgeGioHang();

  alert("✅ Đã thêm " + sanPham.ten + " vào giỏ hàng!");
  hienThiGioHang();
}

// ==================== HIỂN THỊ GIỎ HÀNG ====================
function hienThiGioHang() {
  const danhSach = document.getElementById("cart-list");
  const dem = document.getElementById("cart-count");
  if (!danhSach) return;
  danhSach.innerHTML = "";

  if (gioHang.length === 0) {
    danhSach.innerHTML = `<p style="text-align:center; padding:30px; color:#8B4513;">
      <i class="i-cart" style="font-size:40px;"></i><br>Giỏ hàng trống</p>`;
    if (dem) dem.textContent = "0";
    return;
  }

  gioHang.forEach((sp, index) => {
    const tien = sp.gia * sp.sl;
    const li = document.createElement("li");
    li.classList.add("cart-item");
    li.innerHTML = `
      <div class="cart-item-info">
        <img src="${sp.hinhAnh}" alt="${sp.ten}" class="cart-item-img">
        <div class="cart-item-details">
          <div class="cart-item-name">${sp.ten}</div>
          <div class="cart-item-price">${dinhDangGia(sp.gia)} x ${
      sp.sl
    } = ${dinhDangGia(tien)}</div>
        </div>
      </div>
      <div class="cart-item-controls">
        <div class="quantity-controls">
          <button onclick="giamSoLuong(${index})">−</button>
          <span>${sp.sl}</span>
          <button onclick="tangSoLuong(${index})">+</button>
        </div>
        <button class="btn-remove" onclick="xoaSanPham(${index})">🗑️ Xóa</button>
      </div>`;
    danhSach.appendChild(li);
  });

  if (dem) dem.textContent = gioHang.length;

  // Cập nhật badge
  capNhatBadgeGioHang();
}

// ==================== SỬA SỐ LƯỢNG ====================
function tangSoLuong(index) {
  if (gioHang[index]) {
    // ✅ Kiểm tra tồn kho trước khi tăng
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const productInStock = products.find((p) => p.name === gioHang[index].ten);
    const tonKho = productInStock ? productInStock.amount || 0 : 0;

    if (gioHang[index].sl + 1 > tonKho) {
      alert(
        `⚠️ Không thể thêm! Sản phẩm "${gioHang[index].ten}" chỉ còn ${tonKho} cái trong kho.`
      );
      return;
    }

    gioHang[index].sl++;
    localStorage.setItem("gioHang", JSON.stringify(gioHang));
    hienThiGioHang();
    capNhatBadgeGioHang();
  }
}

function giamSoLuong(index) {
  if (gioHang[index]) {
    if (gioHang[index].sl > 1) {
      gioHang[index].sl--;
    } else {
      xoaSanPham(index);
      return;
    }
    localStorage.setItem("gioHang", JSON.stringify(gioHang));
    hienThiGioHang();
    capNhatBadgeGioHang();
  }
}

// ==================== XÓA SẢN PHẨM ====================
function xoaSanPham(index) {
  if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
    gioHang.splice(index, 1);
    localStorage.setItem("gioHang", JSON.stringify(gioHang));
    hienThiGioHang();
    capNhatBadgeGioHang();
  }
}

// ==================== ĐỊNH DẠNG GIÁ ====================
function dinhDangGia(gia) {
  return gia.toLocaleString("vi-VN") + "đ";
}

// ==================== CHUYỂN TRANG ====================
function chuyenTrang(id) {
  // Ẩn tất cả các trang
  const pages = document.querySelectorAll(".page-content");
  pages.forEach((p) => p.classList.add("hidden"));

  // Hiện trang được chọn
  const targetPage = document.getElementById(id);
  if (targetPage) {
    targetPage.classList.remove("hidden");
  }

  // Scroll về đầu trang
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function moTrangThanhToan() {
  chuyenTrang("page-checkout");
  hienThiDanhSachDiaChi(); // hiển thị radio địa chỉ
  capNhatTongTienThanhToan(); // cập nhật tổng tiền
}

// ==================== THANH TOÁN & ĐỊA CHỈ ====================
function hienThiFormDiaChiMoi() {
  const form = document.getElementById("checkout-new-address-form");
  if (!form) return; // nếu không tìm thấy form thì thoát

  // Nếu đang hiển thị thì ẩn, ngược lại thì hiện
  if (form.style.display === "block") {
    form.style.display = "none";
  } else {
    form.style.display = "block";
  }
}

function luuDiaChiMoi() {
  const name = document.getElementById("checkout-new-name").value.trim();
  const phone = document.getElementById("checkout-new-phone").value.trim();
  const address = document.getElementById("checkout-new-address").value.trim();

  if (!name || !phone || !address) {
    alert("Vui lòng nhập đầy đủ thông tin địa chỉ!");
    return;
  }

  // Kiểm tra số điện thoại hợp lệ
  const regex = /^0[0-9]{9}$/;
  if (!regex.test(phone)) {
    alert("Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0!");
    return;
  }

  // Khi thêm địa chỉ mới, đặt nó làm mặc định
  danhSachDiaChi.forEach((dc) => (dc.macDinh = false));
  danhSachDiaChi.push({ name, phone, address, macDinh: true });

  // Ẩn form và hiển thị lại danh sách
  document.getElementById("checkout-new-address-form").style.display = "none";
  hienThiDanhSachDiaChi();
}

//============ HIỂN THỊ DANH SÁCH ĐỊA CHỈ ==============
function hienThiDanhSachDiaChi() {
  const list = document.getElementById("checkout-address-list");
  if (!list) return;
  list.innerHTML = "";

  // Nếu chưa có địa chỉ → yêu cầu tạo mới
  if (danhSachDiaChi.length === 0) {
    list.innerHTML = `
      <p>Chưa có địa chỉ nào.</p>
    `;
    return;
  }

  // Hiển thị các địa chỉ có sẵn
  danhSachDiaChi.forEach((dc, i) => {
    const div = document.createElement("div");
    div.classList.add("address-item");
    div.innerHTML = div.innerHTML = `
    <label>
      <input type="radio" name="checkout-address" value="${i}" ${
      dc.macDinh ? "checked" : ""
    }>
      <strong>${dc.name}</strong> - ${dc.phone}<br>
      ${dc.address}
    </label>
  `;
    list.appendChild(div);
  });
}

// ==================== CHUYỂN ĐẾN THANH TOÁN ====================
function chuyenDenThanhToan() {
  if (gioHang.length === 0) {
    alert("Giỏ hàng trống, vui lòng thêm sản phẩm!");
    return;
  }

  // Tính tổng
  let tong = gioHang.reduce((t, sp) => t + sp.gia * sp.sl, 0);
  const subtotalEl = document.getElementById("checkout-subtotal");
  if (subtotalEl) subtotalEl.textContent = dinhDangGia(tong);

  // Chuyển trang và hiển thị địa chỉ
  chuyenTrang("page-checkout");
  hienThiDanhSachDiaChi();
}

// ==================== RÀNG BUỘC KHI NHẬP SỐ ĐIỆN THOẠI ====================
document.addEventListener("DOMContentLoaded", function () {
  const phoneInput = document.getElementById("checkout-new-phone");
  if (!phoneInput) return;

  // Tạo phần báo lỗi nếu chưa có
  let phoneError = phoneInput.nextElementSibling;
  if (!phoneError || !phoneError.classList.contains("phone-error")) {
    phoneError = document.createElement("small");
    phoneError.classList.add("phone-error");
    phoneError.style.color = "red";
    phoneError.style.display = "none";
    phoneInput.insertAdjacentElement("afterend", phoneError);
  }

  // Kiểm tra khi người dùng nhập
  phoneInput.addEventListener("input", function () {
    const regex = /^0[0-9]*$/; // chỉ cho phép số, bắt đầu bằng 0
    if (!regex.test(this.value) || this.value.length !== 10) {
      phoneError.style.display = "block";
      phoneError.textContent =
        "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0";
    } else {
      phoneError.style.display = "none";
      phoneError.textContent = "";
    }
  });
});

// ==================== XÁC NHẬN THANH TOÁN ====================
function xacNhanThanhToan() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    alert("Vui lòng đăng nhập để đặt hàng!");
    return;
  }

  if (gioHang.length === 0) {
    alert("Giỏ hàng trống!");
    return;
  }
  // Nếu chưa có địa chỉ nào
  if (danhSachDiaChi.length === 0) {
    alert(
      "Bạn chưa có địa chỉ nhận hàng. Vui lòng thêm địa chỉ mới trước khi thanh toán!"
    );
    hienThiFormDiaChiMoi();
    return;
  }

  // Kiểm tra xem người dùng đã chọn địa chỉ chưa
  const radios = document.getElementsByName("checkout-address");
  let selected = null;
  for (const r of radios) {
    if (r.checked) selected = danhSachDiaChi[r.value];
  }

  if (!selected) {
    alert("Vui lòng chọn địa chỉ nhận hàng!");
    return;
  }

  // Nếu hợp lệ → tiếp tục xử lý thanh toán
  alert(
    `Thanh toán với địa chỉ:\n${selected.name} - ${selected.phone}\n${selected.address}`
  );

  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const newOrder = {
    orderId: "DH" + Date.now(),
    username: currentUser.username,
    date: new Date().toLocaleString("vi-VN"),
    items: gioHang.map((item) => ({
      ten: item.ten,
      name: item.ten,
      gia: item.gia,
      hinhAnh: item.hinhAnh,
      sl: item.sl,
    })),
    total: gioHang.reduce((sum, sp) => sum + sp.gia * sp.sl, 0),
    status: "Chờ xác nhận",
  };

  orders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(orders));

  // Reset giỏ hàng
  gioHang = [];
  localStorage.removeItem("gioHang");

  // Cập nhật lại giao diện
  hienThiGioHang();
  capNhatBadgeGioHang();

  // Quay về trang sản phẩm
  chuyenTrang("page-products");
}

// ==================== XEM LẠI & ĐẶT HÀNG ====================
function xemLaiDonHang() {
  const diaChiChon = document.querySelector(
    "input[name='checkout-address']:checked"
  );
  if (!diaChiChon) {
    alert("Vui lòng chọn địa chỉ giao hàng!");
    return;
  }

  const phuongThucInput = document.querySelector(
    "input[name='checkout-payment']:checked"
  );
  const phuongThuc = phuongThucInput ? phuongThucInput.value : "";
  const tongTienEl = document.getElementById("checkout-subtotal");
  const tongTien = tongTienEl ? tongTienEl.textContent : "0đ";

  const noiDung = `
    <h3>Chi tiết đơn hàng</h3>
    <ul>
      ${gioHang
        .map(
          (sp) =>
            `<li>${sp.ten} - ${sp.sl} x ${dinhDangGia(sp.gia)} = ${dinhDangGia(
              sp.gia * sp.sl
            )}</li>`
        )
        .join("")}
    </ul>
    <p><strong>Tổng cộng: ${tongTien}</strong></p>
    <p>Phương thức thanh toán: ${phuongThuc.toUpperCase()}</p>`;
  document.getElementById("order-review-content").innerHTML = noiDung;

  chuyenTrang("page-review");
}

// ==================== XÁC NHẬN ĐẶT HÀNG ====================
function xacNhanDatHang() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    alert("Vui lòng đăng nhập để đặt hàng!");
    return;
  }

  if (gioHang.length === 0) {
    alert("Giỏ hàng trống!");
    return;
  }

  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const newOrder = {
    orderId: "DH" + Date.now(),
    username: currentUser.username,
    date: new Date().toLocaleString("vi-VN"),
    items: gioHang.map((item) => ({
      ten: item.ten,
      name: item.ten,
      gia: item.gia,
      hinhAnh: item.hinhAnh,
      sl: item.sl,
    })),
    total: gioHang.reduce((sum, sp) => sum + sp.gia * sp.sl, 0),
    status: "Chờ xác nhận",
  };

  orders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(orders));

  // Reset giỏ hàng
  gioHang = [];
  localStorage.removeItem("gioHang"); // Xóa giỏ hàng cũ
  danhSachDiaChi.forEach((d) => (d.macDinh = false));

  // Thông báo
  alert("Đặt hàng thành công!");

  // Cập nhật giao diện
  hienThiDanhSachDiaChi();
  capNhatBadgeGioHang();

  // Chuyển về trang sản phẩm
  chuyenTrang("page-products");
}

// ==================== KHI TẢI TRANG XONG ====================
window.addEventListener("DOMContentLoaded", function () {
  gioHang = JSON.parse(localStorage.getItem("gioHang")) || [];
  hienThiGioHang();
  capNhatBadgeGioHang();
});
