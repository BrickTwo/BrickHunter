import { createApp } from "vue";
import App from "../options.vue";
import router from "../router";
import naive from "naive-ui";

createApp(App).use(router).use(naive).mount("#app");
