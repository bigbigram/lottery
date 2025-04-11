import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Lotto from '../views/Lotto.vue'
import About from '../views/About.vue'
import Contact from '../views/Contact.vue'
import Cancellation from '../views/Cancellation.vue'
import Results from '../views/Results.vue'
import PrivacyPolicy from '../views/PrivacyPolicy.vue'
import TermsConditions from '../views/TermsConditions.vue'
import Checkout from '../views/Checkout.vue'

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/lotto',
    component: Lotto
  },
  {
    path: '/about',
    component: About
  },
  {
    path: '/contact',
    component: Contact
  },
  {
    path: '/cancellation',
    component: Cancellation
  },
  {
    path: '/results',
    component: Results
  },
  {
    path: '/privacy-policy',
    component: PrivacyPolicy
  },
  {
    path: '/terms-and-conditions',
    component: TermsConditions
  },
  {
    path: '/checkout',
    component: Checkout
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

