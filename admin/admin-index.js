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
  document
    .querySelectorAll(".section")
    .forEach((sec) => (sec.style.display = "none"));
  document.getElementById(id).style.display = "block";
  document
    .querySelectorAll(".menu-item")
    .forEach((item) => item.classList.remove("active"));
  element.classList.add("active");
  if (id === "category") {
    renderCategories();
  } else if (id === "products") {
    renderProducts();
    loadTypeDropDown();
    // updateTypeOptions();
  } else if (id === "prices") {
    syncPriceWithProducts();
    loadProductDropDown();
    loadPriceFilter();
    renderPrices(prices);
  }
}

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
    "edit-product-name",
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
        <td>
          <button class="button" onclick="showEditForm(${actualIndex})">Sửa</button>
          <button class="button" onclick="showDeleteForm(${actualIndex})">Xóa</button>
        </td>
      </tr>
    `;
  });

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

// Danh mục sản phẩm với phân trang
function renderProducts(page = 1) {
  currentPageProducts = page;
  const tbody = document.querySelector(".product-list");
  tbody.innerHTML = "";

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);

  paginatedProducts.forEach((cat, i) => {
    const actualIndex = startIndex + i;
    const imgDisplay = cat.img
      ? `<img src="${cat.img}" alt="${cat.name}" style="width: 50px; height: 50px; object-fit: cover;">`
      : "Chưa có";
    tbody.innerHTML += `
      <tr>
        <td>${actualIndex + 1}</td>
        <td>${cat.type}</td>
        <td>${cat.id}</td>
        <td>${cat.name}</td>
        <td>${cat.describe}</td>
        <td>${imgDisplay}</td>
        <td>
          <button class="button" onclick="showEditProduct(${actualIndex})">Sửa</button>
          <button class="button" onclick="showDeleteProduct(${actualIndex})">Xóa</button>
        </td>
      </tr>
    `;
  });

  // Thêm phân trang
  const table = document.getElementById("table-product");
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
  paginationDiv.innerHTML = createPagination(products.length, page, "products");
  table.parentNode.insertBefore(paginationDiv, table.nextSibling);
}

function goToProductPage(page) {
  renderProducts(page);
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
  const describe = document.getElementById("new-product-describe").value.trim();
  const imgUrl = document.getElementById("new-product-img").value.trim();
  const imgFile = document.getElementById("new-product-img-file").files[0];

  if (!id || !name) return alert("Vui lòng nhập đủ ID và tên bánh!");

  // Nếu có file upload, convert sang base64
  if (imgFile) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = e.target.result; // Base64 string
      products.push({ type, id, name, describe, img });
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
    products.push({ type, id, name, describe, img });
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
      products[editIndex] = { type, id, name, describe, img };
      localStorage.setItem("products", JSON.stringify(products));

      const priceItem = prices.find((p) => p.name === oldName);
      if (priceItem) {
        priceItem.name = name;
        priceItem.type = type;
      } else {
        prices.push({ name, type, prime: 0, profit: 0, sale: 0 });
      }
      localStorage.setItem("prices", JSON.stringify(prices));

      hideForms();
      renderProducts(currentPageProducts);
      renderPrices(null, currentPagePrices);
    };
    reader.readAsDataURL(imgFile);
  } else {
    // Giữ ảnh cũ hoặc dùng URL mới
    const img = imgUrl || products[editIndex].img;
    products[editIndex] = { type, id, name, describe, img };
    localStorage.setItem("products", JSON.stringify(products));

    const priceItem = prices.find((p) => p.name === oldName);
    if (priceItem) {
      priceItem.name = name;
      priceItem.type = type;
    } else {
      prices.push({ name, type, prime: 0, profit: 0, sale: 0 });
    }
    localStorage.setItem("prices", JSON.stringify(prices));

    hideForms();
    renderProducts(currentPageProducts);
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
  const deletedName = products[deleteIndex].name;

  products.splice(deleteIndex, 1);
  localStorage.setItem("products", JSON.stringify(products));

  priceIdx = prices.findIndex((p) => p.name !== deletedName);
  if (priceIdx != -1) {
    prices.splice(deleteIndex, 1);
    localStorage.setItem("prices", JSON.stringify(prices));
  }
  hideForms();
  renderProducts(currentPageProducts);
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
  const prices = JSON.parse(localStorage.getItem("prices")) || [];

  if (keyword === "") {
    renderPrices(prices);
    return;
  }

  const filtered = prices.filter((p) => p.name.toLowerCase().includes(keyword));
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
let importData = [
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

let orderData = [
  {
    id: "DH001",
    date: "2025-10-26",
    customer: "Nguyễn Thị A",
    total: 350000,
    status: "new",
    address: "123 Hồng Hà",
    phone: "0901xxx",
    items: [{ name: "Bánh Muffin Dâu", sl: 5, price: 70000 }],
  },
  {
    id: "DH002",
    date: "2025-10-25",
    customer: "Trần Văn B",
    total: 500000,
    status: "processing",
    address: "456 Bánh Ngọt",
    phone: "0902xxx",
    items: [{ name: "Bánh Kem Vani", sl: 1, price: 500000 }],
  },
  {
    id: "DH003",
    date: "2025-10-24",
    customer: "Lê Thu C",
    total: 120000,
    status: "delivered",
    address: "789 Sugar",
    phone: "0903xxx",
    items: [{ name: "Cupcake Socola", sl: 4, price: 30000 }],
  },
  {
    id: "DH004",
    date: "2025-10-23",
    customer: "Phạm Văn D",
    total: 200000,
    status: "cancelled",
    address: "101 Sweet",
    phone: "0904xxx",
    items: [{ name: "Bánh Su Kem", sl: 20, price: 10000 }],
  },
  {
    id: "DH005",
    date: "2025-10-26",
    customer: "Vũ Thị E",
    total: 90000,
    status: "new",
    address: "22 Kem",
    phone: "0905xxx",
    items: [{ name: "Bánh Muffin Dâu", sl: 2, price: 45000 }],
  },
];

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

function loadImportTable(data = importData) {
  const tableBody = document.querySelector("#import-table tbody");
  tableBody.innerHTML = "";

  if (data.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="5" style="text-align: center; color: var(--pink-dark);">Không tìm thấy phiếu nhập nào.</td></tr>';
    return;
  }

  data.forEach((item) => {
    const isComplete = item.status === "complete";
    const statusText = isComplete ? "Đã Hoàn Thành" : "Chưa Hoàn Thành";
    const statusClass = isComplete ? "status-complete" : "status-draft";

    const row = tableBody.insertRow();
    row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.date}</td>
                <td>${item.total.toLocaleString("vi-VN")} VNĐ</td>
                <td><span class="tag ${statusClass}">${statusText}</span></td>
                <td>
                    <button class="btn btn-secondary" onclick="viewImportDetail('${
                      item.id
                    }')" title="Xem Chi Tiết"><i class="fas fa-eye"></i></button>
                    ${
                      !isComplete
                        ? `<button class="btn btn-secondary" onclick="editImport('${item.id}')" title="Sửa Phiếu"><i class="fas fa-pen"></i></button>`
                        : ""
                    }
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

  const filteredData = importData.filter((item) => {
    // Lọc theo Mã Phiếu
    const matchesId = item.id.toLowerCase().includes(searchId);

    // Lọc theo Trạng Thái
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
  document.getElementById("save-import-btn").dataset.id = ""; // Xóa ID cũ
  document.getElementById("complete-import-btn").style.display = "inline-block"; // Luôn hiện khi thêm mới
  addImportItemRow(); // Thêm một dòng sản phẩm mặc định
}

function addImportItemRow(item = { name: "", sl: 0, price: 0 }) {
  const list = document.getElementById("import-items-list");
  const newRow = document.createElement("div");
  newRow.classList.add("import-item-row");
  newRow.innerHTML = `
            <input type="text" class="import-product-name" placeholder="Tên Sản Phẩm" value="${
              item.name
            }" style="width: 250px;">
            <input type="number" class="import-sl" placeholder="SL" min="1" value="${
              item.sl || 1
            }" oninput="calculateImportTotal()" 
              style="width: 30%;
              padding: 10px;
              border: 1px solid #ffb5c1;
              border-radius: 5px;
              font-size: 15px;
              outline: none;
              transition: 0.2s;
              margin-bottom: 10px;">
            <input type="number" class="import-price" placeholder="Giá Nhập (đơn vị)" min="0" value="${
              item.price || 0
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
  calculateImportTotal(); // Tính lại tổng sau khi thêm
}

function calculateImportTotal() {
  let total = 0;
  const rows = document.querySelectorAll(".import-item-row");
  rows.forEach((row) => {
    const sl = parseInt(row.querySelector(".import-sl").value) || 0;
    const price = parseInt(row.querySelector(".import-price").value) || 0;
    if (sl < 0 || price < 0) {
      alert("Số lượng và giá nhập không được là số âm!");
      // Đặt lại giá trị về 0 để tránh lỗi tính toán
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
      sl: parseInt(row.querySelector(".import-sl").value),
      price: parseInt(row.querySelector(".import-price").value),
    });
  });

  if (!currentId) {
    //Them
    const newId = "PN" + String(importData.length + 1).padStart(3, "0");
    importData.push({ id: newId, date, total, status, items });
  } else {
    //Sua
    const index = importData.findIndex((item) => item.id === currentId);
    if (index !== -1) {
      importData[index] = { id: currentId, date, total, status, items };
    }
  }
  alert(
    `Phiếu nhập ${currentId || "mới"} đã được ${
      isComplete ? "HOÀN THÀNH" : "LƯU nháp"
    }!`
  );
  loadImportTable();
  showSection("section-import");
}

function editImport(id) {
  const item = importData.find((i) => i.id === id);
  if (!item || item.status === "complete") return; //Khong sua khi da hoan thanh

  showSection("section-import-form");
  document.getElementById(
    "import-form-title"
  ).textContent = `Sửa Phiếu Nhập #${id}`;
  document.getElementById("import-date").value = item.date;
  document.getElementById("save-import-btn").dataset.id = id;
  document.getElementById("complete-import-btn").style.display = "inline-block";

  const list = document.getElementById("import-items-list");
  list.innerHTML = "";
  item.items.forEach((i) => addImportItemRow(i));
  calculateImportTotal();
}

function viewImportDetail(id) {
  const item = importData.find((i) => i.id === id);
  if (!item) return;

  // Chuyen sang che do chi xem
  editImport(id);

  document.getElementById(
    "import-form-title"
  ).textContent = `Chi Tiết Phiếu Nhập #${id}`;
  document.getElementById("save-import-btn").style.display = "none";
  document.getElementById("complete-import-btn").style.display =
    item.status === "draft" ? "inline-block" : "none";

  //Khoa input
  document.getElementById("import-date").disabled = true;
  document
    .querySelectorAll(".import-item-row input")
    .forEach((input) => (input.disabled = true));

  //Xoa sp khong can thiet khi chi xem
  document
    .querySelectorAll(".import-item-row button")
    .forEach((btn) => (btn.style.display = "none"));
  document.querySelector(".btn-secondary").style.display = "none"; // Ẩn nút thêm sản phẩm
}

// ==================== Quản Lý Đơn Hàng  ====================

function loadOrderTable(data = orderData) {
  const tableBody = document.querySelector("#order-table tbody");
  tableBody.innerHTML = "";

  if (data.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="6" style="text-align: center; color: var(--pink-dark);">Không tìm thấy đơn hàng nào.</td></tr>';
    return;
  }

  data.forEach((item) => {
    const statusClass = `status-${item.status}`;
    const statusText = {
      new: "Mới Đặt",
      processing: "Đã Xử Lý",
      delivered: "Đã Giao",
      cancelled: "Hủy",
    }[item.status];

    // Xác định xem có hiển thị nút xóa hay không
    const canDelete =
      item.status === "delivered" || item.status === "cancelled";
    const deleteButton = canDelete
      ? `<button class="btn btn-secondary" style="background-color: var(--cancelled-color); color: white;" onclick="deleteOrder('${item.id}')" title="Xóa Đơn Hàng"><i class="fas fa-trash"></i></button>`
      : "";

    const row = tableBody.insertRow();
    row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.date}</td>
                <td>${item.customer}</td>
                <td>${item.total.toLocaleString("vi-VN")} VNĐ</td>
                <td><span class="tag ${statusClass}">${statusText}</span></td>
                <td>
                    <button class="btn btn-secondary" onclick="viewOrderDetail('${
                      item.id
                    }')" title="Xem/Cập Nhật"><i class="fas fa-edit"></i></button>
                    ${deleteButton} 
                </td>
            `;
  });
}

/**
 * Hàm xóa đơn hàng đã hủy hoặc đã giao
 */
function deleteOrder(id) {
  const order = orderData.find((o) => o.id === id);

  if (!order) return;

  // Chỉ cho phép xóa nếu là Đã Giao hoặc Hủy
  if (order.status !== "delivered" && order.status !== "cancelled") {
    alert("Chỉ có thể xóa đơn hàng đã Hủy hoặc Đã Giao.");
    return;
  }

  if (
    confirm(
      `Bạn có chắc chắn muốn xóa đơn hàng #${id} của khách hàng ${order.customer}? Hành động này không thể hoàn tác.`
    )
  ) {
    // Lọc ra các đơn hàng KHÔNG có ID trùng với ID muốn xóa
    orderData = orderData.filter((o) => o.id !== id);

    alert(`Đơn hàng #${id} đã được xóa thành công!`);
    loadOrderTable(); // Tải lại bảng để cập nhật danh sách
  }
}
/**
 * Hàm tra cứu và lọc danh sách Đơn Hàng
 */
function searchOrders() {
  const startDateStr = document.getElementById("filter-order-start-date").value;
  const endDateStr = document.getElementById("filter-order-end-date").value;
  const filterStatus = document.getElementById("filter-order-status").value;

  // Chuyển đổi ngày thành đối tượng Date để so sánh
  const startDate = startDateStr ? new Date(startDateStr) : null;
  const endDate = endDateStr ? new Date(endDateStr) : null;

  const filteredData = orderData.filter((order) => {
    // Lọc theo Trạng Thái
    const matchesStatus = !filterStatus || order.status === filterStatus;

    // Lọc theo Khoảng Thời Gian (chuyển ngày đặt sang Date để so sánh)
    const orderDate = new Date(order.date);
    let matchesDate = true;

    if (startDate) {
      // Đảm bảo đơn hàng lớn hơn hoặc bằng ngày bắt đầu
      matchesDate = matchesDate && orderDate >= startDate;
    }
    if (endDate) {
      // Đảm bảo đơn hàng nhỏ hơn hoặc bằng ngày kết thúc
      // Cần thêm 1 ngày để bao gồm cả ngày kết thúc (vì Date object mặc định là 00:00:00)
      const nextDay = new Date(endDate);
      nextDay.setDate(nextDay.getDate() + 1);
      matchesDate = matchesDate && orderDate < nextDay;
    }

    return matchesStatus && matchesDate;
  });

  loadOrderTable(filteredData);
}

function viewOrderDetail(id) {
  const order = orderData.find((o) => o.id === id);
  if (!order) return;

  showSection("section-order-detail");
  document.getElementById(
    "order-detail-title"
  ).textContent = `Chi Tiết Đơn Hàng #${id}`;
  document.getElementById(
    "current-status"
  ).className = `tag status-${order.status}`;
  document.getElementById("current-status").textContent = {
    new: "Mới Đặt",
    processing: "Đã Xử Lý",
    delivered: "Đã Giao",
    cancelled: "Hủy",
  }[order.status];

  // Hiển thị thông tin đơn hàng
  let infoHTML = `
            <p><strong>Ngày Đặt:</strong> ${order.date}</p>
            <p><strong>Khách Hàng:</strong> ${order.customer} (${
    order.phone
  })</p>
            <p><strong>Địa Chỉ:</strong> ${order.address}</p>
            <p><strong>Tổng Thanh Toán:</strong> <strong style="color: var(--pink-dark);">${order.total.toLocaleString(
              "vi-VN"
            )} VNĐ</strong></p>
            
            <h4>Sản Phẩm Đã Đặt:</h4>
            <table class="data-table" style="width: 80%;">
                <thead><tr><th>Sản Phẩm</th><th>SL</th><th>Giá Bán</th><th>Thành Tiền</th></tr></thead>
                <tbody>
                    ${order.items
                      .map(
                        (item) => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.sl}</td>
                            <td>${item.price.toLocaleString("vi-VN")}</td>
                            <td>${(item.sl * item.price).toLocaleString(
                              "vi-VN"
                            )}</td>
                        </tr>
                    `
                      )
                      .join("")}
                </tbody>
            </table>
        `;
  document.getElementById("order-info").innerHTML = infoHTML;

  // Hiển thị nút hành động cập nhật trạng thái
  const actionsDiv = document.getElementById("status-actions");
  actionsDiv.innerHTML = "";

  if (order.status === "new") {
    actionsDiv.innerHTML += `<button class="btn btn-secondary" style="background-color: var(--processing-color);" onclick="updateOrderStatus('${id}', 'processing')"><i class="fas fa-sync-alt"></i> Xử Lý Đơn</button>`;
    actionsDiv.innerHTML += `<button class="btn btn-secondary" style="background-color: var(--cancelled-color);" onclick="updateOrderStatus('${id}', 'cancelled')"><i class="fas fa-times-circle"></i> Hủy Đơn</button>`;
  } else if (order.status === "processing") {
    actionsDiv.innerHTML += `<button class="btn btn-primary" style="background-color: var(--success-color);" onclick="updateOrderStatus('${id}', 'delivered')"><i class="fas fa-truck"></i> Giao Hàng Thành Công</button>`;
    actionsDiv.innerHTML += `<button class="btn btn-secondary" style="background-color: var(--cancelled-color);" onclick="updateOrderStatus('${id}', 'cancelled')"><i class="fas fa-times-circle"></i> Hủy Đơn</button>`;
  }
  // Không có nút hành động nếu trạng thái là 'delivered' hoặc 'cancelled'
}

function updateOrderStatus(id, newStatus) {
  const index = orderData.findIndex((o) => o.id === id);
  if (index !== -1) {
    orderData[index].status = newStatus;
    alert(`Đơn hàng #${id} đã được cập nhật trạng thái thành ${newStatus}!`);
    loadOrderTable();
    viewOrderDetail(id); // Tải lại chi tiết đơn hàng
  }
}

// ==================== Khởi Tạo ====================

// Load bảng và thiết lập sự kiện khi trang được tải
document.addEventListener("DOMContentLoaded", () => {
  loadImportTable();
  loadOrderTable();

  // 1. Thiết lập sự kiện chuyển tab cho "Quản Lý Nhập Hàng"
  document.getElementById("nav-import").addEventListener("click", (e) => {
    e.preventDefault();
    // showSection("section-import");
  });

  // 2. Thiết lập sự kiện chuyển tab cho "Quản Lý Đơn Hàng"
  document.getElementById("nav-order").addEventListener("click", (e) => {
    e.preventDefault();
    showSection("section-order");
  });

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

  // Nếu chưa có users nào, thêm dữ liệu mẫu
  if (users.length === 0) {
    users = [
      {
        hoten: "Trần Kỳ Quang",
        email: "quangdeptrai123@gmail.com",
        sdt: "0347846168",
        address: "Hà Nội",
        username: "quang123",
        password: "123456",
        isLocked: false,
      },
      {
        hoten: "Lý Lữ Cà",
        email: "lylu@gmail.com",
        sdt: "1231231230",
        address: "New York",
        username: "lylu",
        password: "123456",
        isLocked: true,
      },
    ];
    localStorage.setItem("users", JSON.stringify(users));
  } else {
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
const inventoryLogs = [
  {
    productId: "TIRAMISU",
    date: "2025-11-01",
    quantity: 120,
    type: "Bánh kem",
    action: "nhập",
  },
  {
    productId: "TIRAMISU",
    date: "2025-11-02",
    quantity: 112,
    type: "Bánh kem",
    action: "xuất",
  },
  {
    productId: "MACARON",
    date: "2025-11-02",
    quantity: 25,
    type: "Bánh ngọt",
    action: "nhập",
  },
  {
    productId: "ÉCLAIR",
    date: "2025-11-02",
    quantity: 5,
    type: "Bánh ngọt",
    action: "nhập",
  },
  {
    productId: "DONUT",
    date: "2025-11-02",
    quantity: 0,
    type: "Bánh mặn",
    action: "nhập",
  },
];

localStorage.setItem("inventoryLogs", JSON.stringify(inventoryLogs));

// Tra cứu theo sản phẩm và ngày
function searchInventoryByProduct() {
  const date = document.getElementById("inventory-date").value;
  const productId = document.getElementById("inventory-product").value;
  const logs = JSON.parse(localStorage.getItem("inventoryLogs")) || [];
  const filtered = logs.filter(
    (log) => log.productId === productId && log.date === date
  );
  const total = filtered.reduce((sum, log) => sum + log.quantity, 0);

  const resultBox = document.getElementById("inventory-result");
  if (filtered.length > 0) {
    const warning = total <= 10 ? "⚠️ Sắp hết hàng" : "";
    resultBox.innerHTML = `✅ <strong>${productId}</strong> còn <strong>${total}</strong> cái vào ngày <strong>${date}</strong>. ${warning}`;
    resultBox.style.color = total <= 10 ? "#e74c3c" : "#2c3e50";
  } else {
    resultBox.innerHTML = `❌ Không có dữ liệu tồn kho cho <strong>${productId}</strong> vào ngày <strong>${date}</strong>.`;
    resultBox.style.color = "#e74c3c";
  }
}

// Cảnh báo sản phẩm sắp hết
function checkLowStock(threshold = 10) {
  const logs = JSON.parse(localStorage.getItem("inventoryLogs")) || [];
  const latestDate = logs.reduce(
    (max, log) => (log.date > max ? log.date : max),
    "0000-00-00"
  );
  const grouped = {};

  logs
    .filter((log) => log.date === latestDate)
    .forEach((log) => {
      grouped[log.productId] = (grouped[log.productId] || 0) + log.quantity;
    });

  const lowStockItems = Object.entries(grouped).filter(
    ([_, qty]) => qty <= threshold
  );
  const resultBox = document.getElementById("low-stock-result");

  if (lowStockItems.length === 0) {
    resultBox.innerHTML = "✅ Tất cả sản phẩm đều còn đủ hàng.";
    resultBox.style.color = "#2ecc71";
  } else {
    resultBox.innerHTML = lowStockItems
      .map(
        ([id, qty]) =>
          `• <strong>${id}</strong>: còn <strong>${qty}</strong> cái ⚠️`
      )
      .join("<br>");
    resultBox.style.color = "#e74c3c";
  }
}

// Thống kê nhập – xuất – tồn theo khoảng thời gian
function summarizeInventory() {
  const start = document.getElementById("start-date").value;
  const end = document.getElementById("end-date").value;
  const logs = JSON.parse(localStorage.getItem("inventoryLogs")) || [];

  const filtered = logs.filter((log) => log.date >= start && log.date <= end);
  const summary = {};

  filtered.forEach((log) => {
    if (!summary[log.productId]) {
      summary[log.productId] = { nhập: 0, xuất: 0 };
    }
    if (log.action === "nhập") summary[log.productId].nhập += log.quantity;
    if (log.action === "xuất")
      summary[log.productId].xuất += Math.abs(log.quantity);
  });

  const resultBox = document.getElementById("summary-result");
  if (Object.keys(summary).length === 0) {
    resultBox.innerHTML = "❌ Không có dữ liệu trong khoảng thời gian đã chọn.";
    resultBox.style.color = "#e74c3c";
    return;
  }

  resultBox.innerHTML = Object.entries(summary)
    .map(
      ([id, data]) =>
        `• <strong>${id}</strong>: Nhập <strong>${
          data.nhập
        }</strong> cái, Xuất <strong>${data.xuất}</strong> cái, Tồn <strong>${
          data.nhập - data.xuất
        }</strong> cái`
    )
    .join("<br>");
  resultBox.style.color = "#2c3e50";
}
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

// Khởi tạo dữ liệu khi load trang
initializeProductsFromMenuBanh(); // Khởi tạo sản phẩm từ MenuBanh nếu chưa có
initializeUsers(); // Khởi tạo users nếu chưa có
loadDataFromLocalStorage(); // Load dữ liệu vào biến toàn cục

// Khởi tạo UI
renderCategories();
renderProducts();
renderPrices();
loadTypeDropDown();

// ⚠️ BỎ COMMENT 2 DÒNG BÊN DƯỚI ĐỂ XÓA VÀ RESET DỮ LIỆU, SAU ĐÓ COMMENT LẠI
// localStorage.clear();
// alert("Đã xóa toàn bộ dữ liệu trong localStorage!");
