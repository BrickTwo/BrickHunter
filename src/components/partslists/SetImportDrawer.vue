<template>
  <n-drawer-content title="Set Import" closable>
    <n-form :model="model" ref="formRef" :rules="rules">
      <n-form-item path="SetNumber">
        <n-auto-complete
          :options="options"
          v-model:value="value"
          placeholder="Set Number"
        />
      </n-form-item>
      <n-grid :x-gap="12" :y-gap="8" :cols="3">
        <n-gi v-for="(set, index) in sets" :key="index">
          <n-card :title="set.name" hoverable>
            <template #cover>
              <img :src="set.img" />
            </template>
            <n-statistic label="Number">{{ set.id }}</n-statistic>
            <n-statistic label="Bricks">{{ set.bricks }}</n-statistic>
            <n-statistic label="Year">{{ set.year }}</n-statistic>
            <n-statistic label="Source">{{ set.source }}</n-statistic>
          </n-card>
        </n-gi>
      </n-grid>
      <n-form-item label="Name" path="name">
        <n-space vertical style="width: 100%">
          <n-input
            v-model:value="value"
            type="text"
            placeholder="Basic Input"
            style="width: 100%"
          />
          <n-checkbox checked>Use Set Number as prefix</n-checkbox>
        </n-space>
      </n-form-item>

      <n-space justify="start">
        <n-button type="primary" ghost>
          <template #icon>
            <n-icon>
              <SaveAltOutlined />
            </n-icon>
          </template>
          Import
        </n-button>
        <n-button>
          <template #icon>
            <n-icon>
              <ClearOutlined />
            </n-icon>
          </template>
          Cancel
        </n-button>
      </n-space>
    </n-form>
  </n-drawer-content>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { SaveAltOutlined, ClearOutlined } from "@vicons/material";

export default defineComponent({
  name: "SetImport",
  components: {
    SaveAltOutlined,
    ClearOutlined,
  },
  data: () => ({
    options: [
      "3092",
      "3093",
      "3095",
      "3116",
      "3117",
      "3118",
      "3119",
      "3120",
      "3408",
      "3409",
      "3410",
      "3411",
      "3412",
      "3413",
      "3414",
      "3589",
      "3590",
      "3591",
      "3594",
      "3595",
      "3596",
      "3597",
      "3598",
      "3599",
    ],
    sets: [
      {
        id: 76139,
        name: "1989 Batmobile™",
        img: "https://www.lego.com/cdn/product-assets/product.img.pri/76139_Prod.jpg",
        bricks: 485,
        source: "lego.com",
        year: 2019,
      },
      {
        id: 76139,
        name: "1989 Batmobile",
        img: "https://www.lego.com/cdn/product-assets/product.img.pri/76139_Prod.jpg",
        bricks: 524,
        source: "BrickLink",
        year: 2019,
      },
      {
        id: 76139,
        name: "1989 Batmobile",
        img: "https://www.lego.com/cdn/product-assets/product.img.pri/76139_Prod.jpg",
        bricks: 489,
        source: "Rebrickable",
        year: 2019,
      },
    ],
  }),
});
</script>

<style>
.n-upload-trigger {
  width: 100%;
}
</style>
