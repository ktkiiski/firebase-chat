import React, { useState, useEffect, useRef } from 'react';
import { CircularProgress, List, ListItem, ListItemText, ListItemAvatar, TextField } from '@material-ui/core';
import { useFirestore, useCollection, useAuthState } from './Firebase';
import firebase from 'firebase';
import ConversationArea from './ConversationArea';
import ProfileAvatar from './ProfileAvatar';

interface Message {
  id: string;
  message: string;
  senderId: string;
  createdAt: firebase.firestore.Timestamp;
}

interface Participant {
  id: string;
  displayName?: string | null;
  photoUrl?: string | null;
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

function useParticipants(roomId: string) {
  const firestore = useFirestore();
  return useCollection<Message>(
    firestore
      .collection('rooms')
      .doc(roomId)
      .collection('participants')
      .orderBy('displayName'),
    [roomId],
  );
}

function ChatMessage(props: {message: string, sender?: Participant, createdAt: firebase.firestore.Timestamp}) {
  const {sender, message, createdAt} = props;
  const date = createdAt.toDate();
  const time = `${date.getHours()}:${date.getMinutes()}`
  const senderName = sender && sender.displayName || '';
  return (
    <ListItem>
      <ListItemAvatar>
        <ProfileAvatar user={sender || {}} />
      </ListItemAvatar>
      <ListItemText
        primary={message}
        secondary={<><strong>{senderName}</strong>{` – ${time}`}</>}
      />
    </ListItem>
  );
}

function Chat({roomId}: ChatProps) {
  const firestore = useFirestore();
  const messages = useMessages(roomId);
  const participants = useParticipants(roomId);
  const authState = useAuthState();
  const messageCount = messages && messages.length;
  const scrollableRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState('');
  const participantsById: Record<string, Participant> = {};

  if (participants) {
    for (const participant of participants) {
      participantsById[participant.id] = participant;
    }
  }

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
    if (!authState) {
      throw new Error('Not logged in!');
    }
    setNewMessage('');
    const batch = firestore.batch();
    const createdAt = firebase.firestore.Timestamp.now();
    batch.set(
      firestore.collection('rooms').doc(roomId).collection('messages').doc(),
      {
        message: newMessage,
        senderId: authState.id,
        createdAt,
      },
    );
    batch.set(
      firestore.collection('rooms').doc(roomId).collection('participants').doc(authState.id),
      {
        displayName: authState.displayName,
        photoUrl: authState.photoUrl,
        createdAt,
      },
    );
    await batch.commit();
  };

  if (!messages) {
    return <CircularProgress />;
  }
  const form = authState ? (
    <form onSubmit={onSendMessage}>
      <TextField
        placeholder="Type a new message"
        value={newMessage}
        onChange={onMessageChange}
        fullWidth
      />
    </form>
  ) : null;
  return (
    <ConversationArea bottom={form} scrollableRef={scrollableRef}>
      <List>
        {messages.map(message => {
          const sender = participantsById[message.senderId];
          return <ChatMessage
            key={message.id}
            message={message.message}
            sender={sender}
            createdAt={message.createdAt}
          />;
        })}
      </List>
    </ConversationArea>
  );
}

export default React.memo(Chat);