#!/bin/bash

# Script hỗ trợ chạy bot trên Termux
# Đảm bảo bạn đã cài đặt Termux và pkg

echo "Cập nhật Termux..."
pkg update && pkg upgrade -y

echo "Cài đặt Node.js..."
pkg install nodejs -y

echo "Cài đặt Git..."
pkg install git -y

echo "Clone repository..."
git clone https://github.com/LunarKrystal/Niio-Limit.git
cd Niio-Limit

echo "Cài đặt dependencies..."
npm install

echo "Chạy bot..."
npm start