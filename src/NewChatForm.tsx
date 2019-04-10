import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import Padder from './Padder';

interface NewChatFormProps {
  onSubmit: (chatName: string) => Promise<void>;
}

function NewChatForm({onSubmit}: NewChatFormProps) {
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
    <Padder padding={2}>
      <form onSubmit={onFormSubmit} onClick={onClick}>
        <TextField
          label="Create new chat"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Type chat title"
          disabled={isLoading}
          fullWidth
          />
        <Button
          type="submit"
          disabled={!name || isLoading}
          >Create new chat</Button>
      </form>
    </Padder>
  )
}

export default React.memo(NewChatForm);
