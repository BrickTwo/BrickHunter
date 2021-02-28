import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import store from '../store';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import { ValidationProvider, extend, ValidationObserver } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import VueHtmlToPaper from 'vue-html-to-paper';
import VueScrollTo from 'vue-scrollto';

import SingleParts from '@/components/singleParts/Index.vue';
import Import from '@/components/import/Index.vue';
import PartLists from '@/components/partLists/PartLists.vue';
import PartList from '@/components/partLists/PartList.vue';
import Shopping from '@/components/shopping/Index.vue';
import Export from '@/components/export/Index.vue';
import Export2 from '@/components/export/Export.vue';
import Info from '@/components/Info.vue';
import Settings from '@/components/Settings.vue';

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

const routes = [
    { path: '/singleParts', component: SingleParts },
    { path: '/import', component: Import },
    { path: '/partLists', component: PartLists },
    { path: '/partLists/:id', component: PartList },
    { path: '/shopping', component: Shopping },
    { path: '/export', component: Export },
    { path: '/export/:id', component: Export2 },
    { path: '/info', component: Info },
    { path: '/settings', component: Settings },
];

const router = new VueRouter({
    routes, // short for `routes: routes`
});

window.eventHub = new Vue();
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
Vue.use(VueRouter);
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueHtmlToPaper, options);
Vue.use(VueScrollTo);
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
    router,
    beforeCreate() {
        this.$store.dispatch('initialiseStore');
        this.$store.commit('setMode', 'standalone');
    },
    render: (h) => h(App),
}).$mount('#app');
