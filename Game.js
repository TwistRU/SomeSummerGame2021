const firebaseConfig = {
    apiKey: "AIzaSyDoZXL6nZvJPvMQu8dqkOgPa-CJRj30Gm0",
    authDomain: "somesummergame.firebaseapp.com",
    databaseURL: "https://somesummergame-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "somesummergame",
    storageBucket: "somesummergame.appspot.com",
    messagingSenderId: "953371868702",
    appId: "1:953371868702:web:a583ded33b0148b383780f",
    measurementId: "G-88LQ32G6JL"
};

function StartUp() {
    ConnectToFireBase(firebaseConfig)
    console.log("Startup completed");
    return firebase.database()
}

function Main() {
    let database = StartUp();
    console.log(database.ref().set(123));
    console.log(database.ref().get().then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
        }
    }).catch((error) => {
        console.error(error);
    }))
}

Main();