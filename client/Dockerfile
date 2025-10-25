# Sử dụng base image Node.js 20
FROM node:20-alpine

# Đặt thư mục làm việc
WORKDIR /app

# Copy package.json và lock file
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ source code của client
COPY . .

# Dự án của bạn dùng Vite, default port là 5173
EXPOSE 5173

# Lệnh để chạy dev server (với hot-reload)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]