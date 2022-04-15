import { h } from "vue";
import { NIcon, NButton, NSpace } from "naive-ui";
import i18n from "@/i18n";
import { IPartsListStore } from "@/types/store-types";
import {
  ManageSearchOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
} from "@vicons/material";

const { t } = i18n.global;

export function PartsListsColumns(
  onOpenPartsList: (row: IPartsListStore) => void,
  onAddToCart: (row: IPartsListStore) => void,
  onDelete: (row: IPartsListStore) => void
) {
  return [
    {
      type: "selection",
    },
    {
      title: t("partsList.name"),
      key: "name",
    },
    {
      title: t("partsList.positions"),
      key: "positions.length",
    },
    {
      title: t("partsList.actions.title"),
      key: "actions",
      render(row: IPartsListStore) {
        return h(NSpace, {}, () => [
          h(
            NButton,
            {
              id: "openPartsList",
              size: "small",
              onClick: () => onOpenPartsList(row),
            },
            {
              default: () => t("partsList.actions.open"),
              icon: () =>
                h(NIcon, null, { default: () => h(ManageSearchOutlined) }),
            }
          ),
          h(
            NButton,
            {
              id: "addToCart",
              size: "small",
              onClick: () => onAddToCart(row),
            },
            {
              default: () =>
                row.inCart
                  ? t("partsList.actions.removeFromCart")
                  : t("partsList.actions.addToCart"),
              icon: () =>
                h(NIcon, null, { default: () => h(ShoppingCartOutlined) }),
            }
          ),
          h(
            NButton,
            {
              id: "delete",
              size: "small",
              onClick: () => onDelete(row),
            },
            {
              default: () => t("partsList.actions.delete"),
              icon: () => h(NIcon, null, { default: () => h(DeleteOutlined) }),
            }
          ),
        ]);
      },
    },
  ];
}
