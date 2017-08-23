import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import CheckList from '@/components/CheckList'
import ItemList from '@/components/ItemList'
import Register from '@/components/Register'
import Login from '@/components/Login'
import TodoList from '@/components/TodoList'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/checklist',
      name: 'CheckList',
      component: CheckList
    },
    {
      path: '/todolist/:categoryid',
      name: 'TodoList',
      component: TodoList
    },
    {
      path: '/itemlist',
      name: 'ItemList',
      component: ItemList
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }

  ]
})
