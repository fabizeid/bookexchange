<template>
  <div class="landing container">

      <h1 id="bookTitle">Book List</h1>
      <b-form-input class="w-50 my-2 mr-auto" v-model="filter" placeholder="Search author or title" />
      <b-table :items="booksFB" 
	       :fields="fields"
	       :filter="filterFunc"
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

  var componentData = {

      booksFB: [{ title: 'The box', author: 'John', type: 'Fiction',status: 'checked out'},
		{ title: 'Hello'  , author: 'Jane', type: 'Fiction',status: 'checked out'},
		{ title: 'The box of shiva fsdf fsdf fdsf ', author: 'Paul', type: 'Fiction',status: 'checked out'},
		{ title: 'The box', author: 'Kate', type: 'Fiction',status: 'checked out'},
		{ title: 'The box', author: 'Amanda', type: 'Fiction',status: 'checked out'},
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

</style>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
