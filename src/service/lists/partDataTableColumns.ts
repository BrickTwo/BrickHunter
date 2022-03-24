import { IPart } from "@/types/types";
import { h } from "vue";
import { NImage } from "naive-ui";
import PartTableDetail from "@/components/partDataTable/partTableDetail.vue";
import partTableCellPAB from "@/components/partDataTable/partTableCellPAB.vue";
import i18n from "@/i18n";

const { t } = i18n.global;

export function partDataTableColumns() {
  return [
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
      title: t("dataDataTable.partNumberShort"),
      key: "detail.partNum",
      sortOrder: false,
      sorter: (rowA: IPart, rowB: IPart) => {
        return rowA.detail.partNum.localeCompare(rowB.detail.partNum);
      },
    },
    {
      title: t("dataDataTable.element"),
      key: "detail.elementId",
      sortOrder: false,
      sorter: (rowA: IPart, rowB: IPart) => {
        return rowA.detail.elementId.localeCompare(rowB.detail.elementId);
      },
    },
    {
      title: t("dataDataTable.picture"),
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
      title: t("dataDataTable.color"),
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
      title: t("dataDataTable.quantityShort"),
      key: "source.qty",
      sortOrder: false,
      sorter: (rowA: IPart, rowB: IPart) => {
        return rowA.source.qty - rowB.source.qty;
      },
    },
    {
      title: t("general.names.brickLink"),
      key: "brickLink.wantedList.maxprice",
    },
    {
      title: t("general.names.pickABrick"),
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
}
