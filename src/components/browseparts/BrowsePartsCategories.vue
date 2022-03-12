<template>
  <n-h2>Categories</n-h2>
  <n-list>
    <n-list-item v-for="(category, index) in categories" :key="index">
      <n-a class="categoryLink">
        <n-space style="width: 100%" justify="space-between" :wrap="false">
          <span>{{ category.name }}</span>
          <span>({{ category.amount }})</span>
        </n-space>
      </n-a>
    </n-list-item>
  </n-list>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "BrowsePartsCategories",
  components: {},
  setup() {
    return {
      categories: [
        { name: "	All	", amount: 35783 },
        { name: "	Bars, Ladders and Fences	", amount: 593 },
        { name: "	Baseplates	", amount: 68 },
        { name: "	Belville, Scala and Fabuland	", amount: 44 },
        { name: "	Bionicle, Hero Factory and Constraction	", amount: 2022 },
        { name: "	Bricks	", amount: 996 },
        { name: "	Bricks Curved	", amount: 1579 },
        { name: "	Bricks Round and Cones	", amount: 925 },
        { name: "	Bricks Sloped	", amount: 1352 },
        { name: "	Bricks Special	", amount: 682 },
        { name: "	Bricks Wedged	", amount: 905 },
        { name: "	Clikits	", amount: 129 },
        { name: "	Containers	", amount: 305 },
        { name: "	Flags, Signs, Plastics and Cloth	", amount: 638 },
        { name: "	Hinges, Arms and Turntables	", amount: 618 },
        { name: "	Magnets and Holders	", amount: 28 },
        { name: "	Mechanical	", amount: 12 },
        { name: "	Minifig Accessories	", amount: 2200 },
        { name: "	Minifig Heads	", amount: 1434 },
        { name: "	Minifig Headwear	", amount: 1543 },
        { name: "	Minifig Lower Body	", amount: 1175 },
        { name: "	Minifig Upper Body	", amount: 2274 },
        { name: "	Minifigs	", amount: 177 },
        { name: "	Non-LEGO	", amount: 9 },
        { name: "	Other	", amount: 51 },
        { name: "	Panels	", amount: 570 },
        { name: "	Plants and Animals	", amount: 1495 },
        { name: "	Plates	", amount: 1111 },
        { name: "	Plates Angled	", amount: 677 },
        { name: "	Plates Round Curved and Dishes	", amount: 749 },
        { name: "	Plates Special	", amount: 1578 },
        { name: "	Pneumatics	", amount: 35 },
        { name: "	Power Functions, Mindstorms and Electric	", amount: 120 },
        { name: "	Projectiles / Launchers	", amount: 164 },
        { name: "	Rock	", amount: 158 },
        { name: "	Stickers	", amount: 15 },
        { name: "	String, Bands and Reels	", amount: 112 },
        { name: "	Supports, Girders and Cranes	", amount: 149 },
        { name: "	Technic Axles	", amount: 73 },
        { name: "	Technic Beams	", amount: 674 },
        { name: "	Technic Beams Special	", amount: 77 },
        { name: "	Technic Bricks	", amount: 242 },
        { name: "	Technic Bushes	", amount: 20 },
        { name: "	Technic Connectors	", amount: 740 },
        { name: "	Technic Gears	", amount: 140 },
        { name: "	Technic Panels	", amount: 507 },
        { name: "	Technic Pins	", amount: 97 },
        { name: "	Technic Special	", amount: 322 },
        { name: "	Technic Steering, Suspension and Engine	", amount: 137 },
        { name: "	Tiles	", amount: 1252 },
        { name: "	Tiles Round and Curved	", amount: 581 },
        { name: "	Tiles Special	", amount: 463 },
        { name: "	Tools	", amount: 45 },
        { name: "	Transportation - Land	", amount: 782 },
        { name: "	Transportation - Sea and Air	", amount: 404 },
        { name: "	Tubes and Hoses	", amount: 381 },
        { name: "	Uncategorized	", amount: 386 },
        { name: "	Wheels and Tyres	", amount: 522 },
        { name: "	Windows and Doors	", amount: 656 },
        { name: "	Windscreens and Fuselage	", amount: 590 },
      ],
    };
  },
});
</script>

<style scoped>
.categoryLink {
  color: white;
}
.categoryLink:hover {
  color: #7fe7c4;
}
</style>
