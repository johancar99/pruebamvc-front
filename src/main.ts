import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import router from './presentation/index';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';  // Íconos de Bootstrap

const app = createApp(App);

app.use(router);
app.mount('#app');
