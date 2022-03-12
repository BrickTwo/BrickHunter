import { createRouter, createWebHashHistory } from "vue-router";

import BrowsePartsView from "@/views/BrowsePartsView.vue";
import PartsListsView from "@/views/PartsListsView.vue";
import PartsListView from "@/views/PartsListView.vue";
import CartView from "@/views/CartView.vue";
import SettingsView from "@/views/SettingsView.vue";
import InfoView from "@/views/InfoView.vue";

import { initStore } from "@/store/init-stores";

const routes = [
  { path: "/", component: PartsListsView },
  { path: "/index.html#/", component: SettingsView },
  { path: "/browseparts", name: "browseParts", component: BrowsePartsView },
  { path: "/partslists", name: "partsLists", component: PartsListsView },
  { path: "/partslists/:id", component: PartsListView, props: true },
  { path: "/cart", name: "cart", component: CartView },
  { path: "/settings", name: "settings", component: SettingsView },
  { path: "/help", name: "help", component: InfoView },
  { path: "/info", name: "info", component: InfoView },
];

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes, // short for `routes: routes`
});

router.beforeEach(async () => {
  await initStore();
});

export default router;
