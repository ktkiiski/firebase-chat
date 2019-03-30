import React, { useState, useEffect } from 'react';
import './App.css';
import NewRoomForm from './NewRoomForm';
import { request } from './api';

interface Room {
  id: string;
  name: string;
}

function App() {
  const [rooms, setRooms] = useState<Room[] | null>(null);
  async function fetchRooms() {
    const response = await fetch('/api/rooms');
    const result = await response.json();
    setRooms(result);
  }
  useEffect(() => {
    fetchRooms();
  }, []);

  async function onNewRoomSubmit(name: string) {
    const newRoom = await request<Room>('POST', '/api/rooms', {name});
    setRooms(rooms && rooms.concat([newRoom]));
  }

  const roomList = !rooms ? <div>Loading...</div> : (
    <ul>
      {rooms.map((room) => (
        <li key={room.id}>{room.name}</li>
      ))}
    </ul>
  );
  return (
    <div className="App">
      <header className="App-header">Chat rooms</header>
      {roomList}
      <NewRoomForm onSubmit={onNewRoomSubmit} />
    </div>
  );
}

export default App;
