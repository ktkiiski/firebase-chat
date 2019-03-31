import React, { useState, useEffect } from 'react';
import { CircularProgress, List, ListItem, ListItemText, TextField } from '@material-ui/core';
import { request } from './api';

interface Message {
  id: string;
  message: string;
  senderName: string;
  createdAt: string;
}

interface ChatProps {
  roomId: string;
}

function Chat({roomId}: ChatProps) {
    const [messages, setMessages] = useState<Message[] | null>(null);
    const [newMessage, setNewMessage] = useState('');
    async function fetchMessages() {
      const result = await request<Message[]>('GET', `/api/rooms/${roomId}/messages`);
      setMessages(result);
    }
    useEffect(() => {
      fetchMessages();
    }, [roomId]);

    const onMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewMessage(event.target.value);
    };

    const onSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setNewMessage('');
      const message = await request<Message>('POST', `/api/rooms/${roomId}/messages`, {
        senderName: 'Anonymous', message: newMessage,
      });
      setMessages(messages && messages.concat([message]));
    };

    if (!messages) {
      return <CircularProgress />;
    }
    return (
      <List>
        {messages.map(message => (
          <ListItem key={message.id}>
            <ListItemText primary={message.message} secondary={message.senderName} />
          </ListItem>
        ))}
        <form onSubmit={onSendMessage}>
          <TextField
            placeholder="Type a new message"
            value={newMessage}
            onChange={onMessageChange}
            fullWidth
          />
        </form>
      </List>
    );
}

export default React.memo(Chat);