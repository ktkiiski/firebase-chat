import React, { useState, useEffect, useCallback } from 'react';
import NewRoomForm from './NewRoomForm';
import { request } from './api';
import { Typography, CssBaseline, List, ListItem, ListItemText, CircularProgress, Divider } from '@material-ui/core';
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
    // If no room is selected, then select the first loaded room
    if (!selectedRoomId && result.length > 0) {
      setSelectedRoomId(result[0].id);
    }
  }
  useEffect(() => {
    fetchRooms();
  }, []);

  const onNewRoomSubmit = useCallback(async function (name: string) {
    const newRoom = await request<Room>('POST', '/api/rooms', {name});
    setRooms(rooms && rooms.concat([newRoom]));
  }, [rooms]);

  const roomList = !rooms ? <CircularProgress /> : <>
    <List component='nav'>
      {rooms.map((room) => (
        <ListItem
          key={room.id}
          button
          onClick={() => setSelectedRoomId(room.id)}
          selected={!!selectedRoomId && room.id === selectedRoomId}
        >
          <ListItemText primary={room.name} primaryTypographyProps={{color: 'textPrimary'}} />
        </ListItem>
      ))}
    </List>
    {rooms.length > 0 ? <Divider/> : null}
  </>;
  const content = selectedRoomId ?
    <Chat roomId={selectedRoomId} /> :
    !rooms ?
    <CircularProgress /> :
    <Typography>Create a new chat from the side bar.</Typography>
  ;
  const top = (
    <Typography variant='h6' color="inherit">
      Example Chat
    </Typography>
  );
  const left = (
    <>
      {roomList}
      <NewRoomForm onSubmit={onNewRoomSubmit} />
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
