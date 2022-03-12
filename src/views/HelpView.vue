<template>
  <n-popover trigger="hover">
    <template #trigger>
      <n-button text>
        <n-icon size="medium">
          <HelpOutlineFilled />
        </n-icon>
      </n-button>
    </template>
    <span> Help </span>
  </n-popover>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { HelpOutlineFilled } from "@vicons/material";

export default defineComponent({
  name: "HelpView",
  components: {
    HelpOutlineFilled,
  },
  setup() {
    return {};
  },
});
</script>
