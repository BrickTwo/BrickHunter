<template>
  <n-grid x-gap="12" :cols="2" style="width: 100%">
    <n-gi>
      <n-space vertical>
        <n-card title="Priority">
          <template #header-extra>
            <HelpView />
          </template>
          <CartSettingsPriority />
        </n-card>
        <n-card title="General">
          <template #header-extra>
            <HelpView />
          </template>
          <CartSettingsGeneral />
        </n-card>
      </n-space>
    </n-gi>
    <n-gi>
      <n-space vertical>
        <n-card title="Splitting">
          <template #header-extra>
            <HelpView />
          </template>
          <CartSettingsSplitting />
        </n-card>
      </n-space>
    </n-gi>
  </n-grid>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CartSettingsPriority from "./CartSettingsPriority.vue";
import CartSettingsSplitting from "./CartSettingsSplitting.vue";
import CartSettingsGeneral from "./CartSettingsGeneral.vue";
// import { HelpOutlineFilled } from "@vicons/material";
import HelpView from "@/views/HelpView.vue";

export default defineComponent({
  name: "CartSettings",
  components: {
    CartSettingsPriority,
    CartSettingsSplitting,
    CartSettingsGeneral,
    HelpView,
  },
  setup(prop, { emit }) {
    return {};
  },
});
</script>
