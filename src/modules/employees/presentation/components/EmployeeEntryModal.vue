<!-- src/modules/employees/presentation/components/EmployeeEntryModal.vue -->
<template>
    <div v-if="show" class="modal fade show d-block" style="background: rgba(0, 0, 0, 0.5);" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Employee Entries</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div v-if="employee && employee.entries && employee.entries.length">
              <table class="table table-bordered table-sm">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Entry Time</th>
                    <th>Successful</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="entry in employee.entries" :key="entry.id">
                    <td>{{ entry.id }}</td>
                    <td>{{ entry.entry_time }}</td>
                    <td>
                      <span v-if="entry.was_successful" class="badge bg-success">Yes</span>
                      <span v-else class="badge bg-danger">No</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else>
              <p>No entries found for this employee.</p>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary btn-sm" @click="closeModal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, type PropType } from 'vue';
  import type { Employee } from '../../core/entities/Employee';
  
  export default defineComponent({
    name: 'EmployeeEntryModal',
    props: {
      show: {
        type: Boolean,
        required: true
      },
      employee: {
        type: Object as PropType<Employee | null>,
        default: null
      }
    },
    emits: ['close'],
    setup(props, { emit }) {
      const closeModal = () => {
        emit('close');
      };
      return { closeModal };
    }
  });
  </script>
  
  <style scoped>
  /* Puedes agregar estilos adicionales si lo requieres */
  </style>
  