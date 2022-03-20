<script lang="ts">
import { NImage, DataTableSortState, DataTableColumns } from "naive-ui";
import { defineComponent, h, ref, Ref } from "vue";
import PartTableDetail from "@/components/partDataTable/partTableDetail.vue";
import partTableCellPAB from "@/components/partDataTable/partTableCellPAB.vue";
import { IPart } from "@/types/types";
import { TableBaseColumn, Sorter } from "naive-ui/lib/data-table/src/interface";

export default defineComponent({
  name: "PartDataTable",
  props: {
    partsList: { type: Object, required: true },
    style: { type: Object, required: false },
  },
  setup() {
    const columnsRef = ref(columns);

    return {
      columns: columnsRef,
      handleSorterChange(sorter: DataTableSortState | null) {
        columnsRef.value.forEach((column) => {
          /** column.sortOrder !== undefined means it is uncontrolled */
          if (column.sortOrder === undefined) return;
          if (!sorter) {
            column.sortOrder = false;
            return;
          }
          if (column.key === sorter.columnKey) column.sortOrder = sorter.order;
          else column.sortOrder = false;
        });
      },
    };
  },
});

const columns: DataTableColumns<IPart> = [
  {
    type: "selection",
  },
  {
    type: "expand",
    expandable: () => true,
    renderExpand: (rowData: IPart) => {
      return h(PartTableDetail, {
        part: rowData,
      });
    },
  },
  {
    title: "Id",
    key: "detail.partNum",
    sortOrder: false,
    sorter: (rowA: IPart, rowB: IPart) => {
      return rowA.detail.partNum.localeCompare(rowB.detail.partNum);
    },
  },
  {
    title: "Element",
    key: "detail.elementId",
    sortOrder: false,
    sorter: (rowA: IPart, rowB: IPart) => {
      return rowA.detail.elementId.localeCompare(rowB.detail.elementId);
    },
  },
  {
    title: "Picture",
    key: "rowData.detail.imageUrl",
    render(rowData: IPart) {
      return h(NImage, {
        src: rowData.detail.imageUrl,
        height: 50,
        width: 50,
        objectFit: "scale-down",
        fallbackSrc:
          "https://www.nicepng.com/png/detail/103-1037013_lego-brick-coloring-page-lego-brick-coloring-pages.png",
      });
    },
  },
  {
    title: "Color",
    key: "rowData.color.name",
    render(rowData: IPart) {
      return h(
        "span",
        {
          style: "display: block",
        },
        [
          h("div", {
            style: `background-color: #${rowData.color.rgb}; border: 1px solid black; width: 13px; height: 13px; margin-right: 5px; display: inline-block`,
          }),
          h("span", {
            innerHTML: rowData.color.name,
          }),
        ]
      );
    },
    sortOrder: false,
    sorter: (rowA: IPart, rowB: IPart) => {
      return rowA.color.name.localeCompare(rowB.color.name);
    },
  },
  {
    title: "Qty.",
    key: "source.qty",
    sortOrder: false,
    sorter: (rowA: IPart, rowB: IPart) => {
      return rowA.source.qty - rowB.source.qty;
    },
  },
  {
    title: "BrickLink",
    key: "brickLink.wantedList.maxprice",
  },
  {
    title: "Pick a Brick",
    key: "",
    render(rowData: IPart) {
      return h(partTableCellPAB, {
        part: rowData,
      });
    },
    sortOrder: false,
    sorter: (rowA: IPart, rowB: IPart) => {
      return (
        rowA.detail.lego.price.formattedValue -
        rowB.detail.lego.price.formattedValue
      );
    },
  },
];
</script>

<template>
  <n-data-table
    size="small"
    virtual-scroll
    flex-height
    :style="style"
    ref="table"
    :columns="columns"
    :data="partsList.parts"
    :row-key="
      (rowData) => {
        return rowData.source.id + '+' + rowData.source.color;
      }
    "
    @update:sorter="handleSorterChange"
  />
</template>
