<!-- https://www.goodreads.com/search?q=mark+twain -->
<!-- Check logs of functions for filtering/searching -->
<template>
  <div v-if="rootData.signedIn" class="library container">
    <div class="boxedTable">
      <h2 id="bookTitle">Book List</h2>
	<b-row @click.stop class="mb-3 align-items-center"> <!-- style="white-space: nowrap" class="d-flex" -->
	  <b-col sm="6">
	    <b-form-input v-model="filter" placeholder="Search author or title" />
	  </b-col>
	  <b-col class="py-2" >
	  <!-- <a>{{data.field.label}}</a> -->
	  <!-- size="sm" class="mh-100" float-right -->
	  <b-dropdown   id="ddown1" text="Filter" >
	      <b-form-checkbox v-model="allSelected"
	  		       :indeterminate="indeterminate"
	  		       aria-describedby="genre"
	  		       aria-controls="genre"
  		       class="ml-3"
	  		       @change="toggleAll"
	  		       >
	  	{{ allSelected ? 'Un-select' : 'Select' }}
	  	All
	      </b-form-checkbox>
	      <b-dropdown-divider class="mt-0" ></b-dropdown-divider>
	      <b-form-checkbox-group id="availability"
	  			   stacked
	  			   v-model="selected"
	  			   name="availability"
	  			   :options="availability"
	  			   class="ml-3"
	  			   aria-label="availability"
	  			   ></b-form-checkbox-group>
	      <b-dropdown-divider class="mt-0" ></b-dropdown-divider>
	      <b-form-checkbox-group id="genre"
	  			   stacked
	  			   v-model="selected"
	  			   name="genre"
	  			   :options="genre"
	  			   class="ml-3"
	  			   aria-label="Book Genre"
	  			   ></b-form-checkbox-group>
	  </b-dropdown>
	  </b-col>
	  <b-col class="py-2 text-nowrap text-right">
	  <a>Sort by:</a>
	  <b-form-select id="selectbg" class="p-0" style="height: auto; width: 5rem;" v-model="sortSelected" :options="sortOptions">
	  </b-form-select>
	  </b-col>
	</b-row>
	<table class="table">
	  <tbody>
            <template v-for="(book, index) in filteredBooks">
	    <tr :key="book.key">
              <td>
		<a class="booktitle" >
		  {{book.title}}
		</a>
		<br>
		<a>by {{book.author}}</a>
	      </td>
              <td class="text-right">
		<small>
		  <strong class="text-nowrap">Available on:</strong> 11/04/17
		</small>
		<br>
                <a v-if="pendingRes[book.key]" href="#" @click.prevent="showModal(book,'unreserve')" size="sm">
		  Pending
		</a>
                <a v-else href="#" @click.prevent="showModal(book,'reserve')" size="sm">
		  Reserve
		</a>
	      </td>
            </tr>
	      <tr>
		<td colspan="2" style="border-top-width: 0; padding: 0;">
		  <div style="padding: .75rem;">
		    <truncate class="truncate" clamp=" Read more" :length="400" less="Read less" text=
		    "Mark Twain’s brilliant 19th-century novel has long been recognized as one of the finest examples of American literature. It brings back the irrepressible and free-spirited Huck, first introduced in The Adventures of Tom Sawyer, and puts him center stage. Rich in authentic dialect, folksy humor, and sharp social commentary, Twain’s classic tale follows Huck and the runaway. It brings back the irrepressible and free-spirited Huck, first introduced in The Adventures of Tom Sawyer, and puts him center stage. Rich in authentic dialect, folksy humor, and sharp" />
		    <router-link to="/book/1230974">more info</router-link>
		    <br><small><strong>Added on: </strong>{{book.createdDate}}</small>
		    <br><small><strong>Added by: </strong>{{book.ownerName}}</small>
	      	  </div> <!-- b-collapse -->
		</td>
	      </tr>
	    </template>
	  </tbody>
	</table>
	<div v-if="loading" style="position:absolute;top:80%;left:50%">
	  <icon name="spinner" scale="3" pulse/> <!-- class="fa-fw" -->
	  <br/>
	  <a>Loading...</a>
	</div>
    </div>

	<b-modal ref="reserveModal" @ok="reserveBook()">
	  <pre>

       Reserve book
         "{{selectedBook.title}}" by {{selectedBook.author}}?
	  </pre>
	</b-modal>

	<b-modal ref="unreserveModal" @ok="unreserveBook()">
	  <pre>
        Cancel reservation of
           "{{selectedBook.title}}" by {{selectedBook.author}}?
	  </pre>
	</b-modal>


  </div>
</template>

<script>

import 'vue-awesome/icons/spinner'
import truncate from 'vue-truncate-collapsed';


let reactiveData = {

    booksFB: [],
    pendingRes: {},
    filter: null,
    selected: [],
    allSelected: false,
    indeterminate: false,
    sortSelected: 'Default',
    loading: false,
    selectedBook: {}
};

let nonreactiveData = {
    genre: ['Biography/Memoir', 'Art/Photograhy',
	      'History', 'Romance', 'Fiction'],
    availability: ['Available','Reserved'],
    sortOptions: ['Default','Title','Author']
    }
let unsubscribe = null;
export default {
    name: 'Library',
    components: { truncate },
    data () {
	reactiveData.rootData = this.$root.$data;
	return reactiveData;
    },
    methods: {
	logme(m) {
	    console.log(m);
	},
	showModal(book,type){
	    this.selectedBook = book;
            if (type == "reserve")
	        this.$refs.reserveModal.show()
            else if (type == "unreserve")
                this.$refs.unreserveModal.show()
	},
        reserveBook(){
            let db = this.rootData.firebase.firestore();
            let book = this.selectedBook;
            self = this;
            db.collection("pendingResrv")
                .add({borrowerID: this.rootData.uid,
                      bookID: book.key,
                      ownerID: book.ownerID})
                .then(function() {
                    //self.pendingRes[key] = true;
                    self.$set(self.pendingRes,book.key,true);
                    console.log("Reservation successfully updated!");
                })
                .catch(function(error) {
                    // The document probably doesn't exist.
                    console.error("Error updating reservation: ", error);
                });

        },
        unreserveBook(){
            let db = this.rootData.firebase.firestore();
            let book = this.selectedBook;
            let key = book.key;
            self = this;
            db.collection("pendingResrv")
                .where("borrowerID","==",this.rootData.uid)
                .where("bookID","==",key)
                .where("ownerID","==",book.ownerID)
                .get()
     	        .then(function(querySnapshot) {
	            querySnapshot.forEach(function(doc) {
                        doc.ref.delete()
                            .then(function() {
                                self.pendingRes[key] = false;
                                console.log("Cancelled reservation successfully!");
                            })
                            .catch(function(error) {
                                console.error("Error cancelling reservation: ", error);
                            });
                    })
                })
        },
	toggleAll (checked) {
	    this.selected = checked ?
		this.genre.slice().concat(this.availability.slice()) : []
	},
	filterFunc (item){
	    let test = true;
	    if(this.filter) {
		let regex = new RegExp('.*' + this.filter + '.*', 'ig');
		let itemSearchStr=[item["author"],item["title"]].join(' ');
		test = regex.test(itemSearchStr);
		regex.lastIndex = 0;
		}
	    if(this.selected.length) {
		test = test & (this.selected.indexOf(item["type"]) !== -1);
	    }
	    return test;
	    //debugger;
	    //console.log(i,this.filter);
	    //console.log(i,this.selected);
	}
    },
    computed: {
	filteredBooks (){
	    let orderBy = require('lodash.orderby');
	    let self = this;
	    let filteredBooks = self.booksFB.filter(self.filterFunc);
            if (self.sortSelected != 'Default') {
		console.log(self.sortSelected);
		filteredBooks = orderBy(filteredBooks,[user => user[self.sortSelected.toLowerCase()].toLowerCase()]);

	    }
	    return filteredBooks;
	}
    },
    watch: {
	selected (newVal, oldVal) {
	    // Handle changes in individual flavour checkboxes
	    if (newVal.length === 0) {
		this.indeterminate = false
		this.allSelected = false
	    } else if (newVal.length === this.genre.length) {
		this.indeterminate = false
		this.allSelected = true
	    } else {
		this.indeterminate = true
		this.allSelected = false
	    }
	},
	'rootData.signedIn': function (signedIn) {
	    if(signedIn) {
		// User is signed in.
		if(!unsubscribe) unsubscribe =
		    loadDb(this);
	    } else {
		// User is signed out.
		if (unsubscribe) {
		    unsubscribe();
		    unsubscribe = null
		}
		reactiveData.booksFB = [];
	    }
	    console.log(" watch signed in "+ signedIn);
	}
    },
    created: function(){
	console.log("Library created");

        //Set non reactive Data
        Object.assign(this, nonreactiveData);
        /*will only be called once when created, for subsequent
         signins we use the watch*/

	if (this.rootData.signedIn)
	    unsubscribe =
	    loadDb(this);
    }

} //export


/*consider init app in window.onload if will be manipulating DOM
 see: https://stackoverflow.com/questions/20180251/when-to-use-window-onload
 window.onload = function() {
      initApp();
    };
//validation: https://vuejs.org/v2/examples/firebase.html
*/


function loadDb (vm) {
    let db = vm.rootData.firebase.firestore();
    let uid = vm.rootData.uid;
    reactiveData.loading = true;
    db.collection("pendingResrv").where("borrowerID", "==", uid)
     	.get()
     	.then(function(querySnapshot) {
	    querySnapshot.forEach(function(doc) {
		let dt = doc.data();
		//reactiveData.pendingRes[dt.bookID] = true;
                vm.$set(vm.pendingRes,dt.bookID,true);
            });
     	})
     	.catch(function(error) {
            console.error("Error getting pending reserv: ", error);
     	});

    return db.collection("books")
	.onSnapshot(function(snapshot) {
            snapshot.docChanges.forEach(function(change) {
		let dt = change.doc.data();
		let key = change.doc.id;
		dt.key = key;
                dt.createdDate = new Date(dt.createdTime).toLocaleDateString();
		if (change.type === "added") {
		    reactiveData.booksFB.push(dt);
                    console.log("New: ", key);
		} else {
		    let index = indexForKey (reactiveData.booksFB, key);
		    if (change.type === "modified") {
			/*Can't use indexing as Vue will not trigger*/
			reactiveData.booksFB.splice(index,1,dt);
			console.log("Modified : ", key);
		    } else {
			if (change.type === "removed") {
			    reactiveData.booksFB.splice(index,1 );
			    console.log("Removed: ", key);
			}
		    }

		}
            });
	    reactiveData.loading = false;
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

<style>

#ddown1{
    font-weight: initial;
}
#ddown1__BV_toggle_ {
    background-color: transparent;
    color: black;
    padding: .8rem .2rem;
    /*line-height: 1;*/
    font-weight: bold;
    padding-bottom: 2px;
    border: 0px;
    padding-top: 0rem;


}

/* a:{ */
/*     text-decoration: none; */
/* } */

/* a:hover { */
/*     text-decoration: underline; */
/*     color: #333333; */
/* } */

a:any-link {
  text-decoration: underline;
  cursor: auto;
}

/* WebKit browsers */
a:-webkit-any-link {
  text-decoration: underline;
  cursor: auto;
}

#selectbg {
    /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#cdd6db+0,cdd6db+49,afbdc6+51,dee7ed+100 */
background: rgb(205,214,219); /* Old browsers */
background: -moz-linear-gradient(top, rgba(205,214,219,1) 0%, rgba(205,214,219,1) 49%, rgba(175,189,198,1) 51%, rgba(222,231,237,1) 100%); /* FF3.6-15 */
background: -webkit-linear-gradient(top, rgba(205,214,219,1) 0%,rgba(205,214,219,1) 49%,rgba(175,189,198,1) 51%,rgba(222,231,237,1) 100%); /* Chrome10-25,Safari5.1-6 */
background: linear-gradient(to bottom, rgba(205,214,219,1) 0%,rgba(205,214,219,1) 49%,rgba(175,189,198,1) 51%,rgba(222,231,237,1) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#cdd6db', endColorstr='#dee7ed',GradientType=0 ); /* IE6-9 */
}

</style>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
