<template>
  <n-grid x-gap="12" :cols="2" style="width: 100%">
    <n-gi>
      <n-space vertical>
        <n-card title="Positions & Prices">
          <template #header-extra>
            <HelpView />
          </template>
          <CartOverviewPositionsAndPrices />
        </n-card>
      </n-space>
    </n-gi>
    <n-gi>
      <n-space vertical>
        <n-card title="Donation">
          <template #header-extra>
            <HelpView />
          </template>
          <CartOverviewDonation />
        </n-card>
      </n-space>
    </n-gi>
  </n-grid>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CartOverviewPositionsAndPrices from "./CartOverviewPositionsAndPrices.vue";
import CartOverviewDonation from "./CartOverviewDonation.vue";
// import { ShoppingCartOutlined } from "@vicons/material";

export default defineComponent({
  name: "CartOverview",
  components: {
    CartOverviewPositionsAndPrices,
    CartOverviewDonation,
  },
  setup(prop, { emit }) {
    return {};
  },
});
</script>
