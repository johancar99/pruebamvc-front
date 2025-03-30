<template>
  <div class="container d-flex align-items-center justify-content-center min-vh-100">
    <div class="card p-4 shadow" style="width: 22rem;">
      <div class="card-body">
        <h5 class="card-title text-center mb-4">Login</h5>
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="email" class="form-label text-start w-100">Email address</label>
            <input
              type="email"
              class="form-control"
              id="email"
              placeholder="Enter email"
              v-model="email"
              required
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label text-start w-100">Password</label>
            <input
              type="password"
              class="form-control"
              id="password"
              placeholder="Password"
              v-model="password"
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
import { AuthenticateUserUseCase } from '../../core/usecases/AuthenticateUserCase';
import { AuthApi } from '../../infrastructure/http/AuthApi';
import { TokenService } from '../../../../shared/services/TokenService';

export default defineComponent({
  name: 'Login',
  setup() {
    const router = useRouter();
    const email = ref('');
    const password = ref('');
    const errorMessage = ref('');
    const isLoading = ref(false);

    const authApi = new AuthApi();
    const authenticateUserUseCase = new AuthenticateUserUseCase(authApi);

    const handleLogin = async () => {
      isLoading.value = true;
      errorMessage.value = '';
      try {
        const response = await authenticateUserUseCase.execute(email.value, password.value);
        // Guarda el token y la fecha de expiración
        TokenService.setToken(response.token, response.expires_at);
        localStorage.setItem('user', JSON.stringify(response.user));
        router.push({ name: 'Dashboard' });
      } catch (error: any) {
        errorMessage.value = 'Login failed. Please check your credentials.';
        console.error('Login error:', error);
      } finally {
        isLoading.value = false;
      }
    };


    return {
      email,
      password,
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
