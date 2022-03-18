<template>
  <n-drawer
    v-model:show="showDrawer"
    :width="800"
    style="max-width: 100%"
    :mask-closable="!isImporting"
  >
    <n-drawer-content title="File Import" closable>
      <n-spin style="height: 100%" :show="isImporting">
        <n-form :model="formValue" ref="formRef" :rules="rules">
          <n-tabs type="line">
            <n-tab-pane name="file upload" tab="File Upload">
              <n-form-item path="fileUpload">
                <n-upload
                  style="width: 100%"
                  :max="1"
                  accept="text/xml, application/json, .csv"
                  v-model="fileList"
                  @update:file-list="handleFileListChange"
                >
                  <n-upload-dragger v-if="!fileList">
                    <div style="margin-bottom: 12px">
                      <n-icon size="48" :depth="3">
                        <UploadOutlined />
                      </n-icon>
                    </div>
                    <n-text style="font-size: 16px">
                      Click or drag a file to this area to upload
                    </n-text>
                    <n-p depth="3" style="margin: 8px 0 0 0">
                      BrickHunter, BrickLink, Rebrickable, CSV
                    </n-p>
                  </n-upload-dragger>
                </n-upload>
              </n-form-item>
            </n-tab-pane>
            <n-tab-pane name="text input" tab="Text Input">
              <n-form-item path="textInput">
                <n-input
                  v-model:value="formValue.textInpuit"
                  type="textarea"
                  placeholder="Copy file content here"
                  style="height: 200px"
                />
              </n-form-item>
            </n-tab-pane>
          </n-tabs>
          <n-form-item label="Source" path="source">
            <n-select v-model:value="formValue.source" :options="options" />
          </n-form-item>
          <n-form-item label="Name" path="name">
            <n-input
              v-model:value="formValue.name"
              type="text"
              placeholder="Input Name"
            />
          </n-form-item>
          <n-form-item
            label="Mapping"
            path="mapping"
            style="width: 100%"
            v-if="formValue.source == 'customcsv'"
          >
            <n-space vertical style="width: 100%">
              <n-list style="width: 100%; margin-block: 0">
                <n-list-item
                  v-for="(value, index) in csvValues"
                  :key="index"
                  style="width: 100%"
                >
                  <n-space justify="space-between">
                    <n-space>
                      <div>{{ index + 1 }}.</div>
                      <n-cascader
                        :options="csvOptions"
                        v-model:value="value.field"
                        label-field="fieldLabel"
                        value-field="fieldValue"
                        children-field="fieldChildren"
                        expand-trigger="hover"
                        filterable="true"
                        check-strategy="child"
                        style="margin: 0 8px; width: 500px"
                      />
                    </n-space>
                    <div>{{ value.csvValue }}</div>
                  </n-space>
                </n-list-item>
              </n-list>
            </n-space>
          </n-form-item>
          <n-space justify="start">
            <n-button
              type="primary"
              ghost
              @click="handleClickImport"
              :disabled="!showImportButton"
            >
              <template #icon>
                <n-icon>
                  <SaveAltOutlined />
                </n-icon>
              </template>
              Import
            </n-button>
            <n-button @click="$emit('update:show', false)">
              <template #icon>
                <n-icon>
                  <ClearOutlined />
                </n-icon>
              </template>
              Cancel
            </n-button>
          </n-space>
        </n-form>
      </n-spin>
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import {
  UploadOutlined,
  SaveAltOutlined,
  ClearOutlined,
} from "@vicons/material";
import { ImportBrickLink } from "@/service/reader/import-brickLink";
import { partsListStore } from "@/store/partslist-store";
import { BrickLinkItemModel } from "@/types/api-types";

export default defineComponent({
  name: "FileImport",
  components: {
    UploadOutlined,
    SaveAltOutlined,
    ClearOutlined,
  },
  props: { show: { type: Boolean, required: true } },
  emits: ["update:show"],
  setup(prop, { emit }) {
    const formValue = ref({
      name: "",
      textInpuit: "",
      source: ref("brickhunter"),
    });
    const fileList = ref();
    const isImporting = ref(false);
    const showDrawer = ref(prop.show);
    const showImportButton = ref(false);

    let wantedList: BrickLinkItemModel[] = [];

    watch(
      () => prop.show,
      () => {
        showDrawer.value = prop.show;
      }
    );

    return {
      fileList,
      isImporting,
      showDrawer,
      showImportButton,
      async handleFileListChange(fileList: any) {
        showImportButton.value = false;
        let xml = new ImportBrickLink();
        if (fileList) {
          wantedList = await xml.parseFileToObject(fileList[0].file);
          if (!wantedList[0]) return;

          console.log(fileList[0], wantedList);
          formValue.value.name = fileList[0].name.substring(
            0,
            fileList[0].name.length - 4
          );
          if (fileList[0].type === "text/xml" && wantedList)
            formValue.value.source = "bricklink";

          showImportButton.value = true;
        }
      },
      formValue,
      async handleClickImport() {
        // todo: form validation check
        isImporting.value = true;
        await partsListStore.importFromBrickLink(
          wantedList,
          formValue.value.name
        );
        isImporting.value = false;
        emit("update:show", false);
      },
      rules: {
        name: {
          required: true,
          message: "Please input a name for your list",
          trigger: ["input", "blur"],
        },
      },
      csvValues: ref([
        {
          field: "Ignore",
          csvValue: "3004",
        },
        {
          field: "Ignore",
          csvValue: "55665",
        },
        {
          field: "Ignore",
          csvValue: "Red",
        },
        {
          field: "Ignore",
          csvValue: "15",
        },
      ]),
      csvOptions: [
        {
          fieldLabel: "Ignore",
          fieldValue: "ignore",
        },
        {
          fieldLabel: "DesignId",
          fieldValue: "designId",
        },
        {
          fieldLabel: "Element",
          fieldValue: "itemNumber",
        },
        {
          fieldLabel: "Color",
          fieldValue: "color",
          fieldChildren: [
            {
              fieldLabel: "BrickLink Name",
              fieldValue: "brickLinkColor",
            },
            {
              fieldLabel: "LEGO Name",
              fieldValue: "legoColor",
            },
          ],
        },
        {
          fieldLabel: "BrickLink Price",
          fieldValue: "brickLinkPrice",
        },
        {
          fieldLabel: "Pick a Brick Price",
          fieldValue: "pickABrickPrice",
        },
        {
          fieldLabel: "Bricks & Pieces Price",
          fieldValue: "bricksAndPiecesPrice",
        },
      ],
    };
  },
  data: () => ({
    options: [
      {
        label: "BrickHunter",
        value: "brickhunter",
      },
      {
        label: "BrickLink",
        value: "bricklink",
      },
      {
        label: "Rebrickable",
        value: "rebrickable",
      },
      {
        label: "Custom CSV",
        value: "customcsv",
      },
    ],
  }),
});
</script>

<style>
.n-upload-trigger {
  width: 100%;
}
</style>
