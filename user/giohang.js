// ==================== KHAI BÁO DỮ LIỆU ====================
let gioHang = [];
let danhSachDiaChi = [];

// ==================== CẬP NHẬT BADGE GIỎ HÀNG ====================
function capNhatBadgeGioHang() {
  const badge = document.getElementById("cart-badge");
  if (badge) {
    const tongSoLuong = gioHang.reduce(
      (total, item) => total + item.soLuong,
      0
    );
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

  // Tìm sản phẩm trong giỏ hàng (dựa vào tên hoặc id)
  const tonTai = gioHang.find(
    (p) => p.ten === sanPham.ten || p.id === sanPham.id
  );

  if (tonTai) {
    tonTai.soLuong++;
  } else {
    gioHang.push({
      id: sanPham.id,
      ten: sanPham.ten,
      gia: sanPham.gia,
      hinhAnh: sanPham.hinhAnh,
      soLuong: 1,
    });
  }

  // Lưu vào localStorage
  localStorage.setItem("gioHang", JSON.stringify(gioHang));

  // Cập nhật badge
  capNhatBadgeGioHang();

  alert("Đã thêm " + sanPham.ten + " vào giỏ hàng!");
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
    const tien = sp.gia * sp.soLuong;
    const li = document.createElement("li");
    li.classList.add("cart-item");
    li.innerHTML = `
      <div class="cart-item-info">
        <img src="${sp.hinhAnh}" alt="${sp.ten}" class="cart-item-img">
        <div class="cart-item-details">
          <div class="cart-item-name">${sp.ten}</div>
          <div class="cart-item-price">${dinhDangGia(sp.gia)} x ${
      sp.soLuong
    } = ${dinhDangGia(tien)}</div>
        </div>
      </div>
      <div class="cart-item-controls">
        <div class="quantity-controls">
          <button onclick="giamSoLuong(${index})">−</button>
          <span>${sp.soLuong}</span>
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
    gioHang[index].soLuong++;
    localStorage.setItem("gioHang", JSON.stringify(gioHang));
    hienThiGioHang();
    capNhatBadgeGioHang();
  }
}

function giamSoLuong(index) {
  if (gioHang[index]) {
    if (gioHang[index].soLuong > 1) {
      gioHang[index].soLuong--;
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
  // Ẩn tất cả các trang bằng cách thêm class hidden
  const pages = document.querySelectorAll(".page-content");
  pages.forEach((p) => p.classList.add("hidden"));

  // Hiện trang được chọn bằng cách xóa class hidden
  const targetPage = document.getElementById(id);
  if (targetPage) {
    targetPage.classList.remove("hidden");
  }

  // Scroll về đầu trang
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ==================== THANH TOÁN & ĐỊA CHỈ ====================
function hienThiFormDiaChiMoi() {
  const form = document.getElementById("checkout-new-address-form");
  if (form) form.style.display = "block";
}

function luuDiaChiMoi() {
  const name = document.getElementById("checkout-new-name").value.trim();
  const phone = document.getElementById("checkout-new-phone").value.trim();
  const address = document.getElementById("checkout-new-address").value.trim();

  if (!name || !phone || !address) {
    alert("Vui lòng nhập đầy đủ thông tin địa chỉ!");
    return;
  }

  danhSachDiaChi.push({ name, phone, address });
  document.getElementById("checkout-new-address-form").style.display = "none";
  hienThiDanhSachDiaChi();
}

function hienThiDanhSachDiaChi() {
  const list = document.getElementById("checkout-address-list");
  if (!list) return;
  list.innerHTML = "";

  if (danhSachDiaChi.length === 0) {
    list.innerHTML = "<p>Chưa có địa chỉ nào.</p>";
    return;
  }

  danhSachDiaChi.forEach((dc, i) => {
    const div = document.createElement("div");
    div.classList.add("address-item");
    div.innerHTML = `
      <input type="radio" name="checkout-address" ${
        i === danhSachDiaChi.length - 1 ? "checked" : ""
      }>
      <span><strong>${dc.name}</strong> - ${dc.phone}</span><br>
      <span>${dc.address}</span>`;
    list.appendChild(div);
  });
}

function chuyenDenThanhToan() {
  if (gioHang.length === 0) {
    alert("Giỏ hàng trống, vui lòng thêm sản phẩm!");
    return;
  }

  let tong = gioHang.reduce((t, sp) => t + sp.gia * sp.soLuong, 0);
  const subtotalEl = document.getElementById("checkout-subtotal");
  if (subtotalEl) subtotalEl.textContent = dinhDangGia(tong);

  const checkoutPage = document.getElementById("page-checkout");
  if (checkoutPage) {
    LoadPage(checkoutPage);
  }
  hienThiDanhSachDiaChi();
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
            `<li>${sp.ten} - ${sp.soLuong} x ${dinhDangGia(
              sp.gia
            )} = ${dinhDangGia(sp.gia * sp.soLuong)}</li>`
        )
        .join("")}
    </ul>
    <p><strong>Tổng cộng: ${tongTien}</strong></p>
    <p>Phương thức thanh toán: ${phuongThuc.toUpperCase()}</p>`;
  document.getElementById("order-review-content").innerHTML = noiDung;

  const reviewPage = document.getElementById("page-review");
  if (reviewPage) {
    LoadPage(reviewPage);
  }
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
    items: gioHang,
    total: gioHang.reduce((sum, sp) => sum + sp.gia * sp.soLuong, 0),
    status: "Chờ xác nhận",
  };

  orders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(orders));

  alert("Đặt hàng thành công!");
  gioHang = [];
  localStorage.removeItem("gioHang");
  hienThiGioHang();
  capNhatBadgeGioHang();
  chuyenTrang("page-products");
}

// ==================== KHI TẢI TRANG XONG ====================
window.addEventListener("DOMContentLoaded", function () {
  gioHang = JSON.parse(localStorage.getItem("gioHang")) || [];
  hienThiGioHang();
  capNhatBadgeGioHang();
});
