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
		<a v-on:click.stop.prevent="toggleCollapse('title-'+index)" href="#" class="booktitle" >
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
		  <b-collapse :id="'title-'+index" style="padding: .75rem;">

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
		<input :size="book.author.length?book.title.length:10"  v-model="book.title"
		       placeholder="Enter Title"
		       readonly
		       class="booktitle myinput"
                       type="text">
		       </input> {{book.title}}
		<br> by 
		<input :size="book.author.length?book.author.length:10"  v-model="book.author"
		       placeholder="Enter Author"
		       readonly
		       class="myinput"
                       type="text">
		       </input>
	      </td>
              <td class="text-right">
		<small >
		  <strong class="text-nowrap">Available on:</strong>11/04/17
		</small>
		<br>
		<div>
		  <!-- stop.prevent added to avoid scrolling to top after collapsing -->
		  <a v-b-tooltip.hover title="Edit entry" href="#" @click.prevent="toggleEdit('add-'+index,false)">
		    <icon name="pencil"/></a>
		  <a v-b-tooltip.hover title="Delete entry" href="#" @click.prevent = "showConfirmModal(index)">
		    <icon name="trash"/></a>
		</div>
	      </td>
            </tr>
	      <tr>
		<td colspan="2" style="border-top-width: 0; padding: 0;">
		  <b-collapse :id="'add-'+index" @show="makeEdit('add-'+index,index)" v-on:hidden="removeEdit('add-'+index,index)"  style="padding: .75rem;">

		    <!-- <b-form-textarea id="textarea1" -->
		    <!-- 		     v-model="description" -->
		    <!-- 		     placeholder="Enter something" -->
		    <!-- 		     rows="6" -->
		    <!-- 		     max-rows="6"></b-form-textarea> -->

		    <textarea id="textarea1" class="form-control"
		    		     placeholder="Enter something"
		    		     rows="6"
		    		     max-rows="6">{{description}}</textarea>


		    <router-link to="/book/1230974">more info</router-link>
		    <br><small><strong>Added on: </strong> 11/04/14</small>
		    <!-- <b-form-input size="sm" v-model="availableDate" type="date">11/04/17</b-form-input> -->
		    <input  class="form-control form-control-sm" type="date">11/04/17</input>
		    <br><small><strong>Added by: </strong> johnb</small>
		    <div class="text-right mb-3">
		      <b-button  size="sm" @click.prevent="toggleEdit('add-'+index,false)">Cancel</b-button>
		      <b-button  size="sm" @click.prevent="toggleEdit('add-'+index,true)" variant="primary">Save</b-button>
		    </div>
	      	  </b-collapse>
		</td>
	      </tr>
	    </template>
	    <tr>
	      <td></td>
	      <td>
	      <a v-b-tooltip.hover title="Add new book" href="#" @click.prevent="toggleCollapse('add-end')" class="float-right" size="sm">
		  <icon name="plus"/></a>
		</a>
	      </td></tr>
	  </tbody>
	</table>
</div>

	<b-modal ref="confirmModal">
	  <pre>

   Are you sure you want to delete:
   {{myBookId}}	    
  "{{myBooks[myBookId].title}}"

	  </pre>
	</b-modal>

  </div>
</template>

<script>

import 'vue-awesome/icons/trash'
import 'vue-awesome/icons/pencil'
import 'vue-awesome/icons/plus'

  var componentData = {

      reservedBooks: [{ title: 'The box', author: 'John', type: 'Fiction',status: 'checked out'},
		{ title: 'Hello'  , author: 'Jane', type: 'Fiction',status: 'checked out'},
		{ title: 'The box of shiva fsdf fsdf fdsf ', author: 'Paul', type: 'Fiction',status: 'checked out'},
		      { title: 'The box', author: 'Kate', type: 'Fiction',status: 'checked out'}],
      myBooks:[
	  { title: 'he box', author: 'Amanda', type: 'Fiction',status: 'checked out'},
		{ title: 'The box', author: 'Steve', type: 'Fiction sdfsdf sdfsdf',status: 'checked out'},
		{ title: 'The box', author: 'Keith', type: 'Fiction',status: 'checked out'},
		{ title: 'The box', author: 'Don', type: 'Romance',status: 'checked out'},
		{ title: 'The box', author: 'Susan', type: 'Fiction',status: 'checked out'},
	  { title: 'The box', author: 'Susan', type: 'Fiction',status: 'checked out'}],
      oldBookInfo:[],
      description: "Mark Twain’s brilliant 19th-century novel has long been recognized as one of the finest examples of American literature. It brings back the irrepressible and free-spirited Huck, first introduced in The Adventures of Tom Sawyer, and puts him center stage. Rich in authentic dialect, folksy humor, and sharp social commentary, Twain’s classic tale follows Huck and the runaway",
      availableDate:"2017-11-07",
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
      myBookId: 0
  };


export default {
    name: 'Landing',
    data () {
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
	 
	    for (let i=0; i< inputEls.length; i++){
		inputEls[i].removeAttribute("readonly");
		// inputEls[i].setAttribute("data-beirut-oldvalue",inputEls[i].value);
	    }
	    this.backupBook(id);

	},
	removeEdit(mid,id){
	    let el = document.getElementById(mid);
	    let inputEls =el.parentElement.parentElement.previousElementSibling.querySelectorAll(".myinput");
	    let clickedSave = this.clickedSave;
	    for (let i=0; i< inputEls.length; i++){
		inputEls[i].setAttribute("readonly","readonly");
		// if(!clickedSave)
		//     inputEls[i].value = inputEls[i].getAttribute("data-beirut-oldvalue");
		
		// inputEls[i].removeAttribute("data-beirut-oldvalue");
	    }
	    if(!clickedSave) //revert
		{
		    //console.log(id + "Before " + JSON.stringify(this.oldBookInfo[id]) + " " + JSON.stringify(this.myBooks[id]));
		    //Following did not work since it overwrote the reactive elements of the object
		    //this.myBooks[id] =  Object.assign({}, this.oldBookInfo[id]);
		    //console.log(id + "After " + JSON.stringify(this.oldBookInfo[id]) + " " + JSON.stringify(this.myBooks[id]));		    
		    //console.log("revert "+JSON.stringify(this.oldBookInfo[id]));
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
	    //TODO: find a better solution
	    to.title = from.title ;
	    to.author = from.author ;
	    to.type = from.type ;

	},
	toggleCollapse(mid){
	    this.$root.$emit("bv::toggle::collapse",mid);
	},
	toggleEdit(mid,save){
	    if(save)
		this.clickedSave = true;
	    else
		this.clickedSave = false;
	   
	    this.toggleCollapse(mid);
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

</style>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
