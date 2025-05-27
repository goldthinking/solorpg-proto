import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'; 
import App from './App.vue'
import router from './router'
import { createPersistedState } from "pinia-persistedstate-plugin";

const app = createApp(App)

app.use(router)
const pinia = createPinia();
const persist = createPersistedState();
pinia.use(persist);

app.use(pinia);

app.mount('#app')
