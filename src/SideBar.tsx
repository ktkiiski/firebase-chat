import React from 'react';
import { createMuiTheme, Theme } from "@material-ui/core/styles";
import { ThemeProvider, makeStyles } from "@material-ui/styles";

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

interface SideBarProps {
  children: React.ReactNode;
}

const useStyles = makeStyles((theme: Theme) => ({
  sidebar: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(1),
    height: '100%',
  },
} as const));

function SideBarContents(props: SideBarProps) {
  const styles = useStyles();
  return <div className={styles.sidebar}>{props.children}</div>;
}

function SideBar(props: SideBarProps) {
  return (
    <ThemeProvider theme={darkTheme}>
      <SideBarContents>{props.children}</SideBarContents>
    </ThemeProvider>
  );
}

export default SideBar;
