<template>
  <div class="landing container">

      <h1 id="bookTitle">Book List</h1>
      <b-form-input class="w-50 my-2 mr-auto" v-model="filter" placeholder="Type to Search" />
      <b-table v-on:input="rowsUpdated"
	       class="table-ffixed"
	       :items="booksFB" 
	       :fields="fields"
	       :filter="filter"
	       >

	<template slot="HEAD_type" slot-scope="data">
	  <!-- @click.stop stop checkbox from being 
	       cancelled due to prevent default in table
	       https://stackoverflow.com/questions/15767083/why-does-preventdefault-on-a-parent-elements-click-disable-a-checkbox
	    -->

	<div @click.stop > <!-- style="white-space: nowrap" class="d-flex" -->
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
	</div>
      </template>



      </b-table>

  </div>
</template>

<script>
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import PerfectScrollbar from 'perfect-scrollbar';

  var componentData = {

      booksFB: [{ title: 'The box', author: 'John', type: 'fiction',status: 'checked out'},
		{ title: 'Hello'  , author: 'Jane', type: 'fiction',status: 'checked out'},
		{ title: 'The box of shiva fsdf fsdf fdsf ', author: 'Paul', type: 'fiction',status: 'checked out'},
		{ title: 'The box', author: 'Kate', type: 'fiction',status: 'checked out'},
		{ title: 'The box', author: 'Amanda', type: 'fiction',status: 'checked out'},
		{ title: 'The box', author: 'Steve', type: 'fiction sdfsdf sdfsdf',status: 'checked out'},
		{ title: 'The box', author: 'Keith', type: 'fiction',status: 'checked out'},
		{ title: 'The box', author: 'Don', type: 'fiction',status: 'checked out'},
		{ title: 'The box', author: 'Susan', type: 'fiction',status: 'checked out'}],
      filter: null,
      fields: [
	  {
	      key: 'title',
	      label: 'Title',
	      //class: 'col-4'
	  },
	  {
	      key: 'author',
	      label: 'Author',
	      sortable: true,
	      //class: 'col-3'
	  },
	  {
	      key: 'type',
	      label: 'Type',
	      sortable: true,
	      //class: 'col-2'
	  },
	  {
	      key: 'status',
	      label: 'Status',
	      sortable: true,
	      //class: 'col-2'
	  }
      ],

      search: '',
      filter2: null,
      genre: ['Biography/Memoir', 'Art/Photograhy', 
	      'History', 'Romance'],
      selected: [],
      allSelected: false,
      indeterminate: false
  };


export default {
    name: 'Landing',
    data () {
	return componentData;
    },
    methods: {
	toggleAll (checked) {
	    this.selected = checked ? this.genre.slice() : []
	},
	logme(message) {
	    console.log(message);
	},
       rowsUpdated: function(){
	   if (this.pScroll) {
	       this.$nextTick(function(){
		   //console.log('after adding scroll');
		   this.pScroll.update();
		   })
	   }
       }

    },
    mounted: function () {
	this.$nextTick(function () {
	    // Code that will run only after the
	    // entire view has been rendered
	    //this.pScroll = new PerfectScrollbar('table tbody');
	})
    },
    computed: {
	selectedComp: function(){
	    if (this.selected.length > 0) 
		return this.selected.toString()
	    else
		return "search"
	},
	filteredBooks: function () {
	    //var self = this
	    return this.booksFB.filter(
		//book => book.name.indexOf(this.search) !== -1
		book => {
		    var searchRegex = new RegExp(this.search, 'i')
		    return (
			searchRegex.test(book.name) ||
			    searchRegex.test(book.age)
		    )
		})
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
.table-fixed {
    width: 100%;
}
.table-fixed tbody {
  height: 200px;
  width: 100%;
  position: relative; /*needed by scroller*/
}

/* thead,tbody { */
/*   min-width: 500px; */
/* } */
tbody {
    height: 200px;
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

</style>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


/*
.dropdown {
    position: relative;
    display: inline-block;
}

.dropdown-content {
    display: none;
    position: absolute;
    //background-color: #f9f9f9;
    //min-width: 160px;
    //box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    //padding: 12px 16px;
    //z-index: 1;
}

.dropdown:hover .dropdown-content {
    display: block;
}

  https://codepen.io/elmahdim/pen/hlmri

	<b-btn v-b-toggle.collapseCard size="sm">Select Genre</b-btn>
	<b-collapse id="collapseCard">
	  <b-card>
	    <b-form-checkbox v-model="allSelected"
			     :indeterminate="indeterminate"
			     aria-describedby="flavours"
			     aria-controls="flavours"
			     @change="toggleAll"
			     >
	      {{ allSelected ? 'Un-select' : 'Select' }}
	      All Flavors
	    </b-form-checkbox>
	    <b-form-checkbox-group id="flavors"
				   stacked
				   v-model="selected"
				   name="flavs"
				   :options="flavours"
				   class="ml-3"
				   aria-label="Individual flavours"
				   ></b-form-checkbox-group>
	    <!-- <p aria-live="polite"> -->
	    <!--   Selected: <strong>{{ selected }}</strong><br> -->
	    <!--   All Selected: <strong>{{ allSelected }}</strong><br> -->
	    <!--   Indeterminate: <strong>{{ indeterminate }}</strong><br> -->
	    <!-- </p> -->
	  </b-card>
	</b-collapse>


	<div class="dropdown">
	<b-form-input size="sm" class="mr-auto mt-2 w-50" v-bind:placeholder="'Search ' + data.field.label" />
	<div class="dropdown-content">
	  <b-card>
	    <b-form-checkbox v-model="allSelected"
			     :indeterminate="indeterminate"
			     aria-describedby="flavours"
			     aria-controls="flavours"
			     @change="toggleAll"
			     >
	      {{ allSelected ? 'Un-select' : 'Select' }}
	      All Flavors
	    </b-form-checkbox>
	    <b-form-checkbox-group id="flavors"
				   stacked
				   v-model="selected"
				   name="flavs"
				   :options="flavours"
				   class="ml-3"
				   aria-label="Individual flavours"
				   ></b-form-checkbox-group>
	    <!-- <p aria-live="polite"> -->
	    <!--   Selected: <strong>{{ selected }}</strong><br> -->
	    <!--   All Selected: <strong>{{ allSelected }}</strong><br> -->
	    <!--   Indeterminate: <strong>{{ indeterminate }}</strong><br> -->
	    <!-- </p> -->
	  </b-card>
	</div>
	</div>



    <input v-model="search" class="form-control" placeholder="Filter users by name or age">
    <table class="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in filteredBooks">
          <td>{{book.name}}</td>
          <td>{{book.age}}</td>
        </tr>

      </tbody>
    </table>
    <b-form-input class="w-50 my-2 ml-auto" v-model="filter2" placeholder="Type to Search" />

    <b-table
       :items="booksFB"
       :filter="filter2"
       >
      <template slot="HEAD_name" slot-scope="data">
	<div>
	  <!-- <a>{{data.field.label}}</a> class="mt-2 w-50" -->
	  <!-- <b-form-input size="sm" v-bind:placeholder="'Search ' + data.field.label" /> -->
	  <div>
	    <a>{{selectedComp}}</a>
	  </div>
	</div>
      </template>




      <template slot="HEAD_age" slot-scope="data">
	<!-- <a>{{data.field.label}}</a> -->
	<!-- @click.stop stop checkbox from being 
	     cancelled due to prevent default in table
	     https://stackoverflow.com/questions/15767083/why-does-preventdefault-on-a-parent-elements-click-disable-a-checkbox
	  -->

	<div @click.stop class="dropdown">
	  <!-- <b-form-textarea plaintexr size="sm" class="mr-auto mt-2 w-50"  -->
	  <!-- 		   :max-rows="10" -->
	  <!-- 		   placeholder="select age" :value="selectedComp"></b-form-textarea> -->
	  <div>
	    <a>{{selectedComp}}</a>
	  </div>
	  <div class="dropdown-content">
	    <b-card>
	      <b-form-checkbox v-model="allSelected"
			       :indeterminate="indeterminate"
			       aria-describedby="flavours"
			       aria-controls="flavours"
			       @change="toggleAll"
			       >
		{{ allSelected ? 'Un-select' : 'Select' }}
		All Flavors
	      </b-form-checkbox>
	      <b-form-checkbox-group id="flavors"
				     stacked
				     v-model="selected"
				     name="flavs"
				     :options="flavours"
				     class="ml-3"
				     aria-label="Individual flavours"
				     ></b-form-checkbox-group>
	      <!-- <p aria-live="polite"> -->
	      <!--   Selected: <strong>{{ selected }}</strong><br> -->
	      <!--   All Selected: <strong>{{ allSelected }}</strong><br> -->
	      <!--   Indeterminate: <strong>{{ indeterminate }}</strong><br> -->
	      <!-- </p> -->
	    </b-card>
	  </div>
	</div>
      </template>
    </b-table>

    


*/
</style>
