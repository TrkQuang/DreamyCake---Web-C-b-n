// Chờ đến khi toàn bộ HTML được load xong
document.addEventListener("DOMContentLoaded", function () {
  // Khởi tạo slider Splide trên phần tử có id "productSlider"
  new Splide("#productSlider", {
    type: "loop", // Slider chạy vòng lặp vô hạn
    perPage: 4, // Hiển thị 4 slide cùng lúc
    perMove: 1, // Mỗi lần chuyển slide, trượt 1 slide
    autoplay: true, // Slider tự động chạy
    interval: 2500, // Thời gian tự động chuyển slide: 2500ms (2.5s)
    pauseOnHover: true, // Khi rê chuột lên slider, dừng autoplay tạm thời
    gap: "1rem", // Khoảng cách giữa các slide là 1rem
    pagination: false, // Không hiển thị chấm phân trang
    arrows: true, // Hiển thị nút điều hướng trái/phải
    breakpoints: {
      // Tùy chỉnh responsive theo chiều rộng màn hình
      768: { perPage: 3 }, // Màn hình ≤768px hiển thị 3 slide
      480: { perPage: 2 }, // Màn hình ≤480px hiển thị 2 slide
    },
  }).mount(); // Kích hoạt slider, gắn sự kiện và bắt đầu chạy
});
