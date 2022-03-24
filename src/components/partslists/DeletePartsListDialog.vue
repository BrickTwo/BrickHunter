<template>
  <n-modal
    :mask-closable="false"
    preset="dialog"
    type="warning"
    :title="$t('partsList.delete.title')"
    :positive-text="$t('general.functions.confirm')"
    :negative-text="$t('general.functions.cancel')"
  >
    <div>
      {{ $t("partsList.delete.request") }} <br />
      <p>{{ partsList?.name }}</p>
    </div>
  </n-modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "DeletePartsListDialog",
  props: {
    partsList: { type: Object, required: true },
  },
});
</script>
