import Vue from 'vue'
import Router from 'vue-router'
import Landing from '@/components/Landing'
import Library from '@/components/Library'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing',
      component: Landing
    },
    {
      path: '/library',
      name: 'library',
      component: Library
    }
  ]
})
