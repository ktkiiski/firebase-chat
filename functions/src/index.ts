import * as functions from 'firebase-functions';
import { initializeApp, firestore } from 'firebase-admin';

initializeApp();

export const onCreateMessage = functions.firestore
  .document('chats/{chatId}/messages/{messageId}')
  .onCreate((snap, context) => {
    const chatId: string = context.params.chatId;
    const db = firestore();
    const chatRef = db.collection('chats').doc(chatId);
    // Increase chat message count by one
    return db.runTransaction(async transaction => {
      const chat = await transaction.get(chatRef);
      const oldMessageCount = chat.get('messageCount') || 0;
      const newMessageCount = oldMessageCount + 1;
      return transaction.update(chatRef, {
        messageCount: newMessageCount,
      });
    });
  })
;

export const onCreateParticipant = functions.firestore
  .document('chats/{chatId}/participants/{userId}')
  .onCreate((snap, context) => {
    const chatId: string = context.params.chatId;
    const db = firestore();
    const chatRef = db.collection('chats').doc(chatId);
    // Increase chat message count by one
    return db.runTransaction(async transaction => {
      const chat = await transaction.get(chatRef);
      const oldParticipantCount = chat.get('participantCount') || 0;
      const newParticipantCount = oldParticipantCount + 1;
      return transaction.update(chatRef, {
        participantCount: newParticipantCount,
      });
    });
  })
;