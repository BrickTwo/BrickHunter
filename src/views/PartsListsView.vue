<template>
  <n-space vertical size="large" style="width: 100%">
    <n-layout>
      <n-page-header>
        <template #title>{{ $t("partsList.title", 2) }}</template>
        <template #avatar>
          <n-icon size="20">
            <FormatListBulletedOutlined />
          </n-icon>
        </template>
      </n-page-header>
    </n-layout>
    <n-layout style="width: 100%">
      <n-card style="width: 100%">
        <n-space justify="end">
          <n-button @click="showFileImport = true">
            <template #icon>
              <n-icon>
                <PlusOutlined />
              </n-icon>
            </template>
            {{ $t("fileImport.title") }}
          </n-button>
          <n-button @click="showSetImport = true">
            <template #icon>
              <n-icon>
                <PlusOutlined />
              </n-icon>
            </template>
            LEGO Set
          </n-button>
        </n-space>
        <n-divider />
        <n-space vertical>
          <n-dropdown
            trigger="click"
            :options="bulkOptions"
            placement="bottom-start"
          >
            <n-button :disabled="!checkedPartsLists.length">
              <template #icon>
                <n-icon>
                  <ArrowDropDownOutlined />
                </n-icon>
              </template>
              {{ $t("partsList.actions.bulkAction") }}
            </n-button>
          </n-dropdown>
          <n-data-table
            ref="table"
            max-height="100%"
            :columns="columns"
            :data="partsLists"
            :row-key="(rowData) => rowData.id"
            @update:checked-row-keys="onPartsListCheck"
          />
        </n-space>
      </n-card>
    </n-layout>
  </n-space>

  <FileImportDrawer
    v-model:show="showFileImport"
    @onImported="showFileImport = false"
  />

  <SetImportDrawer v-model:show="showSetImport" />
  <DeletePartsListDialog
    v-if="selectedRow"
    v-model:show="showModalDeleteRequest"
    :partsList="selectedRow"
    @positive-click="onDeleteRequestPositiveClick"
  />
</template>

<script lang="ts">
import { defineComponent, Ref, ref, onBeforeMount, watch } from "vue";
import {
  FormatListBulletedOutlined,
  PlusOutlined,
  DeleteOutlined,
  ArrowDropDownOutlined,
} from "@vicons/material";
import FileImportDrawer from "@/components/partslists/FileImportDrawer.vue";
import SetImportDrawer from "@/components/partslists/SetImportDrawer.vue";
import { partsListStore } from "@/store/partslist-store";
import { useRouter } from "vue-router";
import { IPartsListStore } from "@/types/store-types";
import { PartsListsBulkActions } from "@/service/lists/partsListsBulkActions";
import { PartsListsColumns } from "@/service/lists/partsListColumns";
import DeletePartsListDialog from "@/components/partslists/DeletePartsListDialog.vue";

export default defineComponent({
  name: "PartsListsView",
  components: {
    SetImportDrawer,
    FormatListBulletedOutlined,
    PlusOutlined,
    FileImportDrawer,
    ArrowDropDownOutlined,
    DeleteOutlined,
    DeletePartsListDialog,
  },
  setup() {
    const myRouter = useRouter();
    const showFileImport = ref(false);
    const showSetImport = ref(false);
    const showModalDeleteRequest = ref(false);
    const partsLists = ref(partsListStore.getAllPartsListSortedByName());
    const selectedRow: Ref<IPartsListStore | undefined> = ref(undefined);
    const checkedPartsLists = ref([]);

    const onOpenPartsList = (row: IPartsListStore) => {
      myRouter.push({ path: "/partslists/" + row.id });
    };

    const onAddToCart = (row: IPartsListStore) => {
      row.inCart = !row.inCart;
    };

    const onDelete = (row: IPartsListStore) => {
      selectedRow.value = row;
      showModalDeleteRequest.value = true;
    };

    const onDeleteRequestPositiveClick = () => {
      showModalDeleteRequest.value = false;
      if (!selectedRow.value) return;
      deletePartsList(selectedRow.value);
    };

    const onPartsListCheck = (rowKeys: never[]) => {
      checkedPartsLists.value = rowKeys;
    };

    const deletePartsList = (row: IPartsListStore) => {
      partsListStore.deletePartsList(row.id.toString());
    };

    onBeforeMount(async () => {
      await partsListStore.init();
    });

    watch(
      () => partsListStore.getState(),
      () => {
        partsLists.value = partsListStore.getAllPartsListSortedByName();
      },
      { deep: true }
    );

    watch(
      () => showFileImport.value,
      () => {
        console.log("showFileImport", showFileImport.value);
      }
    );

    return {
      partsLists,
      showFileImport,
      showSetImport,
      showModalDeleteRequest,
      selectedRow,
      checkedPartsLists,
      onDeleteRequestPositiveClick,
      onPartsListCheck,
      bulkOptions: PartsListsBulkActions(),
      columns: PartsListsColumns(onOpenPartsList, onAddToCart, onDelete),
    };
  },
});
</script>
