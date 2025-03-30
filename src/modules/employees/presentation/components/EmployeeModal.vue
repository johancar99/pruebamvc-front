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
            <!-- Modo visualización: datos en lectura -->
            <div v-if="mode === 'view'">
              <p><strong>Document:</strong> {{ employeeData?.document }}</p>
              <p><strong>First Name:</strong> {{ employeeData?.first_name }}</p>
              <p><strong>Last Name:</strong> {{ employeeData?.last_name }}</p>
              <p><strong>Department:</strong> {{ employeeData?.department }}</p>
              <p><strong>Access:</strong> {{ employeeData?.access ? 'Granted' : 'Denied' }}</p>
            </div>
            <!-- Modo crear/editar: formulario -->
            <form v-else @submit.prevent="saveEmployee">
              <div class="mb-3">
                <label for="document" class="form-label">Document</label>
                <input
                  id="document"
                  type="text"
                  class="form-control"
                  v-model="employeeForm.document"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="first_name" class="form-label">First Name</label>
                <input
                  id="first_name"
                  type="text"
                  class="form-control"
                  v-model="employeeForm.first_name"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="last_name" class="form-label">Last Name</label>
                <input
                  id="last_name"
                  type="text"
                  class="form-control"
                  v-model="employeeForm.last_name"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="department" class="form-label">Department</label>
                <select id="department" class="form-select" v-model="employeeForm.department" required>
                  <option value="">Select Department</option>
                  <option value="Department 1">Department 1</option>
                  <option value="Department 2">Department 2</option>
                  <option value="Department 3">Department 3</option>
                </select>
              </div>
              <!-- Campo para Access: checkbox para definir el acceso -->
              <div class="form-check mb-3">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="access"
                  v-model="employeeForm.access"
                />
                <label class="form-check-label" for="access">
                  Access Granted
                </label>
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
  import type { Employee } from '../../core/entities/Employee';
  
  export default defineComponent({
    name: 'EmployeeModal',
    props: {
      show: {
        type: Boolean,
        required: true,
      },
      mode: {
        type: String as PropType<'create' | 'edit' | 'view'>,
        required: true,
      },
      employeeData: {
        type: Object as PropType<Employee | null>,
        default: null,
      },
    },
    emits: ['close', 'save'],
    setup(props, { emit }) {
      const employeeForm = ref({
        document: '',
        first_name: '',
        last_name: '',
        department: '',
        access: false,
      });
  
      watch(
        () => props.employeeData,
        (newVal) => {
          if (props.mode !== 'create' && newVal) {
            employeeForm.value = {
              document: newVal.document,
              first_name: newVal.first_name,
              last_name: newVal.last_name,
              department: newVal.department,
              access: newVal.access,
            };
          } else if (props.mode === 'create') {
            employeeForm.value = {
              document: '',
              first_name: '',
              last_name: '',
              department: '',
              access: false,
            };
          }
        },
        { immediate: true }
      );
  
      const closeModal = () => {
        emit('close');
      };
  
      const saveEmployee = () => {
        emit('save', { ...employeeForm.value });
      };
  
      const modalTitle = computed(() => {
        if (props.mode === 'create') return 'Create Employee';
        if (props.mode === 'edit') return 'Edit Employee';
        if (props.mode === 'view') return 'Employee Details';
        return '';
      });
  
      return {
        employeeForm,
        closeModal,
        saveEmployee,
        modalTitle,
      };
    },
  });
  </script>
  
  <style scoped>
  /* Puedes agregar estilos personalizados al modal */
  </style>
  