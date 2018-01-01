// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'

import 'bootstrap-vue/dist/bootstrap-vue.css'
import '../scss/custom.scss'
import Icon from 'vue-awesome/components/Icon'
Vue.component('icon', Icon)
// import VueFire from 'vuefire'

Vue.config.productionTip = false


/*  Bug which causes warning in Bootstrap workaround */
let originalVueComponent = Vue.component
Vue.component = function(name, definition) {
  if (name === 'bFormCheckboxGroup' || name === 'bCheckboxGroup' ||
      name === 'bCheckGroup' || name === 'bFormRadioGroup') {
    definition.components = {bFormCheckbox: definition.components[0]}
  }
  originalVueComponent.apply(this, [name, definition])
}
Vue.use(BootstrapVue)
Vue.component = originalVueComponent
/* End workaround*/

// Vue.use(VueFire)



/* eslint-disable no-new */
new Vue({
  el: '#app',
  /* template of parent*/
  /*template: '<Vtabl/>',*/
    template: '<App/>',
  /*component available in parent template*/
 // components: { Vtabl }
    components: { App },
    /*data used at shared state between all router views*/
    data:  {
	signedIn: false,
	uid: null,
	/*firebase: added dynamically in auth component
	  in order not to make it reactive*/
    } 
})

