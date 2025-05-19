import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/booking', name: 'Booking', component: () => import('../views/Booking.vue') },
    { path: '/update', name: 'Update', component: () => import('../views/Update.vue') },
    { path: '/delete', name: 'Delete', component: () => import('../views/Delete.vue') },
    { path: '/retrieve', name: 'Retrieve', component: () => import('../views/Retrieve.vue') },
    { path: '/map', name: 'Map', component: () => import('../views/Map.vue') }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
