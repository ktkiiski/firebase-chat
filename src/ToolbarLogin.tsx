import React, { useCallback, useState } from 'react';
import { Button, CircularProgress, Theme, makeStyles, Hidden, Menu, MenuItem, ButtonBase } from '@material-ui/core';
import { useAuthState, useAuth } from './Firebase';
import * as firebase from 'firebase/app';
import ProfileAvatar from './ProfileAvatar';

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    marginLeft: theme.spacing(1),
  },
} as const))

function ToolbarLogin() {
  const auth = useAuth();
  const user = useAuthState();
  const [isLoading, setIsLoading] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null as HTMLElement | null);
  const classes = useStyles();
  const openMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  }, []);
  const closeMenu = useCallback(() => {
    setMenuAnchor(null);
  }, []);
  const login = useCallback(async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    setIsLoading(true);
    try {
      await auth.signInWithRedirect(provider);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  const logout = useCallback(async () => {
    closeMenu();
    setIsLoading(true);
    try {
      await auth.signOut();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  if (isLoading || typeof user === 'undefined') {
    return <CircularProgress color="inherit" size={24} />;
  }
  if (!user) {
    return <Button color="inherit" onClick={login}>Login</Button>;
  }
  const avatar = <ButtonBase centerRipple onClick={openMenu}>
    <ProfileAvatar user={user} className={classes.avatar} />
  </ButtonBase>;
  const menu = (
    <Menu
      anchorEl={menuAnchor}
      getContentAnchorEl={undefined}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={menuAnchor != null}
      onClose={closeMenu}
    >
      <MenuItem onClick={logout}>Log out</MenuItem>
    </Menu>
  );
  return (
    <>
      <Hidden xsDown implementation='css'>
        <Button onClick={openMenu} color="inherit">{user.displayName}</Button>
      </Hidden>
      {avatar}
      {menu}
    </>
  );
}

export default React.memo(ToolbarLogin);
