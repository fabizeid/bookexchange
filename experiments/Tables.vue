<template>
  <div class="landing container">

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
    
  </div>
</template>

<script>
  var componentData = {

      booksFB: [{ name: 'John', age: 50 },
		{ name: 'Jane', age: 22 },
		{ name: 'Paul', age: 34 },
		{ name: 'Kate', age: 15 },
		{ name: 'Amanda', age: 65 },
		{ name: 'Steve', age: 38 },
		{ name: 'Keith', age: 21 },
		{ name: 'Don', age: 50 },
		{ name: 'Susan', age: 21 }],
      search: '',
      filter2: null,
      flavours: ['Orange', 'Grape', 'Apple', 'Lime', 'Very Berry'],
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
	    this.selected = checked ? this.flavours.slice() : []
	},
	logme(message) {
	    console.log(message);
	}
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
	    } else if (newVal.length === this.flavours.length) {
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
/*
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

*/
</style>
