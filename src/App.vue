<template>
  <div id="app">
    <b-navbar fixed="top" toggleable="md" type="dark" variant="dark">
      <b-nav-toggle target="nav_collapse"></b-nav-toggle>
      <b-navbar-brand>
	<!-- <b-img :src="require('./assets/logo.png')" /> -->
	<!-- from https://www.shareicon.net/reader-people-sitting-read-reading-open-box-645366 -->
	<img src='./assets/read.svg' />
	<!-- Beirut Book Exchange -->
      </b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">

	<b-nav is-nav-bar>
	  <b-nav-item  to="/" exact>Home</b-nav-item>
	  <b-nav-item  to="/library" exact>Browse</b-nav-item>
	  <transition name="fade">
	    <b-nav-item  v-if="rootData.signedIn" to="/profile" exact>Profile</b-nav-item>
	  </transition>
	</b-nav>
	<LoginButton class="ml-sm-auto mt-sm-2-down"></LoginButton>
      </b-collapse>
    </b-navbar>
    <div class="my-4 pb-3"/>
    <!-- keep-alive needed otherwise watch on rootdata.signedIn
	 in Library.vue will not get triggered when signing
	 out from a different route-->
    <keep-alive include="Library">
      <router-view/>
    </keep-alive>
  </div>
</template>
<script>
import router from './router'
import FireAuthenBtn from '@/components/FireAuthen'

export default {
    name: 'app',
    router,
    components: { LoginButton: FireAuthenBtn },
    data() { return {rootData: this.$root.$data}}
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.navbar-brand img {
    height: 2rem;
    filter: invert(.8);
}

@media (max-width: 767px) {
    .mt-sm-2-down {
	margin-top: 0.5rem !important;
    }

}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to {
  opacity: 0
}
 </style>
