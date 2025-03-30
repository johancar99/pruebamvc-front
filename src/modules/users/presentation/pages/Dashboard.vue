<!-- src/modules/users/presentation/pages/Dashboard.vue -->
<template>
    <div class="dashboard">
      <h1>Dashboard</h1>
      <p>Welcome to the admin panel.</p>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'Dashboard',
  });
  </script>
  
  <style scoped>
  .dashboard {
    padding: 2rem;
  }
  </style>
  