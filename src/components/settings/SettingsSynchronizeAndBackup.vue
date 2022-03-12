<template>
  <n-p
    >Save your BrickHunter Data on the BrickHunter Server and access it on an
    other installation. Data will be stored for 6 Month's after your last
    access.
  </n-p>
  <n-card>
    <n-space>
      <n-space size="small">
        <n-input type="text" style="width: 55px" placeholder="" />
        <div style="height: 34px; line-height: 34px">-</div>
        <n-input type="text" style="width: 55px" placeholder="" />
        <div style="height: 34px; line-height: 34px">-</div>
        <n-input type="text" style="width: 55px" placeholder="" />
        <div style="height: 34px; line-height: 34px">-</div>
        <n-input type="text" style="width: 55px" placeholder="" />
        <div style="height: 34px; line-height: 34px">-</div>
        <n-input type="text" style="width: 55px" placeholder="" />
        <div style="height: 34px; line-height: 34px">-</div>
        <n-input type="text" style="width: 55px" placeholder="" />
        <div style="height: 34px; line-height: 34px">-</div>
        <n-input type="text" style="width: 55px" placeholder="" />
        <div style="height: 34px; line-height: 34px">-</div>
        <n-input type="text" style="width: 55px" placeholder="" />
      </n-space>
      <n-space>
        <n-button>Generate new code</n-button>
        <n-button>Apply code</n-button>
      </n-space>
    </n-space>
  </n-card>
  <n-divider title-placement="left"></n-divider>
  <n-p>Select what should be Synchronized</n-p>
  <n-space vertical>
    <n-checkbox value="Pushes Open" label="Settings (Except this one :-) )" />
    <n-checkbox value="Pushes Open" label="Parts Lists" />
    <n-checkbox value="Pushes Open" label="Browse Parts" />
  </n-space>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SettingsSynchronizeAndBackup",
});
</script>
