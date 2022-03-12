<template>
  <n-form-item label="Bricks & Pieces">
    <n-space vertical>
      <n-space justify="space-between">
        <n-input-number v-model:value="value1" :min="1" />
        <n-space>
          <n-radio
            :checked="checkedValue1 === 'Split equaly'"
            @change="handleChange1"
            value="Split equaly"
            name="basic-demo"
          >
            Split equaly
          </n-radio>
          <n-radio
            :checked="checkedValue1 === 'Fill minimum'"
            @change="handleChange1"
            value="Fill minimum"
            name="basic-demo"
          >
            Fill minimum:
          </n-radio>
          <n-input-number v-model:value="valueMin1" :min="1" step="0.01">
            <template #prefix>$</template>
          </n-input-number>
        </n-space>
      </n-space>
      <i>Recommented: 2</i>
    </n-space>
  </n-form-item>
  <n-form-item label="Pick a Brick">
    <n-space vertical>
      <n-space justify="space-between">
        <n-input-number v-model:value="value2" :min="1" />
        <n-space>
          <n-radio
            :checked="checkedValue2 === 'Split equaly'"
            @change="handleChange2"
            value="Split equaly"
            name="basic-demo"
          >
            Split equaly
          </n-radio>
          <n-radio
            :checked="checkedValue2 === 'Fill minimum'"
            @change="handleChange2"
            value="Fill minimum"
            name="basic-demo"
          >
            Fill minimum:
          </n-radio>
          <n-input-number v-model:value="valueMin2" :min="1" step="0.01">
            <template #prefix>$</template>
          </n-input-number>
        </n-space>
      </n-space>
      <i>Recommented: 1</i>
    </n-space>
  </n-form-item>
  <!-- <n-form-item label="BrickLink">
    <n-space vertical>
      <n-space justify="space-between">
        <n-input-number v-model:value="value3" :min="1" />
        <n-space>
          <n-radio
            :checked="checkedValue3 === 'Split equaly'"
            @change="handleChange3"
            value="Split equaly"
            name="basic-demo"
          >
            Split equaly
          </n-radio>
          <n-radio
            :checked="checkedValue3 === 'Fill minimum'"
            @change="handleChange3"
            value="Fill minimum"
            name="basic-demo"
          >
            Fill minimum:
          </n-radio>
          <n-input-number v-model:value="valueMin3" :min="1" step="0.01">
            <template #prefix>$</template>
          </n-input-number>
        </n-space>
      </n-space>
      <i>Recommented: 1</i>
    </n-space>
  </n-form-item> -->
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
// import { ShoppingCartOutlined } from "@vicons/material";

export default defineComponent({
  name: "CartSettingsSplitting",
  // components: {
  //   ShoppingCartOutlined,
  // },
  setup() {
    const checkedValue1Ref = ref("Split equaly");
    const checkedValue2Ref = ref("Split equaly");
    const checkedValue3Ref = ref("Split equaly");

    return {
      value1: ref(2),
      checkedValue1: checkedValue1Ref,
      valueMin1: ref(100.55),
      handleChange1(e: any) {
        checkedValue1Ref.value = e.target.value;
      },

      value2: ref(1),
      checkedValue2: checkedValue2Ref,
      valueMin2: ref(100.55),
      handleChange2(e: any) {
        checkedValue2Ref.value = e.target.value;
      },

      value3: ref(1),
      checkedValue3: checkedValue3Ref,
      valueMin3: ref(100.55),
      handleChange3(e: any) {
        checkedValue3Ref.value = e.target.value;
      },
    };
  },
});
</script>
