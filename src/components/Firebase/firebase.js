import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.database();
  }
  // AUTH api
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);
  // Merge AUTH and REALTIME DB api
  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.userRef(authUser.uid)
          .once('value')
          .then(snapshot => {
            const dbUser = snapshot.val();
            // Merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              ...dbUser
            };

            next(authUser);
          });
      } else {
        fallback();
      }
    });

  // REALTIME DATABASE api
  userRef = uid => this.db.ref(`users/${uid}`);
  // Not using, only for admin role and showing all users
  // users = () => this.db.ref('users');

  // *** Pantry API ***
  // message = uid => this.db.ref(`messages/${uid}`);
  // messages = () => this.db.ref('messages');
  pantry = uid => this.db.ref(`pantry/${uid}`);
  pantryItems = () => this.db.ref('pantry');
  // pantryItems = () => this.db.ref('pantry').orderByChild('item');
}

export default Firebase;
