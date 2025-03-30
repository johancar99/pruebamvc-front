// src/presentation/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import Login from '../modules/users/presentation/pages/Login.vue';
import DashboardPage from '../modules/users/presentation/pages/Dashboard.vue'; // Vista placeholder
import AdminLayout from '../presentation/AdminLayout.vue';
import UsersList from '../modules/users/presentation/pages/UsersList.vue';
import EmployeesList from '../modules/employees/presentation/pages/EmployeesList.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: DashboardPage,
      },
      {
        path: 'users',
        name: 'Usuarios',
        component: UsersList,
      },
      {
        path: 'employees',
        name: 'Empleados',
        component: EmployeesList,
      },
    ],
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/dashboard',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware para verificar la autenticación en rutas protegidas
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('authToken');
    if (!token) {
      next({ name: 'Login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
