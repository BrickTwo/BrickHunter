<template>
  <n-space vertical>
    <n-el>
      <n-space
        style="font-size: 30px; cursor: pointer; line-height: 50px"
        @click="showCartDrawer = true"
      >
        <n-icon size="40" style="margin-top: 5px">
          <ShoppingCartOutlined />
        </n-icon>
        <div>{{ totalOpenUniqueParts }}/{{ totalOpenQuantity }}</div>
      </n-space>
    </n-el>
  </n-space>
  <CartDrawer v-model:showDrawer="showCartDrawer" />
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { ShoppingCartOutlined } from "@vicons/material";
import CartDrawer from "./CartDrawer.vue";
import { cartsStore } from "@/store/carts-store";

export default defineComponent({
  setup() {
    const showCartDrawer = ref(false);
    const totalOpenUniqueParts = ref(cartsStore.getTotalOpenUniqueParts());
    const totalOpenQuantity = ref(cartsStore.getTotalOpenQuantity());

    watch(
      () => cartsStore.getState(),
      () => {
        totalOpenUniqueParts.value = cartsStore.getTotalOpenUniqueParts();
        totalOpenQuantity.value = cartsStore.getTotalOpenQuantity();
      },
      { deep: true }
    );

    return {
      showCartDrawer,
      totalOpenUniqueParts,
      totalOpenQuantity,
    };
  },
  components: { ShoppingCartOutlined, CartDrawer },
});
</script>
