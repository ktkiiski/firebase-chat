import React from 'react';
import { createMuiTheme, Theme } from "@material-ui/core/styles";
import { ThemeProvider, makeStyles } from "@material-ui/styles";

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const useStyles = makeStyles((theme: Theme) => ({
  sidebar: {
    backgroundColor: theme.palette.background.default,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
} as const));

function SideBarContents(props: React.HTMLAttributes<HTMLDivElement>) {
  const styles = useStyles();
  return <div {...props} className={styles.sidebar} />;
}

function SideBar(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <ThemeProvider theme={darkTheme}>
      <SideBarContents {...props} />
    </ThemeProvider>
  );
}

export default SideBar;
