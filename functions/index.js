//  // Create and Deploy Your First Cloud Functions
//  // https://firebase.google.com/docs/functions/write-firebase-functions
//  //https://github.com/firebase/functions-samples/blob/master/quickstarts/uppercase-firestore/functions/index.js
//  exports.helloWorld = functions.https.onRequest((request, response) => {
//      response.send("Hello from Firebase!");
//  });

const functions = require('firebase-functions');
const admin = require('firebase-admin');


/***********************************************************************
 If running from local server we need to give priviledge to that server,
 in order to allow access to firebase. For more details:
 https://firebase.google.com/docs/admin/setup
 might be a bug:
https://stackoverflow.com/questions/44766536/how-do-you-setup-local-environment-variables-for-cloud-functions-for-firebase
***********************************************************************/
//adminsdk.json generated as described in setup
//file should not be saved publicly
const certFile = './adminsdk.json';

try {
    const serviceAccount = require(certFile); 
    console.log('local server');
    admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://bookexchange-beirut.firebaseio.com'
    });
}
/***********************************************************************
  For deployement we don't need the above, since it will be deployed in
  a privileged server.
***********************************************************************/
// certFile not found, which means we are deployed
catch(e) {
    admin.initializeApp(functions.config().firebase);
}
/***********************************************************************/

// To test cd function, npm start, then:
// addUser({email: 'foo@bar.com', displayName: 'foobar', uid: 'uid1'})
exports.addUser = functions.auth.user().onCreate(event => {
    const user = event.data;
    return admin.firestore().collection('users')
	.doc(user.uid).set({email: user.email,
			   name: user.displayName
			  })
	.then(writeResult => {
	   // console.log('Added user to DB '+ writeResult);
	})
	.catch(function(error) {
	    console.error("Error creating user record: ", error);
	});
});

exports.deleteUser = functions.auth.user().onDelete(event => {
    const user = event.data;
    return admin.firestore().collection('users')
	.doc(user.uid).delete().then(function() {
	    //console.log("Document successfully deleted!");
	}).catch(function(error) {
	    console.error("Error removing document: ", error);
	});    
});

//createBook({title: 'foo@'}, {params: {bookId: 'aaa'}})
exports.createBook = functions.firestore
  .document('books/{bookId}')
    .onCreate(event => {
      return event.data.ref.set({
          //https://stackoverflow.com/questions/47270773/how-to-get-current-user-id-in-firebase-cloud-functions-with-firestore-trigger
          createdTime: event.data.createTime
      }, {merge: true});
  });
