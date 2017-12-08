import Vue from 'vue'
import Router from 'vue-router'
import Landing from '@/components/Landing'
import Library from '@/components/Library'
import Profile from '@/components/Profile'
import Book from '@/components/Book'
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
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    },
    {
      path: '/book/:id',
      name: 'book',
      component: Book
    }
      
  ]
})
