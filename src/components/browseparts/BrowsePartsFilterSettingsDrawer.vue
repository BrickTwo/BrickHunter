<template>
  <n-drawer-content title="Settings" closable>
    <n-space vertical>
      <n-row><n-checkbox checked>Only show available parts</n-checkbox></n-row>
      <n-row>
        <n-space vertical style="width: 100%">
          <n-checkbox checked>Do not show selected categories</n-checkbox>
          <n-select v-model:value="value" multiple :options="options" />
        </n-space>
      </n-row>
      <n-row><n-checkbox checked>Show Bricks & Pieces</n-checkbox></n-row>
      <n-row><n-checkbox checked>Show Pick a Brick</n-checkbox></n-row>
      <n-row
        ><n-space>
          <n-button type="primary" ghost>
            <template #icon>
              <n-icon>
                <SaveAltOutlined />
              </n-icon>
            </template>
            Apply
          </n-button>
          <n-button>
            <template #icon>
              <n-icon>
                <ClearOutlined />
              </n-icon>
            </template>
            Cancel
          </n-button></n-space
        ></n-row
      >
    </n-space>
  </n-drawer-content>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { SaveAltOutlined, ClearOutlined } from "@vicons/material";

export default defineComponent({
  name: "BrowsePartsFilterSettingsDrawer",
  components: { SaveAltOutlined, ClearOutlined },
  setup() {
    return {
      options: [
        {
          label: "Bars, Ladders and Fences",
          value: "1",
        },
        {
          label: "Baseplates",
          value: "2",
        },
        {
          label: "Belville, Scala and Fabuland",
          value: "3",
        },
        {
          label: "Bionicle, Hero Factory and Constraction",
          value: "4",
        },
        {
          label: "Bricks",
          value: "5",
        },
        {
          label: "Bricks Curved",
          value: "6",
        },
        {
          label: "Bricks Round and Cones",
          value: "7",
        },
        {
          label: "Bricks Sloped",
          value: "8",
        },
        {
          label: "Bricks Special",
          value: "9",
        },
        {
          label: "Bricks Wedged",
          value: "10",
        },
        {
          label: "Clikits",
          value: "11",
        },
        {
          label: "Containers",
          value: "12",
        },
        {
          label: "Duplo, Quatro and Primo",
          value: "13",
        },
        {
          label: "Flags, Signs, Plastics and Cloth",
          value: "14",
        },
        {
          label: "Hinges, Arms and Turntables",
          value: "15",
        },
        {
          label: "Magnets and Holders",
          value: "16",
        },
        {
          label: "Mechanical",
          value: "17",
        },
        {
          label: "Minidoll Heads",
          value: "18",
        },
        {
          label: "Minidoll Lower Body",
          value: "19",
        },
        {
          label: "Minidoll Upper Body",
          value: "20",
        },
        {
          label: "Minifig Accessories",
          value: "21",
        },
        {
          label: "Minifig Heads",
          value: "22",
        },
        {
          label: "Minifig Headwear",
          value: "23",
        },
        {
          label: "Minifig Lower Body",
          value: "24",
        },
        {
          label: "Minifig Upper Body",
          value: "25",
        },
        {
          label: "Minifigs",
          value: "26",
        },
        {
          label: "Non-Buildable Figures (Duplo, Fabuland, etc)",
          value: "27",
        },
        {
          label: "Non-LEGO",
          value: "28",
        },
        {
          label: "Other",
          value: "29",
        },
        {
          label: "Panels",
          value: "30",
        },
        {
          label: "Plants and Animals",
          value: "31",
        },
        {
          label: "Plates",
          value: "32",
        },
        {
          label: "Plates Angled",
          value: "33",
        },
        {
          label: "Plates Round Curved and Dishes",
          value: "34",
        },
        {
          label: "Plates Special",
          value: "35",
        },
        {
          label: "Pneumatics",
          value: "36",
        },
        {
          label: "Power Functions, Mindstorms and Electric",
          value: "37",
        },
        {
          label: "Projectiles / Launchers",
          value: "38",
        },
        {
          label: "Rock",
          value: "39",
        },
        {
          label: "Stickers",
          value: "40",
        },
        {
          label: "String, Bands and Reels",
          value: "41",
        },
        {
          label: "Supports, Girders and Cranes",
          value: "42",
        },
        {
          label: "Technic Axles",
          value: "43",
        },
        {
          label: "Technic Beams",
          value: "44",
        },
        {
          label: "Technic Beams Special",
          value: "45",
        },
        {
          label: "Technic Bricks",
          value: "46",
        },
        {
          label: "Technic Bushes",
          value: "47",
        },
        {
          label: "Technic Connectors",
          value: "48",
        },
        {
          label: "Technic Gears",
          value: "49",
        },
        {
          label: "Technic Panels",
          value: "50",
        },
        {
          label: "Technic Pins",
          value: "51",
        },
        {
          label: "Technic Special",
          value: "52",
        },
        {
          label: "Technic Steering, Suspension and Engine",
          value: "53",
        },
        {
          label: "Tiles",
          value: "54",
        },
        {
          label: "Tiles Round and Curved",
          value: "55",
        },
        {
          label: "Tiles Special",
          value: "56",
        },
        {
          label: "Tools",
          value: "57",
        },
        {
          label: "Transportation - Land",
          value: "58",
        },
        {
          label: "Transportation - Sea and Air",
          value: "59",
        },
        {
          label: "Tubes and Hoses",
          value: "60",
        },
        {
          label: "Uncategorized",
          value: "61",
        },
        {
          label: "Wheels and Tyres",
          value: "62",
        },
        {
          label: "Windows and Doors",
          value: "63",
        },
        {
          label: "Windscreens and Fuselage",
          value: "64",
        },
      ],
    };
  },
});
</script>
