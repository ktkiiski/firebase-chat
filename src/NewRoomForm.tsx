import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';

interface NewRoomFormProps {
  onSubmit: (roomName: string) => Promise<void>;
}

function NewRoomForm({onSubmit}: NewRoomFormProps) {
  const [name, setName] = useState('');
  const [isLoading, setLoading] = useState(false);
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
    <form onSubmit={onFormSubmit}>
      <TextField
        label="Create room"
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

export default NewRoomForm;
