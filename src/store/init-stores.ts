import { settingsStore } from "@/store/settings-store";
import { partsListStore } from "@/store/partslist-store";
import { partsStore } from "@/store/parts-store";

export async function initStore() {
  await settingsStore.init();
  await partsListStore.init();
  await partsStore.init();
}
