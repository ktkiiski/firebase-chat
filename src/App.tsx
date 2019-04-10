import React, { useState, useCallback, useEffect } from 'react';
import NewChatForm from './NewChatForm';
import { Typography, CssBaseline, List, ListItem, ListItemText, Divider, Button } from '@material-ui/core';
import Chat from './Chat';
import Layout from './Layout';
import { useFirestore, useCollection, useAuthState } from './Firebase';
import LoadingSpinner from './LoadingSpinner';
import firebase from 'firebase/app';

interface Chat {
  id: string;
  name: string;
  creatorId?: string;
  createdAt?: firebase.firestore.Timestamp;
  messageCount?: number;
  participantCount?: number;
}

function App() {
  const firestore = useFirestore();
  const user = useAuthState();
  const chats = useCollection<Chat>(
    firestore.collection('chats').orderBy('name'), [],
  );
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const selectedChat = chats && chats.find(chat => chat.id === selectedChatId);

  useEffect(() => {
    if (!selectedChatId && chats && chats.length > 0) {
      setSelectedChatId(chats[0].id);
    }
  }, [chats, selectedChatId])

  const onNewChatSubmit = useCallback(async function (name: string) {
    if (!user) {
      // Need to log in to create a chat
      return;
    }
    const creatorId = user.id;
    const createdAt = firebase.firestore.FieldValue.serverTimestamp();
    const doc = await firestore.collection('chats').add({
      name,
      creatorId,
      createdAt,
      messageCount: 0,
      participantCount: 0,
    });
    setSelectedChatId(doc.id);
  }, [firestore, user]);

  const onDeleteClick = useCallback(async function () {
    if (selectedChat && user && confirm(`Are you sure you want to permanently delete the chat ${selectedChat.name} and all of its messages?`)) {
      // Delete the chat
      await firestore.collection('chats').doc(selectedChat.id).delete();
      // Select some other chat
      const anotherChat = chats && chats[0];
      setSelectedChatId(anotherChat && anotherChat.id || null);
    }
  }, [firestore, selectedChat, user, chats]);

  const chatList = !chats ? <LoadingSpinner /> : <>
    <List component='nav'>
      {chats.map((chat) => (
        <ListItem
          key={chat.id}
          button
          onClick={() => setSelectedChatId(chat.id)}
          selected={!!selectedChatId && chat.id === selectedChatId}
        >
          <ListItemText
            primary={chat.name}
            secondary={`${chat.messageCount || 0} messages, ${chat.participantCount || 0} participants`}
            primaryTypographyProps={{color: 'textPrimary'}}
          />
        </ListItem>
      ))}
    </List>
    {chats.length > 0 ? <Divider/> : null}
  </>;
  const content = selectedChatId ?
    <Chat chatId={selectedChatId} /> :
    !chats ?
    <LoadingSpinner /> :
    <Typography>Create a new chat from the side bar.</Typography>
  ;
  const title = selectedChat && selectedChat.name || 'Example chat';
  const isCreated = selectedChat && user && selectedChat.creatorId === user.id;
  const deleteButton = !isCreated ? null : (
    <Button onClick={onDeleteClick}>Delete chat</Button>
  );
  const left = (
    <>
      {chatList}
      <NewChatForm onSubmit={onNewChatSubmit} />
      {deleteButton}
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
