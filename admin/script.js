// Danh sách khách hàng mẫu
const customers = [
  {
    id: "001",
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    status: "active",
  },
  {
    id: "002",
    name: "Trần Thị B",
    email: "tranthib@example.com",
    status: "locked",
  },
];

// Hàm render danh sách khách hàng
function renderCustomers() {
  const tbody = document.querySelector(".customer-table tbody");
  tbody.innerHTML = "";

  customers.forEach((customer) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${customer.id}</td>
      <td>${customer.name}</td>
      <td>${customer.email}</td>
      <td><span class="${customer.status === "active" ? "active" : "inactive"}">
        ${customer.status === "active" ? "Hoạt động" : "Đã khóa"}
      </span></td>
      <td>
        <button onclick="resetPassword('${
          customer.id
        }')" class="btn-reset">Reset mật khẩu</button>
        ${
          customer.status === "active"
            ? `<button onclick="lockAccount('${customer.id}')" class="btn-lock">Khóa</button>`
            : `<button onclick="unlockAccount('${customer.id}')" class="btn-unlock">Mở khóa</button>`
        }
      </td>
    `;

    tbody.appendChild(row);
  });
}

// Hàm reset mật khẩu
function resetPassword(id) {
  const customer = customers.find((c) => c.id === id);
  alert(`✅ Đã gửi email reset mật khẩu cho ${customer.name}`);
}

// Hàm khóa tài khoản
function lockAccount(id) {
  const customer = customers.find((c) => c.id === id);
  customer.status = "locked";
  renderCustomers();
  alert(`🔒 Tài khoản của ${customer.name} đã bị khóa`);
}

// Hàm mở khóa tài khoản
function unlockAccount(id) {
  const customer = customers.find((c) => c.id === id);
  customer.status = "active";
  renderCustomers();
  alert(`🔓 Tài khoản của ${customer.name} đã được mở khóa`);
}

// Khởi tạo khi trang tải
document.addEventListener("DOMContentLoaded", renderCustomers);
function showCustomers() {
  const section = document.getElementById("customer-section");
  section.style.display = "block";
  renderCustomers(); // gọi hàm đã có để hiển thị danh sách
}
// Hàm khóa tài khoản
function lockAccount(id) {
  const customer = customers.find((c) => c.id === id);
  if (confirm(`Bạn có chắc muốn khóa tài khoản của ${customer.name}?`)) {
    customer.status = "locked";
    renderCustomers();
    alert(`🔒 Tài khoản của ${customer.name} đã bị khóa`);
  }
}

// Hàm mở khóa tài khoản
function unlockAccount(id) {
  const customer = customers.find((c) => c.id === id);
  if (confirm(`Bạn có chắc muốn mở khóa tài khoản của ${customer.name}?`)) {
    customer.status = "active";
    renderCustomers();
    alert(`🔓 Tài khoản của ${customer.name} đã được mở khóa`);
  }
}
const products = [
  {
    id: "P001",
    name: "Tiramisu",
    stock: 12,
    price: 250000,
    image: "./img/danhmucsp/tiramisu.svg",
  },
  {
    id: "P002",
    name: "Macaron",
    stock: 5,
    price: 180000,
    image: "./img/danhmucsp/macaron.svg",
  },
  {
    id: "P003",
    name: "Cheesecake",
    stock: 0,
    price: 300000,
    image: "./img/danhmucsp/cheesecake.svg",
  },
];

function renderProducts() {
  const tbody = document.querySelector(".product-table tbody");
  tbody.innerHTML = "";

  products.forEach((product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><img src="${product.image}" alt="${product.name}" width="60" /></td>
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>${product.stock}</td>
      <td>${product.price.toLocaleString()} VND</td>
    `;
    tbody.appendChild(row);
  });
}

function showProducts() {
  hideAllSections();
  document.getElementById("product-section").style.display = "block";
  renderProducts();
}
