import { createApp } from "vue";
import App from "../standalone.vue";
import router from "../router";
import naive from "naive-ui";
import createI18n from "../i18n";

createApp(App).use(router).use(createI18n).use(naive).mount("#app");
