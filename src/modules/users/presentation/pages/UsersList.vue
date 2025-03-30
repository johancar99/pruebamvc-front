<template>
    <div class="card">
      <div class="card-body">
        <!-- Fila 1: Filtros -->
        <div class="row mb-3 align-items-end">
          <!-- Campo de búsqueda -->
          <div class="col-md-4">
            <label class="form-label" for="searchInput">Search</label>
            <input
              type="text"
              id="searchInput"
              class="form-control"
              placeholder="Search by name or email"
              v-model="searchQuery"
            />
          </div>
          <!-- Select de estado -->
          <div class="col-md-3">
            <label class="form-label" for="statusSelect">Status</label>
            <select id="statusSelect" class="form-select" v-model="statusFilter">
              <option value="3">Todos</option>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>
          <!-- Botones para filtrar -->
          <div class="col-md-5 d-flex justify-content-end">
            <button class="btn btn-primary btn-sm me-2" @click="applyFilter">
              <i class="bi bi-funnel me-1"></i>
              Filter
            </button>
            <button class="btn btn-secondary btn-sm" @click="clearFilter">
              <i class="bi bi-x-circle me-1"></i>
              Clear Filter
            </button>
          </div>
        </div>
  
        <!-- Línea divisoria -->
        <hr />
  
        <!-- Fila 2: Botón Agregar Usuario -->
        <div class="row mb-3">
          <div class="col-12 d-flex justify-content-end">
            <button class="btn btn-success btn-sm" @click="openModal('create')">
              Add User
            </button>
          </div>
        </div>
  
        <!-- Fila 3: Tabla de Usuarios -->
        <div class="row">
          <div class="col-12">
            <table class="table table-striped table-bordered table-hover table-sm">
              <thead class="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th class="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span
                        class="badge text-bg-success"
                        v-if="user.active == 1"
                        style="cursor: pointer"
                        @click="toggleStatus(user)"
                    >
                        Activo
                    </span>
                    <span
                        class="badge text-bg-danger"
                        v-else
                        style="cursor: pointer"
                        @click="toggleStatus(user)"
                    >
                        Inactivo
                    </span>
                    </td>
                  <td class="text-end">
                    <button class="btn btn-info btn-sm me-1" @click="openModal('view', user)">
                      View
                    </button>
                    <button class="btn btn-warning btn-sm me-1" @click="openModal('edit', user)">
                      Edit
                    </button>
                    <button class="btn btn-danger btn-sm" @click="deleteUser(user.id)">
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
  
        <!-- Se incluirá el modal para crear/editar/ver en otro componente (UserModal.vue) -->
        <UserModal
          :show="showModal"
          :mode="modalMode"
          :userData="selectedUser"
          @close="closeModal"
          @save="handleSave"
        />
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import type { User } from '../../core/entities/User';
  import { UsersCrudUseCase } from '../../core/usecases/UsersUseCase';
  import { UsersApi } from '../../infrastructure/http/UsersApi';
  import UserModal from '../components/UserModal.vue';
import { AlertService } from '../../../../shared/services/AlertService';
  
  export default defineComponent({
    name: 'UsersList',
    components: { UserModal },
    setup() {
      const users = ref<User[]>([]);
      const searchQuery = ref('');
      const statusFilter = ref('3');
      
      // Variables para el modal (crear/editar/ver)
      const showModal = ref(false);
      const modalMode = ref<'create' | 'edit' | 'view'>('create');
      const selectedUser = ref<User | null>(null);
  
      // Instancia del caso de uso unificado para usuarios
      const usersCrudUseCase = new UsersCrudUseCase(new UsersApi());
  
      const fetchUsers = async () => {
        try {
          // Convertimos el status a número y enviamos los filtros
          const fetchedUsers = await usersCrudUseCase.getUsers({
            search: searchQuery.value || '',
            filter: Number(statusFilter.value),
            perPage: 10
          });
          users.value = fetchedUsers;
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
  
      const applyFilter = async () => {
        await fetchUsers();
      };
  
      const clearFilter = async () => {
        searchQuery.value = '';
        statusFilter.value = '3'; // Valor por defecto
        await fetchUsers();
      };
  
      const openModal = (mode: 'create' | 'edit' | 'view', user?: User) => {
        modalMode.value = mode;
        selectedUser.value = user ? { ...user } : null;
        showModal.value = true;
      };
  
      const closeModal = () => {
        showModal.value = false;
      };
  
      const handleSave = async (userData: Partial<User>) => {
        try {
            if (modalMode.value === 'create') {
            await usersCrudUseCase.createUser(userData);
            AlertService.showSuccess('User created successfully.');
            } else if (modalMode.value === 'edit' && selectedUser.value) {
            await usersCrudUseCase.updateUser(selectedUser.value.id, userData);
            AlertService.showSuccess('User updated successfully.');
            }
            await fetchUsers(); // Refresca la lista de usuarios
            closeModal();
        } catch (error: any) {
            console.error('Error saving user:', error);
            AlertService.showError(
            error.response?.data?.message ||
                'An error occurred while saving the user.'
            );
        }
      };

    
      const deleteUser = async (id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
            await usersCrudUseCase.deleteUser(id);
            await fetchUsers();
            AlertService.showSuccess('User deleted successfully.');
            } catch (error: any) {
            console.error('Error deleting user:', error);
            AlertService.showError(
                error.response?.data?.message || 'Failed to delete user.'
            );
            }
        }
      };


      const toggleStatus = async (user: User) => {
        try {
            await usersCrudUseCase.updateUserStatus(user.id, user.active);
            AlertService.showSuccess('Estado actualizado correctamente');
            await fetchUsers();
        } catch (error: any) {
            console.error('Error updating user status:', error);
            AlertService.showError(
            error.response?.data?.message || 'Failed to update user status.'
            );
        }
     };
  
      onMounted(() => {
        fetchUsers();
      });
  
      return {
        users,
        searchQuery,
        statusFilter,
        applyFilter,
        toggleStatus,
        clearFilter,
        openModal,
        deleteUser,
        showModal,
        modalMode,
        selectedUser,
        closeModal,
        handleSave,
        fetchUsers,
      };
    },
  });
  </script>
  
  <style scoped>
  /* Puedes agregar estilos adicionales para mejorar la apariencia de la tabla */
  .table thead th {
    vertical-align: middle;
  }
  </style>
  