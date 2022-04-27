<template>
  <n-drawer :width="800" style="max-width: 100%" :mask-closable="!isImporting">
    <n-drawer-content :title="$t('fileImport.title')" closable>
      <n-spin style="height: 100%" :show="isImporting">
        <n-form :model="formValue" ref="formInstRef" :rules="rules">
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
                  v-model:value="formValue.textInput"
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
              :disabled="!enableImportButton"
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
import { defineComponent, ref, watch } from "vue";
import {
  UploadOutlined,
  SaveAltOutlined,
  ClearOutlined,
} from "@vicons/material";
import { ImportBrickLink } from "@/service/reader/import-brickLink";
import { ImportBrickHunter } from "@/service/reader/import-brickHunter";
import { BrickHunterV1ItemModel, BrickLinkItemModel } from "@/types/api-types";
import { fileImportCSVValues } from "@/service/lists/fileImportCSVValues";
import { fileImportCSVOptions } from "@/service/lists/fileImportCSVOptions";
import { fileImportSourceOptions } from "@/service/lists/fileImportSourceOptions";
import { partsListStore } from "@/store/partslist-store";
import { useI18n } from "vue-i18n";
import { isJson } from "@/utilities/general/isJson";
import { fileToString } from "@/service/reader/file-import";
import { FormInst } from "naive-ui";

export default defineComponent({
  name: "FileImport",
  components: {
    UploadOutlined,
    SaveAltOutlined,
    ClearOutlined,
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    const formInstRef = ref<FormInst | null>(null);
    const formValue = ref({
      name: "",
      textInput: "",
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
    const enableImportButton = ref(false);
    let importedList: BrickLinkItemModel[] | BrickHunterV1ItemModel[] = [];

    const analyseInput = async (value: string) => {
      if (isJson(value)) {
        const bh = new ImportBrickHunter().parseJsonToObject(value);
        console.log("bh", bh);
        if (bh) {
          importedList = bh.positions;
          formValue.value.source = "brickhunter";
          console.log("blub", formValue.value.source);
          enableImportButton.value = true;
          formValue.value.name = bh.name;
        }
      } else {
        importedList = await new ImportBrickLink().parseXmlToObject(value);
        if (!importedList || !importedList[0]) return;

        formValue.value.source = "bricklink";
        enableImportButton.value = true;
      }

      formInstRef.value?.validate();
    };

    const onFileListChange = async (fileList: any) => {
      enableImportButton.value = false;
      console.log(fileList);
      if (fileList.length) {
        var fileContent = await fileToString(fileList[0].file);
        await analyseInput(fileContent);
        if (formValue.value.source === "bricklink") {
          formValue.value.name = fileList[0].name.substring(
            0,
            fileList[0].name.length - 4
          );
        }
        formInstRef.value?.validate();
      }
    };

    const onImport = async () => {
      if (!formValue.value) return false;
      // todo: form validation check
      isImporting.value = true;
      switch (formValue.value.source) {
        case "bricklink": {
          await partsListStore.importFromBrickLink(
            importedList as BrickLinkItemModel[],
            formValue.value.name
          );
          break;
        }
        case "brickhunter": {
          await partsListStore.importFromBrickHunterV1(
            importedList as BrickHunterV1ItemModel[],
            formValue.value.name
          );
          break;
        }
      }

      isImporting.value = false;
      emit("onImported");
    };

    watch(
      () => formValue.value.textInput,
      () => {
        console.log("change");
        analyseInput(formValue.value.textInput);
      }
    );

    return {
      formInstRef,
      formValue,
      isImporting,
      rules,
      fileList,
      enableImportButton,
      onFileListChange,
      onImport,
      csvValues: fileImportCSVValues(),
      csvOptions: fileImportCSVOptions(),
      sourceOptions: fileImportSourceOptions(),
    };
  },
});
</script>
