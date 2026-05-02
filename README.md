# Niio-Limit Bot

Một bot Facebook Messenger sử dụng Node.js, hỗ trợ chạy trên nhiều môi trường bao gồm Termux.

## Tính năng

- Quản lý nhóm và người dùng
- Hệ thống tiền tệ và coin
- Các lệnh tiện ích
- AI tích hợp
- Và nhiều hơn nữa...

## Cài đặt

### Yêu cầu

- Node.js phiên bản 14 trở lên
- npm

### Cài đặt dependencies

```bash
npm install
```

### Cấu hình

1. Sao chép `config.json` và chỉnh sửa các thiết lập cần thiết.
2. Đăng nhập Facebook để lấy `appstate.json`:
   ```bash
   node login
   ```

### Chạy bot

```bash
npm start
# hoặc
node index
```

## Chạy trên Termux (Android)

Bot này đã được tối ưu để chạy trên Termux mà không cần compile native modules.

### Cài đặt Termux

1. Cài đặt Termux từ F-Droid hoặc Google Play.
2. Cập nhật packages:
   ```bash
   pkg update && pkg upgrade
   ```

### Cài đặt Node.js trên Termux

```bash
pkg install nodejs
```

### Clone và cài đặt

```bash
git clone https://github.com/LunarKrystal/Niio-Limit.git
cd Niio-Limit
npm install
```

### Cấu hình và chạy

Theo các bước trên.

Lưu ý: Trên Termux, sử dụng `node index.js` thay vì `npm start` nếu cần.

## Cấu trúc thư mục

- `index.js`: File khởi động chính
- `niio-limit.js`: Logic chính của bot
- `includes/`: Các module và handlers
- `modules/`: Các lệnh của bot
- `utils/`: Các tiện ích
- `languages/`: File ngôn ngữ

## Đóng góp

Mời đóng góp bằng cách tạo issue hoặc pull request.

## Giấy phép

GPL-3.0