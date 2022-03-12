<template>
  <n-space>
    <n-button @click="changeTheme(darkTheme)">Dark</n-button>
    <n-button @click="changeTheme(null)">Light</n-button>
  </n-space>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { darkTheme } from "naive-ui";
import { BuiltInGlobalTheme } from "naive-ui/lib/themes/interface";

export default defineComponent({
  name: "SettingsTheme",
  data: () => ({
    darkTheme,
  }),
  emits: ["changeTheme"],
  methods: {
    changeTheme(theme: BuiltInGlobalTheme) {
      this.$emit("changeTheme", theme);
    },
  },
});
</script>
