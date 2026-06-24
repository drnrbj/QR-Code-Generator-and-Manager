import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

// Create Vue application instance
const app = createApp(App)

// Use Vue Router for navigation
app.use(router)

// Mount the application to the DOM
app.mount('#app')