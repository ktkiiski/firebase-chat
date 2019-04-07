import React from 'react';
import { AppBar, Grid, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    height: '100vh',
  },
  main: {
    paddingTop: '64px',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  sidebar: {
    padding: theme.spacing(1),
    height: '100%',
  },
  content: {
    padding: theme.spacing(1),
    height: '100%',
  },
} as const));

interface LayoutProps {
  top: React.ReactNode;
  left: React.ReactNode;
  children: React.ReactNode;
}

function Layout(props: LayoutProps) {
  const styles = useStyles();
  return (
    <div className={styles.container}>
      <AppBar position="fixed">{props.top}</AppBar>
      <Grid container spacing={3} className={styles.main}>
        <Grid item xs={3}>
          <div className={styles.sidebar}>{props.left}</div>
        </Grid>
        <Grid item xs={9}>
          <div className={styles.content}>{props.children}</div>
        </Grid>
      </Grid>
    </div>
  );
}

export default Layout;
