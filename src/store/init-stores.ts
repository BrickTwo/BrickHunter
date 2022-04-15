import { settingsStore } from "@/store/settings-store";
import { partsListStore } from "@/store/partslist-store";
import { partsStore } from "@/store/parts-store";
import { cartsStore } from "@/store/carts-store";

export async function initStore() {
  await settingsStore.init();
  await partsStore.init();
  await partsListStore.init();
  await cartsStore.init();
}
