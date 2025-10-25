import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import DashboardWrapper from "./pages/DashboardWrapper";
import StudentList from "./pages/StudentList";
import { StudentProvider } from "./context/StudentProvider";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <StudentProvider>
            <DashboardWrapper />
          </StudentProvider>
        }
      >
        <Route path="students" element={<StudentList />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;
