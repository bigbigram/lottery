import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    meta: { keepAlive: true }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: { keepAlive: true }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import(/* webpackChunkName: "contact" */ '../views/Contact.vue'),
    meta: { keepAlive: true }
  },
  {
    path: '/results',
    name: 'Results',
    component: () => import(/* webpackChunkName: "results" */ '../views/Results.vue'),
    meta: { keepAlive: true }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import(/* webpackChunkName: "checkout" */ '../views/Checkout.vue'),
    meta: { keepAlive: false }
  },
  {
    path: '/cancellation',
    name: 'Cancellation',
    component: () => import(/* webpackChunkName: "policies" */ '../views/Cancellation.vue'),
    meta: { keepAlive: true }
  },
  {
    path: '/terms-and-conditions',
    name: 'Terms',
    component: () => import(/* webpackChunkName: "terms" */ '../views/Terms.vue'),
    meta: { keepAlive: true }
  },
  {
    path: '/privacy-policy',
    name: 'Privacy',
    component: () => import(/* webpackChunkName: "privacy" */ '../views/Privacy.vue'),
    meta: { keepAlive: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'Home' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(savedPosition)
        }, 100)
      })
    }
    return { top: 0 }
  }
});

router.beforeEach((to, from, next) => {
  if (!to.matched.length) {
    next({ name: 'Home' });
    return;
  }
  next();
});

export default router;

