<template>
  <div>
    <n-space vertical size="large" style="width: 100%">
      <n-layout>
        <n-page-header @back="$router.push({ path: `/partslists/${id}` })">
          <template #title>{{ $t("partsList.actions.print") }}</template>
          <!-- <template #extra><Help /></template> -->
          <template #avatar>
            <n-icon size="20">
              <ManageSearchOutlined />
            </n-icon>
          </template>
        </n-page-header>
      </n-layout>
      <n-layout style="width: 100%">
        <n-card style="width: 100%" v-if="partsList">
          <div style="width: 100%" class="container" ref="container">
            <n-space justify="space-between">
              <n-space vertical size="small" style="padding: 0; margin: 0">
                <n-h1 style="padding: 0; margin: 0; line-height: 35px">
                  {{ partsList.name }}
                </n-h1>
                <n-space>
                  <n-button v-print="printObj">
                    <template #icon>
                      <n-icon>
                        <PrintOutlined />
                      </n-icon>
                    </template>
                    {{ $t("partsList.actions.print") }}
                  </n-button>
                </n-space>
              </n-space>
            </n-space>
          </div>
          <n-divider style="margin-top: 10px; margin-bottom: 10px" />
          <n-config-provider :theme="lightTheme">
            <n-space vertical id="printMe">
              <PartDataTable :partsList="partsList" :print="true" />
            </n-space>
          </n-config-provider>
        </n-card>
      </n-layout>
    </n-space>
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, onBeforeMount } from "vue";
import { partsListStore } from "@/store/partslist-store";
import { IPartsList } from "@/types/types";
import PartDataTable from "@/components/partDataTable/partDataTable.vue";
import { PrintOutlined, ManageSearchOutlined } from "@vicons/material";
import print from "@/service/print";
import { lightTheme } from "naive-ui";

export default defineComponent({
  name: "PrintView",
  props: ["type", "id"],
  directives: {
    print,
  },
  setup(prop) {
    const partsList: Ref<IPartsList | undefined> = ref({} as IPartsList);

    const printObj = ref({
      id: "printMe",
      popTitle: "good print",
      preview: false,
    });

    onBeforeMount(async () => {
      partsList.value = await partsListStore.getPartsListWithDetail(prop.id);
    });

    return {
      partsList,
      printObj,
      lightTheme,
    };
  },
  components: {
    ManageSearchOutlined,
    PrintOutlined,
    PartDataTable,
  },
});
</script>
