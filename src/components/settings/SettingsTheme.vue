<template>
  <n-space>
    <n-button @click="changeTheme('dark')">
      {{ $t("settings.theme.dark") }}
    </n-button>
    <n-button @click="changeTheme('light')">
      {{ $t("settings.theme.light") }}
    </n-button>
  </n-space>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { settingsStore } from "@/store/settings-store";

export default defineComponent({
  name: "SettingsTheme",
  methods: {
    changeTheme(theme: string) {
      settingsStore.SetTheme(theme);
    },
  },
});
</script>
