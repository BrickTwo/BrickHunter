<template>
  <div class="container" ref="container">
    <n-space justify="right">
      <n-statistic :label="$t('cart.totalUniqueParts')">
        {{ totalUniqueParts }}
      </n-statistic>
      <n-divider vertical />
      <n-statistic :label="$t('cart.totalQuantity')">
        {{ totalQuantity }}
      </n-statistic>
      <n-divider vertical />
      <n-statistic :label="$t('cart.price')">
        {{ totalPrice }} <span style="font-size: 10px">EUR</span>
      </n-statistic>
      <n-divider vertical />
    </n-space>
  </div>
  <n-divider style="margin-top: 10px; margin-bottom: 10px" />
  <n-space vertical>
    <n-space justify="space-between">
      <n-dropdown
        trigger="click"
        :options="bulkOptions"
        placement="bottom-start"
      >
        <n-button :disabled="!checkedRowKeys.length">
          <template #icon>
            <n-icon>
              <ArrowDropDownOutlined />
            </n-icon>
          </template>
          {{ $t("cart.actions.bulkAction") }}
        </n-button>
      </n-dropdown>
      <n-space justify="end">
        <n-button>
          <template #icon>
            <n-icon>
              <PrintOutlined />
            </n-icon>
          </template>
          {{ $t("cart.actions.print") }}
        </n-button>
        <n-button>
          <template #icon>
            <n-icon>
              <SaveAltOutlined />
            </n-icon>
          </template>
          {{ $t("cart.actions.export") }}
        </n-button>
      </n-space>
    </n-space>
    <PartDataTable
      :partsList="partsList"
      style="height: calc(100vh - 300px)"
      @update:checked-row-keys="onHandleCheck"
    />
  </n-space>
</template>

<script lang="ts">
import { NIcon } from "naive-ui";
import { defineComponent, Ref, ref, h, watch, onBeforeMount } from "vue";
import {
  PrintOutlined,
  ArrowDropDownOutlined,
  SaveAltOutlined,
  ShoppingBagOutlined,
  ClearOutlined,
} from "@vicons/material";
import PartDataTable from "@/components/partDataTable/partDataTable.vue";
import { cartsStore } from "@/store/carts-store";
import { IPartsList } from "@/types/types";
import { CartType } from "@/types/store-types";

const renderIcon = (icon: any) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    });
  };
};

export default defineComponent({
  name: "CartStandard",
  setup() {
    const partsList: Ref<IPartsList | undefined> = ref({} as IPartsList);
    const checkedRowKeys = ref([]);
    const totalUniqueParts = ref(0);
    const totalQuantity = ref(0);
    const totalPrice = ref("0.00");

    const onHandleCheck = (rowKeys: never[]) => {
      console.log(rowKeys);
      checkedRowKeys.value = rowKeys;
    };

    const calcTotalUniqueParts = (): number => {
      if (!partsList.value) return 0;
      return partsList.value.parts.length;
    };

    const calcTotalQuantiy = (): number => {
      if (!partsList.value) return 0;
      return partsList.value.parts
        .map((p) => p.source.qty)
        .reduce((prev, curr) => prev + curr, 0);
    };

    const calcTotalPrice = (): string => {
      if (!partsList.value) return "0.00";
      return (
        Math.round(
          partsList.value.parts
            .map((p) => p.detail.lego?.price?.formattedValue)
            .reduce((prev, curr) => prev + curr, 0) * 100
        ) / 100
      ).toFixed(2);
    };

    onBeforeMount(async () => {
      let partList: IPartsList = {
        id: "",
        name: "",
        parts: await cartsStore.getPositionsByType(CartType.BrickLink),
      };

      partsList.value = partList;
      totalUniqueParts.value = calcTotalUniqueParts();
      totalQuantity.value = calcTotalQuantiy();
      totalPrice.value = calcTotalPrice();
    });

    watch(
      () => cartsStore.getState(),
      async () => {
        let partList: IPartsList = {
          id: "",
          name: "",
          parts: await cartsStore.getPositionsByType(CartType.BrickLink),
        };

        partsList.value = partList;
        totalUniqueParts.value = calcTotalUniqueParts();
        totalQuantity.value = calcTotalQuantiy();
        totalPrice.value = calcTotalPrice();
      },
      { deep: true }
    );

    return {
      partsList,
      checkedRowKeys,
      totalUniqueParts,
      totalQuantity,
      totalPrice,
      bulkValue: ref(null),
      moveToValue: ref(10),
      bulkOptions: [
        {
          label: "Print",
          key: "print",
          icon: renderIcon(PrintOutlined),
        },
      ],
      onHandleCheck,
    };
  },
  components: {
    PrintOutlined,
    ArrowDropDownOutlined,
    SaveAltOutlined,
    ShoppingBagOutlined,
    ClearOutlined,
    PartDataTable,
  },
});
</script>
