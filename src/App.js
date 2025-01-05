import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Box, IconButton, useTheme, useMediaQuery } from "@mui/material";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardPage from "./pages/DashboardPage";
import DepartmentPage from "./pages/DepartmentPage";
import ModulePage from "./pages/ModulePage";
import BatchPage from "./pages/BatchPage";
import StudentDetailsPage from "./pages/StudentDetailsPage";
import DigitalIDPage from "./pages/DigitalIDPage";
import LecturePage from "./pages/LecturePage";
import AssignToModulePage from "./pages/AssignToModulePage";
import PaymentPage from "./pages/PaymentPage";
import TimeTablePage from "./pages/TimeTablePage";
import AttendancePage from "./pages/AttendancePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LecturehallPage from "./pages/LecturehallPage";
import SlotPage from "./pages/Slotpage";
import StudentAttendance from "./pages/StudentAttendance";
import Report from "./pages/report";
import SearchPage from "./pages/SearchPage";
import ExpensesPage from "./pages/ExpensesPage";
import ExpenseTypesPage from "./pages/ExpenseTypesPage";
import AddAccountPage from "./pages/AddAccountPage";
import AccountsPage from "./pages/AccountsPage";
import AddStudentPage from "./pages/AddStudentPage";
import AuthenticatedRoute from '../src/components/AuthenticatedRoute';
import StudentproAttendance from './pages/Attendance_pro';
import QRAttendanceHandler from './components/QRAttendanceHandler';
import './App.css';

const App = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Router>
      <Routes>
        {/* Wrap only the routes that need sidebar and header */}
        <Route
          path="/*"
          element={
            <Layout
              mobileOpen={mobileOpen}
              handleDrawerToggle={handleDrawerToggle}
              isMobile={isMobile}
            />
          }
        />
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

const Layout = ({ mobileOpen, handleDrawerToggle, isMobile }) => {
  const location = useLocation(); // useLocation within Layout component

  const showSidebarAndHeader = !["/login"].includes(location.pathname);

  const isAccountsPage = location.pathname === "/payment/accounts";

  return (
    <>
      {/* Conditionally render Header and Sidebar */}
      {showSidebarAndHeader && <Header />}
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        {showSidebarAndHeader && isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              position: "fixed",
              left: 16,
              top: 16,
              zIndex: 1200,
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {showSidebarAndHeader && (
          <Sidebar
            mobileOpen={mobileOpen}
            onDrawerToggle={handleDrawerToggle}
          />
        )}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100% - ${240}px)` },

            p: 3,
            backgroundColor: isAccountsPage ? "#F3F4F6" : "inherit",
          }}
        >
          <Box sx={{ mt: 8 }}>
            <Routes>
              <Route path="/dashboard" element={<AuthenticatedRoute><DashboardPage /></AuthenticatedRoute>} />
              <Route path="/department" element={<AuthenticatedRoute> <DepartmentPage /> </AuthenticatedRoute>} />
              <Route path="/module" element={<ModulePage />} />
              <Route path="/batch" element={<BatchPage />} />
              <Route path="/student-details" element={<StudentDetailsPage />} />
              <Route path="/add-student" element={<AddStudentPage />} />
              <Route path="/digital-id" element={<DigitalIDPage />} />
              <Route path="/lecture" element={<LecturePage />} />
              <Route path="/qr-attendance" element={<QRAttendanceHandler />} />
              <Route
                path="/assign-to-module"
                element={<AssignToModulePage />}
              />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/payment/search" element={<SearchPage />} />
              <Route path="/payment/expenses" element={<ExpensesPage />} />
              <Route
                path="/payment/expense-types"
                element={<ExpenseTypesPage />}
              />
              <Route path="/payment/add-account" element={<AddAccountPage />} />
              <Route path="/payment/accounts" element={<AccountsPage />} />
              <Route path="/time-table" element={<TimeTablePage />} />
              <Route
                path="/time-table/:studentId"
                element={<TimeTablePage />}
              />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/lecturehall" element={<LecturehallPage />} />
              <Route path="/slot" element={<SlotPage />} />
              <Route
                path="/StudentAttendance"
                element={<StudentAttendance />}
              />
              <Route path="/report" element={<Report />} />
              <Route path="/StudentproAttendance" element={<StudentproAttendance />} />
              <Route path="/qr-attendance" element={<QRAttendanceHandler />} />
            </Routes>
          </Box>
        </Box>
      </Box>
      </>
    
  );
};

export default App;
