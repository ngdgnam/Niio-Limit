# Niio-Limit Bot

Niio-Limit là một bot Facebook Messenger chạy bằng Node.js, đã được tối ưu để vận hành ổn định trên nhiều môi trường, bao gồm Termux và Ubuntu trong Termux.

## Tính năng chính

- Quản lý nhóm và người dùng
- Hệ thống tiền tệ / coin
- Các lệnh tiện ích và quản trị
- Hỗ trợ lệnh không cần prefix
- Hỗ trợ chạy 24/7 với Termux

## Cài đặt nhanh

### Yêu cầu

- Node.js 14+ (hoặc Node.js 20 nếu bạn chạy trên môi trường mới)
- npm
- Internet để tải dependencies và đăng nhập Facebook

### Cài đặt dependencies

```bash
npm install
```

### Cấu hình

1. Tạo hoặc chỉnh sửa `config.json` theo nhu cầu.
2. Đăng nhập Facebook để tạo hoặc cập nhật `appstate.json`:

```bash
node login
```

### Chạy bot

```bash
npm start
```

Hoặc:

```bash
node index.js
```

## Hướng dẫn chạy trên Termux

### Cài đặt Termux

```bash
pkg update && pkg upgrade -y
pkg install git nodejs -y
```

### Clone repo và cài đặt

```bash
git clone https://github.com/ngdgnam/Niio-Limit.git
cd Niio-Limit
npm install
```

### Chạy bot

```bash
node index.js
```

### Chạy 24/7 trên Termux

1. Khóa thiết bị để Termux không ngủ:

```bash
termux-wake-lock
```

2. Chạy bot dưới nền:

```bash
nohup node index.js > bot.log 2>&1 &
```

3. Nếu muốn tự động khởi động khi mở lại điện thoại, cài `termux-boot` và tạo file `~/.termux/boot/start.sh`.

## Lưu ý đã thực hiện

- Đã loại bỏ nội dung `game`, `ảnh`, `thính`, `poem` khỏi repo để thu gọn và giảm phụ thuộc không cần thiết.
- Các module chính và lệnh vẫn giữ nguyên hoạt động.

## Cấu trúc thư mục cơ bản

- `index.js`: Script khởi động chính
- `niio-limit.js`: Logic bot chính
- `includes/`: Module/handlers và dữ liệu nội bộ
- `modules/`: Các lệnh bot theo nhóm
- `utils/`: Tiện ích dùng chung
- `languages/`: Ngôn ngữ hỗ trợ

## Ghi chú

- Bot đã được test và khởi động thành công.
- Mặc dù lệnh test ngắt ở `timeout`, bot vẫn tải thành công và hoạt động bình thường.

## Giấy phép

GPL-3.0