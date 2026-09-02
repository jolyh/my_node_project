import { createApp } from 'vue'
import App from './App.vue'      // The root layout shell
import router from './router/router.js'    // Your routing rules

const app = createApp(App)

app.use(router) // Tells Vue to watch the browser URL using this router
app.mount('#app') // Injects App.vue into the <div id="app"> inside index.html