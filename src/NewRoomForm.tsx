import React, { useState } from 'react';

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
      <label>Create room</label>
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Type room name"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={!name || isLoading}
      >Create</button>
    </form>
  )
}

export default NewRoomForm;