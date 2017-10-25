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
              <td class="editable" :data-f-key="book.key" data-f-field="author">{{book.author}}</td>
              <td>
		<span class="fa fa-trash" aria-hidden="true" v-on:click="removeBook(book)"></span>
		<span class="fa fa-pencil" aria-hidden="true" onclick="editMe(this)"></span> 
	      </td>
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
let uid = null;
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
	  /*since ownerID was added here, it will not be reactive
	  this is ok since we don't need it to trigger*/
	  self.newBook.ownerID = uid;
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
        uid = user.uid;
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
	    unsubscribe = null
	}
	componentData.booksFB = [];
	componentData.signInMessage = 'Sign In';
	componentData.displayName = 'Hello';
	componentData.signedIn = false;
	uid = null;
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


/*
To use persistent variables I could use closures 
or properties as described in
https://stackoverflow.com/questions/1535631/static-variables-in-javascript


Defining in global space (window members) so that it could be found by onclick event. 
Did not use v-on click since I don't want vue to make the editable 
variable reactive. Also could not add an event listener on all rows
of table since table is dynamic.
*/
function editMe(element) {
    /*taverse tree sidewase and assign to all siblings with editable attribute*/
    //.classList.remove("form-control");
    let rowElms = element.parentElement.parentElement.querySelectorAll(".editable");
    let currentElem;
    for (let i=0 ; i < rowElms.length;i++) {
	currentElem = rowElms[i]; 
	currentElem.classList.add("form-control");
	currentElem.setAttribute("contenteditable", "true");
	currentElem.addEventListener("keydown", validate);
	currentElem.setAttribute("data-beirut-oldvalue",currentElem.innerText);
    }
}
window.editMe = editMe;

function validate(e) {

    let k = e.keyCode;
    if (k === 13 || k === 27){
	let element = e.target;
	e.preventDefault();
	if(k === 13) {
	    let docKey = element.getAttribute("data-f-key");
	    let fieldName = element.getAttribute("data-f-field");
	    console.log(docKey,fieldName);
	    db.collection("books").doc(docKey).set(
		{[fieldName]: element.innerText}, { merge: true }).then(function() {
		    console.log("Document successfully set!");
		}).catch(function(error) {
		  console.error("Error setting document: ", error);
		});
	} else { //k  === 27
	    element.innerText = element.getAttribute("data-beirut-oldvalue");
	}
	element.removeEventListener("keydown", validate);
	element.setAttribute("contenteditable", "false");
	element.classList.remove("form-control");
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
