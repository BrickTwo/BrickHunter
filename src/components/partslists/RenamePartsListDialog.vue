<template>
  <n-modal
    preset="dialog"
    type="default"
    :show-icon="false"
    title="Rename"
    positive-text="Save"
    negative-text="Cancel"
    @positive-click="onRenamePositiveClick()"
  >
    <n-input v-model:value="newName" type="text" />
  </n-modal>
</template>

<script lang="ts">
import { IPartsList } from "@/types/types";
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  name: "RenamePartsListDialog",
  props: {
    partsList: { type: Object, required: true },
  },
  emits: {
    "positive-click"() {
      return true;
    },
  },
  setup(props, { emit }) {
    const newName = ref((props.partsList as IPartsList)?.name);

    const onRenamePositiveClick = () => {
      emit("positive-click", newName.value);
    };

    watch(
      () => props.partsList,
      async () => {
        newName.value = (props.partsList as IPartsList)?.name
          ? (props.partsList as IPartsList)?.name
          : "";
      }
    );

    return {
      newName,
      onRenamePositiveClick,
    };
  },
});
</script>
