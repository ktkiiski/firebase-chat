import React from 'react';
import { makeStyles, CircularProgress, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(3),
  },
}));

function LoadingSpinner() {
  const classes = useStyles();
  return (
    <div className={classes.loading}>
      <CircularProgress size={32} />
    </div>
  );
}

export default LoadingSpinner;
