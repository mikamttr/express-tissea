import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import Signup from '@/views/Signup.vue';

const routes = [
  { path: '/', component: Home, meta: { requiresAuth: true } },
  { path: '/login', component: Login, meta: { requiresGuest: true } },
  { path: '/signup', component: Signup, meta: { requiresGuest: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation Guard to protect routes
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('jwt');

  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else if (to.meta.requiresGuest && token) {
    next('/');
  } else {
    next();
  }
});

export default router;