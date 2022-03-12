<template>
  <n-table :bordered="false" style="text-align: right">
    <thead>
      <tr>
        <th style="text-align: left">Type</th>
        <th>Positions</th>
        <th>Parts</th>
        <th>Price</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="text-align: left">Bricks & Pieces 1</td>
        <td>150</td>
        <td>2000</td>
        <td>105.50 USD</td>
      </tr>
      <tr>
        <td style="text-align: left">Bricks & Pieces 2</td>
        <td>75</td>
        <td>950</td>
        <td>42.13 USD</td>
      </tr>
      <tr>
        <td style="text-align: left">Pick a Brick</td>
        <td>93</td>
        <td>103</td>
        <td>95.13 USD</td>
      </tr>
      <tr>
        <td style="text-align: left">BrickLink</td>
        <td>222</td>
        <td>1050</td>
        <td>305.59 USD</td>
      </tr>
      <tr style="font-weight: bold">
        <td style="text-align: left">Total</td>
        <td>540</td>
        <td>2303</td>
        <td>548.35 USD</td>
      </tr>
    </tbody>
  </n-table>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
// import { ShoppingCartOutlined } from "@vicons/material";

export default defineComponent({
  name: "CartOverviewPositionsAndPrices",
  // components: {
  //   ShoppingCartOutlined,
  // },
  setup(prop, { emit }) {
    return {};
  },
});
</script>
