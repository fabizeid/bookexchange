<template>
  <b-button size="sm" v-on:click="toggleSignIn()" class="ml-auto">
    <!-- <i class="fa" v-bind:class="{ 'fa-sign-in': !signedIn , 'fa-sign-out': signedIn }" aria-hidden="true"> -->
    <!-- </i> --> 

    <i v-bind:class="{ 'icon-sign-in': !signedIn , 'icon-sign-out': signedIn }" aria-hidden="true"></i> 
    {{signInMessage}}
  </b-button>
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


console.log('emit');
import Vue from 'vue'
if (window.bus === undefined) {
    window.bus = new Vue();
}
window.bus.$emit('firebaseInit',firebase);

let uid = null;
var componentData = {
    signInMessage: 'Login',
    signedIn: false
};

export default {  
  name: 'FireAuthen',
  data () {
      return componentData;
  },
  
   methods: {
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


firebase.auth().onAuthStateChanged(function(user) {
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
	console.log(" state changed signed in");
    } else {
	componentData.signInMessage = 'Login';
	componentData.signedIn = false;
	uid = null;
	console.log(" state changed signed out");
    }
});



</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@font-face {
  font-family: 'icomoon';
  src:  url('../assets/fonts/icomoon.eot?lvelkq');
  src:  url('../assets/fonts/icomoon.eot?lvelkq#iefix') format('embedded-opentype'),
    url('../assets/fonts/icomoon.ttf?lvelkq') format('truetype'),
    url('../assets/fonts/icomoon.woff?lvelkq') format('woff'),
    url('../assets/fonts/icomoon.svg?lvelkq#icomoon') format('svg');
  font-weight: normal;
  font-style: normal;
}

i {
  /* use !important to prevent issues with browser extensions that change fonts */
  font-family: 'icomoon' !important;
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;

  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-sign-out:before {
  content: "\e901";
}
.icon-sign-in:before {
  content: "\e900";
}

</style>
