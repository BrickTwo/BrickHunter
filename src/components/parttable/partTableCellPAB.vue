<template>
  <div v-if="data.lego">
    <n-text>{{ data.lego?.currency }} {{ data.lego?.price }}</n-text>
    <br />
    <n-text depth="3">
      [{{ data.lego?.designId }}/{{ data.lego?.elementId }}]
    </n-text>
    <br />
    <n-tag type="success" v-if="data.lego?.deliveryChannel === 'pab'">
      Bestseller
    </n-tag>
    <n-tag type="info" v-if="data.lego?.deliveryChannel === 'bap'">
      Standard
    </n-tag>
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
