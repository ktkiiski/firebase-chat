import React from 'react';
import { AppBar, makeStyles, Theme, Drawer } from '@material-ui/core';
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
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
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
    padding: theme.spacing(3),
  },
} as const));

interface LayoutProps {
  top: React.ReactNode;
  left: React.ReactNode;
  children: React.ReactNode;
}

function Layout(props: LayoutProps) {
  const styles = useStyles();
  const isMobile = useMediaQuery(`(min-width:${mobileBreakpoint}px)`);
  const isOpen = true;
  const sideBar = <SideBar>{props.left}</SideBar>;
  const drawer = isMobile ? (
    <Drawer
      variant="permanent"
      open
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
      open={isOpen}
      onClose={() => { /* */ }}
    >{sideBar}</Drawer>
  );
  return (
    <div className={styles.root}>
      <AppBar position="fixed" className={styles.appBar}>{props.top}</AppBar>
      <nav className={styles.drawer}>{drawer}</nav>
      <main className={styles.content}>
        <div className={styles.toolbar} />
        {props.children}
      </main>
    </div>
  );
}

export default Layout;
