import React, { useState, useEffect } from 'react';
import NewRoomForm from './NewRoomForm';
import { request } from './api';
import { Toolbar, Typography, CssBaseline, List, ListItem, ListItemText, CircularProgress } from '@material-ui/core';
import Chat from './Chat';
import Layout from './Layout';

interface Room {
  id: string;
  name: string;
}

function App() {
  const [rooms, setRooms] = useState<Room[] | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  async function fetchRooms() {
    const result = await request<Room[]>('GET', '/api/rooms');
    setRooms(result);
  }
  useEffect(() => {
    fetchRooms();
  }, []);

  async function onNewRoomSubmit(name: string) {
    const newRoom = await request<Room>('POST', '/api/rooms', {name});
    setRooms(rooms && rooms.concat([newRoom]));
  }

  const roomList = !rooms ? <CircularProgress /> : (
    <List component='nav'>
      {rooms.map((room) => (
        <ListItem key={room.id} button onClick={() => setSelectedRoomId(room.id)}>
          <ListItemText primary={room.name} />
        </ListItem>
      ))}
    </List>
  );
  const content = selectedRoomId ? <Chat roomId={selectedRoomId} /> : null;
  const top = (
    <Toolbar>
      <Typography variant='h6' color="inherit">
        Example Chat
      </Typography>
    </Toolbar>
  );
  const left = (
    <>
      <NewRoomForm onSubmit={onNewRoomSubmit} />
      {roomList}
    </>
  );
  return (
    <>
      <CssBaseline />
      <Layout top={top} left={left}>{content}</Layout>
    </>
  );
}

export default App;
