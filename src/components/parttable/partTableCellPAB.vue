<template>
  <div v-if="data.lego">
    <n-text>
      {{ data.lego?.variant.price.currencyCode }}
      {{ data.lego?.variant.price.formattedValue }}
    </n-text>
    <br />
    <n-text depth="3">
      [{{ data.lego?.variant.id }}/{{
        data.lego?.variant.attributes.designNumber
      }}]
    </n-text>
    <br />
    <n-tag
      type="success"
      v-if="data.lego?.variant.attributes.deliveryChannel === 'pab'"
    >
      Bestseller
    </n-tag>
    <n-tag
      type="info"
      v-if="data.lego?.variant.attributes.deliveryChannel === 'bap'"
    >
      Standard
    </n-tag>
    <n-tag type="error" v-if="!data.lego?.inStock"> Out Of Stock </n-tag>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { IParts } from "@/types/types";

export default defineComponent({
  name: "PartTableCellPAB",
  props: { part: { type: Object, required: true } },
  setup(props) {
    var data = ref(props.part as IParts);

    watch(
      () => props.part,
      async () => {
        data.value = props.part as IParts;
      },
      { deep: true }
    );

    return { data };
  },
});
</script>
