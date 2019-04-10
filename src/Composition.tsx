import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import Padder from './Padder';

interface CompositionProps {
  onSendMessage: (message: string) => Promise<void>;
}

function Composition(props: CompositionProps) {
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
    <Padder padding={2}>
      <form onSubmit={onSubmit}>
        <TextField
          placeholder="Type a new message"
          value={message}
          onChange={onChange}
          fullWidth
        />
      </form>
    </Padder>
  );
}

export default React.memo(Composition);
