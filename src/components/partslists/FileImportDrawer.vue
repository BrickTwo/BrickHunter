<template>
  <n-drawer :width="800" style="max-width: 100%" :mask-closable="!isImporting">
    <n-drawer-content :title="$t('fileImport.title')" closable>
      <n-spin style="height: 100%" :show="isImporting">
        <n-form :model="formValue" ref="formRef" :rules="rules">
          <n-tabs type="line">
            <n-tab-pane name="file upload" :tab="$t('fileImport.fileUpload')">
              <n-form-item path="fileUpload">
                <n-upload
                  style="width: 100%"
                  :max="1"
                  accept="text/xml, application/json, .csv"
                  v-model="fileList"
                  @update:file-list="onFileListChange"
                >
                  <n-upload-dragger v-if="!fileList">
                    <div style="margin-bottom: 12px">
                      <n-icon size="48" :depth="3">
                        <UploadOutlined />
                      </n-icon>
                    </div>
                    <n-text style="font-size: 16px">
                      {{ $t("fileImport.fileUploadInputHint") }}
                    </n-text>
                    <n-p depth="3" style="margin: 8px 0 0 0">
                      {{ $t("general.names.brickHunter") }},
                      {{ $t("general.names.brickLink") }},
                      {{ $t("general.names.rebrickable") }}, CSV
                    </n-p>
                  </n-upload-dragger>
                </n-upload>
              </n-form-item>
            </n-tab-pane>
            <n-tab-pane name="text input" :tab="$t('fileImport.textInput')">
              <n-form-item path="textInput">
                <n-input
                  v-model:value="formValue.textInpuit"
                  type="textarea"
                  :placeholder="$t('fileImport.textInputInputHint')"
                  style="height: 200px"
                />
              </n-form-item>
            </n-tab-pane>
          </n-tabs>
          <n-form-item :label="$t('fileImport.source')" path="source">
            <n-select
              v-model:value="formValue.source"
              :options="sourceOptions"
            />
          </n-form-item>
          <n-form-item :label="$t('fileImport.partListName')" path="name">
            <n-input
              v-model:value="formValue.name"
              type="text"
              :placeholder="$t('fileImport.partListNameInputHint')"
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
              @click="onImport"
              :disabled="!disableImportButton"
            >
              <template #icon>
                <n-icon>
                  <SaveAltOutlined />
                </n-icon>
              </template>
              {{ $t("fileImport.import") }}
            </n-button>
            <n-button @click="$emit('update:show', false)">
              <template #icon>
                <n-icon>
                  <ClearOutlined />
                </n-icon>
              </template>
              {{ $t("general.functions.cancel") }}
            </n-button>
          </n-space>
        </n-form>
      </n-spin>
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import {
  UploadOutlined,
  SaveAltOutlined,
  ClearOutlined,
} from "@vicons/material";
import { ImportBrickLink } from "@/service/reader/import-brickLink";
import { BrickLinkItemModel } from "@/types/api-types";
import { fileImportCSVValues } from "@/service/lists/fileImportCSVValues";
import { fileImportCSVOptions } from "@/service/lists/fileImportCSVOptions";
import { fileImportSourceOptions } from "@/service/lists/fileImportSourceOptions";
import { partsListStore } from "@/store/partslist-store";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "FileImport",
  components: {
    UploadOutlined,
    SaveAltOutlined,
    ClearOutlined,
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    const formValue = ref({
      name: "",
      textInpuit: "",
      source: ref("brickhunter"),
    });
    const isImporting = ref(false);
    const rules = ref({
      name: {
        required: true,
        message: t("fileImport.partListNameValidation"),
        trigger: ["input", "blur"],
      },
    });
    const fileList = ref();
    const disableImportButton = ref(false);
    let wantedList: BrickLinkItemModel[] = [];

    const onFileListChange = async (fileList: any) => {
      disableImportButton.value = false;
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

        disableImportButton.value = true;
      }
    };

    const onImport = async () => {
      // todo: form validation check
      isImporting.value = true;
      await partsListStore.importFromBrickLink(
        wantedList,
        formValue.value.name
      );
      isImporting.value = false;
      emit("onImported");
    };

    return {
      formValue,
      isImporting,
      rules,
      fileList,
      disableImportButton,
      onFileListChange,
      onImport,
      csvValues: fileImportCSVValues(),
      csvOptions: fileImportCSVOptions(),
      sourceOptions: fileImportSourceOptions(),
    };
  },
});
</script>
