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

/*
createBook({title: 'foo@',author:'ds',genre:'ds',descr:'ds',link:'ff',hide:false},
           {params: {bookId: '9kRZYjyCBawVIEyKTPrS'}})
*/
/*Could also do this from client:
var updateTimestamp = docRef.update({
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });*/
//Important: acording to doc firestore functions are not guaranteed yet,
// they could happen several times or not at all
// see: https://firebase.google.com/docs/firestore/extend-with-functions#limitations_and_guarantees
exports.createBook = functions.firestore
  .document('books/{bookId}')
    .onCreate(event => {
        let bookId = event.params.bookId;
        let db = admin.firestore();
        let batch = db.batch();
        let newData = event.data.data();
        batch.update(event.data.ref,{
          //https://stackoverflow.com/questions/47270773/how-to-get-current-user-id-in-firebase-cloud-functions-with-firestore-trigger
          createdTime: event.data.createTime
        });
        batch.set(db.collection("publicBooks").doc(bookId),
                  {title: newData.title,
                   author: newData.author,
                   genre: newData.genre,
                   descr: newData.descr,
                   link: newData.link,
                   hide: newData.hide,
                   createdTime: event.data.createTime});
        return batch.commit();
  });
/*
updateBook({before:{},after:{title: 'foo@',author:'ds',genre:'ds',descr:'ds',link:'ff',hide:false}},
           {params: {bookId: 'XnH4SnCzz8T5uIEvrku0'}})
*/

exports.updateBook = functions.firestore
  .document('books/{bookId}')
    .onUpdate(event => {
        let bookId = event.params.bookId;
        let db = admin.firestore();
        let newData = event.data.data();
        return db.collection("publicBooks").doc(bookId).update({
            title: newData.title,
            author: newData.author,
            genre: newData.genre,
            descr: newData.descr,
            link: newData.link,
            hide: newData.hide
        });
    });
/*
deleteBook({},{params: {bookId: '9kRZYjyCBawVIEyKTPrS'}})
*/
exports.deleteBook = functions.firestore
  .document('books/{bookId}')
    .onDelete(event => {
        let bookId = event.params.bookId;
        let db = admin.firestore();
        return db.collection("publicBooks").doc(bookId).delete();
    });

/*
createChatroom({title: 'foo@'},{params: {userId: 'Kxfns4MCMChr8UIOx6QLoQIU7RN2',roomId: 'Kxfns4MCMChr8UIOx6QLoQIU7RN2'}})
*/

exports.createChatroom = functions.firestore
  .document('users/{userId}/chatrooms/{roomId}')
    .onCreate(event => {
        let roomId = event.params.roomId;
        let db = admin.firestore();
        return db.collection("users").doc(roomId).get()
            .then(function(doc){
                let dt = doc.data();
                event.data.ref.update(dt);
            });
    });
