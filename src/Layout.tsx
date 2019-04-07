import React, { useState, useCallback } from 'react';
import { AppBar, makeStyles, Theme, Drawer, Toolbar, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import SideBar from './SideBar';

const drawerWidth = 240;
const mobileBreakpoint = 600;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  desktopDrawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  desktopDrawerPaper: {
    width: drawerWidth,
  },
  appBar: {
    // Bring to the top of the drawer
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    flexShrink: 1,
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
} as const));

interface LayoutProps {
  top: React.ReactNode;
  left: React.ReactNode;
  children: React.ReactNode;
}

function Layout(props: LayoutProps) {
  const styles = useStyles();
  const isDesktop = useMediaQuery(`(min-width:${mobileBreakpoint}px)`);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toggleIsOpen = useCallback(() => {
    setIsDrawerOpen(!isDrawerOpen);
  }, [isDrawerOpen]);
  const drawer = isDesktop ? (
    <Drawer
      variant="permanent"
      open
      classes={{paper: styles.desktopDrawerPaper}}
    >
      <SideBar>
        <div className={styles.toolbar} />
        {props.left}
      </SideBar>
    </Drawer>
  ) : (
    <Drawer
      variant="temporary"
      anchor='left'
      open={isDrawerOpen}
      onClose={toggleIsOpen}
    >
      <SideBar onClick={toggleIsOpen}>
        {props.left}
      </SideBar>
    </Drawer>
  );
  const menuButton = isDesktop ? null : (
    <IconButton
      color="inherit"
      aria-label="Open drawer"
      onClick={toggleIsOpen}
      className={styles.menuButton}
    >
      <MenuIcon />
    </IconButton>
  );
  return (
    <div className={styles.root}>
      <AppBar position="fixed" className={styles.appBar}>
        <Toolbar>
          {menuButton}
          {props.top}
        </Toolbar>
      </AppBar>
      <div className={isDesktop ? styles.desktopDrawer : undefined}>{drawer}</div>
      <main className={styles.content}>
        <div className={styles.toolbar} />
        {props.children}
      </main>
    </div>
  );
}

export default Layout;
