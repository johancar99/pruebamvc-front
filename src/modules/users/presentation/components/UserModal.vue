<template>
    <div
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
      style="background: rgba(0, 0, 0, 0.5);"
      v-if="show"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <!--visualización -->
            <div v-if="mode === 'view'">
              <p><strong>Name:</strong> {{ userData?.name }}</p>
              <p><strong>Email:</strong> {{ userData?.email }}</p>
            </div>
            <!-- Crear/editar -->
            <form v-else @submit.prevent="saveUser">
              <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input
                  id="name"
                  type="text"
                  class="form-control"
                  v-model="userForm.name"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  id="email"
                  type="email"
                  class="form-control"
                  v-model="userForm.email"
                  required
                />
              </div>
              <div class="mb-3" v-if="mode === 'create'">
                <label for="password" class="form-label">Password</label>
                <input
                  id="password"
                  type="password"
                  class="form-control"
                  v-model="userForm.password"
                  required
                />
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeModal">
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary">
                  {{ mode === 'create' ? 'Create' : 'Save' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, type PropType, ref, watch, computed } from 'vue';
  import type { User } from '../../core/entities/User';
  
  export default defineComponent({
    name: 'UserModal',
    props: {
      show: {
        type: Boolean,
        required: true,
      },
      mode: {
        type: String as PropType<'create' | 'edit' | 'view'>,
        required: true,
      },
      userData: {
        type: Object as PropType<User | null>,
        default: null,
      },
    },
    emits: ['close', 'save'],
    setup(props, { emit }) {
      const userForm = ref({
        name: '',
        email: '',
        password: '',
      });
  
      watch(
        () => props.userData,
        (newVal) => {
          if (props.mode !== 'create' && newVal) {
            userForm.value = {
              name: newVal.name,
              email: newVal.email,
              password: '',
            };
          } else if (props.mode === 'create') {
            userForm.value = { name: '', email: '', password: '' };
          }
        },
        { immediate: true }
      );
  
      const closeModal = () => {
        emit('close');
      };
  
      const saveUser = () => {
        emit('save', { ...userForm.value });
      };
  
      const modalTitle = computed(() => {
        if (props.mode === 'create') return 'Create User';
        if (props.mode === 'edit') return 'Edit User';
        if (props.mode === 'view') return 'User Details';
        return '';
      });
  
      return {
        userForm,
        closeModal,
        saveUser,
        modalTitle,
      };
    },
  });
  </script>
  
  <style scoped>
  </style>
  