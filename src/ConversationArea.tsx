import React from 'react';
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
  },
  bottom: {
    flexGrow: 0,
    flexShrink: 0,
  },
});

interface ConversationAreaProps {
  children: React.ReactNode;
  bottom: React.ReactNode;
}

function ConversationArea(props: ConversationAreaProps) {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.scrollable}>{props.children}</div>
      <div className={classes.bottom}>{props.bottom}</div>
    </div>
  );
}

export default ConversationArea;