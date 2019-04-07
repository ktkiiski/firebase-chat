import React, { useState, useEffect, useRef } from 'react';
import { CircularProgress, List, ListItem, ListItemText, TextField } from '@material-ui/core';
import { useFirestore } from './Firebase';
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
  const [messages, setMessages] = useState<Message[] | null>(null);
  useEffect(() => {
    firestore
      .collection('rooms')
      .doc(roomId)
      .collection('messages')
      .orderBy('createdAt')
      .onSnapshot((snapshot) => {
        const newMessages = snapshot.docs.map((doc) => {
          const message = { id: doc.id, ...doc.data() };
          return message as Message;
        });
        setMessages(newMessages)
      })
    ;
  }, [roomId]);
  return messages;
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
        {messages.map(message => (
          <ListItem key={message.id}>
            <ListItemText
              primary={message.message}
              secondary={`${message.createdAt.toDate()} – ${message.senderName}`}
            />
          </ListItem>
        ))}
      </List>
    </ConversationArea>
  );
}

export default React.memo(Chat);