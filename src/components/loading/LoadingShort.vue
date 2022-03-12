<template>
  <n-space vertical>
    <n-el>
      <n-progress
        type="circle"
        :percentage="57"
        style="width: 50px; font-size: 20px; cursor: pointer"
        @click="showLoadingProgress = true"
      >
        <span style="text-align: center">57%</span>
      </n-progress>
    </n-el>
  </n-space>
  <n-drawer
    v-model:show="showLoadingProgress"
    :width="800"
    style="max-width: 100%"
  >
    <LoadingDrawer />
  </n-drawer>
</template>

<script>
import { defineComponent, ref } from "vue";
import LoadingDrawer from "./LoadingDrawer.vue";

export default defineComponent({
  setup() {
    const percentageRef = ref(0);

    return {
      showLoadingProgress: ref(false),
      percentage: percentageRef,
    };
  },
  components: { LoadingDrawer },
});
</script>
