<template>
  <div class="container" ref="container">
    <n-space justify="right">
      <n-statistic label="Total Rows">222</n-statistic>
      <n-divider vertical />
      <n-statistic label="Total Parts">1050</n-statistic>
      <n-divider vertical />
      <n-statistic label="Price">
        305.59 <span style="font-size: 10px">USD</span>
      </n-statistic>
      <n-divider vertical />
    </n-space>
  </div>
  <n-divider style="margin-top: 10px; margin-bottom: 10px" />
  <n-collapse>
    <n-collapse-item name="1">
      <template #header>
        <div class="container" ref="container" style="width: 100%">
          <n-space justify="space-between">
            <n-space vertical justify="center" style="height: 100%">
              <div>A BrickLink Shop name 1</div>
            </n-space>
            <n-space justify="right">
              <n-statistic label="Total Rows">111</n-statistic>
              <n-divider vertical />
              <n-statistic label="Total Parts">550</n-statistic>
              <n-divider vertical />
              <n-statistic label="Price">
                105.50 <span style="font-size: 10px">USD</span>
              </n-statistic>
              <n-divider vertical />
            </n-space>
          </n-space>
        </div>
      </template>
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
            <n-button @click="showSetImport = true">
              <template #icon>
                <n-icon>
                  <PrintOutlined />
                </n-icon>
              </template>
              Print
            </n-button>
            <n-button @click="showSetImport = true" type="primary" ghost>
              <template #icon>
                <n-icon>
                  <SaveAltOutlined />
                </n-icon>
              </template>
              Export
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
        <n-modal
          v-model:show="showMoveToModal"
          :mask-closable="false"
          preset="dialog"
          title="Move To"
          positive-text="Move"
          @positive-click="onPositiveClick"
          @negative-click="onNegativeClick"
          negative-text="Cancel"
        >
          <n-space vertical>
            <n-select :options="moveToOptions" />
            <n-checkbox default-checked value="true" label="All Pieces" />
            <n-input-number v-model:value="moveToValue" :min="1" :max="10" />
          </n-space>
        </n-modal>
      </n-space>
    </n-collapse-item>
    <n-collapse-item name="2">
      <template #header>
        <div class="container" ref="container" style="width: 100%">
          <n-space justify="space-between">
            <n-space vertical justify="center" style="height: 100%">
              <div>A BrickLink Shop name 2</div>
            </n-space>
            <n-space justify="right">
              <n-statistic label="Total Rows">55</n-statistic>
              <n-divider vertical />
              <n-statistic label="Total Parts">300</n-statistic>
              <n-divider vertical />
              <n-statistic label="Price">
                110.59 <span style="font-size: 10px">USD</span>
              </n-statistic>
              <n-divider vertical />
            </n-space>
          </n-space>
        </div>
      </template>
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
            <n-button @click="showSetImport = true">
              <template #icon>
                <n-icon>
                  <PrintOutlined />
                </n-icon>
              </template>
              Print
            </n-button>
            <n-button @click="showSetImport = true" type="primary" ghost>
              <template #icon>
                <n-icon>
                  <SaveAltOutlined />
                </n-icon>
              </template>
              Export
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
        <n-modal
          v-model:show="showMoveToModal"
          :mask-closable="false"
          preset="dialog"
          title="Move To"
          positive-text="Move"
          @positive-click="onPositiveClick"
          @negative-click="onNegativeClick"
          negative-text="Cancel"
        >
          <n-space vertical>
            <n-select :options="moveToOptions" />
            <n-checkbox default-checked value="true" label="All Pieces" />
            <n-input-number v-model:value="moveToValue" :min="1" :max="10" />
          </n-space>
        </n-modal>
      </n-space>
    </n-collapse-item>
    <n-collapse-item name="3">
      <template #header>
        <div class="container" ref="container" style="width: 100%">
          <n-space justify="space-between">
            <n-space vertical justify="center" style="height: 100%">
              <div>A BrickLink Shop name 3</div>
            </n-space>
            <n-space justify="right">
              <n-statistic label="Total Rows">56</n-statistic>
              <n-divider vertical />
              <n-statistic label="Total Parts">200</n-statistic>
              <n-divider vertical />
              <n-statistic label="Price">
                89.50 <span style="font-size: 10px">USD</span>
              </n-statistic>
              <n-divider vertical />
            </n-space>
          </n-space>
        </div>
      </template>
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
            <n-button @click="showSetImport = true">
              <template #icon>
                <n-icon>
                  <PrintOutlined />
                </n-icon>
              </template>
              Print
            </n-button>
            <n-button @click="showSetImport = true" type="primary" ghost>
              <template #icon>
                <n-icon>
                  <SaveAltOutlined />
                </n-icon>
              </template>
              Export
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
        <n-modal
          v-model:show="showMoveToModal"
          :mask-closable="false"
          preset="dialog"
          title="Move To"
          positive-text="Move"
          @positive-click="onPositiveClick"
          @negative-click="onNegativeClick"
          negative-text="Cancel"
        >
          <n-space vertical>
            <n-select :options="moveToOptions" />
            <n-checkbox default-checked value="true" label="All Pieces" />
            <n-input-number v-model:value="moveToValue" :min="1" :max="10" />
          </n-space>
        </n-modal>
      </n-space>
    </n-collapse-item>
  </n-collapse>
</template>

<script lang="ts">
import { NImage, NIcon, NSpace, NButton } from "naive-ui";
import { defineComponent, ref, h } from "vue";
import {
  partsListPositions,
  IPartsListPosition,
} from "../../dummyData/partslist";
import {
  PrintOutlined,
  ArrowDropDownOutlined,
  SaveAltOutlined,
  CallSplitOutlined,
} from "@vicons/material";

const checkedRowKeysRef = ref([]);

const renderIcon = (icon: any) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    });
  };
};

interface IMoveToFunction {
  (rowData: unknown): void;
}

export default defineComponent({
  name: "BrickLink",
  setup(prop, { emit }) {
    const showMoveToModal = ref(false);

    return {
      positions: partsListPositions.positions,
      bulkValue: ref(null),
      showMoveToModal: showMoveToModal,
      moveToValue: ref(10),
      bulkOptions: [
        {
          label: "Print",
          key: "print",
          icon: renderIcon(PrintOutlined),
        },
        {
          label: "Move To",
          key: "moveTo",
          icon: renderIcon(CallSplitOutlined),
        },
      ],
      handleBack() {
        emit("changePage", "partslists");
      },
      moveTo(row: any) {
        console.log(row);
        showMoveToModal.value = true;
      },
      moveToOptions: [
        {
          label: "Bricks & Pieces",
          value: "bricksAndPieces",
        },
        {
          label: "PickABrick",
          value: "pickABrick",
        },
      ],
    };
  },
  emits: ["changePage"],
  components: {
    PrintOutlined,
    ArrowDropDownOutlined,
    SaveAltOutlined,
  },
  data: () => ({
    columns: [] as unknown,
    checkedRowKeys: checkedRowKeysRef,
  }),
  beforeMount() {
    this.columns = this.createColumns(this.moveTo);
  },
  //mixins: [partsListMixin],
  methods: {
    handleCheck(rowKeys: never[]) {
      checkedRowKeysRef.value = rowKeys;
    },
    createColumns(moveTo: IMoveToFunction) {
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
        {
          title: "Action",
          key: "actions",
          render(row: any) {
            return h(NSpace, {}, [
              h(
                NButton,
                {
                  id: "addToCart",
                  size: "small",
                  onClick: () => moveTo(row),
                },
                {
                  default: () => "Move To",
                  icon: () =>
                    h(NIcon, null, { default: () => h(CallSplitOutlined) }),
                }
              ),
            ]);
          },
        },
      ];
    },
  },
});
</script>
