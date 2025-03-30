<template>
    <div class="container d-flex align-items-center justify-content-center min-vh-100">
      <div class="card p-4 shadow" style="width: 22rem;">
        <div class="card-body">
          <h5 class="card-title text-center mb-4">Login</h5>
          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label for="email" class="form-label text-start w-100">Document</label>
              <input
                type="number"
                class="form-control"
                id="document"
                placeholder="Enter document"
                v-model="document"
                required
              />
            </div>
            <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
              <span v-if="isLoading">Loading...</span>
              <span v-else>Login</span>
            </button>
            <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
              {{ errorMessage }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { EmployeesCrudUseCase } from '../../core/usecases/EmployeesCrudUseCase';
  import { EmployeesApi } from '../../infrastructure/http/EmployeesApi';
  import { AlertService } from '../../../../shared/services/AlertService';
  
  export default defineComponent({
    name: 'LoginEmployee',
    setup() {
      const router = useRouter();
      const document = ref('');
      const errorMessage = ref('');
      const isLoading = ref(false);
  
      const employeeApi = new EmployeesApi();
      const employeesCrudUseCase = new EmployeesCrudUseCase(employeeApi);
  
      const handleLogin = async () => {
        isLoading.value = true;
        errorMessage.value = '';
        try {
          await employeesCrudUseCase.login(document.value);
          AlertService.showSuccess('Employee login successful.');
          isLoading.value = false;
          router.push({ name: 'LoginEmployee' });
        } catch (error: any) {
          console.error('Employee login error:', error);
          errorMessage.value = error.response?.data?.message || 'Login failed.';
          AlertService.showError(errorMessage.value);
        }
      };
  
  
      return {
        document,
        errorMessage,
        isLoading,
        handleLogin,
      };
    },
  });
  </script>
  
  <style scoped>
  /* Campo para agregar más estilos */
  </style>
  