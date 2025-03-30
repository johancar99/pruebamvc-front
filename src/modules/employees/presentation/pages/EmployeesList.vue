<template>
    <div class="card">
      <div class="card-body">
        <!-- Fila 1: Filtros -->
        <div class="row mb-3 align-items-end">
          <!-- Campo de búsqueda -->
          <div class="col-md-3">
            <label class="form-label" for="searchInput">Search</label>
            <input
              type="text"
              id="searchInput"
              class="form-control"
              placeholder="Search by document, first or last name"
              v-model="searchQuery"
            />
          </div>
          <!-- Select de Department -->
          <div class="col-md-2">
            <label class="form-label" for="departmentSelect">Department</label>
            <select id="departmentSelect" class="form-select" v-model="departmentFilter">
              <option value="">Todos</option>
              <option value="Department 1">Department 1</option>
              <option value="Department 2">Department 2</option>
              <option value="Department 3">Department 3</option>
            </select>
          </div>
          <!-- Campo de fecha de inicio -->
          <div class="col-md-2">
            <label class="form-label" for="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              class="form-control"
              v-model="startDate"
            />
          </div>
          <!-- Campo de fecha final -->
          <div class="col-md-2">
            <label class="form-label" for="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              class="form-control"
              v-model="endDate"
            />
          </div>
          <!-- Botones para filtrar -->
          <div class="col-md-3 d-flex justify-content-end">
            <button class="btn btn-primary btn-sm me-2" @click="applyFilter">
              <i class="bi bi-funnel me-1"></i> Filter
            </button>
            <button class="btn btn-secondary btn-sm" @click="clearFilter">
              <i class="bi bi-x-circle me-1"></i> Clear Filter
            </button>
          </div>
        </div>

  
        <!-- Línea divisoria -->
        <hr />
  
        <!-- Fila 2: Botón Agregar Empleado -->
        <div class="row mb-3">
          <div class="col-12 d-flex justify-content-end">
            <button class="btn btn-success btn-sm  me-1" @click="openModal('create')">
              Add Employee
            </button>
            <label class="btn btn-secondary btn-sm mb-0">
              Import File
              <input
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                @change="handleFileUpload"
                hidden
              />
            </label>
          </div>
        </div>
  
        <!-- Fila 3: Tabla de Empleados -->
        <div class="row">
          <div class="col-12">
            <table class="table table-striped table-bordered table-hover table-sm">
              <thead class="table-light">
                <tr>
                  <th>ID</th>
                  <th>Document</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Department</th>
                  <th>Access</th>
                  <th>Ingresos</th>
                  <th class="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="employee in employees" :key="employee.id">
                  <td>{{ employee.id }}</td>
                  <td>{{ employee.document }}</td>
                  <td>{{ employee.first_name }}</td>
                  <td>{{ employee.last_name }}</td>
                  <td>{{ employee.department }}</td>
                  <td>{{ employee.entries ? employee.entries.length : 0 }}</td>
                  <td>
                    <span
                      v-if="employee.access"
                      class="badge text-bg-success"
                      style="cursor: pointer"
                      @click="toggleAccess(employee)"
                    >
                      Granted
                    </span>
                    <span
                      v-else
                      class="badge text-bg-danger"
                      style="cursor: pointer"
                      @click="toggleAccess(employee)"
                    >
                      Denied
                    </span>
                  </td>
                  <td class="text-end">
                    <button class="btn btn-info btn-sm me-1" @click="openModal('view', employee)">
                      View
                    </button>
                    <button class="btn btn-warning btn-sm me-1" @click="openModal('edit', employee)">
                      Edit
                    </button>
                    <button class="btn btn-danger btn-sm me-1" @click="deleteEmployee(employee.id)">
                      Delete
                    </button>
                    <button class="btn btn-secondary btn-sm me-1" @click="generatePDF(employee)">
                      PDF
                    </button>
                    <button class="btn btn-secondary btn-sm" @click="openEntryModal(employee)">
                    Ingresos
                  </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
  
        <!-- Modal para crear, editar y visualizar empleados -->
        <EmployeeModal
          :show="showModal"
          :mode="modalMode"
          :employeeData="selectedEmployee"
          @close="closeModal"
          @save="handleSave"
        />
        <!-- Modal para mostrar Ingresos del empleado -->
        <EmployeeEntryModal
        :show="showEntryModal"
        :employee="selectedEmployeeForEntries"
        @close="closeEntryModal"
      />
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import type { Employee } from '../../core/entities/Employee';
  import { EmployeesCrudUseCase } from '../../core/usecases/EmployeesCrudUseCase';
  import { EmployeesApi } from '../../infrastructure/http/EmployeesApi';
  import { AlertService } from '../../../../shared/services/AlertService';
  import EmployeeModal from '../components/EmployeeModal.vue';
  import EmployeeEntryModal from '../components/EmployeeEntryModal.vue';
  import { PdfService } from '../../../../shared/services/PdfService';
  import Papa from 'papaparse';

  
  export default defineComponent({
    name: 'EmployeesList',
    components: { EmployeeModal, EmployeeEntryModal  },
    setup() {
      const employees = ref<Employee[]>([]);
      const searchQuery = ref('');
      const departmentFilter = ref('');
      const startDate = ref(''); 
      const endDate = ref('');
  
      // Variables para el modal (crear/editar/ver)
      const showModal = ref(false);
      const modalMode = ref<'create' | 'edit' | 'view'>('create');
      const selectedEmployee = ref<Employee | null>(null);

      // Variables para el modal de ingresos
      const showEntryModal = ref(false);
      const selectedEmployeeForEntries = ref<Employee | null>(null);
  
      const employeesCrudUseCase = new EmployeesCrudUseCase(new EmployeesApi());
  
      const fetchEmployees = async () => {
        try {
          // Construimos los filtros
          const filters: any = {
            search: searchQuery.value || '',
            filter: departmentFilter.value,
          };
          // Solo se agregan las fechas si se han seleccionado
          if (startDate.value) filters.start_date = startDate.value;
          if (endDate.value) filters.end_date = endDate.value;

          const fetchedEmployees = await employeesCrudUseCase.getEmployees(filters);
          employees.value = fetchedEmployees;
        } catch (error) {
          console.error('Error fetching employees:', error);
        }
      };
  
      const applyFilter = async () => {
        await fetchEmployees();
      };
  
      const clearFilter = async () => {
        searchQuery.value = '';
        departmentFilter.value = '';
        startDate.value = '';
        endDate.value = '';
        await fetchEmployees();
      };
  
      const openModal = (mode: 'create' | 'edit' | 'view', employee?: Employee) => {
        modalMode.value = mode;
        selectedEmployee.value = employee ? { ...employee } : null;
        showModal.value = true;
      };
  
      const closeModal = () => {
        showModal.value = false;
      };
  
      const handleSave = async (employeeData: Partial<Employee>) => {
        try {
          if (modalMode.value === 'create') {
            await employeesCrudUseCase.createEmployee(employeeData);
            AlertService.showSuccess('Employee created successfully.');
          } else if (modalMode.value === 'edit' && selectedEmployee.value) {
            await employeesCrudUseCase.updateEmployee(selectedEmployee.value.id, employeeData);
            AlertService.showSuccess('Employee updated successfully.');
          }
          await fetchEmployees();
          closeModal();
        } catch (error: any) {
          console.error('Error saving employee:', error);
          AlertService.showError(
            error.response?.data?.message || 'Failed to save employee.'
          );
        }
      };
  
      const deleteEmployee = async (id: number) => {
        if (confirm('Are you sure you want to delete this employee?')) {
          try {
            await employeesCrudUseCase.deleteEmployee(id);
            await fetchEmployees();
            AlertService.showSuccess('Employee deleted successfully.');
          } catch (error: any) {
            console.error('Error deleting employee:', error);
            AlertService.showError(
              error.response?.data?.message || 'Failed to delete employee.'
            );
          }
        }
      };
  
      const toggleAccess = async (employee: Employee) => {
        try {
          await employeesCrudUseCase.updateEmployeeAccess(employee.id, employee.access);
          AlertService.showSuccess(
            `Esatdo actualizado correctamente`
          );
          await fetchEmployees();
        } catch (error: any) {
          console.error('Error updating employee access:', error);
          AlertService.showError(
            error.response?.data?.message || 'Failed to update employee access.'
          );
        }
      };

      // Función para abrir el modal de ingresos
      const openEntryModal = (employee: Employee) => {
        selectedEmployeeForEntries.value = { ...employee };
        showEntryModal.value = true;
      };

      const closeEntryModal = () => {
        showEntryModal.value = false;
      };

      const handleFileUpload = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;
        Papa.parse(file, {
          header: true,
          complete: async (results: { data: any; }) => {
            // results.data es un array de objetos, cada uno representando una fila del CSV
            try {
              // Asumimos que el endpoint de importación recibe un JSON con los datos importados
              await employeesCrudUseCase.importEmployees(results.data);
              AlertService.showSuccess('Employees imported successfully.');
              await fetchEmployees();
            } catch (error: any) {
              console.error('Error importing employees:', error);
              AlertService.showError(
                error.response?.data?.message || 'Failed to import employees.'
              );
            }
          },
          error: (error: any) => {
            console.error('Error reading file:', error);
            AlertService.showError('Error reading file.');
          }
        });
      };

      const generatePDF = (employee: Employee) => {
        PdfService.generateEmployeePDF(employee);
      };
  
      onMounted(() => {
        fetchEmployees();
      });
  
      return {
        employees,
        searchQuery,
        departmentFilter,
        applyFilter,
        clearFilter,
        openModal,
        deleteEmployee,
        showModal,
        modalMode,
        selectedEmployee,
        closeModal,
        handleSave,
        toggleAccess,
        fetchEmployees,
        openEntryModal,
        closeEntryModal,
        showEntryModal,
        selectedEmployeeForEntries,
        startDate,
        endDate,
        handleFileUpload,
        generatePDF
      };
    },
  });
  </script>
  
  <style scoped>
  /* Ajustes de estilo para la tabla */
  .table thead th {
    vertical-align: middle;
  }
  </style>
  