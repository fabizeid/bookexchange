<template>
  <div class="books">
      <table class="table table-striped">
      <thead>
        <tr>
          <th>Title</th>
          <th v-on:click="addBook()">Author</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in booksFB" :key="book.key">
	  <td v-on:click="removeBook(book)">{{book.key}}</td>
          <td><a v-bind:href="book.url">{{book.title}}</a></td>
          <td>{{book.author}}</td> 
        </tr>
	</tr>
      </tbody>
    </table>
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
firebase.initializeApp(config);
var db = firebase.firestore();

var componentData = {
	  booksFB: []
    };

export default {
  name: 'Books',
  data () {
      return componentData;
  },
  
   methods: {
      addBook: function () {
	  db.collection("books").add({
	      title: "Tokyo",
	      author: "Japan",
	      url: "www"
	  })
	      .then(function(docRef) {
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
       }
   }
}


/*info on how to bind snapshot to vue, following code is for realtime db, 
       need to convert to firestore:
       https://github.com/vuejs/vuefire/blob/master/src/vuefire.js*/


/*
<div v-for="(value, key, index) in object">
  {{ index }}. {{ key }}: {{ value }}
</div>*/

//Can't use maps with id here since map changes are not observable (not triggered with v-for)
db.collection("books")
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
/**
 * Find the index for an object with given key.
 *
 * @param {array} array
 * @param {string} key
 * @return {number}
 */
function indexForKey (array, key) {
  for (var i = 0; i < array.length; i++) {
    if (array[i].key === key) {
      return i
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
