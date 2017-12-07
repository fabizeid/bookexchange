<template>
  <div class="book container">

    Book id: {{$route.params.id}} <br>
    URL: {{baseURL}}/#/book/{{$route.params.id}}
    
  </div>
</template>

<script>


export default {
    name: 'Book',
    data () {
	return { baseURL: window.location.origin}
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
