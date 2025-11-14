//Cấu trúc dữ liệu
// let categories = JSON.parse(localStorage.getItem("categories")) || [];

// Load dữ liệu từ localStorage (sẽ được khởi tạo từ MenuBanh nếu chưa có)
let types = [];
let products = [];
let prices = [];

// Hàm load dữ liệu từ localStorage
function loadDataFromLocalStorage() {
  types = JSON.parse(localStorage.getItem("types")) || [];
  products = JSON.parse(localStorage.getItem("products")) || [];
  prices = JSON.parse(localStorage.getItem("prices")) || [];
}

let editIndex = -1;
let deleteIndex = -1;

// Biến phân trang
let currentPageCategories = 1;
let currentPageProducts = 1;
let currentPagePrices = 1;
let currentPageUsers = 1;
const itemsPerPage = 10;

// Biến lưu kết quả tìm kiếm
let filteredProducts = null;

// Hàm tạo nút phân trang chung
function createPagination(totalItems, currentPage, onPageChange) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  let paginationHTML = '<div class="pagination">';

  // Nút Previous
  if (currentPage > 1) {
    paginationHTML += `<button class="page-btn" onclick="goToPage('${onPageChange}', ${
      currentPage - 1
    })">‹ Trước</button>`;
  }

  // Nút số trang
  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      paginationHTML += `<button class="page-btn active">${i}</button>`;
    } else {
      paginationHTML += `<button class="page-btn" onclick="goToPage('${onPageChange}', ${i})">${i}</button>`;
    }
  }

  // Nút Next
  if (currentPage < totalPages) {
    paginationHTML += `<button class="page-btn" onclick="goToPage('${onPageChange}', ${
      currentPage + 1
    })">Tiếp ›</button>`;
  }

  paginationHTML += "</div>";
  return paginationHTML;
}

// Hàm điều hướng trang chung
function goToPage(sectionType, page) {
  if (sectionType === "categories") {
    renderCategories(page);
  } else if (sectionType === "products") {
    renderProducts(page);
  } else if (sectionType === "prices") {
    renderPrices(null, page);
  } else if (sectionType === "users") {
    renderUsers(null, page);
  }
}

//Chuyển section
function showSection(id, element) {
  // Ẩn tất cả sections
  document
    .querySelectorAll(".section")
    .forEach((sec) => (sec.style.display = "none"));

  // Hiển thị section được chọn
  const targetSection = document.getElementById(id);
  if (targetSection) {
    targetSection.style.display = "block";
  }

  // Cập nhật active cho menu (chỉ khi có element - tức là click từ sidebar)
  if (element) {
    document
      .querySelectorAll(".menu-item")
      .forEach((item) => item.classList.remove("active"));
    element.classList.add("active");
  }

  // Load dữ liệu tương ứng cho từng section
  if (id === "category") {
    renderCategories();
  } else if (id === "products") {
    renderProducts();
    loadTypeDropDown();
  } else if (id === "prices") {
    // syncPriceWithProducts(); // Hàm này chưa được định nghĩa
    loadProductDropDown();
    loadPriceFilter();
    renderPrices(prices);
  } else if (id === "import") {
    loadImportTable();
  } else if (id === "order") {
    loadOrderTable();
  } else if (id === "customers") {
    renderUsers();
  }
}

// Ẩn tất cả form và reset input
function hideForms() {
  document
    .querySelectorAll(".form-box")
    .forEach((f) => (f.style.display = "none"));

  const ids = [
    "new-type",
    "edit-type",
    "new-product-type",
    "edit-product-type",
    "new-product-id",
    "edit-product-id",
    "new-product-name",
    "new-product-amount",
    "edit-product-name",
    "edit-product-amount",
    "new-product-describe",
    "edit-product-describe",
    "new-price-name",
    "new-price-type",
    "new-price-prime",
    "new-price-profit",
    "edit-price-prime",
    "edit-price-profit",
  ];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = ""; // Chỉ reset nếu tồn tại
  });
}

// Loại sản phẩm với phân trang
function renderCategories(page = 1) {
  currentPageCategories = page;
  const tbody = document.querySelector(".type-list");
  tbody.innerHTML = "";

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTypes = types.slice(startIndex, endIndex);

  paginatedTypes.forEach((cat, i) => {
    const actualIndex = startIndex + i;
    tbody.innerHTML += `
      <tr>
        <td>${actualIndex + 1}</td>
        <td>${cat.name}</td>
        <td>${cat.status ? "Ẩn" : "Hiện thị"}</td>
        <td>
          <button class="button" onclick="showEditForm(${actualIndex})">Sửa</button>
          <button class="button" onclick="toggleHidden(${actualIndex})">${
      cat.status ? "Hiện" : "Ẩn"
    }</button>
          <button class="button-cancel" onclick="showDeleteForm(${actualIndex})">Xóa</button>
        </td>
      </tr>
    `;
  });

  localStorage.setItem("types", JSON.stringify(types));
  loadTypeDropDown();
  // Thêm phân trang
  const table = document.getElementById("table-type");
  // Xóa phân trang cũ nếu có
  let oldPagination = table.nextElementSibling;
  while (oldPagination && oldPagination.classList.contains("pagination")) {
    let toRemove = oldPagination;
    oldPagination = oldPagination.nextElementSibling;
    toRemove.remove();
  }
  // Tạo phân trang mới
  const paginationDiv = document.createElement("div");
  paginationDiv.className = "pagination";
  paginationDiv.innerHTML = createPagination(types.length, page, "categories");
  table.parentNode.insertBefore(paginationDiv, table.nextSibling);
}

function toggleHidden(index) {
  types[index].status = !types[index].status;
  localStorage.setItem("types", JSON.stringify(types));
  renderCategories(currentPageCategories);
  // renderProducts(currentPageProducts);
}

function goToCategoryPage(page) {
  renderCategories(page);
}

function showAddForm() {
  hideForms();
  document.getElementById("form-add").style.display = "block";
}

function saveAdd() {
  const val = document.getElementById("new-type").value.trim();
  if (val === "") return alert("Vui lòng nhập tên loại!");
  types.push({ name: val });
  localStorage.setItem("types", JSON.stringify(types));
  hideForms();
  renderCategories(currentPageCategories);
  loadTypeDropDown();
}

function showEditForm(i) {
  hideForms();
  editIndex = i;
  document.getElementById("edit-type").value = types[i].name;
  document.getElementById("form-edit").style.display = "block";
}

function saveEdit() {
  const val = document.getElementById("edit-type").value.trim();
  if (val === "") return alert("Vui lòng nhập tên mới!");
  types[editIndex].name = val;
  localStorage.setItem("types", JSON.stringify(types));
  hideForms();
  renderCategories(currentPageCategories);
  loadTypeDropDown();
}

function showDeleteForm(i) {
  hideForms();
  deleteIndex = i;
  document.getElementById("form-delete").style.display = "block";
}

function confirmDelete() {
  types.splice(deleteIndex, 1);
  localStorage.setItem("types", JSON.stringify(types));
  hideForms();
  renderCategories(currentPageCategories);
  loadTypeDropDown();
}

// Tìm kiếm loại sản phẩm
function searchCategories() {
  const keyword = document
    .getElementById("search-category")
    .value.trim()
    .toLowerCase();
  const tbody = document.querySelector(".type-list");

  if (keyword === "") {
    renderCategories(currentPageCategories);
    return;
  }

  const filtered = types.filter((t) => t.name.toLowerCase().includes(keyword));

  tbody.innerHTML = "";

  if (filtered.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="4" style="text-align: center; color: #ff92a9;">Không tìm thấy loại sản phẩm nào.</td></tr>';
    return;
  }

  filtered.forEach((cat, i) => {
    const actualIndex = types.findIndex((t) => t.name === cat.name);
    tbody.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${cat.name}</td>
        <td>${cat.status ? "Ẩn" : "Hiện thị"}</td>
        <td>
          <button class="button" onclick="showEditForm(${actualIndex})">Sửa</button>
          <button class="button" onclick="toggleHidden(${actualIndex})">${
      cat.status ? "Hiện" : "Ẩn"
    }</button>
          <button class="button-cancel" onclick="showDeleteForm(${actualIndex})">Xóa</button>
        </td>
      </tr>
    `;
  });

  // Xóa phân trang khi tìm kiếm
  const table = document.getElementById("table-type");
  let oldPagination = table.nextElementSibling;
  while (oldPagination && oldPagination.classList.contains("pagination")) {
    let toRemove = oldPagination;
    oldPagination = oldPagination.nextElementSibling;
    toRemove.remove();
  }
}

// Danh mục sản phẩm với phân trang
function renderProducts(page = 1, filteredList = null) {
  currentPageProducts = page;
  const tbody = document.querySelector(".product-list");
  tbody.innerHTML = "";

  const visibleTypes = types.filter((t) => !t.status).map((t) => t.name);
  // Sử dụng filteredProducts từ biến toàn cục nếu đang search
  const allProducts =
    filteredList ||
    filteredProducts ||
    products.filter((p) => visibleTypes.includes(p.type));

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = allProducts.slice(startIndex, endIndex);

  if (paginatedProducts.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="8" style="text-align: center; color: #ff92a9;">Không tìm thấy sản phẩm nào.</td></tr>';

    // Xóa phân trang
    const table = document.getElementById("table-product");
    let oldPagination = table.nextElementSibling;
    while (oldPagination && oldPagination.classList.contains("pagination")) {
      let toRemove = oldPagination;
      oldPagination = oldPagination.nextElementSibling;
      toRemove.remove();
    }
    return;
  }

  paginatedProducts.forEach((cat, i) => {
    // Nếu đang search hoặc filter, tìm index thực trong mảng products gốc
    const actualIndex =
      filteredList || filteredProducts
        ? products.findIndex((p) => p.id === cat.id)
        : startIndex + i;
    const imgDisplay = cat.img
      ? `<img src="${cat.img}" alt="${cat.name}" style="width: 50px; height: 50px; object-fit: cover;">`
      : "Chưa có";
    tbody.innerHTML += `
      <tr>
        <td>${startIndex + i + 1}</td>
        <td>${cat.type}</td>
        <td>${cat.id}</td>
        <td>${cat.name}</td>
        <td>${cat.amount ?? 0}</td>
        <td>${cat.describe}</td>
        <td>${imgDisplay}</td>
        <td colspan="2">
          <button class="button" onclick="showEditProduct(${actualIndex})">Sửa</button>
          <button class="button-cancel" onclick="showDeleteProduct(${actualIndex})">Xóa</button>
        </td>
      </tr>
    `;
  });

  localStorage.setItem("products", JSON.stringify(products));

  // Thêm phân trang
  const table = document.getElementById("table-product");
  let oldPagination = table.nextElementSibling;
  while (oldPagination && oldPagination.classList.contains("pagination")) {
    let toRemove = oldPagination;
    oldPagination = oldPagination.nextElementSibling;
    toRemove.remove();
  }

  const paginationDiv = document.createElement("div");
  paginationDiv.className = "pagination";
  paginationDiv.innerHTML = createPagination(
    allProducts.length,
    page,
    "products"
  );
  table.parentNode.insertBefore(paginationDiv, table.nextSibling);
}

function goToProductPage(page) {
  renderProducts(page, filteredProducts);
}

// Tìm kiếm sản phẩm
function searchProducts() {
  const keyword = document
    .getElementById("search-product")
    .value.trim()
    .toLowerCase();

  if (keyword === "") {
    filteredProducts = null; // Xóa kết quả tìm kiếm
    renderProducts(1);
    return;
  }

  const visibleTypes = types.filter((t) => !t.status).map((t) => t.name);
  const visibleProducts = products.filter((p) => visibleTypes.includes(p.type));

  const filtered = visibleProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(keyword) ||
      p.id.toLowerCase().includes(keyword) ||
      p.type.toLowerCase().includes(keyword)
  );

  filteredProducts = filtered; // Lưu kết quả tìm kiếm
  renderProducts(1, filtered);
}

function showAddProduct() {
  hideForms();
  loadTypeDropDown();
  document.getElementById("form-add-product").style.display = "block";
}

function saveAddProduct() {
  const type = document.getElementById("new-product-type").value.trim();
  const id = document.getElementById("new-product-id").value.trim();
  const name = document.getElementById("new-product-name").value.trim();
  const amount =
    parseInt(document.getElementById("new-product-amount").value.trim()) || 0;
  if (isNaN(amount)) {
    alert("Vui lòng nhập đầy đủ giá trị hợp lệ!");
    return;
  }

  if (amount < 0) {
    alert("Không được nhập số âm!");
    return;
  }
  const describe = document.getElementById("new-product-describe").value.trim();
  const imgUrl = document.getElementById("new-product-img").value.trim();
  const imgFile = document.getElementById("new-product-img-file").files[0];

  if (!id || !name) return alert("Vui lòng nhập đủ ID và tên bánh!");

  // Nếu có file upload, convert sang base64
  if (imgFile) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = e.target.result; // Base64 string
      products.push({ type, id, name, amount, describe, img });
      localStorage.setItem("products", JSON.stringify(products));
      prices.push({ name, type, prime: 0, profit: 0, sale: 0 });
      localStorage.setItem("prices", JSON.stringify(prices));
      hideForms();
      renderProducts(currentPageProducts);
      renderPrices(null, currentPagePrices);
    };
    reader.readAsDataURL(imgFile);
  } else {
    // Dùng đường dẫn URL
    const img = imgUrl;
    products.push({ type, id, name, amount, describe, img });
    localStorage.setItem("products", JSON.stringify(products));
    prices.push({ name, type, prime: 0, profit: 0, sale: 0 });
    localStorage.setItem("prices", JSON.stringify(prices));
    hideForms();
    renderProducts(currentPageProducts);
    renderPrices(null, currentPagePrices);
  }
  // updateTypeOptions();
}
function showEditProduct(i) {
  hideForms();
  loadTypeDropDown();
  editIndex = i;
  document.getElementById("edit-product-type").value = products[i].type;
  document.getElementById("edit-product-id").value = products[i].id;
  document.getElementById("edit-product-name").value = products[i].name;
  document.getElementById("edit-product-amount").value =
    products[i].amount ?? 0;
  document.getElementById("edit-product-describe").value = products[i].describe;
  document.getElementById("edit-product-img").value =
    products[i].img && !products[i].img.startsWith("data:")
      ? products[i].img
      : "";

  // Hiển thị preview nếu có ảnh
  const previewDiv = document.getElementById("edit-product-img-preview");
  if (products[i].img) {
    previewDiv.innerHTML = `<img src="${products[i].img}" alt="Preview" style="max-width: 200px; max-height: 200px; object-fit: contain;">`;
  } else {
    previewDiv.innerHTML = "";
  }

  document.getElementById("form-edit-product").style.display = "block";
}

function saveEditProduct() {
  const type = document.getElementById("edit-product-type").value.trim();
  const id = document.getElementById("edit-product-id").value.trim();
  const name = document.getElementById("edit-product-name").value.trim();
  const amount = parseInt(
    document.getElementById("edit-product-amount").value.trim()
  );
  if (isNaN(amount)) {
    alert("Vui lòng nhập đầy đủ giá trị hợp lệ!");
    return;
  }

  if (amount < 0) {
    alert("Không được nhập số âm!");
    return;
  }
  const describe = document
    .getElementById("edit-product-describe")
    .value.trim();
  const imgUrl = document.getElementById("edit-product-img").value.trim();
  const imgFile = document.getElementById("edit-product-img-file").files[0];

  if (!id || !name) return alert("Vui lòng nhập đủ ID và tên bánh!");

  const oldName = products[editIndex].name;

  // Nếu có file upload mới, convert sang base64
  if (imgFile) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = e.target.result; // Base64 string
      products[editIndex] = { type, id, name, amount, describe, img };
      localStorage.setItem("products", JSON.stringify(products));

      const priceItem = prices.find((p) => p.name === oldName);
      if (priceItem) {
        priceItem.name = name;
        priceItem.type = type;
      } else {
        prices.push({ name, type, prime: 0, profit: 0, sale: 0 });
      }
      localStorage.setItem("prices", JSON.stringify(prices));

      // Cập nhật lại filteredProducts nếu đang search
      if (filteredProducts) {
        const updatedProduct = products[editIndex];
        const filterIndex = filteredProducts.findIndex(
          (p) => p.id === updatedProduct.id
        );
        if (filterIndex !== -1) {
          filteredProducts[filterIndex] = updatedProduct;
        }
      }

      hideForms();
      renderProducts(currentPageProducts, filteredProducts);
      renderPrices(null, currentPagePrices);
    };
    reader.readAsDataURL(imgFile);
  } else {
    // Giữ ảnh cũ hoặc dùng URL mới
    const img = imgUrl || products[editIndex].img;
    products[editIndex] = { type, id, name, amount, describe, img };
    localStorage.setItem("products", JSON.stringify(products));

    const priceItem = prices.find((p) => p.name === oldName);
    if (priceItem) {
      priceItem.name = name;
      priceItem.type = type;
    } else {
      prices.push({ name, type, prime: 0, profit: 0, sale: 0 });
    }
    localStorage.setItem("prices", JSON.stringify(prices));

    // Cập nhật lại filteredProducts nếu đang search
    if (filteredProducts) {
      const updatedProduct = products[editIndex];
      const filterIndex = filteredProducts.findIndex(
        (p) => p.id === updatedProduct.id
      );
      if (filterIndex !== -1) {
        filteredProducts[filterIndex] = updatedProduct;
      }
    }

    hideForms();
    renderProducts(currentPageProducts, filteredProducts);
    renderPrices(null, currentPagePrices);
  }
  // updateTypeOptions();
}

function showDeleteProduct(i) {
  hideForms();
  deleteIndex = i;
  document.getElementById("form-delete-product").style.display = "block";
}

function confirmDeleteProduct() {
  const deletedProduct = products[deleteIndex];
  const deletedName = deletedProduct.name;
  const deletedId = deletedProduct.id;

  products.splice(deleteIndex, 1);
  localStorage.setItem("products", JSON.stringify(products));

  priceIdx = prices.findIndex((p) => p.name === deletedName);
  if (priceIdx != -1) {
    prices.splice(priceIdx, 1);
    localStorage.setItem("prices", JSON.stringify(prices));
  }

  // Cập nhật lại filteredProducts nếu đang search
  if (filteredProducts) {
    filteredProducts = filteredProducts.filter((p) => p.id !== deletedId);
  }

  hideForms();
  renderProducts(currentPageProducts, filteredProducts);
  renderPrices(null, currentPagePrices);
  // updateTypeOptions();
}

function loadTypeDropDown() {
  const addSelect = document.getElementById("new-product-type");
  const editSelect = document.getElementById("edit-product-type");

  addSelect.innerHTML = `<option value="">-- Chọn loại sản phẩm --</option>`;
  editSelect.innerHTML = `<option value="">-- Chọn loại sản phẩm --</option>`;

  types.forEach((t) => {
    const opt1 = document.createElement("option");
    opt1.value = t.name;
    opt1.textContent = t.name;
    addSelect.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = t.name;
    opt2.textContent = t.name;
    editSelect.appendChild(opt2);
  });
}

//Giá bán
function renderPrices(list = null, page = 1) {
  currentPagePrices = page;
  const tbody = document.querySelector(".price-list");
  tbody.innerHTML = "";

  const pricesToRender =
    list || JSON.parse(localStorage.getItem("prices")) || [];
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const allPrices = JSON.parse(localStorage.getItem("prices")) || [];

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPrices = pricesToRender.slice(startIndex, endIndex);

  paginatedPrices.forEach((cat, i) => {
    const displayIndex = startIndex + i;
    // Tìm index thực trong mảng prices gốc
    const realIndex = allPrices.findIndex((p) => p.name === cat.name);
    const product = products.find((p) => p.name === cat.name);
    const type = product ? product.type : "";
    const prime = cat.prime ?? 0;
    const profit = cat.profit ?? 0;
    const sale = cat.sale ?? 0;
    tbody.innerHTML += `
      <tr>
        <td>${displayIndex + 1}</td>
        <td>${cat.name}</td>
        <td>${type}</td>
        <td>${prime}</td>
        <td>${profit}%</td>
        <td>${sale}</td>
        <td>
          <button class="button" onclick="showNewPrice(${realIndex})">Nhập</button>
          <button class="button" onclick="showEditPrice(${realIndex})">Sửa</button>
        </td>
      </tr>
    `;
  });

  // Thêm phân trang
  const table = document.getElementById("table-price");
  // Xóa phân trang cũ nếu có
  let oldPagination = table.nextElementSibling;
  while (oldPagination && oldPagination.classList.contains("pagination")) {
    let toRemove = oldPagination;
    oldPagination = oldPagination.nextElementSibling;
    toRemove.remove();
  }
  // Tạo phân trang mới
  const paginationDiv = document.createElement("div");
  paginationDiv.className = "pagination";
  paginationDiv.innerHTML = createPagination(
    pricesToRender.length,
    page,
    "prices"
  );
  table.parentNode.insertBefore(paginationDiv, table.nextSibling);
}

function goToPricePage(page) {
  renderPrices(null, page);
}

function showNewPrice(i) {
  hideForms();
  editIndex = i;
  document.getElementById("form-new-price").style.display = "block";
}

function saveNewPrice() {
  const name = prices[editIndex].name;
  const product = products.find((p) => p.name === name);
  const type = product ? product.type : "";

  const prime = parseFloat(
    document.getElementById("new-price-prime").value.trim()
  );
  const profit = parseFloat(
    document.getElementById("new-price-profit").value.trim()
  );
  if (isNaN(prime) || isNaN(profit)) {
    alert("Vui lòng nhập đầy đủ giá trị hợp lệ!");
    return;
  }

  if (prime < 0 || profit < 0) {
    alert("Không được nhập số âm!");
    return;
  }
  const sale = (prime * (1 + profit / 100)).toFixed(0);

  prices[editIndex] = { name, type, prime, profit, sale };
  localStorage.setItem("prices", JSON.stringify(prices));
  hideForms();
  renderPrices();
}

function showEditPrice(i) {
  hideForms();
  editIndex = i;
  document.getElementById("form-edit-profit").style.display = "block";
  document.getElementById("edit-price-prime").value = prices[i].prime;
  document.getElementById("edit-price-profit").value = prices[i].profit;
}

function saveEditPrice() {
  const name = prices[editIndex].name;
  const product = products.find((p) => p.name === name);
  const type = product ? product.type : "";
  const prime = document.getElementById("edit-price-prime").value.trim();
  const profit = document.getElementById("edit-price-profit").value.trim();
  if (isNaN(prime) || isNaN(profit)) {
    alert("Vui lòng nhập đầy đủ giá trị hợp lệ!");
    return;
  }

  if (prime < 0 || profit < 0) {
    alert("Không được nhập số âm!");
    return;
  }
  const sale = (prime * (1 + profit / 100)).toFixed(0);
  prices[editIndex] = { name, type, prime, profit, sale };
  localStorage.setItem("prices", JSON.stringify(prices));
  hideForms();
  renderPrices();
}

function filterPrice() {
  const keyword = document
    .getElementById("search-price-name")
    .value.trim()
    .toLowerCase();

  const primeFilter = document.getElementById("filter-prime").value;
  const profitFilter = document.getElementById("filter-profit").value;
  const saleFilter = document.getElementById("filter-sale").value;

  const prices = JSON.parse(localStorage.getItem("prices")) || [];

  let filtered = prices;

  // Lọc theo tên
  if (keyword !== "") {
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(keyword));
  }

  // Lọc theo giá vốn
  if (primeFilter !== "") {
    const [min, max] = primeFilter.split("-").map(Number);
    filtered = filtered.filter((p) => {
      const prime = p.prime || 0;
      return prime >= min && prime <= max;
    });
  }

  // Lọc theo % lợi nhuận
  if (profitFilter !== "") {
    const [min, max] = profitFilter.split("-").map(Number);
    filtered = filtered.filter((p) => {
      const profit = p.profit || 0;
      return profit >= min && profit <= max;
    });
  }

  // Lọc theo giá bán
  if (saleFilter !== "") {
    const [min, max] = saleFilter.split("-").map(Number);
    filtered = filtered.filter((p) => {
      const prime = p.prime || 0;
      const profit = p.profit || 0;
      const salePrice = prime * (1 + profit / 100);
      return salePrice >= min && salePrice <= max;
    });
  }

  renderPrices(filtered);
}

// function updateTypeOptions() {
//   const products = JSON.parse(localStorage.getItem("products")) || [];
//   const select = document.getElementById("filter-type");

//   const types = [
//     ...new Set(products.map((p) => p.type).filter((t) => t.trim() != "")),
//   ];
//   select = innerHTML = `<option value="">Tất cả loại</option>`;
//   types.forEach((type) => {
//     select.innerHTML += `<option value="${type}">${type}</option>`;
//   });
// }
function initializeImportData() {
  let importData = JSON.parse(localStorage.getItem("importData"));
  if (!importData || importData.length === 0) {
    importData = [
      {
        id: "PN001",
        date: "2025-10-20",
        total: 1500000,
        status: "complete",
        items: [{ name: "Bánh Muffin Dâu", sl: 50, price: 15000 }],
      },
      {
        id: "PN002",
        date: "2025-10-25",
        total: 800000,
        status: "draft",
        items: [{ name: "Bánh Kem Vani", sl: 10, price: 80000 }],
      },
      {
        id: "PN003",
        date: "2025-10-26",
        total: 300000,
        status: "draft",
        items: [{ name: "Cupcake Socola", sl: 10, price: 30000 }],
      },
      {
        id: "PN004",
        date: "2025-10-18",
        total: 1200000,
        status: "complete",
        items: [{ name: "Bánh Tiramisu", sl: 20, price: 60000 }],
      },
    ];
    // Lưu vào localStorage
    localStorage.setItem("importData", JSON.stringify(importData));
    console.log("✅ Đã khởi tạo dữ liệu nhập hàng mẫu");
  }
}

function getImportData() {
  return JSON.parse(localStorage.getItem("importData")) || [];
}

function initializeOrderData() {
  // Lấy dữ liệu từ localStorage (key "orders" - từ user tạo đơn hàng)
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  return orders;
}

function getOrderData() {
  // Lấy trực tiếp từ localStorage key "orders"
  return JSON.parse(localStorage.getItem("orders")) || [];
}
// ==================== Chức Năng Chung ====================

// function showSection(sectionId) {
//   document.querySelectorAll(".section").forEach((section) => {
//     section.classList.remove("active");
//   });
//   document.getElementById(sectionId).classList.add("active");

//   // Cập nhật trạng thái active của sidebar
//   document
//     .querySelectorAll(".sidebar a")
//     .forEach((a) => a.classList.remove("active"));
//   if (sectionId.includes("import")) {
//     document.getElementById("nav-import").classList.add("active");
//   } else if (sectionId.includes("order")) {
//     document.getElementById("nav-order").classList.add("active");
//   }
// }

// ==================== Quản Lý Nhập Hàng (Import) ====================

function loadImportTable(data = null) {
  const importData = data || getImportData();
  const tableBody = document.querySelector("#import-table tbody");

  if (!tableBody) {
    console.error(
      "Lỗi: Không tìm thấy phần tbody của bảng nhập hàng (#import-table tbody)."
    );
    return;
  }

  tableBody.innerHTML = "";

  if (importData.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="5" style="text-align: center; color: #ff92a9;">Không tìm thấy phiếu nhập nào.</td></tr>';
    return;
  }

  importData.forEach((item) => {
    const isComplete = item.status === "complete";
    const statusText = isComplete ? "Đã Hoàn Thành" : "Chưa Hoàn Thành";
    const statusClass = isComplete ? "status-complete" : "status-draft";

    const row = tableBody.insertRow();
    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.date}</td>
      <td>${item.total.toLocaleString("vi-VN")} VNĐ</td>
      <td><span class="tag ${statusClass}">${statusText}</span></td>
      <td class="action-column">
        <button class="btn btn-action btn-view" onclick="viewImportDetail('${
          item.id
        }')" title="Xem Chi Tiết">
          <i class="fa-solid fa-eye"></i>
          <span>Xem</span>
        </button>
        ${
          !isComplete
            ? `<button class="btn btn-action btn-edit" onclick="editImport('${item.id}')" title="Sửa Phiếu">
                <i class="fa-solid fa-pen-to-square"></i>
                <span>Sửa</span>
              </button>`
            : ""
        }
        <button class="btn btn-action btn-delete" onclick="deleteImport('${
          item.id
        }')" title="Xóa Phiếu">
          <i class="fa-solid fa-trash-can"></i>
          <span>Xóa</span>
        </button>
      </td>
    `;
  });
}
/**
 * Hàm tìm kiếm và lọc danh sách Phiếu Nhập
 */
function searchImport() {
  const searchId = document
    .getElementById("search-import-id")
    .value.toLowerCase();
  const filterStatus = document.getElementById("filter-import-status").value;

  const importData = getImportData(); // Lấy từ localStorage

  const filteredData = importData.filter((item) => {
    const matchesId = item.id.toLowerCase().includes(searchId);
    const matchesStatus = !filterStatus || item.status === filterStatus;
    return matchesId && matchesStatus;
  });

  loadImportTable(filteredData);
}

function showAddImportForm() {
  showSection("section-import-form");
  document.getElementById("import-form-title").textContent =
    "Thêm Phiếu Nhập Mới";
  document.getElementById("import-date").valueAsDate = new Date();
  document.getElementById("import-items-list").innerHTML = "";

  // Reset ID trên CẢ HAI nút
  document.getElementById("save-import-btn").dataset.id = ""; // Xóa ID cũ
  document.getElementById("complete-import-btn").dataset.id = ""; // Xóa ID cũ

  // Đảm bảo nút "Lưu" (save-import-btn) cũng hiển thị
  document.getElementById("save-import-btn").style.display = "inline-block";
  document.getElementById("complete-import-btn").style.display = "inline-block";

  // Kích hoạt lại các trường (phòng trường hợp bị vô hiệu hóa khi xem chi tiết)
  document.getElementById("import-date").disabled = false;
  const addRowBtn = document.querySelector(
    "#section-import-form .btn-secondary"
  );
  if (addRowBtn) {
    addRowBtn.style.display = "inline-block";
  }

  addImportItemRow(); // Thêm một dòng sản phẩm mặc định
}

function addImportItemRow(item = { name: "", sl: 0, price: 0 }) {
  const list = document.getElementById("import-items-list");

  // Tạo ID unique cho dropdown
  const dropdownId = `dropdown-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  const newRow = document.createElement("div");
  newRow.classList.add("import-item-row");
  newRow.innerHTML = `
            <div style="position: relative; display: inline-block; width: 250px;">
              <input type="text" class="import-product-name" placeholder="Tên Sản Phẩm" value="${
                item.name
              }" style="width: 100%; padding: 10px; border: 1px solid #ffb5c1; border-radius: 5px; font-size: 15px;">
              <div class="product-dropdown" id="${dropdownId}" style="display: none; position: absolute; top: 100%; left: 0; width: 100%; max-height: 200px; overflow-y: auto; background: white; border: 1px solid #ffb5c1; border-radius: 5px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); z-index: 1000; margin-top: 2px;"></div>
            </div>
            <input type="number" class="import-sl" placeholder="Số lượng" min="1" value="${
              item.sl || ""
            }" oninput="calculateImportTotal()" 
              style="width: 30%;
              padding: 10px;
              border: 1px solid #ffb5c1;
              border-radius: 5px;
              font-size: 15px;
              outline: none;
              transition: 0.2s;
              margin-bottom: 10px;">
            <input type="number" class="import-price" placeholder="Giá nhập / 1 sản phẩm" min="0" value="${
              item.price || ""
            }" oninput="calculateImportTotal()" 
              style="width: 30%;
              padding: 10px;
              border: 1px solid #ffb5c1;
              border-radius: 5px;
              font-size: 15px;
              outline: none;
              transition: 0.2s;
              margin-bottom: 10px;">
            <span class="item-total" style="width: 150px; display: inline-block;">0 VNĐ</span>
            <button class="button-cancel" onclick="this.parentNode.remove(); calculateImportTotal();">&times;</button>
        `;
  list.appendChild(newRow);

  // Lấy danh sách sản phẩm từ localStorage
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const nameInput = newRow.querySelector(".import-product-name");
  const slInput = newRow.querySelector(".import-sl");
  const priceInput = newRow.querySelector(".import-price");
  const dropdown = newRow.querySelector(`#${dropdownId}`);

  // ✅ Xóa giá trị mặc định khi focus vào ô SL
  slInput.addEventListener("focus", function () {
    if (this.value === "0" || this.value === "1") {
      this.value = "";
    }
  });

  slInput.addEventListener("blur", function () {
    if (this.value === "" || this.value === "0") {
      this.value = "1";
    }
  });

  // ✅ Xóa số 0 khi focus vào ô giá
  priceInput.addEventListener("focus", function () {
    if (this.value === "0") {
      this.value = "";
    }
  });

  // ✅ Nếu để trống khi blur, đặt lại về 0
  priceInput.addEventListener("blur", function () {
    if (this.value === "") {
      this.value = "0";
    }
  });

  // Hàm hiển thị dropdown với danh sách lọc
  function showDropdown(filterText = "") {
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(filterText.toLowerCase())
    );

    if (filtered.length === 0) {
      dropdown.style.display = "none";
      return;
    }

    dropdown.innerHTML = "";
    filtered.forEach((product) => {
      const div = document.createElement("div");
      div.textContent = product.name;
      div.style.cssText =
        "padding: 10px; cursor: pointer; border-bottom: 1px solid #ffe6ec;";

      div.addEventListener("mouseenter", function () {
        this.style.background = "#ffe6ec";
      });

      div.addEventListener("mouseleave", function () {
        this.style.background = "white";
      });

      div.addEventListener("click", function () {
        nameInput.value = product.name;
        dropdown.style.display = "none";
      });

      dropdown.appendChild(div);
    });

    dropdown.style.display = "block";
  }

  // Khi focus vào ô input
  nameInput.addEventListener("focus", function () {
    showDropdown(this.value);
  });

  // Khi gõ vào ô input
  nameInput.addEventListener("input", function () {
    showDropdown(this.value);
  });

  // Đóng dropdown khi click ra ngoài
  document.addEventListener("click", function (e) {
    if (!nameInput.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });

  calculateImportTotal(); // Tính lại tổng sau khi thêm
}
function calculateImportTotal() {
  let total = 0;
  const rows = document.querySelectorAll(".import-item-row");
  rows.forEach((row) => {
    let sl = parseInt(row.querySelector(".import-sl").value) || 0;
    let price = parseInt(row.querySelector(".import-price").value) || 0;
    if (sl < 0 || price < 0) {
      alert("Số lượng và giá nhập không được là số âm!");
      const slInput = row.querySelector(".import-sl");
      const priceInput = row.querySelector(".import-price");
      if (sl < 0) slInput.value = 0;
      if (price < 0) priceInput.value = 0;
      sl = Math.max(sl, 0);
      price = Math.max(price, 0);
    }
    const itemTotal = sl * price;
    total += itemTotal;
    row.querySelector(".item-total").textContent =
      itemTotal.toLocaleString("vi-VN") + " VNĐ";
  });
  document.getElementById("import-total").textContent =
    total.toLocaleString("vi-VN");
}

function saveImport(isComplete) {
  const currentId = document.getElementById("save-import-btn").dataset.id;
  const date = document.getElementById("import-date").value;
  const total =
    parseInt(
      document.getElementById("import-total").textContent.replace(/[^0-9]/g, "")
    ) || 0;
  const status = isComplete ? "complete" : "draft";

  let items = [];
  document.querySelectorAll(".import-item-row").forEach((row) => {
    items.push({
      name: row.querySelector(".import-product-name").value,
      sl: parseInt(row.querySelector(".import-sl").value) || 0,
      price: parseInt(row.querySelector(".import-price").value) || 0,
    });
  });

  let importData = getImportData();

  // ✅ Kiểm tra xem phiếu cũ đã hoàn thành chưa (để tránh cộng 2 lần)
  let wasAlreadyComplete = false;
  if (currentId) {
    const oldItem = importData.find((item) => item.id === currentId);
    wasAlreadyComplete = oldItem && oldItem.status === "complete";
  }

  if (!currentId) {
    // ✅ THÊM MỚI
    const newId = "PN" + String(importData.length + 1).padStart(3, "0");
    importData.push({ id: newId, date, total, status, items });
    alert(
      `✅ Phiếu nhập ${newId} đã được ${
        isComplete ? "HOÀN THÀNH" : "LƯU nháp"
      }!`
    );
  } else {
    // ✅ CẬP NHẬT PHIẾU CŨ (KHÔNG TẠO MỚI)
    const index = importData.findIndex((item) => item.id === currentId);
    if (index !== -1) {
      importData[index] = { id: currentId, date, total, status, items };
      alert(
        `✅ Phiếu nhập ${currentId} đã được ${
          isComplete ? "HOÀN THÀNH" : "CẬP NHẬT"
        }!`
      );
    }
  }

  // ✅ Nếu hoàn thành phiếu nhập VÀ chưa từng hoàn thành trước đó → Cập nhật số lượng tồn kho
  if (isComplete && !wasAlreadyComplete) {
    let products = JSON.parse(localStorage.getItem("products")) || [];

    items.forEach((item) => {
      const productIndex = products.findIndex((p) => p.name === item.name);

      if (productIndex !== -1) {
        // Sản phẩm đã có → Cộng thêm số lượng
        const currentAmount = products[productIndex].amount || 0;
        products[productIndex].amount = currentAmount + item.sl;
      }
    });

    // Lưu lại products với số lượng đã cập nhật
    localStorage.setItem("products", JSON.stringify(products));

    // Force reload bảng sản phẩm
    loadDataFromLocalStorage();
    renderProducts(currentPageProducts);
  }

  // Lưu vào localStorage
  localStorage.setItem("importData", JSON.stringify(importData));

  // Reset ID
  document.getElementById("save-import-btn").dataset.id = "";
  document.getElementById("complete-import-btn").dataset.id = "";

  // Quay về trang import
  loadImportTable();
  showSection("import");

  // Cập nhật lại bảng sản phẩm nếu đang ở đó
  if (isComplete) {
    renderProducts(currentPageProducts);
  }
}

function editImport(id) {
  const importData = getImportData();
  const item = importData.find((i) => i.id === id);
  // Loại bỏ điều kiện || item.status === "complete" để cho phép tải
  if (!item) return;

  // Chặn sửa nếu đã hoàn thành (nhưng vẫn tải form)
  if (item.status === "complete") {
    alert("Phiếu đã Hoàn Thành không thể sửa. Chỉ có thể xem.");
    viewImportDetail(id); // Chuyển sang chế độ xem
    return;
  }

  showSection("section-import-form");
  document.getElementById(
    "import-form-title"
  ).textContent = `Sửa Phiếu Nhập #${id}`;
  document.getElementById("import-date").value = item.date;

  // Gán ID cho CẢ HAI nút
  document.getElementById("save-import-btn").dataset.id = id;
  document.getElementById("complete-import-btn").dataset.id = id;

  // Hiển thị các nút
  document.getElementById("save-import-btn").style.display = "inline-block";
  document.getElementById("complete-import-btn").style.display = "inline-block";

  // Kích hoạt lại các trường
  document.getElementById("import-date").disabled = false;
  const addRowBtn = document.querySelector(
    "#section-import-form .btn-secondary"
  );
  if (addRowBtn) {
    addRowBtn.style.display = "inline-block";
  }

  const list = document.getElementById("import-items-list");
  list.innerHTML = "";
  item.items.forEach((i) => addImportItemRow(i)); // Tải các dòng

  // Đảm bảo các dòng có thể sửa
  document
    .querySelectorAll(".import-item-row input")
    .forEach((input) => (input.disabled = false));
  document
    .querySelectorAll(".import-item-row .button-cancel")
    .forEach((btn) => (btn.style.display = "inline-block"));

  calculateImportTotal();
}

function deleteImport(id) {
  let importData = getImportData();
  const importItem = importData.find((i) => i.id === id);

  if (!importItem) {
    alert("Không tìm thấy phiếu nhập!");
    return;
  }

  if (
    !confirm(
      `Bạn có chắc chắn muốn xóa phiếu nhập #${id}? Hành động này không thể hoàn tác.`
    )
  ) {
    return;
  }

  importData = importData.filter((i) => i.id !== id);
  localStorage.setItem("importData", JSON.stringify(importData));

  alert(`✅ Phiếu nhập #${id} đã được xóa thành công!`);
  loadImportTable();
}

function viewImportDetail(id) {
  const importData = getImportData();
  const item = importData.find((i) => i.id === id);

  if (!item) {
    alert("Không tìm thấy phiếu nhập!");
    return;
  }

  // ✅ Chuyển sang section-import-form
  showSection("section-import-form");

  // Thiết lập tiêu đề
  document.getElementById(
    "import-form-title"
  ).textContent = `Chi Tiết Phiếu Nhập #${id}`;

  // Load dữ liệu
  document.getElementById("import-date").value = item.date;
  const list = document.getElementById("import-items-list");
  list.innerHTML = "";
  item.items.forEach((i) => addImportItemRow(i));
  calculateImportTotal();

  // ✅ ẨN TẤT CẢ NÚT HÀNH ĐỘNG (CHẾ ĐỘ CHỈ XEM)
  document.getElementById("save-import-btn").style.display = "none";
  document.getElementById("complete-import-btn").style.display = "none";

  // Vô hiệu hóa tất cả input
  document.getElementById("import-date").disabled = true;
  document.querySelectorAll(".import-item-row input").forEach((input) => {
    input.disabled = true;
  });

  // Ẩn nút "Thêm Sản Phẩm Khác"
  const addProductBtn = document.querySelector(
    'button[onclick="addImportItemRow()"]'
  );
  if (addProductBtn) {
    addProductBtn.style.display = "none";
  }

  // Ẩn nút xóa (×)
  document
    .querySelectorAll(".import-item-row .button-cancel")
    .forEach((btn) => {
      btn.style.display = "none";
    });
}

// ==================== Quản Lý Đơn Hàng  ====================
function loadImportTable(data = null) {
  const importData = data || getImportData();
  const tableBody = document.querySelector("#import-table tbody");

  if (!tableBody) {
    console.error(
      "Lỗi: Không tìm thấy phần tbody của bảng nhập hàng (#import-table tbody)."
    );
    return;
  }

  tableBody.innerHTML = "";

  if (importData.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="5" style="text-align: center; color: var(--pink-dark);">Không tìm thấy phiếu nhập nào.</td></tr>';
    return;
  }

  importData.forEach((item) => {
    const isComplete = item.status === "complete";
    const statusText = isComplete ? "Đã Hoàn Thành" : "Chưa Hoàn Thành";
    const statusClass = isComplete ? "status-complete" : "status-draft";

    const row = tableBody.insertRow();
    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.date}</td>
      <td>${item.total.toLocaleString("vi-VN")} VNĐ</td>
      <td><span class="tag ${statusClass}">${statusText}</span></td>
      <td class="action-column">
        <button class="btn btn-action btn-view" onclick="viewImportDetail('${
          item.id
        }')" title="Xem Chi Tiết">
          <i class="fa-solid fa-eye"></i>
          <span>Xem</span>
        </button>
        ${
          !isComplete
            ? `<button class="btn btn-action btn-edit" onclick="editImport('${item.id}')" title="Sửa Phiếu">
                <i class="fa-solid fa-pen-to-square"></i>
                <span>Sửa</span>
              </button>`
            : ""
        }
        <button class="btn btn-action btn-delete" onclick="deleteImport('${
          item.id
        }')" title="Xóa Phiếu">
          <i class="fa-solid fa-trash-can"></i>
          <span>Xóa</span>
        </button>
      </td>
    `;
  });
}

function loadOrderTable(data = null) {
  const orders = data || getOrderData();
  const tableBody = document.querySelector("#order-table tbody");

  if (!tableBody) {
    console.error(
      "Lỗi: Không tìm thấy phần tbody của bảng đơn hàng (#order-table tbody)."
    );
    return;
  }

  tableBody.innerHTML = "";

  if (orders.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="6" style="text-align: center; color: #ff92a9;">Không tìm thấy đơn hàng nào.</td></tr>';
    return;
  }

  orders.forEach((item) => {
    // Chuẩn hóa status text
    let statusText = item.status || "Chờ xác nhận";
    let statusClass = "status-new";

    if (statusText.includes("Chờ") || statusText.includes("chờ")) {
      statusClass = "status-new";
    } else if (statusText.includes("Đang") || statusText.includes("đang")) {
      statusClass = "status-processing";
    } else if (statusText.includes("Đã") || statusText.includes("đã")) {
      statusClass = "status-delivered";
    } else if (statusText.includes("Hủy") || statusText.includes("hủy")) {
      statusClass = "status-cancelled";
    }

    const canDelete =
      statusClass === "status-delivered" || statusClass === "status-cancelled";

    const deleteButton = canDelete
      ? `<button class="btn btn-action btn-delete" onclick="deleteOrder('${item.orderId}')" title="Xóa Đơn Hàng">
          <i class="fa-solid fa-trash-can"></i>
          <span>Xóa</span>
        </button>`
      : "";

    const row = tableBody.insertRow();
    row.innerHTML = `
      <td>${item.orderId}</td>
      <td>${item.date}</td>
      <td>${item.username || "N/A"}</td>
      <td>${(item.total || 0).toLocaleString("vi-VN")} VNĐ</td>
      <td><span class="tag ${statusClass}">${statusText}</span></td>
      <td class="action-column">
        <button class="btn btn-action btn-edit" onclick="viewOrderDetail('${
          item.orderId
        }')" title="Xem Chi Tiết / Cập Nhật Trạng Thái">
          <i class="fa-solid fa-file-invoice"></i>
          <span>Xem/Sửa</span>
        </button>
        ${deleteButton} 
      </td>
    `;
  });
}

/**
 * Hàm xóa đơn hàng đã hủy hoặc đã giao
 */
function deleteOrder(orderId) {
  let orders = getOrderData();
  const order = orders.find((o) => o.orderId === orderId);

  if (!order) return;

  const status = (order.status || "").toLowerCase();
  if (!status.includes("đã") && !status.includes("hủy")) {
    alert("Chỉ có thể xóa đơn hàng đã Hủy hoặc Đã Giao.");
    return;
  }

  if (
    confirm(
      `Bạn có chắc chắn muốn xóa đơn hàng #${orderId} của khách hàng ${order.username}? Hành động này không thể hoàn tác.`
    )
  ) {
    // Xóa khỏi mảng
    orders = orders.filter((o) => o.orderId !== orderId);

    // ✅ LƯU VÀO localStorage
    localStorage.setItem("orders", JSON.stringify(orders));

    alert(`Đơn hàng #${orderId} đã được xóa thành công!`);
    loadOrderTable();
  }
}
/**
 * Hàm tra cứu và lọc danh sách Đơn Hàng
 */
function searchOrders() {
  const startDateStr = document.getElementById("filter-order-start-date").value;
  const endDateStr = document.getElementById("filter-order-end-date").value;
  const filterStatus = document.getElementById("filter-order-status").value;

  const startDate = startDateStr ? new Date(startDateStr) : null;
  const endDate = endDateStr ? new Date(endDateStr) : null;

  const orders = getOrderData(); // Lấy từ localStorage

  const filteredData = orders.filter((order) => {
    // Lọc theo status
    let matchesStatus = true;
    if (filterStatus) {
      const status = (order.status || "").toLowerCase();
      matchesStatus = status.includes(filterStatus.toLowerCase());
    }

    // Lọc theo ngày
    const orderDate = new Date(order.date);
    let matchesDate = true;

    if (startDate) {
      matchesDate = matchesDate && orderDate >= startDate;
    }
    if (endDate) {
      const nextDay = new Date(endDate);
      nextDay.setDate(nextDay.getDate() + 1);
      matchesDate = matchesDate && orderDate < nextDay;
    }

    return matchesStatus && matchesDate;
  });

  loadOrderTable(filteredData);
}

function viewOrderDetail(orderId) {
  const orders = getOrderData();
  const order = orders.find((o) => o.orderId === orderId);

  if (!order) {
    alert("Không tìm thấy đơn hàng!");
    return;
  }

  // ✅ Chuyển sang section "order-detail"
  showSection("order-detail");

  document.getElementById(
    "order-detail-title"
  ).textContent = `Chi Tiết Đơn Hàng #${orderId}`;

  // Hiển thị trạng thái
  const statusElement = document.getElementById("current-status");
  const statusText = order.status || "Chờ xác nhận";
  let statusClass = "status-new";

  if (statusText.includes("Chờ") || statusText.includes("chờ")) {
    statusClass = "status-new";
  } else if (statusText.includes("Đang") || statusText.includes("đang")) {
    statusClass = "status-processing";
  } else if (statusText.includes("Đã") || statusText.includes("đã")) {
    statusClass = "status-delivered";
  } else if (statusText.includes("Hủy") || statusText.includes("hủy")) {
    statusClass = "status-cancelled";
  }

  statusElement.className = `tag ${statusClass}`;
  statusElement.textContent = statusText;

  // Hiển thị thông tin
  let infoHTML = `
    <p><strong>Ngày Đặt:</strong> ${order.date}</p>
    <p><strong>Khách Hàng:</strong> ${order.username || "N/A"}</p>
    <p><strong>Tổng Thanh Toán:</strong> <strong style="color: #e74c3c;">${(
      order.total || 0
    ).toLocaleString("vi-VN")} VNĐ</strong></p>
    
    <h4>Sản Phẩm Đã Đặt:</h4>
    <table class="data-table" style="width: 80%;">
      <thead><tr><th>Sản Phẩm</th><th>SL</th><th>Giá Bán</th><th>Thành Tiền</th></tr></thead>
      <tbody>
        ${(order.items || [])
          .map(
            (item) => `
          <tr>
            <td>${item.ten || item.name || "N/A"}</td>
            <td>${item.sl || 0}</td>
            <td>${(item.gia || item.price || 0).toLocaleString("vi-VN")}</td>
            <td>${(
              (item.sl || 0) * (item.gia || item.price || 0)
            ).toLocaleString("vi-VN")}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
  document.getElementById("order-info").innerHTML = infoHTML;

  // Hiển thị nút hành động
  const actionsDiv = document.getElementById("status-actions");
  actionsDiv.innerHTML = "";

  if (statusClass === "status-new") {
    actionsDiv.innerHTML += `<button class="button" onclick="updateOrderStatus('${orderId}', 'Đang xử lý')"><i class="fas fa-sync-alt"></i> Xử Lý Đơn</button>`;
    actionsDiv.innerHTML += `<button class="button-cancel" onclick="updateOrderStatus('${orderId}', 'Đã hủy')"><i class="fas fa-times-circle"></i> Hủy Đơn</button>`;
  } else if (statusClass === "status-processing") {
    actionsDiv.innerHTML += `<button class="button" onclick="updateOrderStatus('${orderId}', 'Đã giao hàng')"><i class="fas fa-truck"></i> Giao Hàng Thành Công</button>`;
    actionsDiv.innerHTML += `<button class="button-cancel" onclick="updateOrderStatus('${orderId}', 'Đã hủy')"><i class="fas fa-times-circle"></i> Hủy Đơn</button>`;
  }
}

function updateOrderStatus(orderId, newStatus) {
  let orders = getOrderData();
  const index = orders.findIndex((o) => o.orderId === orderId);

  if (index !== -1) {
    const oldStatus = orders[index].status || "";
    orders[index].status = newStatus;

    // ✅ CẬP NHẬT TỒN KHO DỰA TRÊN THAY ĐỔI TRẠNG THÁI
    let products = JSON.parse(localStorage.getItem("products")) || [];
    const orderItems = orders[index].items || [];

    // Trường hợp 1: Từ "Chờ xác nhận" → "Đang xử lý" → TRỪ TỒN KHO
    if (oldStatus.includes("Chờ") && newStatus.includes("Đang")) {
      // ✅ KIỂM TRA TỒN KHO TRƯỚC KHI XÁC NHẬN
      let khongDuHang = [];

      orderItems.forEach((item) => {
        const productIndex = products.findIndex(
          (p) => p.name === (item.ten || item.name)
        );
        if (productIndex !== -1) {
          const currentAmount = products[productIndex].amount || 0;
          const soLuongDat = item.sl || 0;

          if (currentAmount < soLuongDat) {
            khongDuHang.push(
              `• ${
                item.ten || item.name
              }: Đặt ${soLuongDat}, chỉ còn ${currentAmount}`
            );
          }
        } else {
          khongDuHang.push(
            `• ${item.ten || item.name}: Không tìm thấy trong kho`
          );
        }
      });

      // Nếu có sản phẩm không đủ → Không cho xác nhận
      if (khongDuHang.length > 0) {
        alert(
          `⚠️ KHÔNG THỂ XÁC NHẬN! Tồn kho không đủ:\n\n${khongDuHang.join(
            "\n"
          )}\n\nVui lòng nhập thêm hàng hoặc hủy đơn.`
        );
        return; // Dừng không cập nhật trạng thái
      }

      // Nếu đủ hàng → Trừ tồn kho
      orderItems.forEach((item) => {
        const productIndex = products.findIndex(
          (p) => p.name === (item.ten || item.name)
        );
        if (productIndex !== -1) {
          const currentAmount = products[productIndex].amount || 0;
          products[productIndex].amount = Math.max(
            0,
            currentAmount - (item.sl || 0)
          );
        }
      });
      localStorage.setItem("products", JSON.stringify(products));
    }

    // Trường hợp 2: Từ "Đang xử lý" → "Đã hủy" → CỘNG LẠI TỒN KHO
    if (oldStatus.includes("Đang") && newStatus.includes("hủy")) {
      orderItems.forEach((item) => {
        const productIndex = products.findIndex(
          (p) => p.name === (item.ten || item.name)
        );
        if (productIndex !== -1) {
          const currentAmount = products[productIndex].amount || 0;
          products[productIndex].amount = currentAmount + (item.sl || 0);
        }
      });
      localStorage.setItem("products", JSON.stringify(products));
    }

    // Trường hợp 3: Từ "Chờ xác nhận" → "Đã hủy" → KHÔNG LÀM GÌ (chưa trừ tồn kho)

    // ✅ LƯU VÀO localStorage
    localStorage.setItem("orders", JSON.stringify(orders));

    alert(
      `Đơn hàng #${orderId} đã được cập nhật trạng thái thành ${newStatus}!`
    );
    loadOrderTable();
    viewOrderDetail(orderId);

    // Reload bảng sản phẩm nếu có thay đổi tồn kho
    if (
      (oldStatus.includes("Chờ") && newStatus.includes("Đang")) ||
      (oldStatus.includes("Đang") && newStatus.includes("hủy"))
    ) {
      loadDataFromLocalStorage();
      renderProducts(currentPageProducts);
    }
  }
}
// ==================== Khởi Tạo ====================

// Load bảng và thiết lập sự kiện khi trang được tải
document.addEventListener("DOMContentLoaded", () => {
  loadImportTable();
  loadOrderTable();

  // Các element nav-import và nav-order không tồn tại trong HTML
  // Comment lại để tránh lỗi
  /*
  // 1. Thiết lập sự kiện chuyển tab cho "Quản Lý Nhập Hàng"
  document.getElementById("nav-import")?.addEventListener("click", (e) => {
    e.preventDefault();
    // showSection("section-import");
  });

  // 2. Thiết lập sự kiện chuyển tab cho "Quản Lý Đơn Hàng"
  document.getElementById("nav-order")?.addEventListener("click", (e) => {
    e.preventDefault();
    showSection("section-order");
  });
  */

  // Mặc định hiển thị tab Nhập Hàng
  // showSection("section-import");
});

// Khởi tạo dữ liệu sản phẩm từ MenuBanh (list-banh.js)
function initializeProductsFromMenuBanh() {
  // Kiểm tra nếu đã có dữ liệu thì không khởi tạo lại
  let types = JSON.parse(localStorage.getItem("types")) || [];
  let products = JSON.parse(localStorage.getItem("products")) || [];
  let prices = JSON.parse(localStorage.getItem("prices")) || [];

  if (types.length > 0 && products.length > 0) {
    console.log(
      "⚠️ Dữ liệu đã tồn tại. Để làm mới, xóa localStorage hoặc xóa keys: types, products, prices"
    );
    return; // Đã có dữ liệu rồi, không cần khởi tạo lại
  }

  // Lấy dữ liệu TOÀN BỘ từ MenuBanh (list-banh.js)
  const MenuBanh = [
    {
      category: "Bánh croissant",
      cakes: [
        {
          name: "Croissant 2 thế giới",
          price: 25000,
          img: "../img/Menu bánh/Bánh croissant_/Bánh sừng bò 2 thế giới (Croissant 2 world).jpg",
        },
        {
          name: "Croissant kem hoa hồng",
          price: 30000,
          img: "../img/Menu bánh/Bánh croissant_/Bánh sừng bò kem hoa hồng (Rose Croissant).jpg",
        },
        {
          name: "Croissant kem tươi trái cây",
          price: 30000,
          img: "../img/Menu bánh/Bánh croissant_/Bánh sừng bò kem tươi trái cây (Croissant mix whipping cream, fruits).jpg",
        },
        {
          name: "Croissant mâm xôi",
          price: 30000,
          img: "../img/Menu bánh/Bánh croissant_/Bánh sừng bò mâm xôi (Raspberry Croissant).jpg",
        },
        {
          name: "Croissant Socola",
          price: 30000,
          img: "../img/Menu bánh/Bánh croissant_/Bánh sừng bò sô cô la (Chocolate Croissant).jpg",
        },
        {
          name: "Croissant Socola và hạt",
          price: 30000,
          img: "../img/Menu bánh/Bánh croissant_/Bánh sừng bò sô cô la các loại hạt (Chocolate Croissant mix nuts).jpg",
        },
        {
          name: "Croissant sốt caramel",
          price: 30000,
          img: "../img/Menu bánh/Bánh croissant_/Bánh sừng bò sốt caramel (Croissant mix caramel).jpg",
        },
        {
          name: "Croissant trà xanh",
          price: 30000,
          img: "../img/Menu bánh/Bánh croissant_/Bánh sừng bò trà xanh (Matcha Croissant).jpg",
        },
        {
          name: "Croissant kem hoa hồng",
          price: 30000,
          img: "../img/Menu bánh/Bánh croissant_/Bánh sừng bò kem hoa hồng (Rose Croissant).jpg",
        },
        {
          name: "Croissant classic",
          price: 30000,
          img: "../img/Menu bánh/Bánh croissant_/Bánh sừng bò truyền thống (Classic Croissant).jpg",
        },
        {
          name: "Circular Croissant Oreo",
          price: 30000,
          img: "../img/Menu bánh/Circular Croissant/bánh sừng bò tròn Oreo (Oreo Circular Croissant).jpg",
        },
        {
          name: "Circular Croissant kem hạnh nhân",
          price: 30000,
          img: "../img/Menu bánh/Circular Croissant/bánh sừng bò tròn phủ kem hạnh nhân (Almond Circular Croissant).jpg",
        },
        {
          name: "Circular Croissant Socola",
          price: 30000,
          img: "../img/Menu bánh/Circular Croissant/bánh sừng bò tròn sô cô la (chocolate circular croissant).jpg",
        },
        {
          name: "Circular Croissant Purple",
          price: 30000,
          img: "../img/Menu bánh/Circular Croissant/bánh sừng bò tròn tím (purple Circular Croissant).jpg",
        },
        {
          name: "Circular Croissant Matcha",
          price: 30000,
          img: "../img/Menu bánh/Circular Croissant/bánh sừng bò tròn trà xanh (Matcha Circular croissant).jpg",
        },
      ],
    },
    {
      category: "Cheesecake",
      cakes: [
        {
          name: "Caramel Cheesecake",
          price: 50000,
          img: "../img/Menu bánh/Cheesecake/Caramel cheesecake.jpg",
        },
        {
          name: "Cherry cheesecake",
          price: 420000,
          img: "../img/Menu bánh/Cheesecake/Cherry cheesecake_.jpg",
        },
        {
          name: "Chocolate cheesecake",
          price: 420000,
          img: "../img/Menu bánh/Cheesecake/Chocolate cheesecake_.jpg",
        },
        {
          name: "Grapes cheesecake",
          price: 420000,
          img: "../img/Menu bánh/Cheesecake/Grapes cheesecake_.jpg",
        },
        {
          name: "Kiwi cheesecake",
          price: 420000,
          img: "../img/Menu bánh/Cheesecake/Kiwi cheesecake_.jpg",
        },
        {
          name: "Lemon cheesecake",
          price: 420000,
          img: "../img/Menu bánh/Cheesecake/Lemon cheesecake_.jpg",
        },
        {
          name: "Mango cheesecake",
          price: 420000,
          img: "../img/Menu bánh/Cheesecake/Mango cheesecake_.jpg",
        },
        {
          name: "Orange cheesecake",
          price: 420000,
          img: "../img/Menu bánh/Cheesecake/Orange cheesecake_.jpg",
        },
        {
          name: "Oreo cheesecake",
          price: 420000,
          img: "../img/Menu bánh/Cheesecake/Oreo cheesecake_.jpg",
        },
        {
          name: "Strawberry cheesecake",
          price: 420000,
          img: "../img/Menu bánh/Cheesecake/Strawberry cheesecake_.jpg",
        },
      ],
    },
    {
      category: "Cupcake",
      cakes: [
        {
          name: "Bánh nướng xốp anh đào",
          price: 25000,
          img: "../img/Menu bánh/Cupcake/Bánh nướng xốp anh đào (cherry cupcake).jpg",
        },
        {
          name: "Bánh nướng xốp caramel",
          price: 25000,
          img: "../img/Menu bánh/Cupcake/Bánh nướng xốp caramel (caramel pancake).jpg",
        },
        {
          name: "Bánh nướng xốp chanh vàng",
          price: 25000,
          img: "../img/Menu bánh/Cupcake/Bánh nướng xốp chanh vàng (lemon pancake).jpg",
        },
        {
          name: "Bánh nướng xốp dâu tây",
          price: 25000,
          img: "../img/Menu bánh/Cupcake/Bánh nướng xốp dâu tây (strawberry cupcake).jpg",
        },
        {
          name: "Bánh nướng xốp Kiwi",
          price: 25000,
          img: "../img/Menu bánh/Cupcake/Bánh nướng xốp kiwi (kiwi pancake).jpg",
        },
        {
          name: "Bánh nướng xốp Oreo",
          price: 25000,
          img: "../img/Menu bánh/Cupcake/Bánh nướng xốp Oreo (Oreo cupcake).jpg",
        },
        {
          name: "Bánh nướng xốp việt quốc",
          price: 25000,
          img: "../img/Menu bánh/Cupcake/Bánh nướng xốp việt quất (blueberry pancake).jpg",
        },
      ],
    },
    {
      category: "CrepeCake",
      cakes: [
        {
          name: "Bánh Crepe",
          price: 35000,
          img: "../img/Menu bánh/Crepe cake/Bánh crêpe cầu vòng (rainbow crepe cake).jpg",
        },
        {
          name: "Bánh Crepe chanh vàng",
          price: 35000,
          img: "../img/Menu bánh/Crepe cake/Bánh crêpe chanh vàng (lemon crepe cake).jpg",
        },
        {
          name: "Bánh Crepe dâu",
          price: 35000,
          img: "../img/Menu bánh/Crepe cake/Bánh crêpe dâu (strawberry crepe cake).jpg",
        },
        {
          name: "Bánh Crepe mâm xôi",
          price: 35000,
          img: "../img/Menu bánh/Crepe cake/Bánh crêpe mâm xôi (raspberry crepe cake).jpg",
        },
        {
          name: "Bánh Crepe Oreo",
          price: 35000,
          img: "../img/Menu bánh/Crepe cake/Bánh crêpe Oreo (Oreo crepe cake).jpg",
        },
        {
          name: "Bánh Crepe tiramisu",
          price: 35000,
          img: "../img/Menu bánh/Crepe cake/Bánh crêpe tiramisu (tiramisu crepe cake).jpg",
        },
        {
          name: "Bánh Crepe trà sữa trân châu",
          price: 35000,
          img: "../img/Menu bánh/Crepe cake/Bánh crêpe trà sữa trân châu (Pearl milk tea crepe cake).jpg",
        },
        {
          name: "Bánh Crepe trà xanh",
          price: 35000,
          img: "../img/Menu bánh/Crepe cake/Bánh crêpe trà xanh (matcha crepe cake).jpg",
        },
        {
          name: "Bánh Crepe xoài",
          price: 35000,
          img: "../img/Menu bánh/Crepe cake/Bánh crêpe xoài (mango crepe cake).jpg",
        },
      ],
    },
    {
      category: "Donut",
      cakes: [
        {
          name: "Bánh Donut cầu vồng",
          price: 20000,
          img: "../img/Menu bánh/Donut/Donut cầu vòng (rainbow donut).jpg",
        },
        {
          name: "Bánh Donut dâu tây",
          price: 20000,
          img: "../img/Menu bánh/Donut/Donut dâu tây (strawberry donut).jpg",
        },
        {
          name: "Bánh Donut mâm xôi",
          price: 20000,
          img: "../img/Menu bánh/Donut/Donut mâm xôi (raspberry donut ).jpg",
        },
        {
          name: "Bánh Donut socola",
          price: 20000,
          img: "../img/Menu bánh/Donut/Donut sô cô la (chocolate donut).jpg",
        },
        {
          name: "Bánh Donut caramel",
          price: 20000,
          img: "../img/Menu bánh/Donut/Donut sốt caramel (caramel donut).jpg",
        },
        {
          name: "Bánh Donut matcha",
          price: 20000,
          img: "../img/Menu bánh/Donut/Donut trà xanh (matcha donut).jpg",
        },
        {
          name: "Bánh Donut classic",
          price: 20000,
          img: "../img/Menu bánh/Donut/Donut truyền thống (classsic donut).jpg",
        },
      ],
    },
    {
      category: "Macaron",
      cakes: [
        {
          name: "Bánh Macaron anh đào",
          price: 35000,
          img: "../img/Menu bánh/Macaron/Macaron anh đào (Cherry macaron).jpg",
        },
        {
          name: "Bánh Macaron cam",
          price: 35000,
          img: "../img/Menu bánh/Macaron/Macaron cam (orange macaron).jpg",
        },
        {
          name: "Bánh Macaron chanh",
          price: 35000,
          img: "../img/Menu bánh/Macaron/chanh.jpg",
        },
        {
          name: "Bánh Macaron dâu tây",
          price: 35000,
          img: "../img/Menu bánh/Macaron/Macaron dâu tây (strawberry macaron).jpg",
        },
        {
          name: "Bánh Macaron việt quất",
          price: 35000,
          img: "../img/Menu bánh/Macaron/Macaron việt quất (blueberry macaron).jpg",
        },
        {
          name: "Bánh Macaron mâm xôi",
          price: 35000,
          img: "../img/Menu bánh/Macaron/Macaron mâm xôi (Raspberry Macaron).jpg",
        },
        {
          name: "Bánh Macaron socola",
          price: 35000,
          img: "../img/Menu bánh/Macaron/Macaron sô cô la (chocolate macaron).jpg",
        },
        {
          name: "Bánh Macaron matcha",
          price: 35000,
          img: "../img/Menu bánh/Macaron/Macaron trà xanh (Matcha macaron).jpg",
        },
      ],
    },
    {
      category: "Tiramisu cake",
      cakes: [
        {
          name: "Tiramisu Blackberry",
          price: 55000,
          img: "../img/Menu bánh/Tiramisu cake/Blackberry tiramisu_.jpg",
        },
        {
          name: "Tiramisu Blueberry",
          price: 55000,
          img: "../img/Menu bánh/Tiramisu cake/Blueberry tiramisu_.jpg",
        },
        {
          name: "Tiramisu Classic",
          price: 55000,
          img: "../img/Menu bánh/Tiramisu cake/Classic tiramisu_.jpg",
        },
        {
          name: "Tiramisu Matcha",
          price: 55000,
          img: "../img/Menu bánh/Tiramisu cake/Matcha tiramisu_.jpg",
        },
        {
          name: "Tiramisu Raspberry",
          price: 55000,
          img: "../img/Menu bánh/Tiramisu cake/Raspberry tiramisu_.jpg",
        },
        {
          name: "Tiramisu Strawberry",
          price: 55000,
          img: "../img/Menu bánh/Tiramisu cake/Strawberry tiramisu_.jpg",
        },
      ],
    },
    {
      category: "Eclair",
      cakes: [
        {
          name: "Eclair dâu tây",
          price: 65000,
          img: "../img/Menu bánh/Eclair cake/bánh éclair dâu tây (strawberry eclair cake).jpg",
        },
        {
          name: "Eclair mâm xôi",
          price: 65000,
          img: "../img/Menu bánh/Eclair cake/bánh éclair mâm xôi (raspberry eclair cake).jpg",
        },
        {
          name: "Eclair classic",
          price: 65000,
          img: "../img/Menu bánh/Eclair cake/bánh éclair truyền thống (classic eclair cake).jpg",
        },
        {
          name: "Eclair vanilla",
          price: 65000,
          img: "../img/Menu bánh/Eclair cake/bánh éclair va-ni (vanilla eclair cake).jpg",
        },
      ],
    },
    {
      category: "Cakeroll",
      cakes: [
        {
          name: "Cakeroll chocolate",
          price: 65000,
          img: "../img/Menu bánh/Cakeroll/Chocolate Cakeroll_.jpg",
        },
        {
          name: "Cakeroll classic",
          price: 65000,
          img: "../img/Menu bánh/Cakeroll/Classic Cakeroll_.jpg",
        },
        {
          name: "Cakeroll mango",
          price: 65000,
          img: "../img/Menu bánh/Cakeroll/Mango Cakeroll_.jpg",
        },
        {
          name: "Cakeroll matcha",
          price: 65000,
          img: "../img/Menu bánh/Cakeroll/Matcha Cakeroll_.jpg",
        },
        {
          name: "Cakeroll oreo",
          price: 65000,
          img: "../img/Menu bánh/Cakeroll/Oreo Cakeroll_.jpg",
        },
        {
          name: "Cakeroll strawberry",
          price: 65000,
          img: "../img/Menu bánh/Cakeroll/Strawberry Cakeroll_.jpg",
        },
      ],
    },
  ];

  // Tạo danh sách loại sản phẩm (types)
  types = MenuBanh.map((item) => ({ name: item.category }));

  // Tạo danh sách sản phẩm (products) và giá (prices)
  let productId = 1;
  MenuBanh.forEach((category) => {
    category.cakes.forEach((cake) => {
      const product = {
        type: category.category,
        id: `CAKE${String(productId).padStart(3, "0")}`,
        name: cake.name,
        amount: 20, // Số lượng tồn ban đầu = 15
        describe: `${cake.name} - ${category.category}`,
        img: cake.img,
      };
      products.push(product);

      const price = {
        name: cake.name,
        type: category.category,
        prime: Math.round(cake.price * 0.6), // Giá vốn = 60% giá bán
        profit: 40, // Lợi nhuận 40%
        sale: cake.price,
        img: cake.img,
      };
      prices.push(price);

      productId++;
    });
  });

  // Lưu vào localStorage
  localStorage.setItem("types", JSON.stringify(types));
  localStorage.setItem("products", JSON.stringify(products));
  localStorage.setItem("prices", JSON.stringify(prices));

  console.log("✅ Đã khởi tạo dữ liệu sản phẩm từ MenuBanh");
}

// Khởi tạo sản phẩm
initializeProductsFromMenuBanh();

// Khởi tạo dữ liệu users mẫu nếu chưa có trong localStorage
function initializeUsers() {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Đảm bảo tất cả users đều có thuộc tính isLocked
  let updated = false;
  users = users.map((user) => {
    if (user.isLocked === undefined) {
      updated = true;
      return { ...user, isLocked: false };
    }
    return user;
  });

  if (updated) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  return users;
}

// Khởi tạo users
initializeUsers();

function renderUsers(data = null, page = 1) {
  currentPageUsers = page;
  const tbody = document.querySelector(".user-list");
  tbody.innerHTML = "";

  const usersToRender = data || JSON.parse(localStorage.getItem("users")) || [];

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = usersToRender.slice(startIndex, endIndex);

  paginatedUsers.forEach((user, i) => {
    const actualIndex = startIndex + i;
    const status = user.isLocked ? "🔒 Đã khóa" : "🔓 Đang hoạt động";
    const toggleLabel = user.isLocked ? "Mở khóa" : "Khóa";
    tbody.innerHTML += `
      <tr>
        <td>${actualIndex + 1}</td>
        <td>${user.hoten}</td>
        <td>${user.email}</td>
        <td>${user.sdt}</td>
        <td>${user.address || ""}</td>
        <td>${status}</td>
        <td>
          <button class="button" onclick="toggleLock(${actualIndex})">${toggleLabel}</button>
          <button class="button" onclick="showResetPassword(${actualIndex})">Reset mật khẩu</button>
        </td>
      </tr>
    `;
  });

  // Thêm phân trang
  const table = document.getElementById("table-user");
  // Xóa phân trang cũ nếu có
  let oldPagination = table.nextElementSibling;
  while (oldPagination && oldPagination.classList.contains("pagination")) {
    let toRemove = oldPagination;
    oldPagination = oldPagination.nextElementSibling;
    toRemove.remove();
  }
  // Tạo phân trang mới
  const paginationDiv = document.createElement("div");
  paginationDiv.className = "pagination";
  paginationDiv.innerHTML = createPagination(
    usersToRender.length,
    page,
    "users"
  );
  table.parentNode.insertBefore(paginationDiv, table.nextSibling);
}

let resetIndex = -1;

function showResetPassword(index) {
  hideForms();
  resetIndex = index;
  document.getElementById("form-reset-password").style.display = "block";
}

function confirmResetPassword() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  users[resetIndex].password = "DreamyCakeUser";
  localStorage.setItem("users", JSON.stringify(users));
  alert(
    `✅ Mật khẩu của khách hàng "${users[resetIndex].hoten}" đã được reset về mặc định: DreamyCakeUser.`
  );
  hideForms();
  renderUsers();
}
function goToUserPage(page) {
  renderUsers(null, page);
}

function toggleLock(index) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  users[index].isLocked = !users[index].isLocked;
  localStorage.setItem("users", JSON.stringify(users));
  renderUsers(null, currentPageUsers);
}
function filterUsers() {
  const keyword = document
    .getElementById("search-user")
    .value.trim()
    .toLowerCase();

  // Nếu không có từ khóa tìm kiếm, hiển thị tất cả
  if (keyword === "") {
    renderUsers();
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const filtered = users.filter(
    (user) =>
      user.hoten.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword) ||
      user.sdt.toLowerCase().includes(keyword)
  );

  renderUsers(filtered);
}

// Tra cứu theo sản phẩm và ngày
function searchInventoryByProduct() {
  const date = document.getElementById("inventory-date").value;
  const productName = document
    .getElementById("inventory-product")
    .value.trim()
    .toUpperCase();

  const products = JSON.parse(localStorage.getItem("products")) || [];
  const product = products.find((p) => p.name.toUpperCase() === productName);

  const resultBox = document.getElementById("inventory-result");

  if (!product) {
    resultBox.innerHTML = `❌ Không tìm thấy sản phẩm <strong>${productName}</strong> trong hệ thống.`;
    resultBox.style.color = "#e74c3c";
    return;
  }

  const currentStock = product.amount || 0;
  const warning =
    currentStock <= 10
      ? "⚠️ Sắp hết hàng"
      : currentStock === 0
      ? "❌ Hết hàng"
      : "✅";
  const color =
    currentStock === 0 ? "#c0392b" : currentStock <= 10 ? "#e74c3c" : "#27ae60";

  resultBox.innerHTML = `${warning} <strong>${product.name}</strong> hiện có <strong>${currentStock}</strong> cái trong kho.`;
  resultBox.style.color = color;
}

// Cảnh báo sản phẩm sắp hết
function checkLowStock(threshold = 10) {
  const products = JSON.parse(localStorage.getItem("products")) || [];

  const lowStockItems = products.filter((p) => {
    const amount = p.amount || 0;
    return amount <= threshold;
  });

  const resultBox = document.getElementById("low-stock-result");

  if (lowStockItems.length === 0) {
    resultBox.innerHTML = "✅ Tất cả sản phẩm đều còn đủ hàng (> 10 cái).";
    resultBox.style.color = "#2ecc71";
  } else {
    const outOfStock = lowStockItems.filter((p) => (p.amount || 0) === 0);
    const lowStock = lowStockItems.filter(
      (p) => (p.amount || 0) > 0 && (p.amount || 0) <= threshold
    );

    let html = "";
    if (outOfStock.length > 0) {
      html += "<strong style='color:#c0392b'>🚫 Hết hàng:</strong><br>";
      html +=
        outOfStock
          .map((p) => `• <strong>${p.name}</strong>: <strong>0</strong> cái`)
          .join("<br>") + "<br><br>";
    }
    if (lowStock.length > 0) {
      html +=
        "<strong style='color:#e67e22'>⚠️ Sắp hết hàng (≤10 cái):</strong><br>";
      html += lowStock
        .map(
          (p) =>
            `• <strong>${p.name}</strong>: còn <strong>${p.amount}</strong> cái`
        )
        .join("<br>");
    }

    resultBox.innerHTML = html;
    resultBox.style.color = "#e74c3c";
  }
}

// Thống kê nhập – xuất – tồn theo khoảng thời gian
function summarizeInventory() {
  const start = document.getElementById("start-date").value;
  const end = document.getElementById("end-date").value;

  if (!start || !end) {
    alert("Vui lòng chọn đầy đủ ngày bắt đầu và kết thúc!");
    return;
  }

  const importData = JSON.parse(localStorage.getItem("importData")) || [];
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const products = JSON.parse(localStorage.getItem("products")) || [];

  console.log("🔍 Khoảng thời gian:", start, "đến", end);
  console.log("📋 Tất cả đơn hàng:", orders);
  console.log("📋 Chi tiết từng đơn:");
  orders.forEach((o) => {
    console.log(`  - Đơn ${o.orderId}: Date="${o.date}", Status="${o.status}"`);
  });

  const summary = {};

  // Tính NHẬP từ phiếu nhập hoàn thành
  importData
    .filter(
      (imp) => imp.status === "complete" && imp.date >= start && imp.date <= end
    )
    .forEach((imp) => {
      imp.items.forEach((item) => {
        if (!summary[item.name]) {
          summary[item.name] = { nhập: 0, xuất: 0 };
        }
        summary[item.name].nhập += item.sl || 0;
      });
    });

  // Tính XUẤT từ đơn hàng đã xác nhận (Đang xử lý + Đã giao hàng)
  const validOrders = orders.filter((order) => {
    if (!(order.status === "Đang xử lý" || order.status === "Đã giao hàng"))
      return false;
    // Chuyển date về dạng YYYY-MM-DD
    let dateStr = "";
    if (order.date) {
      // VD: "19:44:33 13/11/2025" => "2025-11-13"
      const match = order.date.match(/(\d{2})\/(\d{2})\/(\d{4})$/);
      if (match) {
        dateStr = `${match[3]}-${match[2]}-${match[1]}`;
      }
    }
    return dateStr >= start && dateStr <= end;
  });

  console.log("📦 Đơn hàng hợp lệ để tính xuất:", validOrders);

  validOrders.forEach((order) => {
    console.log(
      `Đơn ${order.orderId}: Status=\"${order.status}\", Date=\"${order.date}\"`
    );
    (order.items || []).forEach((item) => {
      const productName = item.ten || item.name;
      console.log(`  - Sản phẩm: \"${productName}\", SL: ${item.sl}`);
      if (!summary[productName]) {
        summary[productName] = { nhập: 0, xuất: 0 };
      }
      summary[productName].xuất += item.sl || 0;
    });
  });

  const resultBox = document.getElementById("summary-result");

  if (Object.keys(summary).length === 0) {
    resultBox.innerHTML = `❌ Không có giao dịch nào trong khoảng thời gian <strong>${start}</strong> đến <strong>${end}</strong>.`;
    resultBox.style.color = "#e74c3c";
    return;
  }

  let html = `<strong>📊 Thống kê từ ${start} đến ${end}:</strong><br><br>`;

  Object.entries(summary)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([productName, data]) => {
      const product = products.find((p) => p.name === productName);
      const currentStock = product ? product.amount || 0 : 0;
      const ton = data.nhập - data.xuất;

      html += `• <strong>${productName}</strong>:<br>`;
      html += `&nbsp;&nbsp;&nbsp;Nhập: <span style="color:#27ae60"><strong>${data.nhập}</strong></span> cái | `;
      html += `Xuất: <span style="color:#e74c3c"><strong>${data.xuất}</strong></span> cái | `;
      html += `Chênh lệch: <strong>${
        ton > 0 ? "+" : ""
      }${ton}</strong> cái<br>`;
      html += `&nbsp;&nbsp;&nbsp;Tồn kho hiện tại: <strong>${currentStock}</strong> cái<br><br>`;
    });

  resultBox.innerHTML = html;
  resultBox.style.color = "#2c3e50";
}

// Load danh sách sản phẩm vào dropdown tra cứu tồn kho
function loadInventoryProductDropdown() {
  const select = document.getElementById("inventory-product");
  if (!select) return;

  const products = JSON.parse(localStorage.getItem("products")) || [];

  select.innerHTML = '<option value="">—— Chọn sản phẩm ——</option>';

  products.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.name;
    option.textContent = product.name;
    select.appendChild(option);
  });
}

// Kiểm tra đăng nhập quản trị viên khi load trang
document.addEventListener("DOMContentLoaded", () => {
  const loggedIn = localStorage.getItem("loggedInAdmin");

  if (!loggedIn) {
    alert("⚠️ Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.");
    window.location.href = "admin-login.html";
  } else {
    console.log(`Chào mừng quản trị viên: ${loggedIn}`);
    // Hiển thị nội dung quản trị tại đây

    // Tự động load section "Người dùng" khi vào trang
    const customersSection = document.getElementById("customers");
    const customersMenuItem = document.querySelector(".menu-item");
    if (customersSection && customersMenuItem) {
      customersSection.style.display = "block";
      customersMenuItem.classList.add("active");
      renderUsers(); // Hiển thị tất cả người dùng ngay từ đầu
    }
  }
});
// Hàm đăng xuất
function logoutAdmin() {
  if (confirm("Bạn có chắc muốn đăng xuất không?")) {
    localStorage.removeItem("loggedInAdmin");
    alert("Bạn đã đăng xuất thành công.");
    window.location.href = "admin-login.html";
  }
}

// Khởi tạo dữ liệu khi load trang
initializeProductsFromMenuBanh(); // Khởi tạo sản phẩm từ MenuBanh nếu chưa có
initializeUsers(); // Khởi tạo users nếu chưa có
loadDataFromLocalStorage(); // Load dữ liệu vào biến toàn cục

// Khởi tạo UI
renderCategories();
renderProducts();
renderPrices();
loadTypeDropDown();
loadInventoryProductDropdown(); // Load danh sách sản phẩm vào dropdown tra cứu tồn kho

// ⚠️ BỎ COMMENT 2 DÒNG BÊN DƯỚI ĐỂ XÓA VÀ RESET DỮ LIỆU, SAU ĐÓ COMMENT LẠI
// localStorage.clear();
// alert("Đã xóa toàn bộ dữ liệu trong localStorage!");
