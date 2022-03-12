<template>
  <n-form-item label="Priority 1">
    <n-select v-model:value="valuePrio1" :options="options" />
  </n-form-item>
  <n-form-item label="Priority 2">
    <n-select v-model:value="valuePrio2" :options="options" />
  </n-form-item>
  <n-form-item label="Priority 3">
    <n-select v-model:value="valuePrio3" :options="options" />
  </n-form-item>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
// import { ShoppingCartOutlined } from "@vicons/material";

export default defineComponent({
  name: "CartSettingsPriority",
  // components: {
  //   ShoppingCartOutlined,
  // },
  setup() {
    return {
      valuePrio1: ref("bricksAndPieces"),
      valuePrio2: ref("pickABrick"),
      valuePrio3: ref("brickLink"),
      options: [
        {
          label: "Bricks & Pieces",
          value: "bricksAndPieces",
        },
        {
          label: "Pick a Brick",
          value: "pickABrick",
        },
        {
          label: "BrickLink",
          value: "brickLink",
        },
      ],
    };
  },
});
</script>
