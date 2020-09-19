import Vue from 'vue'
import App from './App.vue'
import store from "../store";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import { ValidationProvider, extend, ValidationObserver } from "vee-validate";
import { required } from "vee-validate/dist/rules";
import VueHtmlToPaper from 'vue-html-to-paper';
/* eslint-disable no-new */
extend("required", required);

const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
    'https://unpkg.com/kidlat-css/css/kidlat.css'
  ]
}

Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueHtmlToPaper, options);
Vue.config.productionTip = false;
new Vue({
store,
  render: h => h(App)
}).$mount("#app");