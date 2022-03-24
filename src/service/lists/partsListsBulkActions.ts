import i18n from "@/i18n";
import {
  ManageSearchOutlined,
  SaveAltOutlined,
  DeleteOutlined,
  DownloadingOutlined,
} from "@vicons/material";
import { renderIcon } from "@/utilities/general/renderIcon";

const { t } = i18n.global;

export function PartsListsBulkActions() {
  return [
    {
      label: t("partsList.actions.open"),
      key: "show",
      icon: renderIcon(ManageSearchOutlined),
    },
    {
      label: t("partsList.actions.delete"),
      key: "delete",
      icon: renderIcon(DeleteOutlined),
    },
    {
      label: t("partsList.actions.export"),
      key: "export",
      icon: renderIcon(SaveAltOutlined),
    },
    {
      label: t("partsList.actions.checkPrices"),
      key: "checkPrices",
      icon: renderIcon(DownloadingOutlined),
    },
    {
      label: t("partsList.actions.addToCart"),
      key: "shoopingCart",
      icon: renderIcon(DeleteOutlined),
    },
  ];
}
