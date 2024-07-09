import { registerPlugins } from '@/plugins'
import App from './App.vue'
import { createApp } from 'vue'
import router from './router'
import Notifications from '@kyvg/vue3-notification'

const app = createApp(App);
registerPlugins(app);
app.use(router);
app.use(Notifications);
app.mount('#app');
