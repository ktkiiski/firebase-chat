import * as functions from 'firebase-functions';
import { initializeApp, firestore } from 'firebase-admin';

initializeApp();

/**
 * When a chat message is created, increase the chat's
 * message count by one.
 */
export const onCreateChatMessage = functions.firestore
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

/**
 * When a chat participant is created, increase the chat's
 * participant count by one.
 */
export const onCreateChatParticipant = functions.firestore
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

/**
 * When a chat is deleted, delete all of its messages and participants.
 */
export const onDeleteChat = functions.firestore
  .document('chats/{chatId}')
  .onDelete((snap, context) => {
    const chatId: string = context.params.chatId;
    const db = firestore();
    const messagesRef = db.collection('chats').doc(chatId).collection('messages');
    const participantsRef = db.collection('chats').doc(chatId).collection('participants');
    const messagesDeletion = deleteCollection(db, messagesRef, 100);
    const participantsDeletion = deleteCollection(db, participantsRef, 100);
    return Promise.all([messagesDeletion, participantsDeletion]);
  })
;

/**
 * Deletes all the documents in the given collection,
 * effectively destroying the collection.
 *
 * @param db Firestore instance
 * @param collectionRef Reference to the collection to delete
 * @param batchSize How many documents to deleted in a single batch
 */
async function deleteCollection(db: firestore.Firestore, collectionRef: firestore.CollectionReference, batchSize: number) {
  while (true) {
    const query = collectionRef.orderBy('__name__').limit(batchSize);
    const snapshot = await query.get();
    if (!snapshot.size) {
      // Everything deleted
      break;
    }
    // Delete in batch
    const batch = db.batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  }
}
