import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, User } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export const useAuthentication = () => {
  const [app, setApp] = useState<FirebaseApp | undefined>();
  const [auth, setAuth] = useState<Auth | undefined>();
  const [db, setDb] = useState<Firestore | undefined>();
  const [user, setUser] = useState<User | null>();

  const firebaseConfig = {
    apiKey: 'AIzaSyD5py7LKDwgqD3eWT8aqbz5nLrdAN_nkQE',
    authDomain: 'project-beta-407300.firebaseapp.com',
    projectId: 'project-beta-407300',
    storageBucket: 'project-beta-407300.appspot.com',
    messagingSenderId: '228605374820',
    appId: '1:228605374820:web:eafa82421da1a679bbca71',
  };

  useEffect(() => {
    const fbApp = initializeApp(firebaseConfig);
    const authObj = getAuth(fbApp);
    const userObj = authObj.currentUser;
    const dbApp = getFirestore(fbApp);
    setUser(userObj);
    setApp(fbApp);
    setDb(dbApp);
    setAuth(authObj);
  }, []);

  return { app, auth, db, user };
};
