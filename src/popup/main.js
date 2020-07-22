import Vue from 'vue'
import App from './App.vue'
import store from "../store";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import BootstrapVue from "bootstrap-vue";
import { ValidationProvider, extend, ValidationObserver } from "vee-validate";
import { required } from "vee-validate/dist/rules";
/* eslint-disable no-new */
extend("required", required);
Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);
Vue.use(BootstrapVue);
Vue.config.productionTip = false;
new Vue({
store,
  render: h => h(App)
}).$mount("#app");