<!-- https://www.goodreads.com/search?q=mark+twain -->
<template>
  <div class="profile container">
   <div class="boxedTable">
     <h2 id="bookTitle">Books I borrowed</h2>
     <h5 style="padding: 1rem" v-if="reservedBooks.length == 0">None yet</h5>
     <table v-else class="table">
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
		  <strong class="text-nowrap">Due: </strong>{{book.dueDate}}
		</small>
	      </td>
            </tr>
	      <tr>
		<td colspan="2" style="border-top-width: 0; padding: 0;">
		  <b-collapse :id="'titleProf-'+index" style="padding: .75rem;">
                    <p style="white-space: pre-wrap">{{book.descr}}</p>
                    <a v-if="book.link" :href="book.link" target="_blank">more info</a>
		    <span v-if="book.genre"><br><small><strong>Genre: </strong>{{book.genre}}</small></span>
		    <br><small><strong>Added on: </strong>{{book.createdDate}}</small>
		    <br><small><strong>Added by: </strong>{{book.ownerName}}</small>
	      	  </b-collapse>
		</td>
	      </tr>
	    </template>
	  </tbody>
	</table>
   </div>
   <div class="boxedTable">
      <h2 id="bookTitle">Books I own</h2>
	<table class="table">
	  <tbody>
            <template v-for="(book, index) in myBooks"> <!-- :key="book.key" -->
              <tr>
                <td colspan="2">
                  <div class="d-even-flex">
                  <a v-if="book.borrowerID" href="#" @click.prevent= "showModal(book,'returnModal')">Return</a>
                  <a v-else-if="hasBorrowRequest(book)" href="#" @click.prevent= "showModal(book,'lendModal')">Lend</a>
                    <a v-b-tooltip.hover :title="book.hide?'Show':'Hide'" href="#" @click.prevent="showModal(book,'hideBookModal')">
		      <icon :name="book.hide?'eye-slash':'eye'"/></a>
                    <a v-b-tooltip.hover title="Edit entry" href="#" @click.prevent="toggleEdit(index,false)">
		      <icon name="pencil"/></a>
		    <a v-b-tooltip.hover title="Delete entry" href="#" @click.prevent = "showModal(book,'deleteModal')">
		      <icon name="trash"/></a>
                    </div>
                </td>
              </tr>

	      <tr>
		<td style="border-top-width: 0; padding: 0;">
                  <div>
		    <a class="booktitle myinput" data-f-field="title" :data-f-index="index">{{book.title}}</a>
                  </div>
		  <div>
		    by <a class="myinput" data-f-field="author" :data-f-index="index">{{book.author}}</a>
                  </div>
                  <div v-if="book.borrowerID">
                    <small ><strong class="text-nowrap">Borrowed by: </strong><a class="text-nowrap">{{book.borrowerName}}</a></small>
                  </div>
		</td>
		<td class="text-right" style="border-top-width: 0; padding: 0;">
		  <div>
		    <small ><strong class="text-nowrap">Available: </strong>{{book.dueDate?book.dueDate:"now"}}</small>
		  </div>
		  <div class="hide-md">
		    <!-- stop.prevent added to avoid scrolling to top after collapsing -->
                    <a v-if="book.borrowerID" href="#" @click.prevent= "showModal(book,'returnModal')">Return</a>
                    <a v-else-if="hasBorrowRequest(book)" href="#" @click.prevent= "showModal(book,'lendModal')">Lend</a>
                    <a v-b-tooltip.hover :title="book.hide?'Show':'Hide'" href="#" @click.prevent="showModal(book,'hideBookModal')">
		      <icon :name="book.hide?'eye-slash':'eye'"/></a>
                    <a v-b-tooltip.hover title="Edit entry" href="#" @click.prevent="toggleEdit(index,false)">
		      <icon name="pencil"/></a>
		    <a v-b-tooltip.hover title="Delete entry" href="#" @click.prevent = "showModal(book,'deleteModal')">
		      <icon name="trash"/></a>
		  </div>
		</td>
              </tr>
	      <tr>
		<td colspan="2" style="border-top-width: 0; padding: 0;">
		  <b-collapse :id="'add-'+index" @show="makeEdit('add-'+index,index)"
			      v-on:hidden="removeEdit('add-'+index,index)"  style="padding: .75rem;">
                    <b-form-textarea v-model="book.descr"
		    		     placeholder="Enter book description"
		    		     :rows="6"
		    		     :max-rows="6">{{book.descr}}</b-form-textarea>
		    <b-form-input type="url" v-model.trim="book.link" placeholder="Optional URL"/>
                    <b-form-select v-model="book.genre" :options="genres"/>
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
		   @click.prevent="toggleAdd()" class="float-right" size="sm">
		  <icon name="plus"/></a>
	      </td>
	    </tr>
	    <tr>
		<td colspan="2" style="border-top-width: 0; padding: 0;">
		  <b-collapse :id="'add-end'"  style="padding: .75rem;">
		    <b-form-input type="text" v-model.trim="newBook.title" placeholder="Title"/>
		    <b-form-input type="text" v-model.trim="newBook.author" placeholder="Author"/>
		    <b-form-textarea v-model="newBook.descr"
		    		     placeholder="Enter book description"
		    		     :rows="6"
		    		     :max-rows="6">{{newBook.descr}}</b-form-textarea>
		    <b-form-input type="url" v-model.trim="newBook.link" placeholder="Optional URL"/>
                    <b-form-select v-model="newBook.genre" :options="genres"/>

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
  	<b-modal v-if="myBooks.length" ref="hideBookModal" @ok="toggleBookVisibility()">
  	  <a>Are you sure you want to {{selectedBook.hide?'show in':'hide from'}} Library:"{{selectedBook.title}}"</a>
  	</b-modal>
  	<b-modal v-if="myBooks.length" ref="deleteModal" @ok="removeBook()">
  	  <a>Are you sure you want to delete:"{{selectedBook.title}}"</a>
  	</b-modal>
  	<b-modal ref="returnModal" @ok="returnBook()">
  	  <a>Make "{{selectedBook.title}}" available for reservation?</a>
  	</b-modal>
	<b-modal id="lendModal" ref="lendModal" :title="'Lend '+selectedBook.title" @ok="lendBook()">
          <form @submit.stop.prevent> <!-- ="handleSubmit" -->
            <label for="rsrvSelect" class="d-block text-left">Select borrower:</label>
            <b-form-select id="rsrvSelect" v-model="selectedBorrower" :options="borrowers" class="d-block mb-3"/>
            <label class="d-block text-left">Select due date:</label>
            <datepicker v-model="selectedDuetime" inline bootstrapStyling/>
          </form>
        </b-modal>
   </div>
  </div>
</template>

<script>
import 'vue-awesome/icons/eye'
import 'vue-awesome/icons/eye-slash'
import 'vue-awesome/icons/trash'
import 'vue-awesome/icons/pencil'
import 'vue-awesome/icons/plus'
import 'vue-awesome/icons/spinner'
// https://github.com/charliekassel/vuejs-datepicker
import Datepicker from 'vuejs-datepicker';

let reactiveData = {};//will be filled by reset
let nonreactiveData = {
    genres: [{value:'', text:'Select genre'},'Art/Photograhy','Biography/Memoir', "Children's Books","Food",
	     'History', 'Literature & Fiction','Mystery & Suspense','Romance',
             'Sci-Fi & Fantasy','Teens & Young Adult'],
    oldBookInfo:[]
};

let unsubscribe = null;
export default {
    name: 'Profile',
    components: {
	Datepicker
    },
    data () {
        reset();
	reactiveData.rootData = this.$root.$data;
	return reactiveData;
    },
    methods: {
	logme(m) {
	    console.log(m);
	},
        showModal(book,modalRef){
	    this.selectedBook = book;
            if(modalRef == 'lendModal'){
                //fill borrowers select options for current book
                let borrowReqArr = this.transactions[book.key];
                let borrowers = {};
                let setReactive = this.$set;//vue set api
                for(let i = 0; i < borrowReqArr.length; i++)
                {
                    let borrowerID = borrowReqArr[i].borrowerID;
                    let borrowerName = borrowReqArr[i].borrowerName;
                    setReactive(borrowers,borrowerID,{value: borrowerID,
                                                      text: borrowerName});
                }
                this.borrowers = borrowers;
                //first borrowers element
                this.selectedBorrower = borrowReqArr[0].borrowerID;
            }
	    this.$refs[modalRef].show()
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
	    }
	    this.backupBook(id);

	},
	removeEdit(mid,id){
	    let el = document.getElementById(mid);
	    let inputEls =el.parentElement.parentElement.previousElementSibling.querySelectorAll(".myinput");
	    let clickedSave = this.clickedSave;
	    for (let i=0; i< inputEls.length; i++){
		let element = inputEls[i];
                let fieldName = element.getAttribute("data-f-field");
		let index = Number(element.getAttribute("data-f-index"));
		element.removeAttribute("contenteditable");
		if(clickedSave){
		    this.myBooks[index][fieldName] = element.innerHTML;
		} else {
                    //this.myBooks[index][fieldName] still has old values
                    element.innerHTML = this.myBooks[index][fieldName];
		}
	    }

	    if(clickedSave){
               let db = this.rootData.firebase.firestore();
               let key = this.myBooks[id].key;
               let self = this;
               db.collection("books").doc(key).update({
                   title: self.myBooks[id].title,
                   author: self.myBooks[id].author,
                   descr: self.myBooks[id].descr,
                   link: self.myBooks[id].link,
                   genre: self.myBooks[id].genre
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
	     this.oldBookInfo[id] = Object.assign({}, this.myBooks[id]);
	},
	restoreBook(id){
            Object.assign(this.myBooks[id],this.oldBookInfo[id]);
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
        toggleAdd(){
            //reset this.newBook
            Object.assign(this.newBook,createNewBook());
            this.toggleCollapse('add-end');
        },
	addBook(mid){
	    //Add new book
	    let db = this.rootData.firebase.firestore();
            let newBook = createNewBook();
            //mutate this.newBook
            Object.assign(newBook,this.newBook);
            newBook.ownerID = this.rootData.uid;
            newBook.ownerName = this.rootData.name;
            newBook.ownerEmail = this.rootData.email;
	    // Add to reactive array
	    this.myBooks.push(newBook);
	    this.toggleCollapse(mid);
	    let self = this;
	    // Add to DB
	    db.collection("books").add(newBook)
		.then(function(docRef) {
		    self.myBooks[self.myBooks.length-1].key = docRef.id;
		    console.log("Document written with ID: ", docRef.id);
	      })
	      .catch(function(error) {
		  console.error("Error adding document: ", error);
	      });
	},
        toggleBookVisibility: function(){
            let book = this.selectedBook;
            let db = this.rootData.firebase.firestore();

	    //update DB
	    db.collection("books").doc(book.key)
                .update({hide:!book.hide}).then(function() {
                    book.hide = !book.hide;
		    console.log("Visibility updated successfully !");
	        }).catch(function(error) {
		    console.error("Error in visibility update: ", error);
	        });

        },

	removeBook: function () {
            let book = this.selectedBook;
	    let db = this.rootData.firebase.firestore();
            let batch = db.batch();
	    let key = book.key;
            let bid = indexForKey (this.myBooks, key);
            let borrowReqsForCurrentBook = this.transactions[key];
            self = this;
	    //remove from DB
            batch.delete(db.collection("books").doc(key));
            if (self.hasBorrowRequest(book)){
                for(let i=0;i< borrowReqsForCurrentBook.length;i++)
                {
                    batch.delete(db.collection("transaction")
                                 .doc(borrowReqsForCurrentBook[i].transID));
                }
                self.transactions[key] = [];
            }
            batch.commit().then(function() {
                //remove from reactive variable
                self.myBooks.splice(bid,1);
                console.log("book successfully deleted!");
            }).catch(function(error) {
                console.error("Error deleting book/trans: ", error);
            });
	},
        hasBorrowRequest: function(book){
            return this.transactions.hasOwnProperty(book.key) &&
                this.transactions[book.key].length > 0;
        },
        lendBook: function () {
            let book = this.selectedBook;
	    let db = this.rootData.firebase.firestore();
            let borrowerID = this.selectedBorrower;
            let borrowerName = this.borrowers[borrowerID].text;
            let selectedDueDate = this.selectedDuetime.toLocaleDateString();
            let borrowReqsForCurrentBook = this.transactions[book.key];
            let transIdx =
                indexForKey(borrowReqsForCurrentBook,borrowerID,'borrowerID');
            let transKey = borrowReqsForCurrentBook[transIdx].transID;
            let batch = db.batch();
            batch.update(db.collection("books").doc(book.key),
                         {
                             borrowerID: borrowerID,
                             borrowerName: borrowerName,
                             dueDate: selectedDueDate
                         });
            batch.delete(db.collection("transaction").doc(transKey));
            batch.commit().then(function() {
                book.borrowerID = borrowerID;
                book.borrowerName = borrowerName;
                book.dueDate = selectedDueDate;
                //Shouldn't remove transaction here, since it will be
                //removed by the DB callback when it is deleted from
                //the DB
                console.log("lending successfully updated!");
            }).catch(function(error) {
                console.error("Error lending book: ", error);
            });
	},
        returnBook: function () {
            let book = this.selectedBook;
	    let db = this.rootData.firebase.firestore();
            db.collection("books").doc(book.key)
                .update({
                    borrowerID: "",
                    borrowerName: "",
                    dueDate: ""
                }).then(function() {
                    //reset reactive variable
                    book.borrowerID = "";
                    book.borrowerName =  "",
                    book.dueDate = "";
                    console.log("returned successfully!");
                }).catch(function(error) {
                    console.error("Error returning book: ", error);
                });
        }
    },
    watch: {
	'rootData.signedIn': function (signedIn) {
	    if(signedIn) {
		// User is signed in.
                reset();
                if(!unsubscribe) unsubscribe =
		    loadDb(this);
	    } else {
                // User is signed out.
		if (unsubscribe) {
		    unsubscribe[0]();unsubscribe[1]();
		    unsubscribe = null
		}
		if (this.$router.currentRoute.name == 'profile')
		    this.$router.go(-1); //go back to previous page
                reset();
	    }
	    console.log(" profile signed in "+ signedIn);
	}

    },
    created: function(){
	console.log("Profile created");
        //Set non reactive Data
        Object.assign(this, nonreactiveData);

	/*will only be called once when created, for subsequent
         signins we use the watch*/
	if (this.rootData.signedIn)
	    unsubscribe = loadDb(this);
    }
}

function createNewBook(){
    return {title: '',
            author: '',
            genre: '' ,
            descr: '',
            link: '',
            ownerID: '',
            ownerName: '',
            ownerEmail: '',
            borrowerID:'',
            borrowerName:'',
            dueDate: '',
            hide: false,
            reserved: false};
}

function reset(){
    Object.assign(reactiveData,
    {    reservedBooks: [],
         myBooks:[],
         newBook: createNewBook(),
         transactions: {},
         loading: false,
         selectedBook: {},
         borrowers: {},
         selectedBorrower: '',
         selectedDuetime: new Date()});
}

function loadDb (vm) {
    reactiveData.loading = true;
    let db = vm.rootData.firebase.firestore();
    let uid = vm.rootData.uid;
    let transactions = vm.transactions;
    let setReactive = vm.$set;//vue set api
    let unsubscribeBorrowed = db.collection("books").where("borrowerID", "==", uid)
	.onSnapshot(function(snapshot) {
            snapshot.docChanges().forEach(function(change) {
		let dt = change.doc.data();
		let key = change.doc.id;
                dt.key = key;
                dt.createdDate = new Date(dt.createdTime).toLocaleDateString();
		if (change.type === "added") {
		    reactiveData.reservedBooks.push(dt);
                    console.log("New: ", key);
		} else {
		    let index = indexForKey (reactiveData.reservedBooks, key);
		    if (change.type === "modified") {
			/*Can't use indexing as Vue will not trigger*/
			reactiveData.reservedBooks.splice(index,1,dt);
			console.log("Modified Pofile ResBook: ", key);
		    } else {
			if (change.type === "removed") {
			    reactiveData.reservedBooks.splice(index,1 );
			    console.log("Removed: ", key);
			}
		    }

		}
            });
        });
    let unsubscribeTransaction = db.collection("transaction").where("ownerID", "==", uid)
	.onSnapshot(function(snapshot) {
            snapshot.docChanges().forEach(function(change) {
		let dt = change.doc.data();
                let bookKey = dt.bookID;
		if (change.type === "added") {
                    dt.transID = change.doc.id;
                    if(!transactions.hasOwnProperty(bookKey))
                        setReactive(transactions,bookKey,[]);
                    transactions[bookKey].push(dt);
                    console.log("New trans: ", change.doc.id);
		} else {
		    if (change.type === "modified") {
                        transactions[bookKey].push(dt);
			console.log("Modified Trans: ", change.doc.id);
		    } else {
			if (change.type === "removed") {
                            let transIdx =
                                indexForKey(transactions,change.doc.id,'transID');
                            reactiveData.transactions[bookKey].splice(transIdx,1);
			    console.log("Removed: ", change.doc.id);
			}
		    }
		}
            });

	});

    db.collection("books").where("ownerID", "==", uid)
     	.get()
     	.then(function(querySnapshot) {
	    querySnapshot.forEach(function(doc) {
		let dt = doc.data();
		let key = doc.id;
		dt.key = key;
		reactiveData.myBooks.push(dt);
            });
	    reactiveData.loading = false;
     	})
     	.catch(function(error) {
            console.error("Error getting documents: ", error);
     	});
    return [unsubscribeBorrowed,unsubscribeTransaction];
}

/**
 * Find the index for an object with given key.
 *
 * @param {array} array
 * @param {string} key
 * @return {number}
 */
function indexForKey (array, key, keyname) {
    if(typeof keyname === "undefined") {
        keyname = 'key';
    }
    for (let i = 0; i < array.length; i++) {
    if (array[i][keyname] === key) {
      return i
    }
  }
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
#lendModal .modal-title {
    max-width: 280px;
}

.d-even-flex {
    display: none;
}

@media (max-width: 767px) {
    .d-even-flex {
        display: flex;
        -ms-flex-pack: distribute;
        justify-content: space-around;
  }
    .hide-md {
        display: none;
    }
}


</style>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
