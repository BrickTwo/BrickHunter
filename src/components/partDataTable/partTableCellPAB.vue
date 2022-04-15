<template>
  <div v-if="data.detail.lego?.date">
    <n-text>
      {{ data.detail.lego.price.currencyCode }}
      {{ data.detail.lego.price.formattedValue.toFixed(2) }}
    </n-text>
    <br />
    <n-text depth="3">
      [{{ data.detail.lego.id }}/{{ data.detail.lego.attributes.designNumber }}]
    </n-text>
    <br />
    <n-tag
      type="success"
      v-if="data.detail.lego.attributes.deliveryChannel === 'pab'"
    >
      {{ $t("general.names.pickABrickBestseller") }}
    </n-tag>
    <n-tag
      type="info"
      v-if="data.detail.lego.attributes.deliveryChannel === 'bap'"
    >
      {{ $t("general.names.pickABrickStandard") }}
    </n-tag>
    <n-tag type="error" v-if="!data.detail.lego?.inStock">
      {{ $t("general.names.pickABrickOutOfStock") }}
    </n-tag>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { IPart } from "@/types/types";

export default defineComponent({
  name: "PartTableCellPAB",
  props: { part: { type: Object, required: true } },
  setup(props) {
    var data = ref(props.part as IPart);

    watch(
      () => props.part,
      async () => {
        data.value = props.part as IPart;
      },
      { deep: true }
    );

    return { data };
  },
});
</script>
