<template>
  <n-data-table
    size="small"
    :virtual-scroll="!print"
    :flex-height="!print"
    :style="style"
    ref="table"
    :columns="columns"
    :data="partsList.parts"
    :row-key="
      (rowData) => {
        return rowData.source.id + '+' + rowData.source.color;
      }
    "
    @update:sorter="onSorterChange"
  />
</template>

<script lang="ts">
import { DataTableSortState, DataTableColumns } from "naive-ui";
import { defineComponent, ref, onBeforeMount } from "vue";
import { partDataTableColumns } from "@/service/lists/partDataTableColumns";

export default defineComponent({
  name: "PartDataTable",
  props: {
    partsList: { type: Object, required: true },
    style: { type: Object, required: false },
    print: { type: Boolean, required: false, default: false },
  },
  setup(prop) {
    const columns = ref(partDataTableColumns() as DataTableColumns);

    const onSorterChange = (sorter: DataTableSortState | null) => {
      columns.value.forEach((column) => {
        /** column.sortOrder !== undefined means it is uncontrolled */
        // @ts-ignore: missing type for columns
        if (column.sortOrder === undefined) return;
        if (!sorter) {
          // @ts-ignore: missing type for columns
          column.sortOrder = false;
          return;
        }
        // @ts-ignore: missing type for columns
        if (column.key === sorter.columnKey) column.sortOrder = sorter.order;
        // @ts-ignore: missing type for columns
        else column.sortOrder = false;
      });
    };

    onBeforeMount(() => {
      if (prop.print) {
        columns.value = columns.value.filter(
          (c) => c.type !== "selection" && c.type !== "expand"
        );
      }
    });

    return {
      columns,
      onSorterChange,
    };
  },
});
</script>
