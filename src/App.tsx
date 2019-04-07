import React, { useState, useCallback, useEffect } from 'react';
import NewRoomForm from './NewRoomForm';
import { Typography, CssBaseline, List, ListItem, ListItemText, CircularProgress, Divider } from '@material-ui/core';
import Chat from './Chat';
import Layout from './Layout';
import { useFirestore, useCollection } from './Firebase';

interface Room {
  id: string;
  name: string;
}

function App() {
  const firestore = useFirestore();
  const rooms = useCollection<Room>(
    firestore.collection('rooms').orderBy('name'), [],
  );
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedRoomId && rooms && rooms.length > 0) {
      setSelectedRoomId(rooms[0].id);
    }
  }, [rooms, selectedRoomId])

  const onNewRoomSubmit = useCallback(async function (name: string) {
    const doc = await firestore.collection('rooms').add({ name });
    setSelectedRoomId(doc.id);
  }, [firestore]);

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
