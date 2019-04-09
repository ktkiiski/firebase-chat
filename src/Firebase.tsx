// tslint:disable:no-import-side-effect
import React, { useState, useEffect, useContext } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export const FirebaseContext = React.createContext<firebase.app.App | null>(null);

export function useFirebase() {
  const value = useContext(FirebaseContext);
  if (!value) {
    throw new Error(`Firebase not provided!`);
  }
  return value;
}

export function useFirestore() {
  return useFirebase().firestore();
}

export function useAuth() {
  return useFirebase().auth();
}

export function useCollection<T>(ref: firebase.firestore.Query, deps: any[]) {
  const [items, setItems] = useState<T[] | null>(null);
  useEffect(() => {
    ref.onSnapshot((snapshot) => {
      const newItems = snapshot.docs.map((doc) => {
        const item: unknown = { id: doc.id, ...doc.data() };
        return item as T;
      });
      setItems(newItems)
    });
  }, deps);
  return items;
}

export interface AuthState {
  id: string;
  displayName: string | null;
  photoUrl: string | null;
}

export function useAuthState() {
  const auth = useAuth();
  const [authState, setAuthState] = useState(undefined as AuthState | null | undefined);
  useEffect(() => (
    auth.onAuthStateChanged((user) => {
      setAuthState(user && {
        id: user.uid,
        displayName: user.displayName,
        photoUrl: user.photoURL,
      });
    })
  ), [])
  return authState;
}

export function FirebaseProvider(props: {children?: React.ReactNode}) {
  const [app, setApp] = useState<null | firebase.app.App>(null);
  useEffect(() => {
    loadApp().then(setApp);
  }, []);
  if (!app) {
    return <div>Loading Firebase configuration…</div>;
  }
  return <FirebaseContext.Provider value={app}>
    {props.children}
  </FirebaseContext.Provider>
}

async function loadApp() {
  const response = await fetch('/__/firebase/init.json');
  if (!response.ok) {
    throw response;
  }
  const config = await response.json();
  return firebase.initializeApp(config);
}
