<template>
  <n-space vertical size="large" style="width: 100%">
    <n-layout>
      <n-page-header>
        <template #title>Parts Lists</template>
        <!-- <template #extra> <Help /> </template> -->
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
            File Import
          </n-button>
          <n-button @click="showSetImport = true">
            <template #icon>
              <n-icon>
                <PlusOutlined />
              </n-icon>
            </template>
            LEGO Set
          </n-button>
          <!-- <n-button @click="send()">
            <template #icon>
              <n-icon>
                <PlusOutlined />
              </n-icon>
            </template>
            Test {{ iteration }}
          </n-button>-->
        </n-space>
        <n-divider />
        <n-space vertical>
          <n-dropdown
            trigger="click"
            :options="bulkOptions"
            placement="bottom-start"
          >
            <n-button :disabled="!checkedRowKeys.length">
              <template #icon>
                <n-icon>
                  <ArrowDropDownOutlined />
                </n-icon>
              </template>
              Bulk Action
            </n-button>
          </n-dropdown>
          <n-data-table
            ref="table"
            max-height="100%"
            :columns="columns"
            :data="partsLists"
            :row-key="(rowData) => rowData.id"
            @update:checked-row-keys="handleCheck"
          />
        </n-space>
      </n-card>
    </n-layout>
  </n-space>

  <FileImportDrawer
    v-model:show="showFileImport"
    @close="showFileImport = false"
    @imported="showFileImport = false"
  />

  <n-drawer v-model:show="showSetImport" :width="800" style="max-width: 100%">
    <SetImportDrawer />
  </n-drawer>
  <n-modal
    v-model:show="showModalDeleteRequest"
    :mask-closable="false"
    preset="dialog"
    type="warning"
    title="Delete"
    positive-text="Confirm"
    negative-text="Cancel"
    @positive-click="onDeleteRequestPositiveClick"
    @negative-click="onDeleteRequestNegativeClick"
  >
    <div>
      Are you sure you want to delete the following part list? <br />
      <p>{{ selectedRow?.name }}</p>
    </div>
  </n-modal>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, h, onBeforeMount, watch } from "vue";
import { NIcon, NButton, NSpace } from "naive-ui";
//import browser from "webextension-polyfill";
import {
  FormatListBulletedOutlined,
  ManageSearchOutlined,
  PlusOutlined,
  SaveAltOutlined,
  DeleteOutlined,
  DownloadingOutlined,
  ArrowDropDownOutlined,
  ShoppingCartOutlined,
} from "@vicons/material";
import FileImportDrawer from "@/components/partslists/FileImportDrawer.vue";
import SetImportDrawer from "@/components/partslists/SetImportDrawer.vue";
import { partsListStore } from "@/store/partslist-store";
import { useRouter } from "vue-router";
// import { partStore } from "@/store/part-store";
// import Help from "../general/Help.vue";

interface IRowData {
  id: number;
  name: string;
  positions: number;
}

const checkedRowKeysRef = ref([]);

const renderIcon = (icon: any) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    });
  };
};

export default defineComponent({
  name: "PartsListsView",
  components: {
    SetImportDrawer,
    FormatListBulletedOutlined,
    PlusOutlined,
    FileImportDrawer,
    ArrowDropDownOutlined,
    DeleteOutlined,
    // Help,
  },
  setup() {
    onBeforeMount(async () => {
      await partsListStore.init();
    });

    const myRouter = useRouter();
    const showFileImport = ref(false);
    const showSetImport = ref(false);
    const showModalDeleteRequest = ref(false);
    const partsLists: Ref<IRowData[]> = ref([]);
    const state = partsListStore.getState();
    const selectedRow: Ref<IRowData | undefined> = ref(undefined);

    watch(
      () => partsListStore.getState(),
      (state) => {
        partsLists.value = [];
        state.entries.forEach((partsList) => {
          partsLists.value.push({
            id: partsList.id,
            name: partsList.name,
            positions: partsList.parts.length,
          } as unknown as IRowData);
        });
      },
      { deep: true }
    );

    state.entries.forEach((partsList) => {
      partsLists.value.push({
        id: partsList.id,
        name: partsList.name,
        positions: partsList.parts.length,
      } as unknown as IRowData);
    });

    const columns = [
      {
        type: "selection",
      },
      {
        title: "Name",
        key: "name",
      },
      {
        title: "Positions",
        key: "positions",
      },
      {
        title: "Action",
        key: "actions",
        render(row: IRowData) {
          return h(NSpace, {}, () => [
            h(
              NButton,
              {
                id: "openPartsList",
                size: "small",
                onClick: () => openPartsList(row),
              },
              {
                default: () => "Open",
                icon: () =>
                  h(NIcon, null, { default: () => h(ManageSearchOutlined) }),
              }
            ),
            h(
              NButton,
              {
                id: "addToCart",
                size: "small",
                onClick: () => addToCart(row),
              },
              {
                default: () => "Add to Cart",
                icon: () =>
                  h(NIcon, null, { default: () => h(ShoppingCartOutlined) }),
              }
            ),
            h(
              NButton,
              {
                id: "delete",
                size: "small",
                onClick: () => {
                  selectedRow.value = row;
                  showModalDeleteRequest.value = true;
                },
              },
              {
                default: () => "Delete",
                icon: () =>
                  h(NIcon, null, { default: () => h(ShoppingCartOutlined) }),
              }
            ),
          ]);
        },
      },
    ];

    const deletePartsList = (row: IRowData) => {
      console.log("delete", row.id);
      // todo: add confirmation request
      partsListStore.deletePartsList(row.id.toString());
    };

    const openPartsList = (row: IRowData) => {
      //console.log(row);
      myRouter.push({ path: "/partslists/" + row.id });
      //this.$emit("changePage", "partslist");
    };

    const addToCart = (row: IRowData) => {
      console.log(row);
    };

    const send = async () => {
      // partStore.addPart(3004);
      // partStore.addPart(3005);
      // partStore.addPart(3006);
      // console.log(partStore.getState());
      /*let response = await browser.runtime.sendMessage({ function: "findBrick" }).then((response: any) => {
        console.log(response);
      });*/
    };

    return {
      partsLists,
      columns,
      showFileImport,
      showSetImport,
      showModalDeleteRequest,
      selectedRow,
      bulkOptions: [
        {
          label: "Show",
          key: "show",
          icon: renderIcon(ManageSearchOutlined),
        },
        {
          label: "Delete",
          key: "delete",
          icon: renderIcon(DeleteOutlined),
        },
        {
          label: "Export",
          key: "export",
          icon: renderIcon(SaveAltOutlined),
        },
        {
          label: "Check Prices",
          key: "checkPrices",
          icon: renderIcon(DownloadingOutlined),
        },
        {
          label: "Add to Cart",
          key: "shoopingCart",
          icon: renderIcon(DeleteOutlined),
        },
      ],
      onDeleteRequestPositiveClick() {
        showModalDeleteRequest.value = false;
        if (!selectedRow.value) return;
        deletePartsList(selectedRow.value);
      },
      onDeleteRequestNegativeClick() {
        showModalDeleteRequest.value = false;
      },

      send,
    };
  },
  data: () => ({
    checkedRowKeys: checkedRowKeysRef,
    iteration: 0,
  }),
  //emits: ["changePage"],
  mounted() {
    //console.log("mounted");
    // browser.runtime.onMessage.addListener(function (request) {
    //   //console.log(request);
    //   /*if (request.function === "ping") {
    //     this.iteration = request.iteration;
    //   }*/
    // });
  },
  methods: {
    handleCheck(rowKeys: never[]) {
      checkedRowKeysRef.value = rowKeys;
    },

    // async send() {

    //   //let response = await chrome.runtime.sendMessage({function: "start"});
    //   let response = await browser.runtime.sendMessage({ function: "findBrick" }).then(response => {
    //     console.log(response);
    //   });

    // }
  },
});
</script>
