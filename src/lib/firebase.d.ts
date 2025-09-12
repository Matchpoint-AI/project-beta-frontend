import { FirebaseApp } from 'firebase/app';
import { Auth, User } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
export declare const useAuthentication: () => {
  app: FirebaseApp | undefined;
  auth: Auth | undefined;
  db: Firestore | undefined;
  user: User | null | undefined;
};
