import React from 'react';
import { AppBar, Toolbar, IconButton, Badge, Avatar, Menu, MenuItem, ListItemIcon, Divider } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import TaskIcon from '@mui/icons-material/List';
import LogoutIcon from '@mui/icons-material/Logout';
import profileImage from '../../src/img/user-1.jpg';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
   
    localStorage.removeItem("authToken");

    navigate('/');
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#fff', color: '#000', width: '100%', zIndex: 1200 }}>
      <Toolbar sx={{ justifyContent: 'space-between', padding: '8px' }}>
        
        {/* Left Side: Sidebar Toggle Icon */}
        <IconButton edge="start" color="inherit">
          <MenuIcon />
        </IconButton>

        {/* Left Side: Notification Icon with Badge */}
        <IconButton color="inherit" sx={{ marginLeft: 25 }}>
          <Badge color="primary" variant="dot">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        {/* Right Side: Profile Avatar with Dropdown */}
        <div style={{ marginLeft: 'auto' }}>
          <IconButton onClick={handleMenuClick}>
            <Avatar src={profileImage} alt="Profile" />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              My Profile
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <MailIcon fontSize="small" />
              </ListItemIcon>
              My Account
            </MenuItem>
            {/* <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <TaskIcon fontSize="small" />
              </ListItemIcon>
              My Task
            </MenuItem> */}
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </div>

      </Toolbar>
    </AppBar>
  );
};

export default Header;
