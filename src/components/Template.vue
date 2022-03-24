//
https://vuejs.org/style-guide/rules-recommended.html#component-instance-options-order
<template>
  <p></p>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  reactive,
  watchEffect,
  watch,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onActivated,
  onDeactivated,
  onBeforeUnmount,
  onUnmounted,
  onErrorCaptured,
  onRenderTracked,
  onRenderTriggered,
} from "vue";

export default defineComponent({
  name: "Template",
  directives: {},
  components: {},
  provide() {
    return {};
  },
  inject: {},
  props: {},
  emits: {},
  setup() {
    const a = ref(1);
    const b = computed(() => a.value + 1);
    const c = reactive({ count: 0 });
    watchEffect(() => console.log(a.value));
    watch(
      () => a,
      (a, prevA) => {}
    );
    onBeforeMount(() => {});
    onMounted(() => {});
    onBeforeUpdate(() => {});
    onUpdated(() => {});
    onActivated(() => {});
    onDeactivated(() => {});
    onBeforeUnmount(() => {});
    onUnmounted(() => {});
    onErrorCaptured(() => {});
    onRenderTracked(() => {});
    onRenderTriggered(() => {});
    return {};
  },
});
</script>

<style scoped>

</style>

<style lang="sass" scoped>

</style>