// Lấy dữ liệu từ localStorage (được quản lý bởi admin)
function getMenuBanhFromLocalStorage() {
  const types = JSON.parse(localStorage.getItem("types")) || [];
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const prices = JSON.parse(localStorage.getItem("prices")) || [];

  // Chuyển đổi từ định dạng admin sang định dạng MenuBanh
  const MenuBanh = types
    .map((type) => {
      const typeName = type.name;
      const cakes = products
        .filter((product) => product.type === typeName)
        .map((product) => {
          // Tìm giá tương ứng
          const priceInfo = prices.find((p) => p.name === product.name) || {
            sale: 0,
          };
          return {
            name: product.name,
            price: priceInfo.sale,
            img: product.img || priceInfo.img || "../img/default.jpg",
          };
        });

      return {
        category: typeName,
        cakes: cakes,
      };
    })
    .filter((category) => category.cakes.length > 0); // Chỉ giữ các category có sản phẩm

  return MenuBanh;
}

// Sử dụng dữ liệu từ localStorage thay vì dữ liệu cứng
const MenuBanh = getMenuBanhFromLocalStorage();

// Lưu vào localStorage để tương thích với code cũ
localStorage.setItem("MenuBanh", JSON.stringify(MenuBanh));

//================================================
//Phân trang
let tatCaBanh = [];
// Duyệt qua từng loại bánh
for (let i = 0; i < MenuBanh.length; i++) {
  const loaiBanh = MenuBanh[i];

  // Duyệt qua từng bánh trong loại đó
  for (let j = 0; j < loaiBanh.cakes.length; j++) {
    const banh = loaiBanh.cakes[j];

    // Gắn thêm tên loại bánh vô mỗi bánh (để hiển thị)
    tatCaBanh.push({
      name: banh.name,
      price: banh.price,
      img: banh.img,
      category: loaiBanh.category,
    });
  }
}

let dsHienThi = tatCaBanh.slice(); // mảng hiển thị hiện tại
let trang = 1; // trang hiện tại
let moiTrang = 8; // số sản phẩm mỗi trang

// 3) Render lưới theo dsHienThi và trang
function renderGrid() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;
  grid.innerHTML = "";

  const batDau = (trang - 1) * moiTrang;
  const ketThuc = batDau + moiTrang;
  const items = dsHienThi.slice(batDau, ketThuc);

  if (dsHienThi.length === 0) {
    grid.innerHTML = '<h3 class="no-result">Không có sản phẩm phù hợp</h3>';
    return;
  }

  for (let i = 0; i < items.length; i++) {
    const banh = items[i];
    // Thêm data vào card => xíu làm popup chi tiết
    const card = document.createElement("div");
    card.className = "product-card";
    card.dataset.name = banh.name;
    card.dataset.category = banh.category;
    card.dataset.price = banh.price;
    card.dataset.img = banh.img || "../img/default.jpg";

    card.innerHTML = `
      <img src="${banh.img || "../img/default.jpg"}" alt="${
      banh.name
    }" class="product-image" />
      <div class="product-info">
        <span class="category">${banh.category}</span>
        <h3>${banh.name}</h3>
        <p class="price">${Number(banh.price).toLocaleString("vi-VN")}₫</p>
        <button class="add-to-cart">
          <i class='bx bx-cart-add'></i> Thêm vào giỏ hàng
        </button>
      </div>
    `;

    // Gắn sự kiện cho nút "Thêm vào giỏ hàng"
    const addToCartBtn = card.querySelector(".add-to-cart");
    addToCartBtn.addEventListener("click", function (e) {
      e.stopPropagation(); // Ngăn event lan ra card
      themVaoGioHang(banh.name, banh.price, banh.img || "../img/default.jpg");
    });

    // Gắn sự kiện click cho card để hiện popup
    card.addEventListener("click", function (e) {
      if (!e.target.closest(".add-to-cart")) {
        showProductDetail(card.dataset);
      }
    });

    grid.appendChild(card);
  }
}
//Tạo nút
const pagination = document.getElementById("pagination");
function renderPagination() {
  if (!pagination) return;
  pagination.innerHTML = "";
  if (dsHienThi.length === 0) return;
  const tongTrang = Math.max(1, Math.ceil(dsHienThi.length / moiTrang));
  for (let i = 1; i <= tongTrang; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === trang) btn.classList.add("active");
    pagination.appendChild(btn);
  }
}
pagination.addEventListener("click", (event) => {
  // event.target là phần tử được click. closest("button") tìm nút button gần nhất (nếu click vào icon/text bên trong).
  const clickedButton = event.target.closest("button");
  // Nếu không click vào 1 button trong container thì thoát
  if (!clickedButton || !pagination.contains(clickedButton)) {
    return;
  }
  // Lấy số trang từ text của nút
  const pageNumber = Number(clickedButton.textContent);
  // Cập nhật trang và render lại giao diện
  trang = pageNumber;
  renderGrid();
  renderPagination();
});
//Hàm tiện lợi: render lại tất cả
function refresh() {
  renderGrid();
  renderPagination();
}

// Hàm lọc theo category và cập nhật giao diện
function filterByCategory(categoryName) {
  if (categoryName) {
    dsHienThi = tatCaBanh.filter(
      (product) => product.category === categoryName
    );
  } else {
    dsHienThi = tatCaBanh.slice();
  }
  trang = 1;
  // Cập nhật trạng thái active của category tabs
  const tabs = document.querySelectorAll(".category-tab");
  tabs.forEach((tab) => {
    tab.classList.remove("active");
    // Nếu categoryName rỗng, active tab "Tất cả"
    if (!categoryName && tab.textContent.trim() === "Tất cả") {
      tab.classList.add("active");
    }
    // Nếu có categoryName, active tab tương ứng
    else if (categoryName && tab.textContent.trim() === categoryName) {
      tab.classList.add("active");
    }
  });

  refresh(); // gọi hàm bạn dùng để vẽ lại danh sách + phân trang
}

// Hàm set active khi click vào bất kỳ phần tử con nào trong .category-tab
document.addEventListener("click", function (e) {
  var clickedTab = e.target.closest(".category-tab");
  if (!clickedTab) return;
  var selectedCategory = clickedTab.dataset.category || "";
  var tabs = document.querySelectorAll(".category-tab");
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove("active");
  }
  clickedTab.classList.add("active");
});

//Tìm kiếm đơn giản theo tên
function searchProducts() {
  const oTimKiem = document.getElementById("productSearch");
  const tuKhoa = (oTimKiem?.value || "").toLowerCase();
  dsHienThi = tatCaBanh.filter((p) => p.name.toLowerCase().includes(tuKhoa));
  trang = 1;
  refresh();
}

//Khởi tạo khi DOM sẵn sàng
window.addEventListener("DOMContentLoaded", () => {
  // Nếu có ô tìm kiếm, gắn sự kiện
  const productSearch = document.getElementById("productSearch");
  if (productSearch) productSearch.addEventListener("keyup", searchProducts);
  // Hiển thị tất cả mặc định
  refresh();
});

//bật tắt tìm kiếm nâng cao
function toggleAdvancedSearch() {
  const advancedSearch = document.querySelector(".advanced-search");
  advancedSearch.classList.toggle("active");
}
const toggleAdvanced = document.querySelector(".toggle-advanced");
toggleAdvanced.addEventListener("click", toggleAdvancedSearch);

function applyAdvancedFilter() {
  var category = document.getElementById("categoryFilter").value;
  var minVal = document.getElementById("minPrice").value;
  var maxVal = document.getElementById("maxPrice").value;
  // Nếu rỗng thì để null (bỏ qua), nếu có thì chuyển thành Number
  var minPrice = minVal === "" ? null : Number(minVal);
  var maxPrice = maxVal === "" ? null : Number(maxVal);
  // (Tuỳ) kiểm tra nếu người dùng nhập nhưng không phải số

  dsHienThi = tatCaBanh.filter(function (p) {
    var price = Number(p.price);
    if (Number.isNaN(price)) return false; // nếu price sản phẩm không hợp lệ thì bỏ
    // Nếu category đã chọn thì so sánh, nếu không thì bỏ qua
    if (category && p.category !== category) return false;
    // Nếu minPrice khác null thì kiểm tra price >= minPrice
    if (minPrice !== null && price < minPrice) return false;
    // Nếu maxPrice khác null thì kiểm tra price <= maxPrice
    if (maxPrice !== null && price > maxPrice) return false;
    return true; // thỏa hết -> giữ sản phẩm
  });
  trang = 1;
  refresh();
}

// Hàm popup chi tiết sản phẩm
function showProductDetail(data) {
  const modal = document.getElementById("productModal");
  const modalBody = document.getElementById("modalBody");
  if (!modal || !modalBody) return;

  modalBody.innerHTML = `
    <div class="product-detail">
      <img src="${data.img}" alt="${data.name}" class="detail-image" />
      <h2>${data.name}</h2>
      <p class="detail-category"><strong>Loại:</strong> ${data.category}</p>
      <p class="detail-price">${Number(data.price).toLocaleString("vi-VN")}₫</p>
      <button class="add-to-cart-modal">
        <i class='bx bx-cart-add'></i> Thêm vào giỏ hàng
      </button>
    </div>
  `;

  // Gắn sự kiện cho nút trong modal
  const addBtn = modalBody.querySelector(".add-to-cart-modal");
  if (addBtn) {
    addBtn.addEventListener("click", function () {
      themVaoGioHang(data.name, data.price, data.img);
      closeProductModal();
    });
  }

  modal.classList.add("active");
}

// Hàm đóng popup
function closeProductModal() {
  const modal = document.getElementById("productModal");
  if (modal) modal.classList.remove("active");
}
//Hàm này cho cái danh mục sản phẩm lượt lướt khi click vô thì nó ra trang sản ppham có sẵn category
function attachCategoryClickEvents() {
  document.querySelectorAll(".product-item[data-category]").forEach((item) => {
    item.addEventListener("click", function () {
      const cat = this.dataset.category;
      LoadPage(pageproducts); // Chuyển sang trang sản phẩm
      setTimeout(() => {
        filterByCategory(cat); // Lọc theo category (đảm bảo trang đã load)
      }, 100); // Delay nhỏ để chắc chắn trang đã chuyển
    });
  });
}

function renderMenuRight(products) {
  const menuRight = document.querySelector(".menu-right");
  if (!menuRight) return;
  menuRight.innerHTML = "";
  //banh là tên biến tạm thời đại diện chjo mỗi phần tử của mảng khi đang duyệt
  products.forEach((banh) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.dataset.name = banh.name;
    card.dataset.category = banh.category;
    card.dataset.price = banh.price;
    card.dataset.img = banh.img || "../img/default.jpg";
    card.innerHTML = `
      <img src="${banh.img || "../img/default.jpg"}" alt="${
      banh.name
    }" class="product-image" />
      <div class="product-info">
        <span class="category">${banh.category}</span>
        <h3>${banh.name}</h3>
        <p class="price">${Number(banh.price).toLocaleString("vi-VN")}₫</p>
        <button class="add-to-cart">
          <i class='bx bx-cart-add'></i> Thêm vào giỏ hàng
        </button>
      </div>
    `;

    // Gắn sự kiện cho nút "Thêm vào giỏ hàng"
    const addToCartBtn = card.querySelector(".add-to-cart");
    addToCartBtn.addEventListener("click", function (e) {
      e.stopPropagation(); // Ngăn event lan ra card
      themVaoGioHang(banh.name, banh.price, banh.img || "../img/default.jpg");
    });

    // Gắn sự kiện click cho card để hiện popup
    card.addEventListener("click", function (e) {
      if (!e.target.closest(".add-to-cart")) {
        showProductDetail(card.dataset);
      }
    });
    menuRight.appendChild(card);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  // ...các code khác...
  renderMenuRight(tatCaBanh.slice(0, 6)); // Hiện 6 sản phẩm đầu ở menu-right
  // ...các code khác...
});

document.getElementById("bestban").addEventListener("click", function () {
  renderMenuRight(tatCaBanh.slice(0, 6)); // 6 sản phẩm đầu
});

document.getElementById("newproduct").addEventListener("click", function () {
  renderMenuRight(tatCaBanh.slice(-6)); // 6 sản phẩm cuối
});

// ==================== RENDER CATEGORY TABS & FILTER ====================
function renderCategoryTabs() {
  const categoryTabs = document.getElementById("categoryTabs");
  const categoryFilter = document.getElementById("categoryFilter");

  if (!categoryTabs) return;

  // Xóa nội dung cũ
  categoryTabs.innerHTML = "";

  if (categoryFilter) {
    categoryFilter.innerHTML = '<option value="">Tất cả</option>';
  }

  // Lấy danh sách types
  const types = JSON.parse(localStorage.getItem("types")) || [];

  // Tạo nút "Tất cả"
  const allBtn = document.createElement("button");
  allBtn.className = "category-tab active";
  allBtn.textContent = "Tất cả";
  allBtn.onclick = function () {
    document
      .querySelectorAll(".category-tab")
      .forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");
    filterByCategory("");
  };
  categoryTabs.appendChild(allBtn);

  // Render từng category
  types.forEach((type) => {
    // Tạo nút category tab
    const btn = document.createElement("button");
    btn.className = "category-tab";
    btn.textContent = type.name;
    btn.onclick = function () {
      document
        .querySelectorAll(".category-tab")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      filterByCategory(type.name);
    };
    categoryTabs.appendChild(btn);

    // Thêm vào dropdown filter
    if (categoryFilter) {
      const option = document.createElement("option");
      option.value = type.name;
      option.textContent = type.name;
      categoryFilter.appendChild(option);
    }
  });
}

// Gọi hàm khi trang load
window.addEventListener("DOMContentLoaded", () => {
  renderCategoryTabs(); // Render category tabs
  renderMenuRight(tatCaBanh.slice(0, 6)); // Hiện 6 sản phẩm đầu ở menu-right
  attachCategoryClickEvents(); // Gắn sự kiện click cho danh mục sản phẩm
});
