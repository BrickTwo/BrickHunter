<template>
  <n-space vertical size="large" style="width: 100%">
    <n-layout>
      <n-page-header @back="handleBack">
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
          <n-tab-pane tab="Action Required (55)" name="actionRequired">
            <ActionRequired />
          </n-tab-pane>
          <n-tab-pane tab="Bricks & Pieces (225)" name="bricksAndPieces">
            <BricksAndPieces />
          </n-tab-pane>
          <n-tab-pane tab="Pick a Brick (25)" name="pickABrick">
            <PickABrick />
          </n-tab-pane>
          <n-tab-pane tab="BrickLink (35)" name="brickLink">
            <BrickLink />
          </n-tab-pane>
          <n-tab-pane tab="Set (5)" name="set">
            <BrickLink />
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </n-layout>
  </n-space>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ShoppingCartOutlined } from "@vicons/material";
import Settings from "@/components/cart/settings/CartSettings.vue";
import Overview from "@/components/cart/overview/CartOverview.vue";
import ActionRequired from "@/components/cart/CartActionRequired.vue";
import BricksAndPieces from "@/components/cart/CartBricksAndPieces.vue";
import PickABrick from "@/components/cart/CartPickABrick.vue";
import BrickLink from "@/components/cart/CartBrickLink.vue";

export default defineComponent({
  name: "PartsListsView",
  components: {
    ShoppingCartOutlined,
    Settings,
    Overview,
    ActionRequired,
    BricksAndPieces,
    PickABrick,
    BrickLink,
  },
  setup(prop, { emit }) {
    return {
      handleBack() {
        emit("changePage", "partslists");
      },
    };
  },
});
</script>
