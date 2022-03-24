import i18n from "@/i18n";
import {
  DeleteOutlined,
  DownloadingOutlined,
  PrintOutlined,
  CallSplitOutlined,
  ContentCopyOutlined,
} from "@vicons/material";
import { renderIcon } from "@/utilities/general/renderIcon";

const { t } = i18n.global;

export function PartsListBulkActions() {
  return [
    {
      label: t("partsList.actions.delete"),
      key: "delete",
      icon: renderIcon(DeleteOutlined),
    },
    {
      label: t("partsList.actions.copyTo"),
      key: "copyTo",
      icon: renderIcon(ContentCopyOutlined),
    },
    {
      label: t("partsList.actions.split"),
      key: "split",
      icon: renderIcon(CallSplitOutlined),
    },
    {
      label: t("partsList.actions.checkPrices"),
      key: "checkPrices",
      icon: renderIcon(DownloadingOutlined),
    },
    {
      label: t("partsList.actions.print"),
      key: "print",
      icon: renderIcon(PrintOutlined),
    },
  ];
}
