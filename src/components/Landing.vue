<!-- https://www.goodreads.com/search?q=mark+twain -->
<template>
  <div class="landing container">    
      <h2 id="bookTitle">Book List</h2>
	<b-row @click.stop class="mb-3 align-items-center"> <!-- style="white-space: nowrap" class="d-flex" -->
	  <b-col sm="6">
	    <b-form-input v-model="filter" placeholder="Search author or title" />
	  </b-col>
	  <b-col class="py-2" >
	  <!-- <a>{{data.field.label}}</a> -->
	  <!-- size="sm" class="mh-100" float-right -->
	  <b-dropdown   id="ddown1" text="Type" >
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
	  <b-col class="py-2 text-nowrap">
	  <a>Sort by:</a>
	  <b-form-select id="selectbg" class="p-0" style="height: auto; width: fit-content" v-model="sortSelected" :options="sortOptions">
	  </b-form-select>
	  </b-col>
	</b-row>
	<table class="table">
	  <tbody>
            <template v-for="(book, index) in filteredBooks"> <!-- :key="book.key" -->
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
		  <strong class="text-nowrap">Available on:</strong> 11/04/17
		</small>
		<br><a href="#" @click.prevent="showModal(index)" size="sm">
		  Reserve
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
  To reserve "{{booksFB[reserveId].title}}"
  please contact: "{{booksFB[reserveId].author}}"

	  </pre>
	</b-modal>


	
  </div>
</template>

<script>
  var componentData = {

      booksFB: [{ title: 'The box', author: 'John', type: 'Fiction',status: 'checked out'},
		{ title: 'Hello'  , author: 'Jane', type: 'Fiction',status: 'checked out'},
		{ title: 'The box of shiva fsdf fsdf fdsf ', author: 'Paul', type: 'Fiction',status: 'checked out'},
		{ title: 'The box', author: 'Kate', type: 'Fiction',status: 'checked out'},
		{ title: 'he box', author: 'Amanda', type: 'Fiction',status: 'checked out'},
		{ title: 'The box', author: 'Steve', type: 'Fiction sdfsdf sdfsdf',status: 'checked out'},
		{ title: 'The box', author: 'Keith', type: 'Fiction',status: 'checked out'},
		{ title: 'The box', author: 'Don', type: 'Romance',status: 'checked out'},
		{ title: 'The box', author: 'Susan', type: 'Fiction',status: 'checked out'}],
      filter: null,
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
      reserveId: 0
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
	showModal(mid){
	    this.reserveId = mid;
	    this.$refs.reserveModal.show()
	    },
	toggleCollapse(mid){
	    this.$root.$emit("bv::toggle::collapse",mid);
	    },
	toggleAll (checked) {
	    this.selected = checked ? this.genre.slice() : []
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
