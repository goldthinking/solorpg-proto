import { createRouter, createWebHistory } from 'vue-router'
import ScriptView from '../views/ScriptView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'script',
      component: ScriptView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/script-detail',
      name: 'script-detail',
      component: () => import('../views/ScriptDetailView.vue'),
    },
    {
      path: '/game-script-stage',
      name: 'game-script-stage',
      component: () => import('../views/GameScriptStageView.vue'),
    },
    {
      path: '/game-search-stage',
      name: 'game-search-stage',
      component: () => import('../views/GameSearchStageView.vue'),
    },
    {
      path: '/game-reasoning-stage',
      name: 'game-reasoning-stage',
      component: () => import('../views/GameReasoningStageView.vue'),
    },
    {
      path: '/game-reveal-stage',
      name: 'game-reveal-stage',
      component: () => import('../views/GameRevealStageView.vue'),
    },
    {
      path: '/game-preferences',
      name: 'GamePreferences',
      component: () => import('../views/GamePreferencesView.vue')
    },
  ],
})

export default router
