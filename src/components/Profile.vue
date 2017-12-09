<!-- https://www.goodreads.com/search?q=mark+twain -->
<template>
  <div class="profile container">
      <h2 id="bookTitle" class="my-3">Books I Borrowed</h2>
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


	<b-modal ref="reserveModal">
	  <pre>

  Hello,
  To extend "{{reservedBooks[reserveId].title}}"
  please contact: "{{reservedBooks[reserveId].author}}"

	  </pre>
	</b-modal>
	<hr>
      <h2 id="bookTitle" class="my-3">Books I Own</h2>
	<table class="table">
	  <tbody>
            <template v-for="(book, index) in myBooks"> <!-- :key="book.key" -->
	    <tr>
              <td>
		<!-- stop.prevent added to avoid scrolling to top after collapsing -->
		<a class="booktitle" >
		  {{book.title}}
		</a>
		<br>
		<a>by {{book.author}}</a>
	      </td>
              <td class="text-right">
		<small >
		  <strong class="text-nowrap">Available on:</strong>11/04/17
		</small>
		<br>
		<div>
		  <a v-b-tooltip.hover title="Edit entry" href="#" @click.prevent="toggleCollapse('add-'+index)">
		    <icon name="pencil"/></a>
		  <a v-b-tooltip.hover title="Delete entry" href="#" @click.prevent = "showConfirmModal(index)">
		    <icon name="trash"/></a>
		  		<!--<span class="fa fa-trash" aria-hidden="true"></span> v-on:click="removeBook(book)"
		<span class="fa fa-pencil" aria-hidden="true" ></span><!-- onclick="editMe(this)" -->
		</div>
	      </td>
            </tr>
	      <tr>
		<td colspan="2" style="border-top-width: 0; padding: 0;">
		  <b-collapse :id="'add-'+index" style="padding: .75rem;">

		    <b-form-textarea id="textarea1"
				     v-model="description"
				     placeholder="Enter something"
				     rows="6"
				     max-rows="6"></b-form-textarea>

		    <router-link to="/book/1230974">more info</router-link>
		    <br><small><strong>Added on: </strong> 11/04/14</small>
		    <b-form-input size="sm" v-model="availableDate" type="date">11/04/17</b-form-input>
		    <br><small><strong>Added by: </strong> johnb</small>
		    <div class="text-right mb-3">
		      <b-button  size="sm" @click.prevent="toggleCollapse('add-'+index)">Cancel</b-button>
		      <b-button  size="sm" @click.prevent="toggleCollapse('add-'+index)" variant="primary">Save</b-button>
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
	    console.log(mid);
	    this.myBookId = mid;
	    this.$refs.confirmModal.show()
	    },
	showModal(mid){
	    this.reserveId = mid;
	    this.$refs.reserveModal.show()
	    },
	toggleCollapse(mid){
	    this.$root.$emit("bv::toggle::collapse",mid);
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

.booktitle,h1{
    font-family: "Merriweather", serif;
}

.booktitle {
    font-weight: bold;
    font-size: 120%;
    outline: none;
    color: #333333;
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
