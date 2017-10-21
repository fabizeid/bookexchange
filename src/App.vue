<template>
  <div id="app" class="container">
    <div class="page-header">
      <h1>Beirut Book Exchange</h1>
    </div>

    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title">{{displayName}}</h3>
      </div>
      <div class="panel-body">
	<button type="button" class="btn btn-secondary" v-on:click="toggleSignIn()">{{signInMessage}}</button>
      </div>
    </div>
    <div class="panel panel-default" v-if="!signedIn">
      <div class="panel-heading">
        <h3 class="panel-title">Intro</h3>
      </div>
      <div class="panel-body">
	<a>Welcome to Beirut Book Exchange</a>
	<a>Please sign in</a>
      </div>
    </div>
    <div v-if="signedIn">
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title">Add New Books</h3>
      </div>
      <div class="panel-body">
         <form id="form" class="form-inline" v-on:submit.prevent="addBook">
          <div class="form-group">
            <label for="bookTitle">Title:</label>
            <input type="text" id="bookTitle" class="form-control" v-model="newBook.title">
          </div>
          <div class="form-group">
            <label for="bookAuthor">Author:</label>
            <input type="text" id="bookAuthor" class="form-control" v-model="newBook.author">
          </div>
          <div class="form-group">
            <label for="bookUrl">Url:</label>
            <input type="text" id="bookUrl" class="form-control" v-model="newBook.url">
          </div>
          <input type="submit" class="btn btn-primary" value="Add Book">
        </form>
      </div>
    </div>
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title">Book List</h3>
      </div>
      <div class="panel-body">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in booksFB" :key="book.key">
              <td><a v-bind:href="book.url">{{book.title}}</a></td>
              <td>{{book.author}}</td>
              <td><span class="fa fa-trash" aria-hidden="true" v-on:click="removeBook(book)"></span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </div>
  </div>
</template>
<script>

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAVZsubeql5nwSz5vq4CkqUcrT0FOXN-YY",
    authDomain: "bookexchange-beirut.firebaseapp.com",
    projectId: "bookexchange-beirut"
};

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
require("firebase/auth");
firebase.initializeApp(config);
var db = firebase.firestore();

var componentData = {
    signInMessage: 'Sign',
    signedIn: false, 
    displayName: 'Hello',
    booksFB: [],
    newBook: {
          title: '',
          author: '',
          url: 'http://'
    }
};

export default {
  name: 'app',
  data () {
      return componentData;
  },
  
   methods: {
      addBook: function () {
	  let self = this;	  
	  db.collection("books").add(self.newBook)
	      .then(function(docRef) {
		  self.newBook.title = '';
		  self.newBook.author = '';
		  self.newBook.url = 'http://';
		  console.log("Document written with ID: ", docRef.id);
	      })
	      .catch(function(error) {
		  console.error("Error adding document: ", error);
	      });
      },
       removeBook: function (book) {
	   db.collection("books").doc(book.key).delete().then(function() {
	       console.log("Document successfully deleted!");
	   }).catch(function(error) {
	       console.error("Error removing document: ", error);
	   });
       },
       toggleSignIn: function() {
	   /*https://github.com/firebase/quickstart-js/blob/master/auth/google-popup.html*/
	   if (!firebase.auth().currentUser) {
	       /*Sign in*/
	       let provider = new firebase.auth.GoogleAuthProvider();
	       firebase.auth().signInWithPopup(provider).then(function(result) {		   
		   console.log("sign in: ", result);
	       }).catch(function(error) {
		   console.error("Error sign in: ", error);
	       }); 
	   } else {
	       /*Sign Out*/
	       firebase.auth().signOut().then(function() {
		   console.log("signed out");
	       }).catch(function(error) {
		   console.error("Error sign out: ", error);
	       });
	   }
       }
   }
}


/*consider init app in window.onload if will be manipulating DOM 
 see: https://stackoverflow.com/questions/20180251/when-to-use-window-onload
 window.onload = function() {
      initApp();
    };
//validation: https://vuejs.org/v2/examples/firebase.html
*/

var unsubscribe = null;

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        let displayName = user.displayName;
        let email = user.email;
        let emailVerified = user.emailVerified;
        let photoURL = user.photoURL;
        let isAnonymous = user.isAnonymous;
        let uid = user.uid;
        let providerData = user.providerData;
	componentData.signInMessage = 'Sign Out';
	componentData.displayName = 'Hello ' + displayName;
	componentData.signedIn = true;
	if(!unsubscribe) unsubscribe = loadDb();
	console.log(" state changed signed in");
    } else {
        // User is signed out.
	if (unsubscribe) {
	    unsubscribe();
	    componentData.booksFB = [];
	    unsubscribe = null
	}
	componentData.signInMessage = 'Sign In';
	componentData.displayName = 'Hello';
	componentData.signedIn = false;
	console.log(" state changed signed out");
    }
});


function loadDb () {
return db.collection("books")
    .onSnapshot(function(snapshot) {
        snapshot.docChanges.forEach(function(change) {
	    let dt = change.doc.data();
	    let key = change.doc.id;

	    dt.key = key;
            if (change.type === "added") {
		componentData.booksFB.push(dt);
                console.log("New: ", key);
            } else {
		let index = indexForKey (componentData.booksFB, key);
		if (change.type === "modified") {
		    /*Can't use indexing as Vue will not trigger*/
		    componentData.booksFB.splice(index,1,dt);
                    console.log("Modified : ", key);
		} else {
		    if (change.type === "removed") {
			componentData.booksFB.splice(index,1 );
			console.log("Removed: ", key);
		    }
		}

	    }
        });
    });
}
/**
 * Find the index for an object with given key.
 *
 * @param {array} array
 * @param {string} key
 * @return {number}
 */
function indexForKey (array, key) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].key === key) {
      return i
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
