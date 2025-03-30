<template>
    <div class="d-flex min-vh-100">
      <!-- SIDEBAR IZQUIERDO -->
      <aside class="bg-white border-end" style="width: 250px;">
        <div class="p-3 border-bottom">
          <h4 class="fw-bold mb-0">Prueba</h4>
        </div>
  
        <!-- Menú -->
        <div class="p-3">
          <ul class="nav flex-column gap-2">
            <li>
              <router-link
                to="/dashboard"
                class="nav-link d-flex align-items-center text-secondary"
                active-class="active-link"
              >
                <i class="bi bi-speedometer2 me-2"></i>
                <span>Dashboard</span>
              </router-link>
            </li>
          
            <li>
              <router-link
                to="/users"
                class="nav-link d-flex align-items-center text-secondary"
                active-class="active-link"
              >
                <i class="bi bi-person me-2"></i>
                <span>Users</span>
              </router-link>
            </li>
            <li>
              <router-link
                to="/employees"
                class="nav-link d-flex align-items-center text-secondary"
                active-class="active-link"
              >
                <i class="bi bi-briefcase me-2"></i>
                <span>Employees</span>
              </router-link>
            </li>
          </ul>
        </div>
      </aside>
  
      <!-- CONTENIDO PRINCIPAL -->
      <div class="flex-grow-1 d-flex flex-column bg-light">
        <header class="d-flex align-items-center justify-content-end p-2 border-bottom" style="height: 60px;">
          <div class="dropdown me-3">
            <a
              class="text-decoration-none text-dark dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ userName }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <button class="dropdown-item" @click="logout">Logout</button>
              </li>
            </ul>
          </div>
        </header>
  
        <!-- Área principal de contenido -->
        <main class="p-4 flex-grow-1">
          <router-view />
        </main>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default defineComponent({
    name: 'AdminLayout',
    setup() {
      const router = useRouter();
      const userName = ref('Admin User');
  
      onMounted(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            userName.value = parsedUser.name || 'Admin User';
          } catch (error) {
            console.error('Error parsing user:', error);
          }
        }
      });
  
      const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        router.push({ name: 'Login' });
      };
  
      return {
        userName,
        logout,
      };
    },
  });
  </script>
  
  <style scoped>
  .active-link {
    background-color: #e2e6ea;
    border-radius: 4px;
    color: #000 !important;
  }
  </style>
  