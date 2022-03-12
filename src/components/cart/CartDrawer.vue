<template>
  <n-drawer-content title="Shopping Cart" closable>
    <n-space vertical>
      <n-row>
        <n-col :span="12">
          <n-statistic label="Total Rows" :value="99">596</n-statistic>
        </n-col>
        <n-col :span="12">
          <n-statistic label="Total Parts">3,524</n-statistic>
        </n-col>
      </n-row>
      <n-list bordered>
        <n-list-item>
          <n-space justify="space-between">
            <div style="line-height: 20px">My Second Parts List</div>
            <n-icon size="20">
              <DeleteOutlined />
            </n-icon>
          </n-space>
        </n-list-item>
        <n-list-item>
          <n-space justify="space-between">
            <div style="line-height: 20px">76139 - 1989 Batmobile</div>
            <n-icon size="20">
              <DeleteOutlined />
            </n-icon>
          </n-space>
        </n-list-item>
        <n-list-item>
          <n-space justify="space-between">
            <div style="line-height: 20px">Lose Parts</div>
            <n-icon size="20">
              <DeleteOutlined />
            </n-icon>
          </n-space>
        </n-list-item>
      </n-list>
      <n-button @click="changePage" type="primary" ghost>
        <template #icon>
          <n-icon>
            <ShoppingCartOutlined />
          </n-icon>
        </template>
        Go to Shopping Cart
      </n-button>
    </n-space>
  </n-drawer-content>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { DeleteOutlined, ShoppingCartOutlined } from "@vicons/material";

export default defineComponent({
  name: "CartDrawer",
  setup(prop, { emit }) {
    return {
      changePage() {
        emit("changePage", "cart");
      },
    };
  },
  components: { DeleteOutlined, ShoppingCartOutlined },
});
</script>
