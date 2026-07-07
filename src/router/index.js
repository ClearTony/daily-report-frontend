import { createRouter, createWebHistory } from 'vue-router'
import { currentUser } from '../api'

const routes = [
  { path: '/login', component: () => import('../views/Login.vue') },
  {
    path: '/',
    component: () => import('../views/Layout.vue'),
    children: [
      { path: '', redirect: () => defaultHome() },
      { path: 'my-reports', component: () => import('../views/MyReports.vue'), meta: { roles: ['EMPLOYEE', 'LEADER'] } },
      { path: 'team-reports', component: () => import('../views/TeamReports.vue'), meta: { roles: ['LEADER'] } },
      { path: 'admin/users', component: () => import('../views/AdminUsers.vue'), meta: { roles: ['ADMIN'] } }
    ]
  }
]

function defaultHome() {
  const user = currentUser()
  if (!user) return '/login'
  if (user.role === 'ADMIN') return '/admin/users'
  if (user.role === 'LEADER') return '/team-reports'
  return '/my-reports'
}

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const user = currentUser()
  if (to.path !== '/login' && !user) return '/login'
  if (to.path === '/login' && user) return defaultHome()
  if (to.meta?.roles && user && !to.meta.roles.includes(user.role)) return defaultHome()
})

export default router
