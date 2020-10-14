import Vue from 'vue';
import App from './App.vue';
import store from '../store';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import { ValidationProvider, extend, ValidationObserver } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import VueHtmlToPaper from 'vue-html-to-paper';
/* eslint-disable no-new */
extend('required', required);

const options = {
    name: '_blank',
    specs: ['fullscreen=yes', 'titlebar=yes', 'scrollbars=yes'],
    styles: [
        'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
        'https://unpkg.com/kidlat-css/css/kidlat.css',
    ],
};
window.eventHub = new Vue();
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueHtmlToPaper, options);
Vue.config.productionTip = false;
Vue.filter('formatDate', function(value) {
    if (value) {
        var d = new Date(value);
        if (d.getFullYear() <= '2000') return '00.00.0000, 00:00';
        return d.toLocaleDateString('de-DE', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
        //return moment(String(value)).format('l LT')
    }
});
new Vue({
    store,
    beforeCreate() {
        this.$store.commit('initialiseStore');
    },
    render: (h) => h(App),
}).$mount('#app');
