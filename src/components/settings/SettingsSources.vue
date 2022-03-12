<template>
  <n-p>
    Which prices should be loaded per default? This can be overruled inside a
    parts list.<br /><b>Attention:</b> Selecting more leads to slower loading
    times!
  </n-p>
  <n-space vertical>
    <n-checkbox value="Pushes Open" label="LEGO Pick a Brick" />
    <n-checkbox value="Pushes Open" label="LEGO Bricks & Pieces" />
    <n-checkbox value="Pushes Open" label="BrickLink" />
  </n-space>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SettingsSources",
});
</script>
