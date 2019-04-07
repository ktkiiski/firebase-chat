import React, { useState } from 'react';
import { TextField, Button, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
  form: {
    padding: theme.spacing(1),
  },
} as const));

interface NewRoomFormProps {
  onSubmit: (roomName: string) => Promise<void>;
}

function NewRoomForm({onSubmit}: NewRoomFormProps) {
  const styles = useStyles();
  const [name, setName] = useState('');
  const [isLoading, setLoading] = useState(false);
  const onClick: React.MouseEventHandler = (event) => {
    event.stopPropagation()
  };
  async function onFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name) {
      return;
    }
    setLoading(true);
    try {
      await onSubmit(name);
      setName('');
    } finally {
      setLoading(false);
    }
  }
  return (
    <form onSubmit={onFormSubmit} className={styles.form} onClick={onClick}>
      <TextField
        label="Create new room"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Type room name"
        disabled={isLoading}
        fullWidth
      />
      <Button
        type="submit"
        disabled={!name || isLoading}
      >Create</Button>
    </form>
  )
}

export default React.memo(NewRoomForm);
