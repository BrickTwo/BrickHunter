<template>
  <n-drawer v-model:show="show" :width="800" style="max-width: 100%">
    <n-drawer-content :title="$t('cart.title')" closable>
      <n-space vertical>
        <n-row>
          <n-col :span="12">
            <n-statistic :label="$t('cart.totalUniqueParts')">
              {{ totalOpenUniqueParts }}
            </n-statistic>
          </n-col>
          <n-col :span="12">
            <n-statistic :label="$t('cart.totalQuantity')">
              {{ totalOpenQuantity }}
            </n-statistic>
          </n-col>
        </n-row>
        <n-list bordered>
          <n-list-item v-for="(partList, index) in partLists" :key="index">
            <n-space justify="space-between">
              <div style="line-height: 20px">{{ partList.name }}</div>
              <n-icon size="20">
                <DeleteOutlined @click="partList.inCart = false" />
              </n-icon>
            </n-space>
          </n-list-item>
        </n-list>
        <n-button @click="onGoToShoppingCart()" type="primary" ghost>
          <template #icon>
            <n-icon>
              <ShoppingCartOutlined />
            </n-icon>
          </template>
          {{ $t("cart.goToShoppingCart") }}
        </n-button>
      </n-space>
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { DeleteOutlined, ShoppingCartOutlined } from "@vicons/material";
import { cartsStore } from "@/store/carts-store";
import { partsListStore } from "@/store/partslist-store";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "CartDrawer",
  props: {
    showDrawer: { type: Boolean, required: true },
  },
  emits: ["update:showDrawer"],
  setup(prop, { emit }) {
    const show = ref(prop.showDrawer);
    const totalOpenUniqueParts = ref(cartsStore.getTotalOpenUniqueParts());
    const totalOpenQuantity = ref(cartsStore.getTotalOpenQuantity());
    const partLists = ref(partsListStore.getAllPartsListsInCart());
    const myRouter = useRouter();

    const onGoToShoppingCart = () => {
      show.value = false;
      myRouter.push({ path: "/cart/" });
    };

    watch(
      () => prop.showDrawer,
      () => {
        show.value = prop.showDrawer;
      }
    );

    watch(
      () => show.value,
      () => {
        emit("update:showDrawer", show.value);
      }
    );

    watch(
      () => cartsStore.getState(),
      () => {
        totalOpenUniqueParts.value = cartsStore.getTotalOpenUniqueParts();
        totalOpenQuantity.value = cartsStore.getTotalOpenQuantity();
      },
      { deep: true }
    );

    watch(
      () => partsListStore.getState(),
      () => {
        partLists.value = partsListStore.getAllPartsListsInCart();
      },
      { deep: true }
    );

    return {
      show,
      totalOpenUniqueParts,
      totalOpenQuantity,
      partLists,
      onGoToShoppingCart,
    };
  },
  components: { DeleteOutlined, ShoppingCartOutlined },
});
</script>
