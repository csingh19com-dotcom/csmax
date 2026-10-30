import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Conversation, Message } from '../types';

const GUEST_CONVOS_KEY = 'moon_ai_guest_conversations';
const GUEST_MSGS_KEY = 'moon_ai_guest_messages';

// Helper for local guest storage
function getGuestConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(GUEST_CONVOS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveGuestConversations(convos: Conversation[]) {
  try {
    localStorage.setItem(GUEST_CONVOS_KEY, JSON.stringify(convos));
  } catch (err) {
    console.warn('Failed to save guest conversations to localStorage:', err);
  }
}

function getGuestMessagesMap(): Record<string, Message[]> {
  try {
    const raw = localStorage.getItem(GUEST_MSGS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveGuestMessagesMap(map: Record<string, Message[]>) {
  try {
    localStorage.setItem(GUEST_MSGS_KEY, JSON.stringify(map));
  } catch (err) {
    console.warn('Failed to save guest messages to localStorage:', err);
  }
}

export class ChatStorageService {
  /**
   * Load all conversations for either signed-in user or guest
   */
  static async getConversations(userId?: string | null): Promise<Conversation[]> {
    if (!userId || userId === 'guest_user') {
      const convos = getGuestConversations();
      return convos.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    }

    const path = `users/${userId}/conversations`;
    try {
      const collRef = collection(db, 'users', userId, 'conversations');
      const q = query(collRef, orderBy('updatedAt', 'desc'));
      const snapshot = await getDocs(q);
      const convos: Conversation[] = [];
      snapshot.forEach((docSnap) => {
        convos.push(docSnap.data() as Conversation);
      });
      return convos;
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  }

  /**
   * Create or save a new conversation
   */
  static async createConversation(
    conversation: Conversation,
    userId?: string | null
  ): Promise<Conversation> {
    if (!userId || userId === 'guest_user') {
      const convos = getGuestConversations();
      const updated = [conversation, ...convos.filter((c) => c.id !== conversation.id)];
      saveGuestConversations(updated);
      return conversation;
    }

    const path = `users/${userId}/conversations/${conversation.id}`;
    try {
      const docRef = doc(db, 'users', userId, 'conversations', conversation.id);
      await setDoc(docRef, conversation);
      return conversation;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  }

  /**
   * Update conversation title or model
   */
  static async updateConversation(
    conversationId: string,
    updates: Partial<Conversation>,
    userId?: string | null
  ): Promise<void> {
    const updatedAt = new Date().toISOString();

    if (!userId || userId === 'guest_user') {
      const convos = getGuestConversations();
      const updated = convos.map((c) =>
        c.id === conversationId ? { ...c, ...updates, updatedAt } : c
      );
      saveGuestConversations(updated);
      return;
    }

    const path = `users/${userId}/conversations/${conversationId}`;
    try {
      const docRef = doc(db, 'users', userId, 'conversations', conversationId);
      await updateDoc(docRef, { ...updates, updatedAt });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  }

  /**
   * Delete an entire conversation and all its messages
   */
  static async deleteConversation(
    conversationId: string,
    userId?: string | null
  ): Promise<void> {
    if (!userId || userId === 'guest_user') {
      const convos = getGuestConversations().filter((c) => c.id !== conversationId);
      saveGuestConversations(convos);

      const msgsMap = getGuestMessagesMap();
      delete msgsMap[conversationId];
      saveGuestMessagesMap(msgsMap);
      return;
    }

    const convPath = `users/${userId}/conversations/${conversationId}`;
    try {
      // First delete all messages in subcollection
      const msgsRef = collection(db, 'users', userId, 'conversations', conversationId, 'messages');
      const msgsSnap = await getDocs(msgsRef);
      const batch = writeBatch(db);
      msgsSnap.forEach((mDoc) => {
        batch.delete(mDoc.ref);
      });
      // Delete the conversation document
      const convRef = doc(db, 'users', userId, 'conversations', conversationId);
      batch.delete(convRef);
      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, convPath);
    }
  }

  /**
   * Load messages for a conversation
   */
  static async getMessages(
    conversationId: string,
    userId?: string | null
  ): Promise<Message[]> {
    if (!userId || userId === 'guest_user') {
      const map = getGuestMessagesMap();
      const list = map[conversationId] || [];
      return list.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }

    const path = `users/${userId}/conversations/${conversationId}/messages`;
    try {
      const msgsRef = collection(db, 'users', userId, 'conversations', conversationId, 'messages');
      const q = query(msgsRef, orderBy('createdAt', 'asc'));
      const snapshot = await getDocs(q);
      const messages: Message[] = [];
      snapshot.forEach((docSnap) => {
        messages.push(docSnap.data() as Message);
      });
      return messages;
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  }

  /**
   * Save a single message in a conversation
   */
  static async saveMessage(
    conversationId: string,
    message: Message,
    userId?: string | null
  ): Promise<Message> {
    if (!userId || userId === 'guest_user') {
      const map = getGuestMessagesMap();
      const currentList = map[conversationId] || [];
      const updatedList = [...currentList.filter((m) => m.id !== message.id), message];
      map[conversationId] = updatedList;
      saveGuestMessagesMap(map);

      // Update conversation updatedAt
      const convos = getGuestConversations();
      const updatedConvos = convos.map((c) =>
        c.id === conversationId ? { ...c, updatedAt: message.createdAt } : c
      );
      saveGuestConversations(updatedConvos);
      return message;
    }

    const path = `users/${userId}/conversations/${conversationId}/messages/${message.id}`;
    try {
      const msgRef = doc(db, 'users', userId, 'conversations', conversationId, 'messages', message.id);
      await setDoc(msgRef, message);

      // Also touch conversation's updatedAt
      const convRef = doc(db, 'users', userId, 'conversations', conversationId);
      await updateDoc(convRef, { updatedAt: message.createdAt });
      return message;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  }

  /**
   * Delete an individual message
   */
  static async deleteMessage(
    conversationId: string,
    messageId: string,
    userId?: string | null
  ): Promise<void> {
    if (!userId || userId === 'guest_user') {
      const map = getGuestMessagesMap();
      if (map[conversationId]) {
        map[conversationId] = map[conversationId].filter((m) => m.id !== messageId);
        saveGuestMessagesMap(map);
      }
      return;
    }

    const path = `users/${userId}/conversations/${conversationId}/messages/${messageId}`;
    try {
      const msgRef = doc(db, 'users', userId, 'conversations', conversationId, 'messages', messageId);
      await deleteDoc(msgRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  }

  /**
   * Update message content (e.g. prompt edit or regeneration)
   */
  static async updateMessage(
    conversationId: string,
    messageId: string,
    content: string,
    model?: string,
    userId?: string | null
  ): Promise<void> {
    if (!userId || userId === 'guest_user') {
      const map = getGuestMessagesMap();
      if (map[conversationId]) {
        map[conversationId] = map[conversationId].map((m) =>
          m.id === messageId ? { ...m, content, model: model || m.model } : m
        );
        saveGuestMessagesMap(map);
      }
      return;
    }

    const path = `users/${userId}/conversations/${conversationId}/messages/${messageId}`;
    try {
      const msgRef = doc(db, 'users', userId, 'conversations', conversationId, 'messages', messageId);
      const updateData: { content: string; model?: string } = { content };
      if (model) updateData.model = model;
      await updateDoc(msgRef, updateData);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  }

  /**
   * Clear all conversations
   */
  static async clearAllConversations(userId?: string | null): Promise<void> {
    if (!userId || userId === 'guest_user') {
      localStorage.removeItem(GUEST_CONVOS_KEY);
      localStorage.removeItem(GUEST_MSGS_KEY);
      return;
    }

    const path = `users/${userId}/conversations`;
    try {
      const collRef = collection(db, 'users', userId, 'conversations');
      const snapshot = await getDocs(collRef);
      for (const convDoc of snapshot.docs) {
        await this.deleteConversation(convDoc.id, userId);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  }

  /**
   * Check if guest has stored data available to import
   */
  static hasGuestData(): boolean {
    const convos = getGuestConversations();
    return convos.length > 0;
  }

  /**
   * Import guest conversations and messages to the authenticated user's account
   */
  static async importGuestData(userId: string, clearGuestAfter = false): Promise<number> {
    const guestConvos = getGuestConversations();
    const guestMsgs = getGuestMessagesMap();

    if (guestConvos.length === 0) return 0;

    let importedCount = 0;
    for (const convo of guestConvos) {
      const newConvo: Conversation = {
        ...convo,
        userId,
      };
      await this.createConversation(newConvo, userId);

      const msgs = guestMsgs[convo.id] || [];
      for (const msg of msgs) {
        const newMsg: Message = {
          ...msg,
          userId,
        };
        await this.saveMessage(convo.id, newMsg, userId);
      }
      importedCount++;
    }

    if (clearGuestAfter) {
      localStorage.removeItem(GUEST_CONVOS_KEY);
      localStorage.removeItem(GUEST_MSGS_KEY);
    }

    return importedCount;
  }

  /**
   * Export all conversations for current user or guest
   */
  static async exportData(
    userId?: string | null,
    format: 'json' | 'markdown' = 'json'
  ): Promise<string> {
    const convos = await this.getConversations(userId);
    const fullData: Array<{ conversation: Conversation; messages: Message[] }> = [];

    for (const c of convos) {
      const msgs = await this.getMessages(c.id, userId);
      fullData.push({ conversation: c, messages: msgs });
    }

    if (format === 'json') {
      return JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          appName: 'Moon AI',
          creator: 'Chandrashekhar Singh',
          conversationsCount: fullData.length,
          data: fullData,
        },
        null,
        2
      );
    }

    // Markdown export
    let md = `# Moon AI — Exported Conversations\n`;
    md += `Exported on: ${new Date().toLocaleString()}\n`;
    md += `App created by: Chandrashekhar Singh\n\n---\n\n`;

    for (const item of fullData) {
      md += `## ${item.conversation.title}\n`;
      md += `*Model:* ${item.conversation.model} | *Date:* ${new Date(item.conversation.createdAt).toLocaleString()}\n\n`;

      for (const m of item.messages) {
        const roleLabel = m.role === 'user' ? '👤 User' : '🌙 Moon AI';
        md += `### ${roleLabel} (${new Date(m.createdAt).toLocaleTimeString()})\n\n`;
        md += `${m.content}\n\n`;
      }
      md += `---\n\n`;
    }

    return md;
  }
}
