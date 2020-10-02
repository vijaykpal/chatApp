import * as firebase from 'firebase';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBkmkA65fyowgxCzoOtEpCcLmRyz7pEBiY",
    authDomain: "chatapp-65830.firebaseapp.com",
    databaseURL: "https://chatapp-65830.firebaseio.com",
    projectId: "chatapp-65830",
    storageBucket: "chatapp-65830.appspot.com",
    messagingSenderId: "528047315658",
    appId: "1:528047315658:web:9a56cf610026038b2b7233"
  };

const initFirebase = () => {
    if(firebase.apps.length === 0){
        firebase.initializeApp(firebaseConfig)
        firebase.firestore().settings({ experimentalForceLongPolling: true });
      }
}

const createDb = () => {
    return firebase.firestore();;
}

export {
    initFirebase,
    createDb,
}