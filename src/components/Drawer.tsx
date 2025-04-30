import React from 'react';
import { Divider, Drawer as MuiDrawer, List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import { Dashboard as DashboardIcon, Settings as SettingsIcon, Analytics as AnalyticsIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const drawerWidth = 200;

const Drawer: React.FC = () => {
  return (
    <MuiDrawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: drawerWidth,
          boxSizing: 'border-box',
          position: 'relative', // Not fixed
          height: 'calc(100vh - 64px)', // Subtract app bar height
          top: 0, // Align to top (below app bar)
          touchAction: 'none', // Prevent touch scrolling
         
        },
        
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <ListItem  component={Link} to="/">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem  component={Link} to="/settings">
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem  component={Link} to="/analytics">
            <ListItemIcon>
              <AnalyticsIcon />
            </ListItemIcon>
            <ListItemText primary="Analytics" />
          </ListItem>
        </List>
      </Box>
    </MuiDrawer>
  );
};

export default Drawer;