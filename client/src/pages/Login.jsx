// client/src/pages/Login.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImg from "../assets/Login.jpg"; // Đổi tên 'login' thành 'loginImg' để tránh nhầm lẫn với hàm
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext"; // Import hook 'useAuth'

const Login = () => {
  // USER_URLs không còn cần thiết vì chúng ta dùng 'api.js'
  // const USER_URLs = import.meta.env.VITE_USER_SERVICE_URL;

  const navigate = useNavigate();
  const { login } = useAuth(); // Lấy hàm 'login' từ AuthContext

  const [formData, setFormData] = useState({
    email: "", // Đổi 'username' thành 'email' cho rõ ràng
    password: "",
  });
  const [error, setError] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // --- HÀM SUBMIT ĐÃ ĐƯỢC CẬP NHẬT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Xóa lỗi cũ

    try {
      // Gọi hàm login từ Context, truyền vào email và password
      const success = await login(formData.email, formData.password);

      if (success) {
        navigate("/"); // Đăng nhập thành công, chuyển hướng về trang chủ (Dashboard)
      } else {
        // Hàm login trả về false (do lỗi 401, 404...)
        setError("Email hoặc mật khẩu không chính xác.");
      }
    } catch (err) {
      // Xử lý các lỗi khác (ví dụ: server sập)
      setError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
      console.error(err);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-blue-950">
      <div className="w-4/5 h-4/5 bg-white rounded-md shadow-2xl shadow-blue flex">
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <h1 className="text-blue-950 font-bold text-5xl">Đăng nhập</h1>
          <h2 className="text-blue-950">
            Đảm bảo tài khoản của bạn được an toàn
          </h2>
          <img className="w-3/5" src={loginImg} alt="anh login" />
        </div>

        <div className="flex-1 flex flex-col gap-4 items-center justify-center">
          <div className="flex flex-col gap-2">
            {/* <img src={logo} className="w-14 h-14" /> */}
            <span className="font-bold">Stdportal</span>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 w-3/5"
            autoComplete="off"
          >
            <div className="w-full flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-blue-950 font-semibold">
                  Email
                </label>
                <input
                  type="email" // Đổi type thành 'email'
                  name="email" // Đổi name thành 'email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập email"
                  className="rounded-md p-2 w-full border border-gray-300"
                  required
                />
              </div>
              <div className="flex flex-col gap-1 relative itemc-">
                <label className="text-blue-950 font-semibold">Mật khẩu</label>
                <input
                  type={isShowPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu"
                  className="border border-gray-300 rounded-md p-2 w-full pr-10"
                  required
                />

                <div
                  className="absolute right-3 top-10 cursor-pointer text-gray-500"
                  onClick={() => setIsShowPassword((prev) => !prev)}
                >
                  {isShowPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            {/* Hiển thị lỗi nếu có */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="button"
              onClick={() => navigate("/resetPassword")} // Giả sử bạn có route này
              className="flex justify-between items-start flex-col gap-4 mb-4"
            >
              <span className="text-blue-950 cursor-pointer">
                Quên mật khẩu?
              </span>
            </button>

            <button
              type="submit"
              className="bg-blue-950 hover:bg-blue-900 cursor-pointer text-white rounded-md p-2 w-full"
            >
              ĐĂNG NHẬP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;