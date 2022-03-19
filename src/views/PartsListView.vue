<template>
  <div>
    <n-space vertical size="large" style="width: 100%">
      <n-layout>
        <n-page-header @back="handleBack">
          <template #title>Parts List</template>
          <!-- <template #extra><Help /></template> -->
          <template #avatar>
            <n-icon size="20">
              <ManageSearchOutlined />
            </n-icon>
          </template>
        </n-page-header>
      </n-layout>
      <n-layout style="width: 100%" v-if="partsList">
        <n-card style="width: 100%">
          <div class="container" ref="container">
            <n-space justify="space-between">
              <n-space vertical size="small" style="padding: 0; margin: 0">
                <n-h1 style="padding: 0; margin: 0; line-height: 35px">
                  {{ partsList.name }}
                </n-h1>
                <n-space>
                  <n-button @click="showModalDeleteRequest = true">
                    <template #icon>
                      <n-icon>
                        <DeleteOutlined />
                      </n-icon>
                    </template>
                    Delete
                  </n-button>
                  <n-button @click="showModalRename = true">
                    <template #icon>
                      <n-icon>
                        <ModeEditOutlined />
                      </n-icon>
                    </template>
                    Rename
                  </n-button>
                  <n-button>
                    <template #icon>
                      <n-icon>
                        <SaveAltOutlined />
                      </n-icon>
                    </template>
                    Export
                  </n-button>
                </n-space>
              </n-space>
              <n-space>
                <n-statistic label="Total Unique Parts">
                  {{ partsList.parts?.length }}
                </n-statistic>
                <n-divider vertical />
                <n-statistic label="Total Quantity">
                  {{
                    partsList.parts
                      ? partsList.parts
                          .map((p) => p.qty)
                          .reduce((prev, curr) => prev + curr, 0)
                      : 0
                  }}
                </n-statistic>
                <n-divider vertical />
                <n-statistic label="PaB Bestseller">0</n-statistic>
                <n-divider vertical />
                <n-statistic label="PaB Standard">0</n-statistic>
                <n-divider vertical />
                <n-statistic label="PaB Out Of Stock">0</n-statistic>
              </n-space>
            </n-space>
          </div>
          <n-divider style="margin-top: 10px; margin-bottom: 10px" />
          <n-space vertical>
            <n-space justify="space-between">
              <n-dropdown
                trigger="click"
                :options="bulkOptions"
                placement="bottom-start"
              >
                <n-button :disabled="!checkedRowKeys.length">
                  <template #icon>
                    <n-icon>
                      <ArrowDropDownOutlined />
                    </n-icon>
                  </template>
                  Bulk Action
                </n-button>
              </n-dropdown>
              <n-space justify="end">
                <n-button type="primary" ghost @click="findPaBParts()">
                  <template #icon>
                    <n-icon>
                      <DownloadingOutlined />
                    </n-icon>
                  </template>
                  Check Prices
                </n-button>
                <n-button>
                  <template #icon>
                    <n-icon>
                      <PrintOutlined />
                    </n-icon>
                  </template>
                  Print
                </n-button>
              </n-space>
            </n-space>
            <n-data-table
              size="small"
              virtual-scroll
              flex-height
              style="height: calc(100vh - 280px)"
              ref="table"
              :columns="columns"
              :data="partsList.parts"
              :row-key="
                (rowData) => {
                  return rowData.id + '+' + rowData.color.id;
                }
              "
              @update:checked-row-keys="handleCheck"
            />
          </n-space>
        </n-card>
      </n-layout>
    </n-space>
    <n-modal
      v-model:show="showModalDeleteRequest"
      :mask-closable="false"
      preset="dialog"
      type="warning"
      title="Delete"
      positive-text="Confirm"
      negative-text="Cancel"
      @positive-click="onDeleteRequestPositiveClick"
      @negative-click="onDeleteRequestNegativeClick"
    >
      <div>
        Are you sure you want to delete the following part list?
        <br />
        <p>{{ partsList?.name }}</p>
      </div>
    </n-modal>
    <n-modal
      v-model:show="showModalRename"
      preset="dialog"
      type="default"
      :show-icon="false"
      title="Rename"
      positive-text="Save"
      negative-text="Cancel"
      @positive-click="onRenamePositiveClick"
      @negative-click="onRenameNegativeClick"
    >
      <n-input v-model:value="newName" type="text" />
    </n-modal>
  </div>
</template>

<script lang="ts">
import { NIcon, NImage } from "naive-ui";
import {
  defineComponent,
  Ref,
  ref,
  h,
  watch,
  onBeforeMount,
  onMounted,
} from "vue";
import { partsListPositions } from "@/dummyData/partslist";
import {
  DeleteOutlined,
  ModeEditOutlined,
  DownloadingOutlined,
  PrintOutlined,
  SaveAltOutlined,
  ManageSearchOutlined,
  ArrowDropDownOutlined,
  CallSplitOutlined,
  ContentCopyOutlined,
} from "@vicons/material";
// import Help from "../../general/Help.vue";
import { partsListStore } from "@/store/partslist-store";
import {
  IPartsList,
  IParts,
  BackgroundRequest,
  BackgroundRequestAction,
} from "@/types/types";
import { useRouter } from "vue-router";
import PartTableDetail from "@/components/parttable/partTableDetail.vue";
import partTableCellPAB from "@/components/parttable/partTableCellPAB.vue";
import browser from "webextension-polyfill";
import { GetPaBFindPartsResponse } from "@/types/api-types";

const checkedRowKeysRef = ref([]);

const renderIcon = (icon: any) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    });
  };
};

export default defineComponent({
  name: "PartsListView",
  props: ["id"],
  setup(prop) {
    const partsList: Ref<IPartsList | undefined> = ref({} as IPartsList);
    const showModalDeleteRequest = ref(false);
    const showModalRename = ref(false);
    const myRouter = useRouter();
    const newName = ref("");

    watch(
      () => partsListStore.getDetailedPartsList(prop.id, true),
      async () => {
        partsList.value = await partsListStore.getDetailedPartsList(
          prop.id,
          true
        );

        newName.value = partsList.value ? partsList.value.name : "";

        console.log(partsList.value);
      },
      { deep: true }
    );

    onMounted(async () => {
      partsList.value = await partsListStore.getDetailedPartsList(
        prop.id,
        true
      );
      newName.value = partsList.value ? partsList.value.name : "";
    });

    onBeforeMount(async () => {
      partsList.value = await partsListStore.getDetailedPartsList(
        prop.id,
        false
      );
      newName.value = partsList.value ? partsList.value.name : "";
    });

    const findPaBParts = async () => {
      if (!partsList.value) return;

      for (var i = 0; i < partsList.value.parts.length; i++) {
        let item = partsList.value.parts[i];

        var request: BackgroundRequest = {
          action: BackgroundRequestAction.FindPaBPart,
          request: {
            page: 1,
            perPage: 500,
            query: `${item.externalIds
              .filter((e) => e.source === "LEGO")
              .map((id) => id.externalId)
              .join(", ")}, ${
              item.elementIds ? item.elementIds.join(", ") : ""
            }`,
            location: "de-DE",
          },
        };

        console.log("request", request);

        var response = (await browser.runtime.sendMessage(
          request
        )) as GetPaBFindPartsResponse;

        var parts = response.data.elements.results
          .filter((p) => {
            return item.externalIds.filter(
              (e) =>
                e.source === "LEGO" &&
                e.externalId === p.variant.attributes.designNumber.toString()
            ).length;
          })
          .filter(
            (p) =>
              p.variant.attributes.colourId ===
              item.color.external_ids.LEGO?.ext_ids[0].toString()
          );

        parts.concat(
          response.data.elements.results.filter((p) => {
            return item.elementIds
              ? item.elementIds.find((e) => e.toString() === p.variant.id)
              : false;
          })
        );

        parts.sort(
          (a, b) =>
            a.variant.price.formattedValue - b.variant.price.formattedValue
        );

        var result = parts[0];
        item.lego = result;

        await sleep(500);
      }
    };

    const sleep = (ms: number) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    const deletePartsList = () => {
      if (!partsList.value) return;
      partsListStore.deletePartsList(partsList.value.id.toString());
    };

    return {
      partsList,
      positions: partsListPositions.positions,
      showModalDeleteRequest,
      showModalRename,
      newName,
      findPaBParts,
      bulkValue: ref(null),
      bulkOptions: [
        {
          label: "Delete",
          key: "delete",
          icon: renderIcon(DeleteOutlined),
        },
        {
          label: "Copy to",
          key: "copyTo",
          icon: renderIcon(ContentCopyOutlined),
        },
        {
          label: "Split",
          key: "split",
          icon: renderIcon(CallSplitOutlined),
        },
        {
          label: "Check Prices",
          key: "checkPrices",
          icon: renderIcon(DownloadingOutlined),
        },
        {
          label: "Print",
          key: "print",
          icon: renderIcon(PrintOutlined),
        },
      ],
      handleBack() {
        myRouter.push({ path: "/partslists/" });
      },
      onDeleteRequestPositiveClick() {
        showModalDeleteRequest.value = false;
        deletePartsList();
        myRouter.push({ path: "/partslists/" });
      },
      onDeleteRequestNegativeClick() {
        showModalDeleteRequest.value = false;
      },
      onRenamePositiveClick() {
        showModalRename.value = false;
        if (!partsList.value) return;
        //if (partsList.value) partsList.value.name = newName.value;
        partsListStore.setPartsListName(partsList.value.id, newName.value);
      },
      onRenameNegativeClick() {
        showModalRename.value = false;
      },
    };
  },
  emits: ["changePage"],
  components: {
    DeleteOutlined,
    ModeEditOutlined,
    DownloadingOutlined,
    PrintOutlined,
    SaveAltOutlined,
    ManageSearchOutlined,
    ArrowDropDownOutlined,
    PartTableDetail,
    partTableCellPAB,
    // Help,
  },
  data: () => ({
    columns: [] as unknown,
    checkedRowKeys: checkedRowKeysRef,
  }),
  beforeMount() {
    this.columns = this.createColumns();
  },
  //mixins: [partsListMixin],
  methods: {
    handleCheck(rowKeys: never[]) {
      checkedRowKeysRef.value = rowKeys;
    },
    createColumns() {
      return [
        {
          type: "selection",
        },
        {
          type: "expand",
          expandable: () => true,
          renderExpand: (rowData: IParts) => {
            return h(PartTableDetail, {
              part: rowData,
            });
          },
        },
        {
          title: "Id",
          key: "id",
          sortOrder: false,
          sorter(rowA: IParts, rowB: IParts) {
            return rowA.id > rowB.id;
          },
        },
        {
          title: "Element",
          key: "elementId",
          sortOrder: false,
          sorter(rowA: IParts, rowB: IParts) {
            return rowA.elementId > rowB.elementId;
          },
        },
        {
          title: "Picture",
          render(rowData: IParts) {
            return h(NImage, {
              src: rowData.imageUrl,
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
          render(rowData: IParts) {
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
        },
        {
          title: "Qty.",
          key: "qty",
        },
        {
          title: "BrickLink",
          key: "brickLink.wantedList.maxprice",
        },
        {
          title: "Pick a Brick",
          render(rowData: IParts) {
            return h(partTableCellPAB, {
              part: rowData,
            });
          },
        },
      ];
    },
  },
});
</script>
