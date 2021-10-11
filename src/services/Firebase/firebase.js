import app from 'firebase';

import ball from '../../images/ball.png';

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
    var secondaryApp = app.initializeApp(config, "Secondary");

    /* Helper */

    this.serverValue = app.database.ServerValue;
    this.emailAuthProvider = app.auth.EmailAuthProvider;

    /* Firebase APIs */

    this.auth = app.auth();
    this.secondaryAuth = secondaryApp.auth();

    this.db = app.firestore();
    this.storage = app.storage();

    /* Social Sign In Method Provider */

    this.googleProvider = new app.auth.GoogleAuthProvider();
    this.facebookProvider = new app.auth.FacebookAuthProvider();
    this.twitterProvider = new app.auth.TwitterAuthProvider();
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignInWithGoogle = () =>
    this.auth.signInWithPopup(this.googleProvider);

  doSignInWithFacebook = () =>
    this.auth.signInWithPopup(this.facebookProvider);

  doSignInWithTwitter = () =>
    this.auth.signInWithPopup(this.twitterProvider);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doSendEmailVerification = () =>
    this.auth.currentUser.sendEmailVerification({
      url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
    });

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

  doSecondaryCreateUserWithEmailAndPassword = (email, password) =>
    this.secondaryAuth.createUserWithEmailAndPassword(email, password);


  // *** Merge Auth and DB User API *** //

  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.user(authUser.uid)
          .get()
          .then(doc => {

            if (doc.exists) {
              const dbUser = doc.data();

              // default empty roles
              if (!dbUser.roles) {
                dbUser.roles = {};
              }

              // merge auth and db user
              authUser = {
                uid: authUser.uid,
                email: authUser.email,
                emailVerified: authUser.emailVerified,
                providerData: authUser.providerData,
                ...dbUser,
              };

              next(authUser);
            } else {
              console.log("No Such User");
              fallback();
            }

          }).catch((error) => {
            console.log("Error: ", error);
            fallback();
          });
      } else {
        fallback();
      }
    });

  onWithoutAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        console.log(authUser)
        fallback(authUser);
      } else {
        next();
      }
    });

  // *** Thumballs API ***

  thumballs = () => this.db.collection(`thumball`);
  thumball = uid => this.db.collection(`thumball`).doc(`${uid}`);

  thumballmedias = () => this.db.collection(`thumball_media`);

  thumballmetas = () => this.db.collection(`thumball_meta`);

  // *** ThumbTracks API ***

  thumbtracks = () => this.db.collection(`thumbtrack`);
  thumbtrack = uid => this.db.collection(`thumbtrack`).doc(`${uid}`);

  // *** Pricing Tiers API ***

  pricingtiers = () => this.db.collection(`pricing_tier`);

  // *** Features API ***

  features = () => this.db.collection(`feature`);

  // *** User API ***

  usertypes = () => this.db.collection(`user_type`);

  user = uid => this.db.collection(`users`).doc(`${uid}`);
  users = () => this.db.collection('users');

  usermetas = () => this.db.collection(`usermeta`);

  usermeta = uid => this.db.collection(`usermeta`).doc(`${uid}`);

  // *** Organization Types API ***

  organizationtypes = () => this.db.collection(`organization_type`);

  // *** Account API ***

  accounts = () => this.db.collection(`account`);

  // *** Partner API ***

  partners = () => this.db.collection(`partner`);
  partner = uid => this.db.collection(`partner`).doc(`${uid}`);

  // *** App User API ***

  appusers = () => this.db.collection(`app_user`);
  appuser = uid => this.db.collection(`app_user`).doc(`${uid}`);

  // *** Category API ***

  categories = () => this.db.collection(`category`);

  // *** Group API ***

  group = uid => this.db.collection(`group`).doc(`${uid}`);
  groups = () => this.db.collection(`group`);

  // *** Customer API ***

  customer = uid => this.db.collection(`customer`).doc(`${uid}`);
  customers = () => this.db.collection(`customer`);

  // *** Editor API ***

  editor = uid => this.db.collection(`editor`).doc(`${uid}`);
  editors = () => this.db.collection(`editor`);

  // *** Promos API ***

  promo = uid => this.db.collection(`promo`).doc(`${uid}`);
  promos = () => this.db.collection(`promo`);

  // *** Message API ***

  message = uid => this.db.collection(`messages`).doc(`${uid}`);
  messages = () => this.db.collection('messages');

  addMessage = message => this.db.collection(`messages`).add(message);

  doUpload = (file, type) => {

    var ref = this.storage.ref();
    var uploadRef = ref.child(`${type}s/${file.name}`);

    return uploadRef.put(file);

  }

  doDownload = () => {
    var ref = this.storage.ref();
    ref.child(`images/Tulips.jpg`).getDownloadURL()
      .then((url) => {
        console.log("Download URL: ", url);
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = (event) => {
          var blob = xhr.response;
        };
        xhr.open('GET', url);
        xhr.send();
      })
      .catch((error) => {
        // Handle any errors
        console.log("File Download Error: ", error);
      });
  }

  getImageURL = () => {
    var ref = this.storage.ref();
    return ref.child(`images/Tulips.jpg`).getDownloadURL();
  }

  getImageList = () => {

    var listRef = this.storage.ref().child('images');
    return listRef.listAll();

  }
  getSoundList = () => {

    var listRef = this.storage.ref().child('audios');
    return listRef.listAll();

  }
  getVideoList = () => {

    var listRef = this.storage.ref().child('videos');
    return listRef.listAll();

  }

  getRef = () => {
    return this.storage.ref();
  }


}

export default Firebase;
