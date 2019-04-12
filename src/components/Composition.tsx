import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import Padder from './Padder';

interface CompositionProps {
  isSignedIn: boolean;
  onSendMessage: (message: string) => Promise<void>;
}

function Composition(props: CompositionProps) {
  const {isSignedIn, onSendMessage} = props;
  const [message, setMessage] = useState('');

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setMessage(event.currentTarget.value);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    await onSendMessage(message);
  }

  return (
    <Padder padding={2}>
      <form onSubmit={onSubmit}>
        <TextField
          placeholder={isSignedIn ? `Type a new message` : `Please sign in to send a message`}
          value={isSignedIn ? message : ''}
          onChange={onChange}
          disabled={!isSignedIn}
          fullWidth
        />
      </form>
    </Padder>
  );
}

export default React.memo(Composition);
