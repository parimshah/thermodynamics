import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  School as SchoolIcon,
  Whatshot as WhatshotIcon,
  Science as ScienceIcon,
  Calculate as CalculateIcon,
  Quiz as QuizIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';

const Navigation = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navItems = [
    { path: '/', label: 'Home', icon: <HomeIcon /> },
    { path: '/fundamentals', label: 'Fundamentals', icon: <SchoolIcon /> },
    { path: '/heating-cooling', label: 'Heating & Cooling', icon: <WhatshotIcon /> },
    { path: '/enthalpy', label: 'Enthalpy', icon: <ScienceIcon /> },
    { path: '/hess-law', label: "Hess's Law", icon: <CalculateIcon /> },
    { path: '/practice', label: 'Practice Problems', icon: <QuizIcon /> }
  ];

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const activeRoute = (path) => location.pathname === path;

  const drawer = (
    <Box
      sx={{ width: 280 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Typography
        variant="h6"
        sx={{
          p: 2,
          fontWeight: 'bold',
          color: theme.palette.primary.main,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        Thermodynamics Journey
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            component={Link}
            to={item.path}
            key={item.path}
            selected={activeRoute(item.path)}
            sx={{
              color: activeRoute(item.path) ? theme.palette.primary.main : 'inherit',
              bgcolor: activeRoute(item.path) ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(25, 118, 210, 0.04)',
              }
            }}
          >
            <ListItemIcon sx={{ color: activeRoute(item.path) ? theme.palette.primary.main : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" color="default" elevation={2} sx={{ bgcolor: 'white' }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" component={Link} to="/" style={{
            textDecoration: 'none',
            color: theme.palette.primary.main,
            fontWeight: 'bold',
            flexGrow: isMobile ? 1 : 0
          }}>
            Thermodynamics Journey
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', mx: 4, flexGrow: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  color={activeRoute(item.path) ? 'primary' : 'inherit'}
                  sx={{
                    mx: 0.5,
                    fontWeight: activeRoute(item.path) ? 600 : 400,
                    position: 'relative',
                    '&::after': activeRoute(item.path) ? {
                      content: '""',
                      position: 'absolute',
                      width: '70%',
                      height: '3px',
                      bottom: '6px',
                      left: '15%',
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: '2px'
                    } : {}
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navigation;