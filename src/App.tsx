import React, { useState, useEffect } from 'react';
import NewRoomForm from './NewRoomForm';
import './App.css';
import { request } from './api';
import { Toolbar, Typography, AppBar, CssBaseline, Grid, List, ListItem, ListItemText, CircularProgress } from '@material-ui/core';


interface Room {
  id: string;
  name: string;
}

function App() {
  const [rooms, setRooms] = useState<Room[] | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
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

  const roomList = !rooms ? <CircularProgress /> : (
    <List component='nav'>
      {rooms.map((room) => (
        <ListItem key={room.id} button onClick={() => setSelectedRoomId(room.id)}>
          <ListItemText primary={room.name} />
        </ListItem>
      ))}
    </List>
  );
  return (
    <div className="App">
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant='h6' color="inherit">
            Example Chat
          </Typography>
        </Toolbar>
      </AppBar>
      <div className="main">
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <div className="sidebar">
              <NewRoomForm onSubmit={onNewRoomSubmit} />
              {roomList}
            </div>
          </Grid>
          <Grid item xs={9}>
            <div className="content">{selectedRoomId}</div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default App;
