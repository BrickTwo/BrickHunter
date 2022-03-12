<template>
  <n-space vertical>
    <n-grid x-gap="12" :cols="2">
      <n-gi>
        <n-input-group :style="{ width: '100%' }">
          <n-button disabled style="font-size: 24px; width: 40px">
            <n-icon> <SearchOutlined /> </n-icon>
          </n-button>
          <n-input :style="{ width: '100%' }" clearable />
        </n-input-group>
      </n-gi>
      <n-gi>
        <n-input-group :style="{ width: 'calc(100% - 58px)' }">
          <n-button style="font-size: 24px; width: 40px">
            <n-icon> <SortAscendingOutlined /> </n-icon>
          </n-button>
          <n-select
            :style="{ width: '100%' }"
            v-model:value="value"
            :options="options"
            :consistent-menu-width="false"
          />
        </n-input-group>
        <n-button style="margin-left: 12px" @click="showSettings = true">
          <template #icon>
            <n-icon>
              <SettingsOutlined />
            </n-icon>
          </template>
        </n-button>
      </n-gi>
    </n-grid>
    <n-grid x-gap="12" :cols="10" style="width: 100%">
      <n-gi>
        <n-button style="width: 100%">All</n-button>
      </n-gi>
      <n-gi>
        <n-dropdown trigger="hover" :options="optionsColor">
          <n-button style="width: 100%" dashed> Trans </n-button>
        </n-dropdown>
      </n-gi>
      <n-gi>
        <n-dropdown trigger="hover" :options="optionsColor">
          <n-button style="width: 100%; background-color: rgb(52, 58, 64)" />
        </n-dropdown>
      </n-gi>
      <n-gi>
        <n-dropdown trigger="hover" :options="optionsColor">
          <n-button style="width: 100%; background-color: rgb(127, 30, 6)" />
        </n-dropdown>
      </n-gi>
      <n-gi>
        <n-dropdown trigger="hover" :options="optionsColor">
          <n-button style="width: 100%; background-color: rgb(220, 53, 69)" />
        </n-dropdown>
      </n-gi>
      <n-gi>
        <n-dropdown trigger="hover" :options="optionsColor">
          <n-button style="width: 100%; background-color: rgb(253, 126, 20)" />
        </n-dropdown>
      </n-gi>
      <n-gi>
        <n-dropdown trigger="hover" :options="optionsColor">
          <n-button style="width: 100%; background-color: rgb(255, 193, 7)" />
        </n-dropdown>
      </n-gi>
      <n-gi>
        <n-dropdown trigger="hover" :options="optionsColor">
          <n-button style="width: 100%; background-color: rgb(40, 167, 69)" />
        </n-dropdown>
      </n-gi>
      <n-gi>
        <n-dropdown trigger="hover" :options="optionsColor">
          <n-button style="width: 100%; background-color: rgb(0, 123, 255)" />
        </n-dropdown>
      </n-gi>
      <n-gi>
        <n-dropdown trigger="hover" :options="optionsColor">
          <n-button style="width: 100%; background-color: rgb(111, 66, 193)" />
        </n-dropdown>
      </n-gi>
    </n-grid>
    <n-space justify="space-between">
      <n-select
        v-model:value="pageSize"
        :options="pageSizes"
        style="width: 70px"
      />
      <n-pagination v-model:page="page" :page-count="100" />
      <div style="width: 70px; text-align: right">
        <n-button>
          <template #icon>
            <n-icon>
              <FormatListBulletedOutlined />
            </n-icon>
          </template>
        </n-button>
      </div>
    </n-space>
  </n-space>
  <n-drawer v-model:show="showSettings" :width="800" style="max-width: 100%">
    <BrowsePartsFilterSettingsDrawer />
  </n-drawer>
</template>

<script lang="ts">
import { defineComponent, ref, h } from "vue";
import BrowsePartsFilterSettingsDrawer from "./BrowsePartsFilterSettingsDrawer.vue";
import {
  SearchOutlined,
  SettingsOutlined,
  FormatListBulletedOutlined,
} from "@vicons/material";
import { SortAscendingOutlined } from "@vicons/antd";

const optionsColor = [
  {
    label: "A Color",
    key: "1",
    icon() {
      return h("div", {
        style:
          "background-color: red; border: 1px solid black; width: 13px; height: 13px; margin-right: 5px; display: inline-block;",
      });
    },
  },
  {
    label: "A Color",
    key: "2",
    icon() {
      return h("div", {
        style:
          "background-color: blue; border: 1px solid black; width: 13px; height: 13px; margin-right: 5px; display: inline-block;",
      });
    },
  },
  {
    label: "A Color",
    key: "3",
    icon() {
      return h("div", {
        style:
          "background-color: yellow; border: 1px solid black; width: 13px; height: 13px; margin-right: 5px; display: inline-block;",
      });
    },
  },
  {
    label: "A Color",
    key: "4",
    icon() {
      return h("div", {
        style:
          "background-color: green; border: 1px solid black; width: 13px; height: 13px; margin-right: 5px; display: inline-block;",
      });
    },
  },
];

export default defineComponent({
  name: "BrowsePartsFilter",
  components: {
    BrowsePartsFilterSettingsDrawer,
    SearchOutlined,
    SortAscendingOutlined,
    SettingsOutlined,
    FormatListBulletedOutlined,
  },
  setup() {
    const pageSizes = [
      {
        label: "10",
        value: 10,
      },
      {
        label: "25",
        value: 25,
      },
      {
        label: "50",
        value: 50,
      },
      {
        label: "100",
        value: 100,
      },
    ];
    return {
      value: ref("description"),
      options: [
        {
          label: "Description",
          value: "description",
        },
        {
          label: "Element",
          value: "element",
        },
        {
          label: "Design Number",
          value: "designNumber",
        },
        {
          label: "Price",
          value: "price",
        },
        {
          label: "Max Amount",
          value: "maxAmount",
        },
        {
          label: "First Availability",
          value: "fisrtAvailability",
        },
        {
          label: "Bricks and Pieces Indexing",
          value: "bricksAndPiecesIndexing",
        },
      ],
      optionsColor,
      page: ref(2),
      pageSize: ref(100),
      pageSizes,
      showSettings: ref(false),
    };
  },
});
</script>
