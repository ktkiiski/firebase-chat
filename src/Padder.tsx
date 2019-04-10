import React from 'react';
import { Theme, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  padding1: {
    padding: theme.spacing(1),
  },
  padding2: {
    padding: theme.spacing(2),
  },
  padding3: {
    padding: theme.spacing(3),
  },
  padding4: {
    padding: theme.spacing(4),
  },
} as const))

function Padder(props: React.PropsWithChildren<{padding?: 1 | 2 | 3 | 4}>) {
  const classes = useStyles();
  const {padding = 1, children} = props;
  const classKey = `padding${padding}` as keyof typeof classes;
  return <div className={classes[classKey]}>{children}</div>;
}

export default Padder;
