<template>
  <div>
    <n-card :title="data.detail.name" :bordered="false">
      <n-row style="width: 100%">
        <n-col :span="6">
          <n-image
            :src="data.detail.imageUrl"
            fallback-src="https://www.nicepng.com/png/detail/103-1037013_lego-brick-coloring-page-lego-brick-coloring-pages.png"
            style="max-width: 150px; max-height: 150px"
            width="150"
            height="150"
            objectFit="scale-down"
          />
        </n-col>
        <n-col :span="12">
          <n-h3>{{ $t("dataDataTable.itemInfo") }}</n-h3>
          <n-col :span="12"
            ><n-text strong>{{ $t("dataDataTable.partNumber") }}:</n-text>
            {{ data.detail.id }}<br />
            <n-text strong>{{ $t("dataDataTable.element", 2) }}:</n-text>
            {{ data.detail.elementIds ? data.detail.elementIds.join(", ") : ""
            }}<br />
            <n-text strong>{{ $t("dataDataTable.category") }}:</n-text>
            {{ data.detail.partCatId }}<br />
            <n-text strong>{{ $t("dataDataTable.printed") }}:</n-text>
            {{ data.detail.isPrint ? "Yes" : "No" }}<br />
            <n-text strong>{{ $t("dataDataTable.transparent") }}:</n-text>
            {{ data.color.is_trans ? "Yes" : "No" }}
          </n-col>
          <n-col :span="12">
            <n-text strong>{{ $t("dataDataTable.year") }}:</n-text>
            {{
              $t("dataDataTable.yearTo", {
                from: data.detail.yearFrom,
                to: data.detail.yearTo,
              })
            }}
            <br />
            <n-text strong>{{ $t("dataDataTable.weight") }}:</n-text><br />
            <n-text strong>
              {{ $t("dataDataTable.studDimensionShort") }}:
            </n-text>
            <br />
            <n-text strong>
              {{ $t("dataDataTable.packageDimensionShort") }}:
            </n-text>
          </n-col>
        </n-col>
        <n-col :span="6">
          <n-h3>{{ $t("dataDataTable.lot") }}</n-h3>
          <n-text strong>{{ $t("dataDataTable.quantity") }}:</n-text>
          {{ data.source.qty }}<br />
          <n-text strong>{{ $t("dataDataTable.have") }}:</n-text>
          {{ data.source.have }}<br />
          <n-text strong>{{ $t("dataDataTable.maxPrice") }}:</n-text>
          {{ data.source.maxPrice }}<br />
          <n-text strong>{{ $t("dataDataTable.remarks") }}:</n-text>
          {{ data.source.remarks }}<br />
        </n-col>
      </n-row>
      <n-row>
        <n-col :span="12">
          <n-h3>{{ $t("dataDataTable.color") }}</n-h3>
          <n-descriptions label-placement="top">
            <n-descriptions-item :label="$t('general.names.rebrickable')">
              <span style="display: block">
                <span
                  :style="`background-color: #${data.color.rgb}; border: 1px solid black; width: 13px; height: 13px; margin-right: 5px; display: inline-block`"
                />
                {{ data.color.name }}</span
              >
            </n-descriptions-item>
            <n-descriptions-item :label="$t('general.names.brickLink')">
              <span
                :style="`background-color: #${data.color.rgb}; border: 1px solid black; width: 13px; height: 13px; margin-right: 5px; display: inline-block`"
              /><span style="display: inline-table">
                <n-text
                  tag="div"
                  v-for="(desc, index) in data.color.external_ids.BrickLink
                    ?.ext_descrs[0]"
                  :key="index"
                >
                  {{ desc }}
                </n-text>
              </span>
            </n-descriptions-item>
            <n-descriptions-item :label="$t('general.names.brickOwl')">
              <span
                :style="`background-color: #${data.color.rgb}; border: 1px solid black; width: 13px; height: 13px; margin-right: 5px; display: inline-block`"
              /><span style="display: inline-table">
                <n-text
                  tag="div"
                  v-for="(desc, index) in data.color.external_ids.BrickOwl
                    ?.ext_descrs[0]"
                  :key="index"
                >
                  {{ desc }}
                </n-text>
              </span>
            </n-descriptions-item>
            <n-descriptions-item :label="$t('general.names.lDraw')">
              <span
                :style="`background-color: #${data.color.rgb}; border: 1px solid black; width: 13px; height: 13px; margin-right: 5px; display: inline-block`"
              /><span style="display: inline-table">
                <n-text
                  tag="div"
                  v-for="(desc, index) in data.color.external_ids.LDraw
                    ?.ext_descrs[0]"
                  :key="index"
                >
                  {{ desc }}
                </n-text>
              </span>
            </n-descriptions-item>
            <n-descriptions-item :label="$t('general.names.lego')">
              <span
                :style="`background-color: #${data.color.rgb}; border: 1px solid black; width: 13px; height: 13px; margin-right: 5px; display: inline-block`"
              />
              <span style="display: inline-table">
                <n-text
                  tag="div"
                  v-for="(desc, index) in data.color.external_ids.LEGO
                    ?.ext_descrs[0]"
                  :key="index"
                >
                  {{ desc }}
                </n-text>
              </span>
            </n-descriptions-item>
            <n-descriptions-item :label="$t('general.names.peeron')">
              <span
                :style="`background-color: #${data.color.rgb}; border: 1px solid black; width: 13px; height: 13px; margin-right: 5px; display: inline-block`"
              />
              <span style="display: inline-table">
                <n-text
                  tag="div"
                  v-for="(desc, index) in data.color.external_ids.Peeron
                    ?.ext_descrs[0]"
                  :key="index"
                >
                  {{ desc }}
                </n-text>
              </span>
            </n-descriptions-item>
          </n-descriptions>
        </n-col>
        <n-col :span="12">
          <n-h3>{{ $t("dataDataTable.designNumber", 2) }}</n-h3>
          <n-descriptions label-placement="top">
            <n-descriptions-item :label="$t('general.names.rebrickable')">
              {{ data.detail.id }}
            </n-descriptions-item>
            <n-descriptions-item :label="$t('general.names.brickLink')">
              <n-text
                tag="div"
                v-for="(eId, index) in data.detail.externalIds.filter(
                  (e) => e.source === 'BrickLink'
                )"
                :key="index"
              >
                {{ eId.externalId }}
              </n-text>
            </n-descriptions-item>
            <n-descriptions-item :label="$t('general.names.brickOwl')">
              <n-text
                tag="div"
                v-for="(eId, index) in data.detail.externalIds.filter(
                  (e) => e.source === 'BrickOwl'
                )"
                :key="index"
              >
                {{ eId.externalId }}
              </n-text>
            </n-descriptions-item>
            <n-descriptions-item :label="$t('general.names.lDraw')">
              <n-text
                tag="div"
                v-for="(eId, index) in data.detail.externalIds.filter(
                  (e) => e.source === 'LDraw'
                )"
                :key="index"
              >
                {{ eId.externalId }}
              </n-text>
            </n-descriptions-item>
            <n-descriptions-item :label="$t('general.names.lego')">
              <n-text
                tag="div"
                v-for="(eId, index) in data.detail.externalIds.filter(
                  (e) => e.source === 'LEGO'
                )"
                :key="index"
              >
                {{ eId.externalId }}
              </n-text>
            </n-descriptions-item>
            <n-descriptions-item :label="$t('general.names.peeron')">
              <n-text
                tag="div"
                v-for="(eId, index) in data.detail.externalIds.filter(
                  (e) => e.source === 'Peeron'
                )"
                :key="index"
              >
                {{ eId.externalId }}
              </n-text>
            </n-descriptions-item>
          </n-descriptions>
        </n-col>
      </n-row>
      <n-row v-if="data.cart">
        {{ data.cart.qty }}
      </n-row>
    </n-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { IPart } from "@/types/types";

export default defineComponent({
  name: "PartTableDetail",
  props: { part: { type: Object, required: true } },
  setup(props) {
    const data = ref(props.part as IPart);

    return { data };
  },
});
</script>
