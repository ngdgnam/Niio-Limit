# Niio-Limit Bot

Niio-Limit là một bot Facebook Messenger được phát triển bằng Node.js. Bot hỗ trợ nhiều lệnh nhóm và quản trị, quản lý tiền ảo, xử lý sự kiện, lệnh không cần prefix và hoạt động tốt trên môi trường Linux/Ubuntu, Termux hoặc các máy chủ VPS.

## Tính năng

- Quản lý nhóm, thành viên và quản trị viên
- Hệ thống coin / tiền ảo
- Lệnh tiện ích, tìm kiếm và thống kê
- Hỗ trợ lệnh không cần prefix
- Hỗ trợ tự động làm sạch cache
- Khởi động và chạy bot qua `npm start`

## Yêu cầu

- Node.js >= 18
- npm
- Internet để tải dependencies và đăng nhập Facebook
- Facebook appstate (`appstate.json`) hợp lệ

## Cài đặt

1. Clone repository:

```bash
git clone https://github.com/ngdgnam/Niio-Limit.git
cd Niio-Limit
```

2. Cài dependencies:

```bash
npm install
```

3. Nếu gặp lỗi thiếu module, cài thêm trực tiếp:

```bash
npm install deasync ws
```

## Cấu hình

1. Mở `config.json` và chỉnh sửa thông tin bot theo nhu cầu:
   - `PREFIX`: tiền tố lệnh
   - `ADMINBOT`: danh sách ID admin bot
   - `NDH`: danh sách hỗ trợ
   - `FCAOption`: cấu hình FCA

2. Nếu chưa có `appstate.json`, đăng nhập Facebook bằng lệnh:

```bash
node login
```

## Chạy bot

```bash
npm start
```

Hoặc:

```bash
node index.js
```

## Cấu hình Termux

1. Cài Termux và nodejs:

```bash
pkg update && pkg upgrade -y
pkg install git nodejs -y
```

2. Clone repo, cài dependencies và chạy bot:

```bash
git clone https://github.com/ngdgnam/Niio-Limit.git
cd Niio-Limit
npm install
npm start
```

3. Để chạy nền và giữ hoạt động 24/7:

```bash
termux-wake-lock
nohup npm start > bot.log 2>&1 &
```

## Công việc đã hoàn thành

- Đã sửa lỗi crash khi `info.messageID` undefined trong các handler command (`handleCommand.js` và `handleCommandNoprefix.js`).
- Đã thêm dependency runtime cần thiết vào `package.json`.
- Đã kiểm tra bot khởi động thành công.

## Cấu trúc chính của dự án

- `index.js`: Điểm khởi động chính của bot
- `niio-limit.js`: Logic nội bộ và cấu hình bot
- `includes/`: Các module xử lý sự kiện, handler và thư viện phụ
- `modules/`: Lệnh của bot phân theo nhóm
- `utils/`: Tiện ích dùng chung
- `languages/`: File ngôn ngữ hỗ trợ

## Lưu ý

- `config.json` chứa token và cấu hình bot, cần giữ bí mật.
- Không đẩy `appstate.json` lên GitHub nếu nó chứa dữ liệu đăng nhập Facebook.
- Nếu chạy lên server mới, hãy cài `npm install` trước khi start.

## License

GPL-3.0