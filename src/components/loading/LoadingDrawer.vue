<template>
  <n-drawer-content title="Loading Parts" closable>
    <h3>Bricks & Pieces</h3>
    <n-progress
      type="line"
      :percentage="100"
      :indicator-placement="'inside'"
      processing
    />
    <h3>Pick a Brick</h3>
    <n-progress
      type="line"
      :percentage="55"
      :indicator-placement="'inside'"
      processing
    />
    <h3>BrickLink</h3>
    <n-progress
      type="line"
      :percentage="0"
      :indicator-placement="'inside'"
      processing
    />

    <h2>Current Loading</h2>
    <n-list bordered>
      <n-list-item>
        <n-space justify="space-between">
          <n-image
            height="65"
            width="65"
            objectFit="scale-down"
            src="https://img.bricklink.com/ItemImage/PN/11/18671.png"
          />
          <n-statistic label="Design Id">18671</n-statistic>
          <n-statistic label="Element">18671</n-statistic>
          <n-statistic label="Color">Black</n-statistic>
        </n-space>
      </n-list-item>
      <n-list-item>
        <n-space justify="space-between">
          <n-image
            height="65"
            width="65"
            objectFit="scale-down"
            src="https://img.bricklink.com/ItemImage/PN/85/18671.png"
          />
          <n-statistic label="Design Id">18671</n-statistic>
          <n-statistic label="Element">18671</n-statistic>
          <n-statistic label="Color">Dk. St. Grey</n-statistic>
        </n-space>
      </n-list-item>
    </n-list>

    <h2>Queue 2/3 (55)</h2>
    <n-list bordered>
      <n-list-item v-for="(position, index) in queue" :key="index">
        <n-space justify="space-between">
          <n-image
            height="65"
            width="65"
            objectFit="scale-down"
            :src="position.image.rsc"
          />
          <n-statistic label="Design Number">
            {{ position.designId }}
          </n-statistic>
          <n-statistic label="Element"></n-statistic>
          <n-statistic label="Color">
            {{ position.color.bricksAndPiecesName }}
          </n-statistic>
        </n-space>
      </n-list-item>
    </n-list>
  </n-drawer-content>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  partsListPositions,
  //IPartsListPosition,
} from "../../dummyData/partslist";

export default defineComponent({
  name: "CartDrawer",
  setup(prop, { emit }) {
    return { queue: partsListPositions.positions.slice(-55) };
  },
});
</script>
