<!-- https://www.goodreads.com/search?q=mark+twain -->
<template>
  <div class="landing container">

      <h1 id="bookTitle">Book List</h1>
	<b-row @click.stop class="d-flex mb-5"> <!-- style="white-space: nowrap" class="d-flex" -->
	  <b-col cols="6">
	    <b-form-input v-model="filter" placeholder="Search author or title" />
	  </b-col>
	  <b-col>
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
	  <b-col class="text-nowrap">
	  <a>Sort by:</a>
	  <b-form-select id="selectbg" class="p-0 align-self-center" style="height: auto" v-model="sortSelected" :options="sortOptions">
	  </b-form-select>
	  </b-col>
	</b-row>
	<table class="table">
	  <tbody>
            <tr v-for="(book, index) in filteredBooks"> <!-- :key="book.key" -->
              <td>
		<a :id="'title-'+index" class="booktitle" tabindex="0">{{book.title}}</a>
		<br>
		<a>by {{book.author}}</a>
		<b-popover :target="'title-'+index" triggers="blur click">
		  <p>Mark Twain’s brilliant 19th-century novel has long been recognized as one of the finest examples of American literature. It brings back the irrepressible and free-spirited Huck, first introduced in The Adventures of Tom Sawyer, and puts him center stage. Rich in authentic dialect, folksy humor, and sharp social commentary, Twain’s classic tale follows Huck and the runaway</p>
		  <a href="">more info</a>
		</b-popover>
	      </td>
              <td>
		<a class="float-right">
		  <strong class="text-nowrap">Reserved on:</strong> 11/04/17</a>
		
		
		<br>
		<a :id="'moreInfo-'+index" class="float-right" >more info...</a>		<b-popover :target="'moreInfo-'+index" triggers="hover focus">
		  <strong>Added on:</strong> 09/03/2017 <br>
		  <strong>Added by:</strong> johnb <br>
		  <strong>Last reserved:</strong> 10/12/2107
		</b-popover> 
	      </td>
            </tr>

	  </tbody>
	</table>


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
      indeterminate: false,
      sortSelected: null,
      sortOptions: ['Default','Title','Author']
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
    computed: {
	filteredBooks (){
	    var self = this
	    return self.booksFB.filter(self.filterFunc)
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

.ccard-deck{
    justify-content: center;
}
.ccard-deck .card {
    flex: 0 0 15em;
    margin-bottom: 1rem;
    %max-width: 210px;
    %min-width: 210px;
}

.booktitle,h1{
    font-family: "Merriweather", serif;   
}

.booktitle {
    font-weight: bold;
    font-size: 120%;
    color: #333333;
    outline: none;
}

/* a:any-link { */
/*   border: 1px solid blue; */
/*   color: orange; */
/* } */

a:{
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
    color: #333333;
}
/* WebKit browsers */
a:-webkit-any-link {
  /* text-decoration: underline; */
  curor: auto;
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
