import React, { useState, useEffect, useContext } from 'react';
import firebase from 'firebase/app';
// tslint:disable-next-line:no-import-side-effect
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
