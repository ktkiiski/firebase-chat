import React, {Ref} from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  scrollable: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    overflowX: 'hidden',
    overflowY: 'scroll',
  },
  bottom: {
    flexGrow: 0,
    flexShrink: 0,
  },
});

interface VerticalSplitProps {
  children: React.ReactNode;
  bottom: React.ReactNode;
  scrollableRef?: Ref<HTMLDivElement>;
}

function VerticalSplit(props: VerticalSplitProps) {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.scrollable} ref={props.scrollableRef}>{props.children}</div>
      <div className={classes.bottom}>{props.bottom}</div>
    </div>
  );
}

export default VerticalSplit;
