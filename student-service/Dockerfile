# backend/Dockerfile

# Sử dụng image Node.js 18
FROM node:18-alpine

# Đặt thư mục làm việc bên trong container
WORKDIR /app

# Copy 2 file quản lý package trước
COPY package*.json ./

# Chạy npm install (Theo yêu cầu đề bài, bước này phải được làm sẵn)
RUN npm install

# Copy toàn bộ source code của backend vào container
COPY . .

# Mở cổng 5000 (cổng server Express đang chạy)
EXPOSE 5000

# Lệnh để khởi chạy server khi container chạy
CMD ["npm", "start"]