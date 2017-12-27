<!-- https://www.goodreads.com/search?q=mark+twain -->
<template>
  <div class="profile container">
   <div class="boxedTable">
    <h2 id="bookTitle">Books I borrowed</h2>
	<table class="table">
	  <tbody>
            <template v-for="(book, index) in reservedBooks"> <!-- :key="book.key" -->
	    <tr>
              <td>
		<!-- stop.prevent added to avoid scrolling to top after collapsing -->
		<a v-on:click.stop.prevent="toggleCollapse('titleProf-'+index)" href="#" class="booktitle" >
		  {{book.title}}
		</a>
		<br>
		<a>by {{book.author}}</a>
	      </td>
              <td class="text-right">
		<small>
		  <strong class="text-nowrap">Return by:</strong> 11/04/17
		</small>
		<br><a href="#" @click.prevent="showModal(index)" class="text-right" size="sm">
		  Extend
		</a>
	      </td>
            </tr>
	      <tr>
		<td colspan="2" style="border-top-width: 0; padding: 0;">
		  <b-collapse :id="'titleProf-'+index" style="padding: .75rem;">

		    <p>Mark Twain’s brilliant 19th-century novel has long been recognized as one of the finest examples of American literature. It brings back the irrepressible and free-spirited Huck, first introduced in The Adventures of Tom Sawyer, and puts him center stage. Rich in authentic dialect, folksy humor, and sharp social commentary, Twain’s classic tale follows Huck and the runaway</p>
		    <router-link to="/book/1230974">more info</router-link>
		    <br><small><strong>Added on: </strong> 11/04/14</small>
		    <br><small><strong>Added by: </strong> johnb</small>
	      	  </b-collapse>
		</td>
	      </tr>
	    </template>
	  </tbody>
	</table>
   </div>

	<b-modal ref="reserveModal">
	  <pre>

  Hello,
  To extend "{{reservedBooks[reserveId].title}}"
  please contact: "{{reservedBooks[reserveId].author}}"

	  </pre>
	</b-modal>

   <div class="boxedTable">
      <h2 id="bookTitle">Books I own</h2>
	<table class="table">
	  <tbody>
            <template v-for="(book, index) in myBooks"> <!-- :key="book.key" -->
	      <tr>
		<td>
                  <div>
		    <a class="booktitle myinput" data-f-field="title" :data-f-index="index">{{book.title}}</a>
                  </div>
		  <div>
		    by <a class="myinput" data-f-field="author" :data-f-index="index">{{book.author}}</a>
                  </div>
                  <div>
                    <small ><strong class="text-nowrap">Borrowed by:</strong><a class="text-nowrap">John Murphy</a></small>                    
                  </div>
		</td>
		<td class="text-right">
		  <div>
		    <small ><strong class="text-nowrap">Available on:</strong>12/08/17</small>
		    <!-- <datepicker v-model="time" v-on:input="logme('datepicked')" -->
		    <!--     	input-class="form-control form-control-sm datepickerInput" -->
		    <!--     	calendar-class="datepickerCalendar" -->
		    <!--     	class="d-inline-block align-middle" -->
		    <!--     	></datepicker> -->
                    
		  </div>
		  <div>
		    <!-- stop.prevent added to avoid scrolling to top after collapsing -->
                    <a href="#" @click.prevent>Extend</a>
                    <a v-b-tooltip.hover title="Edit entry" href="#" @click.prevent="toggleEdit(index,false)">
		      <icon name="pencil"/></a>
		    <a v-b-tooltip.hover title="Delete entry" href="#" @click.prevent = "showConfirmModal(index)">
		      <icon name="trash"/></a>
		  </div>
		</td>
              </tr>
	      <tr>
		<td colspan="2" style="border-top-width: 0; padding: 0;">
		  <b-collapse :id="'add-'+index" @show="makeEdit('add-'+index,index)"
			      v-on:hidden="removeEdit('add-'+index,index)"  style="padding: .75rem;">

		    <!-- <b-form-textarea id="textarea1" -->
		    <!-- 		     v-model="description" -->
		    <!-- 		     placeholder="Enter something" -->
		    <!-- 		     rows="6" -->
		    <!-- 		     max-rows="6"></b-form-textarea> -->
		    <textarea id="textarea1" class="form-control"
		    		     placeholder="Enter something"
		    		     rows="6"
		    		     max-rows="6">{{description}}</textarea>

		    <div class="text-right mb-3">
		      <b-button  size="sm" @click.prevent="toggleEdit(index,false)">Cancel</b-button>
		      <b-button  size="sm" @click.prevent="toggleEdit(index,true)" variant="primary">Save</b-button>
		    </div>
	      	  </b-collapse>
		</td>
	      </tr>
	    </template>
	    <tr>
	      <td></td>
	      <td>
		<a v-b-tooltip.hover title="Add new book" href="#"
		   @click.prevent="toggleCollapse('add-end')" class="float-right" size="sm">
		  <icon name="plus"/></a>
	      </td>
	    </tr>
	    <tr>
		<td colspan="2" style="border-top-width: 0; padding: 0;">
		  <b-collapse :id="'add-end'"  style="padding: .75rem;">
		    <b-form-input type="text" v-model.trim="newBook.title" placeholder="Title"/>
		    <b-form-input type="text" v-model.trim="newBook.author" placeholder="Author"/>
		    <textarea id="textarea1" class="form-control"
		    		     placeholder="Enter something"
		    		     rows="6"
		    		     max-rows="6">{{description}}</textarea>


		    <div class="text-right mb-3">
		      <b-button  size="sm" @click.prevent="toggleCollapse('add-end')">Cancel</b-button>
		      <b-button  size="sm" @click.prevent="addBook('add-end')" variant="primary">Add</b-button>
		    </div>
	      	  </b-collapse>
		</td>
	      </tr>
	  </tbody>
	</table>
	<div v-if="loading" style="position:absolute;top:50%;left:50%">
	  <icon name="spinner" scale="3" pulse/> <!-- class="fa-fw" -->
	  <br/>
	  <a>Loading...</a>
	</div>

  	<b-modal v-if="myBooks.length" ref="confirmModal" @ok="removeBook(myBookId)">
  	  <pre>

   Are you sure you want to delete:
   {{myBookId}}
   <!-- The following statement was introducing bugs in emacs indentation -->
  <!-- "{{(myBookId>myBooks.length-1)?'undef':myBooks[myBookId].title}}" -->

  	  </pre>
  	</b-modal>
   </div>
  </div>
</template>

<script>

import 'vue-awesome/icons/trash'
import 'vue-awesome/icons/pencil'
import 'vue-awesome/icons/plus'
import 'vue-awesome/icons/spinner'
// https://github.com/charliekassel/vuejs-datepicker
import Datepicker from 'vuejs-datepicker';

var componentData = {

    reservedBooks: [{ title: 'The box', author: 'John', type: 'Fiction',status: 'checked out'},
		{ title: 'Hello'  , author: 'Jane', type: 'Fiction',status: 'checked out'},
		{ title: 'The box of shiva fsdf fsdf fdsf ', author: 'Paul', type: 'Fiction',status: 'checked out'},
		      { title: 'The box', author: 'Kate', type: 'Fiction',status: 'checked out'}],
    myBooks:[],
    oldBookInfo:[],
    newBook: {title: '',
              author: '',
              type: '' ,
              ownerID: '',
              ownerName: '',
              reserved: false},
      description: "Mark Twain’s brilliant 19th-century novel has long been recognized as one of the finest examples of American literature. It brings back the irrepressible and free-spirited Huck, first introduced in The Adventures of Tom Sawyer, and puts him center stage. Rich in authentic dialect, folksy humor, and sharp social commentary, Twain’s classic tale follows Huck and the runaway",
      availableDate:"2017-11-07",
      time: new Date(),
      fields: [
	  {
	      key: 'title',
	      label: 'Title',
	  },
	  {
	      key: 'author',
	      label: 'Author',
	      sortable: true,
	  },
	  {
	      key: 'type',
	      label: 'Type',
	      sortable: true,
	  },
	  {
	      key: 'status',
	      label: 'Status',
	      sortable: true,
	  }
      ],

      genre: ['Biography/Memoir', 'Art/Photograhy',
	      'History', 'Romance', 'Fiction'],
      selected: [],
      allSelected: false,
      indeterminate: false,
      sortSelected: 'Default',
      sortOptions: ['Default','Title','Author'],
      reserveId: 0,
      myBookId: 0,
      loading: false
  };


export default {
    name: 'Profile',
    components: {
	Datepicker
    },
    data () {
	componentData.rootData = this.$root.$data;
	return componentData;
    },
    methods: {
	logme(m) {
	    console.log(m);
	},
	showConfirmModal(mid){
	    this.myBookId = mid;
	    this.$refs.confirmModal.show()
	    },
	showModal(mid){
	    this.reserveId = mid;
	    this.$refs.reserveModal.show()
	},
	makeEdit(mid,id){
	    let el = document.getElementById(mid); //current element
	    //get all elements with class myinput in prevous tr element
	    //could not use closest function yet since it is experimental
	    let inputEls =el.parentElement.parentElement.previousElementSibling.querySelectorAll(".myinput");
	    let currentElem;
	    for (let i=0; i< inputEls.length; i++){
		currentElem = inputEls[i];
		currentElem.setAttribute("contenteditable",true);
		currentElem.setAttribute("data-f-oldvalue",currentElem.innerHTML);
		//currentElem.addEventListener("input", validate);
	    }
	    this.backupBook(id);

	},
	removeEdit(mid,id){
	    let el = document.getElementById(mid);
	    let inputEls =el.parentElement.parentElement.previousElementSibling.querySelectorAll(".myinput");
	    let clickedSave = this.clickedSave;
	    for (let i=0; i< inputEls.length; i++){
		let element = inputEls[i];
		element.removeAttribute("contenteditable");
		if(clickedSave){
		    let fieldName = element.getAttribute("data-f-field");
		    let index = Number(element.getAttribute("data-f-index"));
		    this.myBooks[index][fieldName] = element.innerHTML;
		} else {
		    element.innerHTML = element.getAttribute("data-f-oldvalue");
		}

		element.removeAttribute("data-f-oldvalue");
	    }

	    if(clickedSave){
               let db = this.rootData.firebase.firestore();
               let key = this.myBooks[id].key;
               let self = this;
               db.collection("books").doc(key).update({
                   title: self.myBooks[id].title,
                   author: self.myBooks[id].author
                }).then(function() {
                  console.log("Document successfully updated!");
                 })
                 .catch(function(error) {
                     // The document probably doesn't exist.
                   console.error("Error updating document: ", error);
               });

            }
            else //revert remaining non special elements
	     {
		 this.restoreBook(id);
	     }
	    this.clickedSave = false;
	},
	backupBook(id){
	    //this.copyBook(this.myBooks[id],this.oldBookInfo[id]);
	    this.oldBookInfo[id] = Object.assign({}, this.myBooks[id]);
	},
	restoreBook(id){
	    // doing manually since Object.assign({}) overwrote reactive listeners
	    //this.myBooks[id] = Object.assign({},this.oldBookInfo[id]);
	    let to = this.myBooks[id];
	    let from = this.oldBookInfo[id];

	    //Title and author are special case and restored differently
	    //to.title = from.title ;
	    //to.author = from.author ;
	    to.type = from.type ;

	},
	toggleCollapse(mid){
	    this.$root.$emit("bv::toggle::collapse",mid);
	},
        toggleEdit(bid,save){
            if(save){ // Update Book
               this.clickedSave = true;
            }
	    else{
		this.clickedSave = false;
            }
	    this.toggleCollapse('add-'+ bid);
	},
	addBook(mid){
	    //Add new book
	    let db = this.rootData.firebase.firestore();
	    this.newBook.ownerID = this.rootData.uid;
            this.newBook.ownerName = this.rootData.name;
	    // Add to reactive array
	    this.myBooks.push(Object.assign({},this.newBook));
	    this.toggleCollapse(mid);
	    let self = this;

	    // Add to DB
	    db.collection("books").add(this.newBook)
		.then(function(docRef) {
		    self.myBooks[self.myBooks.length-1].key = docRef.id;
		    console.log("Document written with ID: ", docRef.id);
	      })
	      .catch(function(error) {
		  console.error("Error adding document: ", error);
	      });
	    this.newBook.title = '';
	    this.newBook.author= '';
	},
	removeBook: function (bid) {

	    let db = this.rootData.firebase.firestore();
	    let key = this.myBooks[bid].key;
	    //remove from reactive variable
	    this.myBooks.splice(bid,1);
	    //remove from DB
	    db.collection("books").doc(key).delete().then(function() {
		console.log("Document successfully deleted!");
	    }).catch(function(error) {
		console.error("Error removing document: ", error);
	    });

	}

    },
    watch: {
	'rootData.signedIn': function (signedIn) {
	    if(signedIn) {
		// User is signed in.
		loadDb(this.rootData.firebase.firestore(),
		       this.rootData.uid);
	    } else {
		if (this.$router.currentRoute.name == 'profile')
		    this.$router.go(-1); //go back to previous page
		componentData.myBooks = [];
	    }
	    console.log(" profile signed in "+ signedIn);
	}

    },
    created: function(){
	console.log("Profile created");
	/*will only be called once when created, for subsequent
         signins we use the watch*/
	if (this.rootData.signedIn)
	    loadDb(this.rootData.firebase.firestore(),
		   this.rootData.uid);
    }
}

function loadDb (db,uid) {
    componentData.loading = true;
    db.collection("books").where("ownerID", "==", uid)
     	.get()
     	.then(function(querySnapshot) {
	    querySnapshot.forEach(function(doc) {
		let dt = doc.data();
		let key = doc.id;
		dt.key = key;
		componentData.myBooks.push(dt);
            });
	    componentData.loading = false;
     	})
     	.catch(function(error) {
            console.error("Error getting documents: ", error);
     	});

}

</script>

<style>
a:any-link {
  text-decoration: underline;
  cursor: auto;
}

/* WebKit browsers */
a:-webkit-any-link {
  text-decoration: underline;
  cursor: auto;
}
.datepickerInput {
  width: 6rem;
  padding: 0rem .25rem;
}

.datepickerCalendar{
    right:0px;
}
</style>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
