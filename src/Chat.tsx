import React, { useState, useEffect, useRef } from 'react';
import { CircularProgress, List, ListItem, ListItemText, TextField } from '@material-ui/core';
import { useFirestore, useCollection } from './Firebase';
import firebase from 'firebase';
import ConversationArea from './ConversationArea';

interface Message {
  id: string;
  message: string;
  senderName: string;
  createdAt: firebase.firestore.Timestamp;
}

interface ChatProps {
  roomId: string;
}

function useMessages(roomId: string) {
  const firestore = useFirestore();
  return useCollection<Message>(
    firestore
      .collection('rooms')
      .doc(roomId)
      .collection('messages')
      .orderBy('createdAt'),
    [roomId],
  );
}

function ChatMessage({message, senderName, createdAt}: Message) {
  const date = createdAt.toDate();
  const time = `${date.getHours()}:${date.getMinutes()}`
  const sender = (
    <strong>{senderName}</strong>
  );
  return (
    <ListItem>
      <ListItemText
        primary={message}
        secondary={<>{sender}{` – ${time}`}</>}
      />
    </ListItem>
  );
}

function Chat({roomId}: ChatProps) {
  const firestore = useFirestore();
  const messages = useMessages(roomId);
  const messageCount = messages && messages.length;
  const scrollableRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const {current} = scrollableRef;
    if (current) {
      // Scroll to the bottom
      current.scrollTop = current.scrollHeight;
    }
  }, [messageCount, roomId]);

  const onMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(event.target.value);
  };

  const onSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNewMessage('');
    await firestore.collection('rooms').doc(roomId).collection('messages').add({
      message: newMessage,
      senderName: 'Anonymous',
      createdAt: firebase.firestore.Timestamp.now(),
    });
  };

  if (!messages) {
    return <CircularProgress />;
  }
  const form = (
    <form onSubmit={onSendMessage}>
      <TextField
        placeholder="Type a new message"
        value={newMessage}
        onChange={onMessageChange}
        fullWidth
      />
    </form>
  );
  return (
    <ConversationArea bottom={form} scrollableRef={scrollableRef}>
      <List>
        {messages.map(message => <ChatMessage key={message.id} {...message} />)}
      </List>
    </ConversationArea>
  );
}

export default React.memo(Chat);