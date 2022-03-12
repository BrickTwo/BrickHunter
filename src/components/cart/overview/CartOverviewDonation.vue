<template>
  <n-space vertical>
    If you like BrickHunter I would appreciate a voluntary donation.
    <img
      alt=""
      border="0"
      src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif"
      style="cursor: pointer"
    />
  </n-space>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
// import { ShoppingCartOutlined } from "@vicons/material";

export default defineComponent({
  name: "CartOverviewDonation",
  // components: {
  //   ShoppingCartOutlined,
  // },
  setup(prop, { emit }) {
    return {};
  },
});
</script>
