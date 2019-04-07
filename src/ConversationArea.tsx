import React, {Ref} from 'react';
import { makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
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
    marginTop: theme.spacing(1),
    flexGrow: 0,
    flexShrink: 0,
  },
} as const));

interface ConversationAreaProps {
  children: React.ReactNode;
  bottom: React.ReactNode;
  scrollableRef?: Ref<HTMLDivElement>;
}

function ConversationArea(props: ConversationAreaProps) {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.scrollable} ref={props.scrollableRef}>{props.children}</div>
      <div className={classes.bottom}>{props.bottom}</div>
    </div>
  );
}

export default ConversationArea;
