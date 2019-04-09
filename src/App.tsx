import React, { useState, useCallback, useEffect } from 'react';
import NewChatForm from './NewChatForm';
import { Typography, CssBaseline, List, ListItem, ListItemText, Divider } from '@material-ui/core';
import Chat from './Chat';
import Layout from './Layout';
import { useFirestore, useCollection } from './Firebase';
import LoadingSpinner from './LoadingSpinner';

interface Chat {
  id: string;
  name: string;
}

function App() {
  const firestore = useFirestore();
  const chats = useCollection<Chat>(
    firestore.collection('chats').orderBy('name'), [],
  );
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedChatId && chats && chats.length > 0) {
      setSelectedChatId(chats[0].id);
    }
  }, [chats, selectedChatId])

  const onNewChatSubmit = useCallback(async function (name: string) {
    const doc = await firestore.collection('chats').add({ name });
    setSelectedChatId(doc.id);
  }, [firestore]);

  const chatList = !chats ? <LoadingSpinner /> : <>
    <List component='nav'>
      {chats.map((chat) => (
        <ListItem
          key={chat.id}
          button
          onClick={() => setSelectedChatId(chat.id)}
          selected={!!selectedChatId && chat.id === selectedChatId}
        >
          <ListItemText primary={chat.name} primaryTypographyProps={{color: 'textPrimary'}} />
        </ListItem>
      ))}
    </List>
    {chats.length > 0 ? <Divider/> : null}
  </>;
  const selectedChat = chats && chats.find(chat => chat.id === selectedChatId);
  const content = selectedChatId ?
    <Chat chatId={selectedChatId} /> :
    !chats ?
    <LoadingSpinner /> :
    <Typography>Create a new chat from the side bar.</Typography>
  ;
  const title = selectedChat && selectedChat.name || 'Example chat';
  const left = (
    <>
      {chatList}
      <NewChatForm onSubmit={onNewChatSubmit} />
    </>
  );
  return (
    <>
      <CssBaseline />
      <Layout title={title} left={left}>{content}</Layout>
    </>
  );
}

export default App;
