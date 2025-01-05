import React, { useState } from "react";
import ScheduleIcon from "@mui/icons-material/Schedule"; // Icon for Slot
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Dashboard,
  AccountBalance,
  Category,
  Group,
  Person,
  Camera,
  Book,
  Assignment,
  Payment,
  Schedule,
  Today,
  Login,
  AppRegistration,
  School,
  Report,
  DoubleArrow,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import logo from "../img/logo.jpg";

const Sidebar = ({ mobileOpen, onDrawerToggle }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [openPaymentMenu, setOpenPaymentMenu] = useState(false);
  const [openStudentMenu, setOpenStudentMenu] = useState(false);

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
    { text: "Department", icon: <AccountBalance />, path: "/department" },
    { text: "Module", icon: <Category />, path: "/module" },
    { text: "Batch", icon: <Group />, path: "/batch" },
    { text: "Lecturehall", icon: <School />, path: "/lecturehall" },
    { text: "Slot", icon: <ScheduleIcon />, path: "/slot" },
    {
      text: "Students",
      icon: <Person />,
      path: "##",
      onClick: () => setOpenStudentMenu((prev) => !prev),
      submenu: [
        { text: "Student Details", path: "/student-details" },
        { text: "Add Student", path: "/add-student" },
      ],
    },
    { text: "Digital ID", icon: <Camera />, path: "/digital-id" },
    { text: "Lecture", icon: <Book />, path: "/lecture" },
    {
      text: "Assign to Module",
      icon: <Assignment />,
      path: "/assign-to-module",
    },
    {
      text: "Finance",
      icon: <Payment />,
      path: "#",
      onClick: () => setOpenPaymentMenu((prev) => !prev),
      submenu: [
        { text: "Payment", path: "/payment" },
        { text: "Search", path: "/payment/search" },
        { text: "Expenses", path: "/payment/expenses" },
        { text: "Expense Types", path: "/payment/expense-types" },
        { text: "Add Account", path: "/payment/add-account" },
        { text: "Accounts", path: "/payment/accounts" },
      ],
    },
    { text: "Time Table", icon: <Schedule />, path: "/time-table" },
    { text: "Attendance", icon: <Today />, path: "/attendance" },
    { text: "Login", icon: <Login />, path: "/login" },
    { text: "Register", icon: <AppRegistration />, path: "/register" },
    { text: "report", icon: <Report />, path: "/report" },
  ];

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Logo fixed at the top */}
      <Box
        sx={{
          p: 2,
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "sticky", // Ensures the logo stays fixed while scrolling
          top: 0, // Position from the top of the sidebar
          zIndex: 1000, // Make sure the logo stays on top
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{
            width: "70%",
            maxWidth: "90px",
            height: "auto",
          }}
        />
      </Box>

      {/* Sidebar menu items */}
      <Box
        sx={{
          overflowY: "auto",
          flexGrow: 1,
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#c2a8a8",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#a7afc0",
            borderRadius: "50px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#c8cbd6",
          },
        }}
      >
        <List>
          {menuItems.map((item) => (
            <div key={item.text}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    if (item.path !== "#") {
                      navigate(item.path);
                      if (isMobile) {
                        onDrawerToggle();
                      }
                    }
                    if (item.onClick) item.onClick();
                  }}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(0, 123, 255, 0.1)",
                    },
                    borderRadius: 2,
                    m: 0.5,
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      "& .MuiTypography-root": {
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>

              {/* Conditional rendering of submenu for Students */}
              {item.text === "Students" && openStudentMenu && item.submenu && (
                <Box
                  sx={{
                    paddingLeft: 3,
                    backgroundColor: "rgba(0, 123, 255, 0.05)", // Light background color for submenu
                    borderRadius: 2,
                    marginTop: 1,
                    textAlign: "center",
                  }}
                >
                  {item.submenu.map((subItem) => (
                    <ListItem key={subItem.text} disablePadding>
                      <ListItemButton
                        onClick={() => {
                          navigate(subItem.path);
                          if (isMobile) {
                            // Assuming `onDrawerToggle` is a prop for mobile view drawer toggle
                            // onDrawerToggle();
                          }
                        }}
                        sx={{
                          "&:hover": {
                            backgroundColor: "rgba(0, 123, 255, 0.2)", // Darker hover effect for submenu items
                          },
                          borderRadius: 2,
                          m: 0.5,
                          ml: -2.5,
                        }}
                      >
                        <ListItemIcon>
                          <DoubleArrow
                            sx={{ fontSize: 18, transform: "rotate(90deg)" }}
                          />{" "}
                          {/* Submenu marker */}
                        </ListItemIcon>
                        <ListItemText
                          primary={subItem.text}
                          sx={{
                            "& .MuiTypography-root": {
                              fontSize: 14,
                              whiteSpace: "nowrap",
                            },
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </Box>
              )}

              {/* Conditional rendering of submenu for Finance */}
              {item.text === "Finance" && openPaymentMenu && item.submenu && (
                <Box
                  sx={{
                    paddingLeft: 3,
                    backgroundColor: "rgba(0, 123, 255, 0.05)", // Light background color for submenu
                    borderRadius: 2,
                    marginTop: 1,
                    textAlign: "center",
                  }}
                >
                  {item.submenu.map((subItem) => (
                    <ListItem key={subItem.text} disablePadding>
                      <ListItemButton
                        onClick={() => {
                          navigate(subItem.path);
                          if (isMobile) {
                            // Assuming `onDrawerToggle` is a prop for mobile view drawer toggle
                            // onDrawerToggle();
                          }
                        }}
                        sx={{
                          "&:hover": {
                            backgroundColor: "rgba(0, 123, 255, 0.2)", // Darker hover effect for submenu items
                          },
                          borderRadius: 2,
                          m: 0.5,
                          ml: -2.5,
                        }}
                      >
                        <ListItemIcon>
                          <DoubleArrow
                            sx={{ fontSize: 18, transform: "rotate(90deg)" }}
                          />{" "}
                          {/* Submenu marker */}
                        </ListItemIcon>
                        <ListItemText
                          primary={subItem.text}
                          sx={{
                            "& .MuiTypography-root": {
                              fontSize: 14,
                              whiteSpace: "nowrap",
                            },
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </Box>
              )}
            </div>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { sm: 240 },
        flexShrink: { sm: 0 },
      }}
    >
      {/* Mobile drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={onDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 240,
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 240,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
