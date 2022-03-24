import { h } from "vue";
import { NIcon, NButton, NSpace } from "naive-ui";
import i18n from "@/i18n";
import { PartsListStore } from "@/types/store-types";
import {
  ManageSearchOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
} from "@vicons/material";

const { t } = i18n.global;

export function PartsListsColumns(
  onOpenPartsList: any,
  onAddToCart: any,
  onDelete: any
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
      key: "parts.length",
    },
    {
      title: t("partsList.actions.title"),
      key: "actions",
      render(row: PartsListStore) {
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
              default: () => t("partsList.actions.addToCart"),
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
