<template>
  <n-space vertical size="large" style="width: 100%">
    <n-layout>
      <n-page-header>
        <template #title>Settings</template>
        <template #avatar>
          <n-icon size="20"> <LibraryBooksOutlined /> </n-icon>
        </template>
      </n-page-header>
    </n-layout>
    <n-layout style="width: 100%">
      <n-grid x-gap="12" :cols="2">
        <n-gi>
          <n-space vertical>
            <n-card title="Theme">
              <template #header-extra>
                <HelpView />
              </template>
              <SettingsTheme @changeTheme="changeTheme" />
            </n-card>
            <n-card title="Synchronize & Backup">
              <template #header-extra>
                <HelpView />
              </template>
              <SettingsSynchronizeAndBackup />
            </n-card>
            <n-card title="LEGO.com">
              <template #header-extra>
                <HelpView />
              </template>
              <SettingsLegoCom />
            </n-card>
          </n-space>
        </n-gi>
        <n-gi>
          <n-space vertical>
            <n-card title="Sources">
              <template #header-extra>
                <HelpView />
              </template>
              <SettingsSources />
            </n-card>
            <n-card title="Table fields">
              <template #header-extra>
                <HelpView />
              </template>
              <SettingsTableFields />
            </n-card>
          </n-space>
        </n-gi>
      </n-grid>
    </n-layout>
  </n-space>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { LibraryBooksOutlined } from "@vicons/material";
import { BuiltInGlobalTheme } from "naive-ui/lib/themes/interface";
import SettingsTheme from "@/components/settings/SettingsTheme.vue";
import SettingsSynchronizeAndBackup from "@/components/settings/SettingsSynchronizeAndBackup.vue";
import SettingsLegoCom from "@/components/settings/SettingsLegoCom.vue";
import SettingsSources from "@/components/settings/SettingsSources.vue";
import SettingsTableFields from "@/components/settings/SettingsTableFields.vue";
import HelpView from "@/views/HelpView.vue";

export default defineComponent({
  name: "SettingsView",
  emits: ["changeTheme"],
  components: {
    LibraryBooksOutlined,
    SettingsTheme,
    SettingsSynchronizeAndBackup,
    SettingsLegoCom,
    SettingsSources,
    SettingsTableFields,
    HelpView,
  },
  methods: {
    changeTheme(theme: BuiltInGlobalTheme) {
      this.$emit("changeTheme", theme);
    },
  },
});
</script>
