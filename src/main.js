import { createApp } from 'vue'
import antz from 'ant-design-vue';

import App from './App.vue'
import router from './router'
import '@/index.css'

const app = createApp(App)
app.use(router)
app.use(antz)

app.mount('#app')
