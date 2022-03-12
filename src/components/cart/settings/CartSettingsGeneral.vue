<template>
  <n-space vertical>
    <n-checkbox
      value="Pushes Open"
      label="Subtract WantedList-Have from number"
      default-checked
    />
    <n-checkbox
      value="Pushes Open"
      label="Do not take BrickLink prices into account"
    />
    <n-space>
      <n-checkbox value="Pushes Open">
        <div style="height: 34px; line-height: 34px">
          Only add to BrickLink if price is
        </div>
      </n-checkbox>
      <n-input-number v-model:value="valueMin" :min="0" step="0.01" />
      <n-select v-model:value="value" :options="options" />
      <div style="height: 34px; line-height: 34px">cheaper.</div>
    </n-space>
  </n-space>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
// import { ShoppingCartOutlined } from "@vicons/material";

export default defineComponent({
  name: "CartSettingsSettings",
  // components: {
  //   ShoppingCartOutlined,
  // },
  setup(prop, { emit }) {
    return {
      valueMin: ref(0),
      value: ref("USD"),
      options: [
        {
          label: "USD",
          value: "currency",
        },
        {
          label: "%",
          value: "percent",
        },
      ],
    };
  },
});
</script>
