import { db, auth } from './firebase';
import { collection, addDoc, query, where, orderBy, limit, onSnapshot, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

export interface HistoryItem {
  id: string;
  userId: string;
  toolId: string;
  toolName: string;
  timestamp: any;
  data: any;
  summary: string;
}

export const historyService = {
  subscribe(callback: (items: HistoryItem[]) => void) {
    const isFirebaseConfigured = auth.app.options.apiKey !== 'missing';
    const user = auth.currentUser;

    if (!isFirebaseConfigured || !user) {
      // Fallback to localStorage for local experience if firebase is missing or unauthenticated
      const localData = localStorage.getItem('local_history');
      if (localData) {
        try {
          callback(JSON.parse(localData));
        } catch (e) {
          callback([]);
        }
      } else {
        callback([]);
      }
      return () => {};
    }

    const q = query(
      collection(db, 'history'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as HistoryItem[];
      callback(items);
    }, (error) => {
      console.error("History sync error:", error);
      // Try local fallback on error
      const localData = localStorage.getItem('local_history');
      if (localData) {
        try {
          callback(JSON.parse(localData));
        } catch (e) {
          callback([]);
        }
      } else {
        callback([]);
      }
    });
  },

  async addToHistory(item: Omit<HistoryItem, 'id' | 'timestamp' | 'userId'>) {
    const isFirebaseConfigured = auth.app.options.apiKey !== 'missing';
    const user = auth.currentUser;

    // Always update local storage as a cache/fallback
    const localData = localStorage.getItem('local_history');
    let localItems: any[] = [];
    if (localData) {
      try { localItems = JSON.parse(localData); } catch (e) {}
    }
    const newItem = {
      ...item,
      id: Date.now().toString(),
      userId: user?.uid || 'local-user',
      timestamp: new Date().toISOString()
    };
    localItems = [newItem, ...localItems].slice(0, 50);
    localStorage.setItem('local_history', JSON.stringify(localItems));

    if (!isFirebaseConfigured || !user) return;

    try {
      await addDoc(collection(db, 'history'), {
        ...item,
        userId: user.uid,
        timestamp: serverTimestamp()
      });
    } catch (e) {
      console.error("Failed to add to history:", e);
    }
  },

  async deleteHistoryItem(id: string) {
    try {
      await deleteDoc(doc(db, 'history', id));
    } catch (e) {
      console.error("Failed to delete history item:", e);
    }
  },

  async clearHistory() {
    // Note: For real apps, batch deletion is better
    console.warn("clearHistory not fully implemented for Firestore in this demo.");
  },

  // Compatibility method
  getHistory(): HistoryItem[] {
    return [];
  }
};
