import { partsListStore } from "@/store/partslist-store";
import { partsStore } from "@/store/parts-store";

export async function initStore() {
  await partsListStore.init();
  await partsStore.init();
}
