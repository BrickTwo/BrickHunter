<template>
  <n-space vertical size="large" style="width: 100%">
    <n-layout>
      <n-page-header>
        <template #title>Shopping Cart</template>
        <template #avatar>
          <n-icon size="20"> <ShoppingCartOutlined /> </n-icon>
        </template>
      </n-page-header>
    </n-layout>
    <n-layout style="width: 100%">
      <n-card style="width: 100%" content-style="padding: 0">
        <n-tabs
          type="line"
          tab-style="min-width: 80px;"
          :tabs-padding="20"
          pane-style="padding: 20px 24px; width: calc(100% - 48px)"
        >
          <n-tab-pane tab="Overview" name="overview">
            <Overview />
          </n-tab-pane>
          <n-tab-pane tab="Settings" name="settings">
            <Settings />
          </n-tab-pane>
          <n-tab-pane
            :tab="`Bestseller (${totalUniquePartsBestseller})`"
            name="bestseller"
          >
            <Bestseller />
          </n-tab-pane>
          <n-tab-pane
            :tab="`Standard (${totalUniquePartsStandard})`"
            name="standard"
          >
            <Standard />
          </n-tab-pane>
          <n-tab-pane
            :tab="`BrickLink (${totalUniquePartsBrickLink})`"
            name="brickLink"
          >
            <BrickLink />
          </n-tab-pane>
          <!-- <n-tab-pane tab="Set (5)" name="set">
            <BrickLink />
          </n-tab-pane> -->
        </n-tabs>
      </n-card>
    </n-layout>
  </n-space>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onBeforeMount } from "vue";
import { ShoppingCartOutlined } from "@vicons/material";
import Settings from "@/components/cart/settings/CartSettings.vue";
import Overview from "@/components/cart/overview/CartOverview.vue";
import ActionRequired from "@/components/cart/CartActionRequired.vue";
import Bestseller from "@/components/cart/CartBestseller.vue";
import Standard from "@/components/cart/CartStandard.vue";
import BrickLink from "@/components/cart/CartBrickLink.vue";
import { cartsStore } from "@/store/carts-store";
import { partsStore } from "@/store/parts-store";
import { CartType } from "@/types/store-types";

export default defineComponent({
  name: "PartsListsView",
  components: {
    ShoppingCartOutlined,
    Settings,
    Overview,
    ActionRequired,
    Bestseller,
    Standard,
    BrickLink,
  },
  setup() {
    const totalUniquePartsBestseller = ref(0);
    const totalUniquePartsStandard = ref(0);
    const totalUniquePartsBrickLink = ref(0);

    onBeforeMount(async () => {
      await partsStore.loadPaB();
      totalUniquePartsBestseller.value =
        cartsStore.getTotalOpenUniquePartsByType(CartType.Bestseller);
      totalUniquePartsStandard.value = cartsStore.getTotalOpenUniquePartsByType(
        CartType.Standard
      );
      totalUniquePartsBrickLink.value =
        cartsStore.getTotalOpenUniquePartsByType(CartType.BrickLink);
    });

    watch(
      () => cartsStore.getState(),
      async () => {
        totalUniquePartsBestseller.value =
          cartsStore.getTotalOpenUniquePartsByType(CartType.Bestseller);
        totalUniquePartsStandard.value =
          cartsStore.getTotalOpenUniquePartsByType(CartType.Standard);
        totalUniquePartsBrickLink.value =
          cartsStore.getTotalOpenUniquePartsByType(CartType.BrickLink);
      },
      { deep: true }
    );

    return {
      totalUniquePartsBestseller,
      totalUniquePartsStandard,
      totalUniquePartsBrickLink,
    };
  },
});
</script>
