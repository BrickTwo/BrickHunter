<template>
  <div>
    <n-space vertical size="large" style="width: 100%">
      <n-layout>
        <n-page-header @back="$router.push({ path: '/partslists/' })">
          <template #title>{{ $t("partsList.title") }}</template>
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
                    {{ $t("partsList.actions.delete") }}
                  </n-button>
                  <n-button @click="showModalRename = true">
                    <template #icon>
                      <n-icon>
                        <ModeEditOutlined />
                      </n-icon>
                    </template>
                    {{ $t("partsList.actions.rename") }}
                  </n-button>
                  <n-button>
                    <template #icon>
                      <n-icon>
                        <SaveAltOutlined />
                      </n-icon>
                    </template>
                    {{ $t("partsList.actions.export") }}
                  </n-button>
                </n-space>
              </n-space>
              <n-space>
                <n-statistic
                  :label="$t('partsList.statistic.totalUniqueParts')"
                >
                  {{ partsList.parts?.length }}
                </n-statistic>
                <n-divider vertical />
                <n-statistic :label="$t('partsList.statistic.totalQuantity')">
                  {{
                    partsList.parts
                      ? partsList.parts
                          .map((p) => p.source.qty)
                          .reduce((prev, curr) => prev + curr, 0)
                      : 0
                  }}
                </n-statistic>
                <n-divider vertical />
                <n-statistic
                  :label="
                    $t('general.names.pickABrickShort') +
                    ' ' +
                    $t('general.names.pickABrickBestseller')
                  "
                >
                  {{
                    partsList.parts
                      ? partsList.parts.filter(
                          (p) =>
                            p.detail.lego?.attributes?.deliveryChannel == "pab"
                        ).length
                      : 0
                  }}
                </n-statistic>
                <n-divider vertical />
                <n-statistic
                  :label="
                    $t('general.names.pickABrickShort') +
                    ' ' +
                    $t('general.names.pickABrickStandard')
                  "
                >
                  {{
                    partsList.parts
                      ? partsList.parts.filter(
                          (p) =>
                            p.detail.lego?.attributes?.deliveryChannel == "bap"
                        ).length
                      : 0
                  }}
                </n-statistic>
                <n-divider vertical />
                <n-statistic
                  :label="
                    $t('general.names.pickABrickShort') +
                    ' ' +
                    $t('general.names.pickABrickOutOfStock')
                  "
                >
                  {{
                    partsList.parts
                      ? partsList.parts.filter(
                          (p) => !p.detail.lego?.inStock && p.detail.lego?.date
                        ).length
                      : 0
                  }} </n-statistic
                ><n-divider vertical />
                <n-statistic :label="$t('partsList.statistic.price')">
                  {{
                    partsList.parts
                      ? (
                          Math.round(
                            partsList.parts
                              .map((p) => p.detail.lego?.price?.formattedValue)
                              .reduce((prev, curr) => prev + curr, 0) * 100
                          ) / 100
                        ).toFixed(2)
                      : 0
                  }}
                  EUR
                </n-statistic>
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
                  {{ $t("partsList.actions.bulkAction") }}
                </n-button>
              </n-dropdown>
              <n-space justify="end">
                <!-- <n-button type="primary" ghost @click="onCheckPrices()">
                  <template #icon>
                    <n-icon>
                      <DownloadingOutlined />
                    </n-icon>
                  </template>
                  {{ $t("partsList.actions.checkPrices") }}
                </n-button> -->
                <n-button
                  @click="$router.push({ path: `/print/partslist/${id}` })"
                >
                  <template #icon>
                    <n-icon>
                      <PrintOutlined />
                    </n-icon>
                  </template>
                  {{ $t("partsList.actions.print") }}
                </n-button>
              </n-space>
            </n-space>
            <PartDataTable
              :partsList="partsList"
              style="height: calc(100vh - 280px)"
              @update:checked-row-keys="handleCheck"
            />
          </n-space>
        </n-card>
        <DeletePartsListDialog
          v-model:show="showModalDeleteRequest"
          :partsList="partsList"
          @positive-click="onDeleteRequestPositiveClick()"
        />
        <RenamePartsListDialog
          v-model:show="showModalRename"
          :partsList="partsList"
          @positive-click="onRenamePositiveClick"
        />
      </n-layout>
    </n-space>
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, watch, onMounted } from "vue";
import {
  DeleteOutlined,
  ModeEditOutlined,
  DownloadingOutlined,
  PrintOutlined,
  SaveAltOutlined,
  ManageSearchOutlined,
  ArrowDropDownOutlined,
} from "@vicons/material";
import { partsListStore } from "@/store/partslist-store";
import { partsStore } from "@/store/parts-store";
import {
  IPartsList,
  BackgroundRequest,
  BackgroundRequestAction,
} from "@/types/types";
import { useRouter } from "vue-router";
import PartTableDetail from "@/components/partDataTable/partTableDetail.vue";
import partTableCellPAB from "@/components/partDataTable/partTableCellPAB.vue";
import PartDataTable from "@/components/partDataTable/partDataTable.vue";
import browser from "webextension-polyfill";
import { PickABrickQueryResponse } from "@/types/api-types";
import { PartsListBulkActions } from "@/service/lists/partsListBulkActions";
import DeletePartsListDialog from "@/components/partslists/DeletePartsListDialog.vue";
import RenamePartsListDialog from "@/components/partslists/RenamePartsListDialog.vue";
import { sleep } from "@/utilities/general/sleep";
import { useLoadingBar } from "naive-ui";

const checkedRowKeysRef = ref([]);

export default defineComponent({
  name: "PartsListView",
  props: ["id"],
  setup(prop) {
    const loadingBar = useLoadingBar();
    const partsList: Ref<IPartsList | undefined> = ref({} as IPartsList);
    const showModalDeleteRequest = ref(false);
    const showModalRename = ref(false);
    const myRouter = useRouter();
    const bulkValue = ref(null);

    const onDeleteRequestPositiveClick = () => {
      showModalDeleteRequest.value = false;
      deletePartsList();
      myRouter.push({ path: "/partslists/" });
    };

    const onRenamePositiveClick = (newName: string) => {
      if (!partsList.value) return;
      partsListStore.setPartsListName(partsList.value.id, newName);
    };

    const onCheckPrices = async () => {
      if (!partsList.value) return;

      for (var i = 0; i < partsList.value.parts.length; i++) {
        let item = partsList.value.parts[i];

        var request: BackgroundRequest = {
          action: BackgroundRequestAction.FindPaBPart,
          request: {
            page: 1,
            perPage: 500,
            query: `${item.detail.externalIds
              .filter((e) => e.source === "LEGO")
              .map((id) => id.externalId)
              .join(", ")}, ${
              item.detail.elementIds ? item.detail.elementIds.join(", ") : ""
            }`,
            location: "de-DE",
          },
        };

        console.log("request", request);

        var response = (await browser.runtime.sendMessage(
          request
        )) as PickABrickQueryResponse;

        console.log("response", response);

        var parts = response.data.elements.results
          .filter((p) => {
            return item.detail.externalIds.filter(
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
            return item.detail.elementIds
              ? item.detail.elementIds.find(
                  (e) => e.toString() === p.variant.id
                )
              : false;
          })
        );

        parts.sort(
          (a, b) =>
            a.variant.price.formattedValue - b.variant.price.formattedValue
        );

        var result = parts[0];
        if (result) {
          item.detail.lego.id = result.variant.id;
          item.detail.lego.inStock = result.inStock;
          item.detail.lego.price.currencyCode =
            result.variant.price.currencyCode;
          item.detail.lego.price.formattedValue =
            result.variant.price.formattedValue;
          item.detail.lego.attributes.designNumber =
            result.variant.attributes.designNumber;
          item.detail.lego.attributes.colourId =
            result.variant.attributes.colourId;
          item.detail.lego.attributes.deliveryChannel =
            result.variant.attributes.deliveryChannel;
          item.detail.lego.date = Date.now();
        }

        await sleep(500);
      }
    };

    const deletePartsList = () => {
      if (!partsList.value) return;
      partsListStore.deletePartsList(partsList.value.id.toString());
    };

    onMounted(async () => {
      loadingBar.start();
      partsList.value = await partsListStore.getPartsListWithDetail(prop.id);
      await partsStore.loadPaB();
      loadingBar.finish();
    });

    watch(
      () => partsListStore.getPartsListWithDetail(prop.id),
      async () => {
        partsList.value = await partsListStore.getPartsListWithDetail(prop.id);
      },
      { deep: true }
    );

    return {
      partsList,
      showModalDeleteRequest,
      showModalRename,
      bulkValue,
      bulkOptions: PartsListBulkActions(),
      onDeleteRequestPositiveClick,
      onRenamePositiveClick,
      onCheckPrices,
    };
  },
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
    PartDataTable,
    DeletePartsListDialog,
    RenamePartsListDialog,
    // Help,
  },
  data: () => ({
    checkedRowKeys: checkedRowKeysRef,
  }),
  //mixins: [partsListMixin],
  methods: {
    handleCheck(rowKeys: never[]) {
      console.log(rowKeys);
      checkedRowKeysRef.value = rowKeys;
    },
  },
});
</script>
