<template>
  <div>
    <n-card :title="data.name" :bordered="false">
      <n-row style="width: 100%">
        <n-col :span="4">
          <n-image
            :src="data.imageUrl"
            fallback-src="https://www.nicepng.com/png/detail/103-1037013_lego-brick-coloring-page-lego-brick-coloring-pages.png"
            height="150"
            width="150"
            objectFit="scale-down"
          />
        </n-col>
        <n-col :span="5">
          <n-h3>General</n-h3>
          <n-text strong>Part Number:</n-text> {{ data.id }}<br />
          <n-text strong>Element Id's:</n-text> {{ data.elementIds.join(", ")
          }}<br />
          <n-text strong>Category Id:</n-text> {{ data.partCatId }}<br />
          <n-text strong>Year:</n-text> {{ data.yearFrom }} to {{ data.yearTo
          }}<br />
          <n-text strong>Printed:</n-text> {{ data.isPrint ? "Yes" : "No"
          }}<br />
        </n-col>
        <n-col :span="5">
          <n-h3>Lot</n-h3>
          <n-text strong>Quantity:</n-text> {{ data.qty }}<br />
          <n-text strong>Have:</n-text> {{ data.have }}<br />
          <n-text strong>Max Price:</n-text> {{ data.maxPrice }}<br />
          <n-text strong>Remarks:</n-text> {{ data.remarks }}<br />
        </n-col>
        <n-col :span="10">
          <n-h3>Color</n-h3>
          <div
            :style="`background-color: #${data.color.rgb}; border: 1px solid black; width: 25px; height: 25px; margin-right: 5px; display: inline-block`"
          />
          <br />
          <n-text strong>Transparent:</n-text>
          {{ data.color.is_trans ? "Yes" : "No" }}<br />
          <n-descriptions label-placement="top">
            <n-descriptions-item label="Rebrickable">
              {{ data.color.name }}
            </n-descriptions-item>
            <n-descriptions-item label="BrickLink">
              <n-text
                tag="div"
                v-for="(desc, index) in data.color.external_ids.BrickLink
                  ?.ext_descrs[0]"
                :key="index"
              >
                {{ desc }}
              </n-text>
            </n-descriptions-item>
            <n-descriptions-item label="BrickOwl">
              <n-text
                tag="div"
                v-for="(desc, index) in data.color.external_ids.BrickOwl
                  ?.ext_descrs[0]"
                :key="index"
              >
                {{ desc }}
              </n-text>
            </n-descriptions-item>
            <n-descriptions-item label="LDraw">
              <n-text
                tag="div"
                v-for="(desc, index) in data.color.external_ids.LDraw
                  ?.ext_descrs[0]"
                :key="index"
              >
                {{ desc }}
              </n-text>
            </n-descriptions-item>
            <n-descriptions-item label="LEGO">
              <n-text
                tag="div"
                v-for="(desc, index) in data.color.external_ids.LEGO
                  ?.ext_descrs[0]"
                :key="index"
              >
                {{ desc }}
              </n-text>
            </n-descriptions-item>
            <n-descriptions-item label="Peeron">
              <n-text
                tag="div"
                v-for="(desc, index) in data.color.external_ids.Peeron
                  ?.ext_descrs[0]"
                :key="index"
              >
                {{ desc }}
              </n-text>
            </n-descriptions-item>
          </n-descriptions>
        </n-col>
      </n-row>
    </n-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { IParts } from "@/types/types";

export default defineComponent({
  name: "PartTableDetail",
  props: { part: { type: Object, required: true } },
  setup(props) {
    const data = ref(props.part as IParts);

    return { data };
  },
});
</script>
