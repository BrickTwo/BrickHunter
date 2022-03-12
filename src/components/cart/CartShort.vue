<template>
  <n-space vertical>
    <n-el>
      <n-space
        style="font-size: 30px; cursor: pointer; line-height: 50px"
        @click="showCart = true"
      >
        <n-icon size="40" style="margin-top: 5px">
          <ShoppingCartOutlined />
        </n-icon>
        <div>596/3,524</div>
      </n-space>
    </n-el>
    <!--<n-space>
      <n-button @click="minus"> Minus 10% </n-button>
      <n-button @click="add"> Add 10% </n-button>
    </n-space>-->
  </n-space>
  <n-drawer v-model:show="showCart" :width="800" style="max-width: 100%">
    <CartDrawer @changePage="changePage" />
  </n-drawer>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { ShoppingCartOutlined } from "@vicons/material";
import CartDrawer from "./CartDrawer.vue";

export default defineComponent({
  setup(prop, { emit }) {
    const showCart = ref(false);

    const changePage = () => {
      showCart.value = false;
      emit("changePage", "cart");
    };

    return {
      showCart,
      changePage,
    };
  },
  components: { ShoppingCartOutlined, CartDrawer },
});
</script>
