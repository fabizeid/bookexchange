<template>
  <b-nav-item v-b-toggle="'nav_collapse'"class="ml-md-auto" v-on:click="toggleSignIn()">
    <icon v-bind:name = "signedIn? 'sign-in': 'sign-out'" aria-hidden="true"></icon><a class="align-middle">{{signInMessage}}</a>
  </b-nav-item>
</template>

<script>

import 'vue-awesome/icons/sign-in'
import 'vue-awesome/icons/sign-out'

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAVZsubeql5nwSz5vq4CkqUcrT0FOXN-YY",
    authDomain: "bookexchange-beirut.firebaseapp.com",
    projectId: "bookexchange-beirut"
};

const firebase = require("firebase/app");
// Required for side-effects
require("firebase/firestore");
require("firebase/auth");
firebase.initializeApp(config);
const firestore = firebase.firestore();
const settings = {timestampsInSnapshots: true};
firestore.settings(settings);

var componentData = {
    signInMessage: 'Login',
    signedIn: false
};

export default {
  name: 'FireAuthen',
    data () {
	componentData.rootData = this.$root.$data;
	return componentData;
  },
    created: function(){
	this.$root.$data.firebase = firebase;
    },
   methods: {
       toggleSignIn: function() {
	   /*https://github.com/firebase/quickstart-js/blob/master/auth/google-popup.html*/
	   if (!firebase.auth().currentUser) {
	       /*Sign in*/
	       let provider = new firebase.auth.GoogleAuthProvider();
	       firebase.auth().signInWithPopup(provider).then(function(result) {
	       }).catch(function(error) {
		   console.error("Error sign in: ", error);
	       });
	   } else {
	       /*Sign Out*/
	       firebase.auth().signOut().then(function() {
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


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        let displayName = user.displayName.split(" ", 1)[0];
        let email = user.email;
        let emailVerified = user.emailVerified;
        let photoURL = user.photoURL;
        let isAnonymous = user.isAnonymous;
        componentData.rootData.uid = user.uid;
        componentData.rootData.name = user.displayName;
        componentData.rootData.email = user.email;
        let providerData = user.providerData;
	componentData.signInMessage = displayName;
	componentData.signedIn = true;
	componentData.rootData.signedIn = true;
	console.log(" state changed signed in");
    } else {
	componentData.signInMessage = 'Login';
	componentData.signedIn = false;
	componentData.rootData.signedIn = false;
	componentData.rootData.uid = null;
        componentData.rootData.name = '';
        componentData.rootData.email= '';
	console.log(" state changed signed out");
    }
});



</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
