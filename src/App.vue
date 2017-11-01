<template>
  <div id="app">
    <b-navbar toggleable="md" type="dark" variant="dark">
      <b-nav-toggle target="nav_collapse"></b-nav-toggle>
      <b-navbar-brand href="#">Beirut Book Exchange</b-navbar-brand>
      
      <b-collapse is-nav id="nav_collapse">

	<b-nav is-nav-bar>
	  <b-nav-item  to="/" exact>Home</b-nav-item>
	  <b-nav-item  to="/library" exact>Browse</b-nav-item>
	</b-nav>
	<LoginButton></LoginButton>
      </b-collapse>
    </b-navbar>
    <router-view/>
  </div>
</template>
<script>
import router from './router'
import FireAuthenBtn from '@/components/FireAuthen'

export default {
    name: 'app',
    router,
    components: { LoginButton: FireAuthenBtn }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
