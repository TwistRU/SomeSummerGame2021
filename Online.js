function ConnectToFireBase(firebaseConfig) {
    console.log(firebaseConfig);
    firebase.initializeApp(firebaseConfig);
    console.log("Connected to Firebase Realtime Database");
}