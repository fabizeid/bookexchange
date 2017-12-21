const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

 // Create and Deploy Your First Cloud Functions
 // https://firebase.google.com/docs/functions/write-firebase-functions


//https://github.com/firebase/functions-samples/blob/master/quickstarts/uppercase-firestore/functions/index.js

 exports.helloWorld = functions.https.onRequest((request, response) => {
     //debugger;
     response.send("Hello from Firebase!");
 });

exports.addUser = functions.auth.user().onCreate(event => {
    // ...
    console.log("user created "+ JSON.stringify(event));
    // const user = event.data;
    // const email = user.email; // The email of the user.
    // const displayName = user.displayName; // The display name of the user.
    // const uid = user.uid;
    const original = 'nnnn';
    
    return admin.firestore().collection('messages').add({original: original}).
	then(writeResult => {
	    // Send back a message that we've succesfully written the message
	    //res.json({result: `Message with ID: ${writeResult.id} added.`});
	    console.log('Added to DB '+ writeResult);
	}).catch(function(error) {
		   console.error("Error sign in: ", error);
	});
});

exports.deleteUser = functions.auth.user().onDelete(event => {
    // ...
    console.log("user removed "+ JSON.stringify(event));
    // const user = event.data;
    // const email = user.email; // The email of the user.
    // const displayName = user.displayName; // The display name of the user.
    // const uid = user.uid;
});
