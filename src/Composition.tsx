import React, { useState } from 'react';
import { makeStyles, Theme, TextField } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  form: {
    padding: theme.spacing(2),
  },
}));

interface CompositionProps {
  onSendMessage: (message: string) => Promise<void>;
}

function Composition(props: CompositionProps) {
  const classes = useStyles();
  const [message, setMessage] = useState('');

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setMessage(event.currentTarget.value);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    await props.onSendMessage(message);
  }

  return (
    <form className={classes.form} onSubmit={onSubmit}>
      <TextField
        placeholder="Type a new message"
        value={message}
        onChange={onChange}
        fullWidth
      />
    </form>
  );
}

export default React.memo(Composition);
