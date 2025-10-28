# client/Dockerfile (Production Version)

# --- GIAI ĐOẠN 1: BUILD (XÂY DỰNG CODE REACT) ---
# Dùng Node.js 20 làm môi trường build
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
# Cài đặt dependencies, bao gồm cả devDependencies để build
RUN npm install

# Copy toàn bộ source code
COPY . .

# Chạy lệnh build của Vite (npm run build)
# Lệnh này sẽ tạo ra thư mục /app/dist chứa các file tĩnh
RUN npm run build

# --- GIAI ĐOẠN 2: SERVE (PHỤC VỤ FILE TĨNH) ---
# Dùng Nginx làm web server siêu nhẹ
FROM nginx:1.27-alpine

# Copy các file tĩnh đã build từ Giai đoạn 1 (/app/dist)
# vào thư mục gốc của Nginx (/usr/share/nginx/html)
COPY --from=builder /app/dist /usr/share/nginx/html

# (Không cần dòng này, Nginx tự biết phục vụ thư mục html)
# COPY nginx.conf /etc/nginx/conf.d/default.conf 

# Nginx mặc định chạy ở cổng 80 bên trong container
EXPOSE 80

# Nginx tự khởi động, không cần CMD