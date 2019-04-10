import React, { useEffect, useRef, useMemo } from 'react';
import { CircularProgress, List, ListItem, ListItemText, ListItemAvatar, Typography } from '@material-ui/core';
import { useFirestore, useCollection, useAuthState } from './Firebase';
import firebase from 'firebase/app';
import VerticalSplit from './VerticalSplit';
import ProfileAvatar from './ProfileAvatar';
import Composition from './Composition';
import Padder from './Padder';

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
  chatId: string;
}

function useMessages(chatId: string) {
  const firestore = useFirestore();
  return useCollection<Message>(
    firestore
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('createdAt'),
    [chatId],
  );
}

function useParticipants(chatId: string) {
  const firestore = useFirestore();
  return useCollection<Message>(
    firestore
      .collection('chats')
      .doc(chatId)
      .collection('participants')
      .orderBy('displayName'),
    [chatId],
  );
}

function ChatMessage(props: {message: string, sender?: Participant, createdAt: firebase.firestore.Timestamp}) {
  const {sender, message, createdAt} = props;
  const now = useMemo(() => new Date(), []);
  const date = createdAt && createdAt.toDate() || now;
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

function Chat({chatId}: ChatProps) {
  const firestore = useFirestore();
  const messages = useMessages(chatId);
  const participants = useParticipants(chatId);
  const authState = useAuthState();
  const messageCount = messages && messages.length;
  const scrollableRef = useRef<HTMLDivElement>(null);
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
  }, [messageCount, chatId]);

  const onSendMessage = async (newMessage: string) => {
    if (!authState) {
      throw new Error('Not logged in!');
    }
    const batch = firestore.batch();
    const createdAt = firebase.firestore.FieldValue.serverTimestamp();
    batch.set(
      firestore.collection('chats').doc(chatId).collection('messages').doc(),
      {
        message: newMessage,
        senderId: authState.id,
        createdAt,
      },
    );
    batch.set(
      firestore.collection('chats').doc(chatId).collection('participants').doc(authState.id),
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
  const form = authState ? <Composition onSendMessage={onSendMessage} /> : null;
  const messageList = messages.length ? (
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
  ) : (
    <Padder padding={4}>
      <Typography color='textSecondary'>
        Start chatting by typing your message below!
      </Typography>
    </Padder>
  );
  return (
    <VerticalSplit bottom={form} scrollableRef={scrollableRef}>
    {messageList}
    </VerticalSplit>
  );
}

export default React.memo(Chat);