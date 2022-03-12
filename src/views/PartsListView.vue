<template>
  <n-space vertical size="large" style="width: 100%">
    <n-layout>
      <n-page-header @back="handleBack">
        <template #title>Parts List</template>
        <!-- <template #extra><Help /></template> -->
        <template #avatar>
          <n-icon size="20">
            <ManageSearchOutlined />
          </n-icon>
        </template>
      </n-page-header>
    </n-layout>
    <n-layout style="width: 100%" v-if="partsList">
      <n-card style="width: 100%">
        <div class="container" ref="container">
          <n-space justify="space-between">
            <n-space vertical size="small" style="padding: 0; margin: 0">
              <n-h1 style="padding: 0; margin: 0; line-height: 35px">
                {{ partsList.name }}
              </n-h1>
              <n-space>
                <n-button>
                  <template #icon>
                    <n-icon>
                      <DeleteOutlined />
                    </n-icon>
                  </template>
                  Delete
                </n-button>
                <n-button>
                  <template #icon>
                    <n-icon>
                      <ModeEditOutlined />
                    </n-icon>
                  </template>
                  Rename
                </n-button>
                <n-button>
                  <template #icon>
                    <n-icon>
                      <SaveAltOutlined />
                    </n-icon>
                  </template>
                  Export
                </n-button>
              </n-space>
            </n-space>
            <n-space>
              <n-statistic label="Total Rows">
                {{ partsList.parts.length }}
              </n-statistic>
              <n-divider vertical />
              <n-statistic label="Total Parts">
                {{
                  partsList.parts
                    .map((p) => p.qty)
                    .reduce((prev, curr) => prev + curr, 0)
                }}
              </n-statistic>
              <n-divider vertical />
              <n-statistic label="Pick a Brick">25</n-statistic>
              <n-divider vertical />
              <n-statistic label="Bricks & Pieces">442</n-statistic>
            </n-space>
          </n-space>
        </div>
        <n-divider style="margin-top: 10px; margin-bottom: 10px" />
        <n-space vertical>
          <n-space justify="space-between">
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
            <n-space justify="end">
              <n-button type="primary" ghost>
                <template #icon>
                  <n-icon>
                    <DownloadingOutlined />
                  </n-icon>
                </template>
                Check Prices
              </n-button>
              <n-button>
                <template #icon>
                  <n-icon>
                    <PrintOutlined />
                  </n-icon>
                </template>
                Print
              </n-button>
            </n-space>
          </n-space>
          <n-data-table
            size="small"
            virtual-scroll
            flex-height
            style="height: calc(100vh - 280px)"
            ref="table"
            :columns="columns"
            :data="partsList.parts"
            :row-key="
              (rowData) => {
                return rowData.id + '+' + rowData.color.id;
              }
            "
            @update:checked-row-keys="handleCheck"
          />
        </n-space>
      </n-card>
    </n-layout>
  </n-space>
</template>

<script lang="ts">
import { NIcon, NImage } from "naive-ui";
import { defineComponent, Ref, ref, h, watch } from "vue";
import { partsListPositions } from "@/dummyData/partslist";
import {
  DeleteOutlined,
  ModeEditOutlined,
  DownloadingOutlined,
  PrintOutlined,
  SaveAltOutlined,
  ManageSearchOutlined,
  ArrowDropDownOutlined,
  CallSplitOutlined,
  ContentCopyOutlined,
} from "@vicons/material";
// import Help from "../../general/Help.vue";
import { partsListStore } from "@/store/partslist-store";
import { IPartsList, IParts } from "@/types/types";

const checkedRowKeysRef = ref([]);

const renderIcon = (icon: any) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    });
  };
};

export default defineComponent({
  name: "PartsListView",
  props: ["id"],
  setup(prop, { emit }) {
    const partsList: Ref<IPartsList | undefined> = ref({} as IPartsList);

    watch(
      () => partsListStore.getDetailedPartsList(prop.id),
      () => {
        partsList.value = partsListStore.getDetailedPartsList(prop.id);
        console.log("current partsList", partsList, partsList.value);
      },
      { deep: true }
    );

    partsList.value = partsListStore.getDetailedPartsList(prop.id);

    return {
      partsList,
      positions: partsListPositions.positions,
      bulkValue: ref(null),
      bulkOptions: [
        {
          label: "Delete",
          key: "delete",
          icon: renderIcon(DeleteOutlined),
        },
        {
          label: "Copy to",
          key: "copyTo",
          icon: renderIcon(ContentCopyOutlined),
        },
        {
          label: "Split",
          key: "split",
          icon: renderIcon(CallSplitOutlined),
        },
        {
          label: "Check Prices",
          key: "checkPrices",
          icon: renderIcon(DownloadingOutlined),
        },
        {
          label: "Print",
          key: "print",
          icon: renderIcon(PrintOutlined),
        },
      ],
      handleBack() {
        emit("changePage", "partslists");
      },
    };
  },
  emits: ["changePage"],
  components: {
    DeleteOutlined,
    ModeEditOutlined,
    DownloadingOutlined,
    PrintOutlined,
    SaveAltOutlined,
    ManageSearchOutlined,
    ArrowDropDownOutlined,
    // Help,
  },
  data: () => ({
    columns: [] as unknown,
    checkedRowKeys: checkedRowKeysRef,
  }),
  beforeMount() {
    this.columns = this.createColumns();
  },
  //mixins: [partsListMixin],
  methods: {
    handleCheck(rowKeys: never[]) {
      checkedRowKeysRef.value = rowKeys;
    },
    createColumns() {
      return [
        {
          type: "selection",
        },
        {
          type: "expand",
          expandable: () => true,
          renderExpand: (rowData: IParts) => {
            return `${rowData.name}`;
          },
        },
        {
          title: "Id",
          key: "id",
          sortOrder: false,
          sorter(rowA: IParts, rowB: IParts) {
            return rowA.id > rowB.id;
          },
        },
        {
          title: "Element",
          key: "elementId",
          sortOrder: false,
          sorter(rowA: IParts, rowB: IParts) {
            return rowA.elementId > rowB.elementId;
          },
        },
        {
          title: "Picture",
          render(rowData: IParts) {
            return h(NImage, {
              src: rowData.imageUrl,
              height: 50,
              width: 50,
              objectFit: "scale-down",
            });
          },
        },
        {
          title: "Color",
          render(rowData: IParts) {
            return h(
              "span",
              {
                style: "display: block",
              },
              [
                h("div", {
                  style: `background-color: #${rowData.color.rgb}; border: 1px solid black; width: 13px; height: 13px; margin-right: 5px; display: inline-block`,
                }),
                h("span", {
                  innerHTML: rowData.color.name,
                }),
              ]
            );
          },
        },
        {
          title: "Qty.",
          key: "qty",
        },
        {
          title: "BrickLink",
          key: "brickLink.wantedList.maxprice",
        },
        {
          title: "PaB Bestseller",
          key: "pickABrick.variant.price.formattedAmount",
        },
        {
          title: "PaB Standard",
          key: "bricksAndPieces.price.amount",
        },
      ];
    },
  },
});
</script>
