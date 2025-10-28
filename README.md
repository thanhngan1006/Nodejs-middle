# Student App — React + Node.js Microservices

Ứng dụng quản lý sinh viên với **frontend** React (Vite + TailwindCSS) và **backend** Node.js/Express theo mô hình nhiều service, điều phối bằng **Docker Swarm** và **nginx** làm reverse proxy.

---

## ✨ Tech stack

- **Frontend:** React 18, Vite, TailwindCSS  
- **Backend:** Node.js, Express  
- **Gateway/Proxy:** nginx  
- **Orchestration:** Docker Compose + Docker Swarm

---

## 🗂️ Cấu trúc thư mục (rút gọn)
├─ client/ # Frontend React (Vite + Tailwind)
│ └─ src/ (api, assets, context, pages, App.jsx, main.jsx, ...)
│ └─ pages/ (Login.jsx, Profile.jsx, StudentList.jsx, ...)
│ ├─ Dockerfile, package.json, vite.config.js, tailwind.config.js, ...
│
├─ grade-service/ # Service điểm số
│ ├─ grade.model.js
│ ├─ messageBroker.js
│ ├─ server.js
│ └─ Dockerfile, package.json, ...
│
├─ notification-service/ # Service thông báo
│ ├─ consumer.js
│ ├─ .env.example <-- mẫu biến môi trường (xem bên dưới)
│ └─ Dockerfile, package.json, ...
│
├─ student-service/ # Service tài khoản, hồ sơ, sinh viên
│ ├─ controllers/ (auth.controller.js, profile.controller.js, ...)
│ ├─ middleware/auth.js
│ ├─ models/ (student.model.js, teacher.model.js, user.model.js)
│ ├─ routes/ (auth.routes.js, profile.routes.js, student.routes.js, ...)
│ ├─ gpaListener.js, messageBroker.js
│ └─ Dockerfile, package.json, ...
│
├─ nginx/
│ └─ nginx.conf
│
├─ docker-compose.yml
└─ README.md

> Ghi chú: Cấu trúc trên phản ánh các thư mục/chức năng chính trong hệ thống như hình đã gửi.

---

## ✅ Chuẩn bị

- **Node.js** (khuyến nghị v18+) và **npm**
- **Docker Desktop/Engine** & **Docker Compose v2**
- **Postman/Insomnia** (để gọi API thử)

---

## ⚙️ Biến môi trường (chỉ cho `notification-service`)

Chỉ sử dụng **một** file `.env.example` đặt **cùng cấp với `.env` trong `notification-service/`**.

**`notification-service/.env.example`**
```env
# Mẫu tệp biến môi trường cho dịch vụ thông báo
# Thông tin đăng nhập Gmail của bạn
EMAIL_USER=youremail@gmail.com
# Mật khẩu ứng dụng 16 chữ số
EMAIL_PASS=pass_your_16_char_app_password
```
### Cách dùng
```cmd
cp notification-service/.env.example notification-service/.env
```
**mở notification-service/.env và điền EMAIL_USER, EMAIL_PASS (App Password 16 ký tự của Gmail)**

## Cài đặt & Build
### 1. Cài dependencies cho từng service
```bash
cd client && npm i && cd ..
cd grade-service && npm i && cd ..
cd notification-service && npm i && cd ..
cd student-service && npm i && cd ..
```
### 2. Khởi tạo & deploy bằng Docker
```bash
# bật Docker
docker swarm init
# build images
docker compose build
# deploy stack
docker stack deploy -c docker-compose.yml student_app
```
### 3. Tắt toàn bộ stack
```bash
docker stack rm student_app
```

## Kiểm thử nhanh
### 1. Đăng ký tài khoản giáo viên (Postman)
``` POSTMAN
Method: POST

URL: http://localhost/api/auth/register

Body (raw JSON):
{
  "email": "newteacher@example.com",
  "password": "password123",
  "name": "Duong Huu Phuoc",
  "employeeId": "GV001",
  "department": "IT Faculty"
}
```
**Kết quả mong đợi: Teacher account and profile created**

### 2. Đăng nhập trên trình duyệt
Mở: http://localhost/
*Ứng dụng sẽ tự chuyển đến trang Login → đăng nhập bằng tài khoản vừa tạo ở bước trên.*
