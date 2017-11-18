<template>
  <!--<div class="library">-->
  <b-container>
    <div v-if="computedSignedIn">
    <b-row>
      <b-col class="my-5" v-if="false">
        <h3>Add New Books</h3>
        <b-form id="form"  inline v-on:submit.prevent="addBook">
	  <b-form-group id="bookTitle" label="Title:" horizontal label-for="bookTitle">
	    <b-form-input type="text" v-model="newBook.title"></b-form-input>
	  </b-form-group>
	  <b-form-group label="Author:" horizontal label-for="bookAuthor">
	    <b-form-input type="text" id="bookAuthor" v-model="newBook.author"></b-form-input>
	  </b-form-group>
	  <b-form-group label="Url:" horizontal label-for="bookUrl">
	    <b-form-input type="text" id="bookUrl" v-model="newBook.url"></b-form-input>
	  </b-form-group>
	  <b-button class="mt-2" type="submit">Add Book</b-button>
        </b-form>
      </b-col>
      <div class="w-100"></div>
    <b-col class="mt-5">

      <h1 id="bookTitle">Book List</h1>
      <b-form-input class="w-50 my-2 ml-auto" v-model="filter" placeholder="Type to Search" />
      <b-table class="table-fixed"
	       :items="booksFB" 
	       :fields="fields"
	       :filter="filter"
	       ></b-table>
      <div v-if="!booksFB.length" style="position:absolute;top:50%;left:50%"> 
	<i  class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
	<br/>
	<a>Loading...</a>
      </div>
    </b-col>
    </b-row>
    </div>
  </b-container>
</template>

<script>
/*Should import vue before componentData otherwise for
 for some reason data will not be reactive
*/
import Vue from 'vue'
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import PerfectScrollbar from 'perfect-scrollbar';

var db = null;
let uid = null;
var componentData = {
    signInMessage: 'Login',
    signedIn: false, 
    booksFB: [],
    filter: null,
    fields: [
	{
	    key: 'title',
	    label: 'Title',
	    class: 'col-6'
	},
	{
	    key: 'author',
	    label: 'Author',
	    sortable: true,
	    class: 'col-6'
	}
    ],
    newBook: {
          title: '',
          author: '',
          url: 'http://'
    }
};


console.log('recv');
if (window.bus === undefined) {
    window.bus = new Vue();
}

window.bus.$once('firebaseInit', function (firebase) {
  // ...
    console.log('firebase init',firebase);
    db = firebase.firestore();
    firebase.auth().onAuthStateChanged(authStateChanged);
});


export default {
  name: 'library',
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
       }
   },
    computed: {
	//Needed to make sure scrollbar is added after
	//DOM inside the v-if is created
	computedSignedIn: function(){
	    this.$nextTick(function () {
	    // Code that will run only after the
	    // entire view has been rendered
		if (this.signedIn){
		    //https://github.com/utatti/perfect-scrollbar
		    var ps = new PerfectScrollbar('table tbody');
		}
	    })
	    return this.signedIn;
	}
    },
    mounted(){
	//this.$nextTick(function () {
	    // Code that will run only after the
	    // entire view has been rendered
	//    console.log('mounter next tick');
	//})
	//console.log('add class');
	//debugger;
	//document.getElementById("div1")
	//document.querySelector(".b-table tbody").className += " otherclass";
	//var ps = new PerfectScrollbar('table tbody');
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



function authStateChanged(user) {
    if (user) {
        // User is signed in.
        let displayName = user.displayName.split(" ", 1)[0];	
        let email = user.email;
        let emailVerified = user.emailVerified;
        let photoURL = user.photoURL;
        let isAnonymous = user.isAnonymous;
        uid = user.uid;
        let providerData = user.providerData;
	componentData.signInMessage = displayName;
	componentData.signedIn = true;
	if(!unsubscribe) unsubscribe = loadDb();
	console.log(" state changed signed in 2");
    } else {
        // User is signed out.
	if (unsubscribe) {
	    unsubscribe();
	    unsubscribe = null
	}
	componentData.booksFB = [];
	componentData.signInMessage = 'Login';
	componentData.signedIn = false;
	uid = null;
	console.log(" state changed signed out 2");
    }
};


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
    console.log(element);
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

<!-- Scoped style did not affect table
   following style is needed to have a scrollable table with fixed header
  PS: don't forget to adjust the col class for the fields
  Essentially by changing the display to block and using the col classes
  for the items, we are not using a table anymore but bootstrap grids-->

<style>
.table-fixed {
    width: 100%;
}
.table-fixed tbody {
  height: 200px;
  width: 100%;
  position: relative; /*needed by scroller*/
}

.table-fixed thead, .table-fixed tbody , .table-fixed tr, .table-fixed td, .table-fixed th{
  display: block;
}

.table-fixed tbody td {
  float: left;
}
 .table-fixed thead > tr> th {
     float:left;
}

</style>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* force input to be within parent's bounds */
    form input {
        max-width: 100%;
	/*background-color: yellow;*/
    } 

#bookTitle {
    -ms-transform: rotate(20deg); /* IE 9 */
    -webkit-transform: rotate(20deg); /* Safari */
    transform: rotate(20deg); /* Standard syntax */
    font-family: "Tangerine";
    font-weight: 600;
    text-shadow: 4px 4px 4px #aaa;
    width: fit-content;
}

</style>

