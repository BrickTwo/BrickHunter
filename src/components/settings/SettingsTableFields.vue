<template>
  <n-p>
    Select the fields that should be shown in a row. All other information will
    be shown when expanding a row.
  </n-p>
  <n-space vertical>
    <n-ol>
      <n-dynamic-input
        v-model:value="customValue"
        :on-create="onCreate"
        #="{ value }"
      >
        <n-li style="width: 100%">
          <div style="width: 100%">
            <div style="display: flex; align-items: center">
              <n-cascader
                :options="options"
                v-model:value="value.field"
                label-field="fieldLabel"
                value-field="fieldValue"
                children-field="fieldChildren"
                expand-trigger="hover"
                filterable="true"
                check-strategy="child"
                style="margin: 0 8px"
              />
              <n-checkbox
                v-model:checked="value.isCheck"
                style="margin-right: 12px"
                label="Hide if empty"
              />
            </div>
          </div>
        </n-li>
      </n-dynamic-input>
    </n-ol>
  </n-space>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "SettingsTableFields",
  setup() {
    return {
      customValue: ref([
        {
          isCheck: false,
          field: "designId",
        },
        {
          isCheck: false,
          field: "itemNumber",
        },
        {
          isCheck: true,
          field: "brickLinkPrice",
        },
        {
          isCheck: true,
          field: "pickABrickPrice",
        },
        {
          isCheck: true,
          field: "bricksAndPiecesPrice",
        },
      ]),
      onCreate() {
        return {
          isCheck: false,
          field: "",
        };
      },
      options: [
        {
          fieldLabel: "DesignId",
          fieldValue: "designId",
        },
        {
          fieldLabel: "Element",
          fieldValue: "itemNumber",
        },
        {
          fieldLabel: "Color",
          fieldValue: "color",
          fieldChildren: [
            {
              fieldLabel: "BrickLink Name",
              fieldValue: "brickLinkColor",
            },
            {
              fieldLabel: "LEGO Name",
              fieldValue: "legoColor",
            },
          ],
        },
        {
          fieldLabel: "BrickLink Price",
          fieldValue: "brickLinkPrice",
        },
        {
          fieldLabel: "Pick a Brick Price",
          fieldValue: "pickABrickPrice",
        },
        {
          fieldLabel: "Bricks & Pieces Price",
          fieldValue: "bricksAndPiecesPrice",
        },
      ],
    };
  },
});
</script>
