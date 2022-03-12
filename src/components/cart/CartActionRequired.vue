<template>
  <div class="container" ref="container">
    <n-space justify="space-between">
      <n-alert type="warning">
        The availabilty and prices of the following parts may be outdated.
        Please <b>Check Prices</b> to fix this.
      </n-alert>
      <n-space>
        <n-statistic label="Total Rows">55</n-statistic>
        <n-divider vertical />
        <n-statistic label="Total Parts">152</n-statistic>
        <n-divider vertical />
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
        <n-button @click="showFileImport = true" type="primary" ghost>
          <template #icon>
            <n-icon>
              <DownloadingOutlined />
            </n-icon>
          </template>
          Check Prices
        </n-button>
        <n-button @click="showSetImport = true">
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
      style="height: calc(100vh - 295px)"
      ref="table"
      :columns="columns"
      :data="positions"
      :row-key="(row) => row.rowNumber"
      @update:checked-row-keys="handleCheck"
    />
  </n-space>
</template>

<script lang="ts">
import { NImage, NIcon } from "naive-ui";
import { defineComponent, ref, h } from "vue";
import {
  partsListPositions,
  IPartsListPosition,
} from "../../dummyData/partslist";
import {
  DownloadingOutlined,
  PrintOutlined,
  ArrowDropDownOutlined,
} from "@vicons/material";

const checkedRowKeysRef = ref([]);

const renderIcon = (icon: any) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    });
  };
};

export default defineComponent({
  name: "ActionRequired",
  setup(prop, { emit }) {
    return {
      positions: partsListPositions.positions,
      bulkValue: ref(null),
      bulkOptions: [
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
    DownloadingOutlined,
    PrintOutlined,
    ArrowDropDownOutlined,
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
          expandable: (_: IPartsListPosition, index: number) => true,
          renderExpand: (rowData: IPartsListPosition) => {
            return `${rowData.color.legoName}`;
          },
        },
        {
          title: "Id",
          key: "designId",
        },
        {
          title: "Element",
          key: "itemNumber",
        },
        {
          title: "Picture",
          key: "image.rsc",
          render(row: IPartsListPosition) {
            return h(NImage, {
              src: row.image.rsc,
              height: 50,
              width: 50,
              objectFit: "scale-down",
            });
          },
        },
        {
          title: "Color",
          key: "color.bricksAndPiecesName",
        },
        {
          title: "Qty.",
          key: "qty.min",
        },
        {
          title: "BrickLink",
          key: "brickLink.wantedList.maxprice",
        },
        {
          title: "Pick a Brick",
          key: "pickABrick.variant.price.formattedAmount",
        },
        {
          title: "Bricks & Pieces",
          key: "bricksAndPieces.price.amount",
        },
      ];
    },
  },
});
</script>
