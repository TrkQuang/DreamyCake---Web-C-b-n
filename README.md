# 🍰 DreamyCake - Website Bán Bánh Ngọt

Website bán bánh ngọt trực tuyến với giao diện người dùng và trang quản trị admin.

## ✨ Tính năng

### 👥 Phía Người dùng:
- 🏠 Trang chủ với danh mục sản phẩm động
- 🛍️ Giỏ hàng với badge đếm số lượng
- 🔍 Tìm kiếm và lọc sản phẩm theo danh mục
- 📱 Giao diện responsive

### 🔧 Phía Admin:
- 👤 Đăng nhập admin
- 📦 Quản lý sản phẩm (thêm/sửa/xóa)
- 🏷️ Quản lý danh mục
- 💰 Quản lý giá và lợi nhuận
- 📊 Phân trang dữ liệu
- 🖼️ Upload hình ảnh (Base64 hoặc URL)

## 🚀 Công nghệ sử dụng

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- LocalStorage API

## 📁 Cấu trúc thư mục

```
DreamyCake/
├── admin/              # Trang quản trị
│   ├── admin-index.html
│   ├── admin-index.css
│   ├── admin-index.js
│   ├── admin-login.html
│   └── ...
├── user/              # Trang người dùng
│   ├── index.html
│   ├── sanppham.js
│   ├── giohang.js
│   └── ...
├── css/               # Stylesheet chung
├── img/               # Hình ảnh
└── README.md
```

## 🎯 Cách sử dụng

1. Mở `admin/admin-login.html` để đăng nhập admin
2. Mở `user/index.html` để xem trang người dùng

## 💾 Lưu trữ dữ liệu

Dự án sử dụng LocalStorage để lưu trữ:
- Danh sách sản phẩm
- Giỏ hàng
- Giá cả
- Danh mục

## 👨‍💻 Phát triển bởi

DreamyCake Team

---

© 2025 DreamyCake. All rights reserved.
