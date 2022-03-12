<template>
  <n-space vertical size="large" style="width: 100%">
    <n-layout>
      <n-page-header>
        <template #title>Browse Parts</template>
        <template #avatar>
          <n-icon size="20">
            <ScreenSearchDesktopOutlined />
          </n-icon>
        </template>
      </n-page-header>
    </n-layout>
    <n-layout style="width: 100%">
      <n-card style="width: 100%" content-style="padding: 0">
        <n-layout style="height: calc(100vh - 90px)" has-sider>
          <n-layout-sider
            content-style="padding: 24px;"
            :native-scrollbar="false"
            bordered
          >
            <PartsLists />
            <Categories />
          </n-layout-sider>
          <n-layout :native-scrollbar="false">
            <n-layout-header
              position="absolute"
              style="height: 165px; padding: 24px; z-index: 0"
              bordered
            >
              <Filter />
            </n-layout-header>
            <n-layout
              position="absolute"
              style="top: 165px; background-color: rgb(24, 24, 28)"
              :native-scrollbar="false"
              id="drawer-brick-detail-target"
            >
              <n-layout-content
                style="background-color: rgb(24, 24, 28)"
                content-style="padding: 24px; "
              >
                <n-grid
                  cols="1 400:2 600:3 800:4 1000:5 1200:6 1400:7 1600:8"
                  :x-gap="10"
                  :y-gap="10"
                >
                  <n-grid-item v-for="(part, index) in parts" :key="index">
                    <n-card
                      style="min-width: 200px; padding: 2px"
                      header-style="padding: 0; font-size: 15px; height: 78px; overflow: hidden; vertical-align: top; display: block;"
                      content-style="padding: 0"
                      footer-style="padding: 0"
                    >
                      <template #cover>
                        <div style="background-color: white; width: 100%">
                          <n-image
                            :src="part.imageUrl"
                            style="height: 120px; width: 100%"
                            object-fit="scale-down"
                            @click="showBrickDetail = true"
                            preview-disabled
                          />
                        </div>
                      </template>
                      <template #header>
                        <n-p style="margin: 0 !important">
                          <n-space justify="space-between">
                            <div>
                              <n-space size="small" style="margin-top: 2px">
                                <n-popover trigger="hover">
                                  <template #trigger>
                                    <n-tag size="small" type="success"
                                      >B&P</n-tag
                                    >
                                  </template>
                                  <span>Bricks & Pieces</span>
                                </n-popover>
                                <n-popover
                                  trigger="hover"
                                  v-if="
                                    index == 4 ||
                                    index == 8 ||
                                    index == 9 ||
                                    index == 18
                                  "
                                >
                                  <template #trigger>
                                    <n-tag size="small" type="success"
                                      >PaB</n-tag
                                    >
                                  </template>
                                  <span>Pick a Brick</span>
                                </n-popover>
                              </n-space>
                            </div>
                            <div>
                              <n-button
                                text
                                style="font-size: 24px"
                                type="info"
                              >
                                <n-icon>
                                  <TelegramPlane />
                                </n-icon>
                              </n-button>
                              <n-button
                                text
                                style="font-size: 24px"
                                type="success"
                              >
                                <n-icon>
                                  <CheckCircleRound />
                                </n-icon>
                              </n-button>
                              <n-button
                                text
                                style="font-size: 24px"
                                type="error"
                              >
                                <n-icon>
                                  <HeartFilled />
                                </n-icon>
                              </n-button>
                              <n-button
                                text
                                style="font-size: 24px"
                                @click="showBrickDetail = true"
                              >
                                <n-icon>
                                  <OpenInFullOutlined />
                                </n-icon>
                              </n-button>
                            </div>
                          </n-space>
                        </n-p>
                        <n-p style="margin: 0 !important">
                          {{ part.description }}
                        </n-p>
                      </template>
                      <!-- <template #header-extra> #extra </template> -->
                      <n-space vertical size="small">
                        <n-space justify="space-between">
                          <div>Element:</div>
                          <div>
                            <n-a>{{ part.itemNumber }}</n-a>
                          </div>
                        </n-space>
                        <n-space justify="space-between">
                          <div>Design Number:</div>
                          <div>
                            <n-a>{{ part.designId }}</n-a>
                          </div>
                        </n-space>
                        <n-space justify="space-between">
                          <div>Max Amount:</div>
                          <div>{{ part.maxAmount }}</div>
                        </n-space>
                        <n-space justify="space-between">
                          <div>
                            <n-space size="small">
                              <n-popover
                                trigger="hover"
                                v-if="index != 4 && index != 8"
                              >
                                <template #trigger>
                                  <n-tag size="small" type="success">B&P</n-tag>
                                </template>
                                <span>Bricks & Pieces</span>
                              </n-popover>
                              <n-popover trigger="hover" v-else>
                                <template #trigger>
                                  <n-tag size="small" type="success">PaB</n-tag>
                                </template>
                                <span>Pick a Brick</span>
                              </n-popover>
                              <img
                                src="@/assets/flags/de.png"
                                style="width: 20px"
                              />
                            </n-space>
                          </div>
                          <div>
                            {{ part.priceAmount }} {{ part.priceCurrency }}
                          </div>
                        </n-space>
                        <div>
                          <div
                            style="
                              background-color: #ffffff;
                              border: 1px solid black;
                              width: 13px;
                              height: 13px;
                              margin-right: 5px;
                              display: inline-block;
                            "
                          />
                          <span style="white-space: nowrap">
                            <n-a>{{ part.color }}</n-a>
                          </span>
                        </div>
                      </n-space>
                      <!-- <template #footer> #footer </template> -->
                      <template #footer>
                        <n-button
                          type="warning"
                          ghost
                          style="width: 100%"
                          v-if="index == 1"
                        >
                          <n-input-number
                            v-model:value="value"
                            placeholder="Min"
                            :min="0"
                          />
                          <n-button text style="font-size: 24px" type="error">
                            <n-icon>
                              <DeleteOutlined />
                            </n-icon>
                          </n-button>
                        </n-button>
                        <n-button
                          type="primary"
                          ghost
                          style="width: 100%"
                          v-else
                        >
                          <template #icon>
                            <n-icon>
                              <PlusOutlined />
                            </n-icon>
                          </template>
                          Add
                        </n-button>
                      </template>
                    </n-card>
                  </n-grid-item>
                </n-grid>
              </n-layout-content>
            </n-layout>
          </n-layout>
        </n-layout>
      </n-card>
    </n-layout>
  </n-space>
  <n-drawer
    v-model:show="showBrickDetail"
    height="100%"
    placement="top"
    to="#drawer-brick-detail-target"
  >
    <BrickDetailDrawer />
  </n-drawer>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import {
  ScreenSearchDesktopOutlined,
  PlusOutlined,
  DeleteOutlined,
  CheckCircleRound,
  OpenInFullOutlined,
} from "@vicons/material";
import { HeartFilled } from "@vicons/antd";
import { TelegramPlane } from "@vicons/fa";
import { parts } from "@/dummyData/parts";
import PartsLists from "@/components/browseparts/BrowsePartsPartsLists.vue";
import Categories from "@/components/browseparts/BrowsePartsCategories.vue";
import Filter from "@/components/browseparts/BrowsePartsFilter.vue";
import BrickDetailDrawer from "@/components/browseparts/BrowsePartsBrickDetailDrawer.vue";

export default defineComponent({
  name: "BrowsePartsView",
  components: {
    ScreenSearchDesktopOutlined,
    PlusOutlined,
    DeleteOutlined,
    PartsLists,
    Categories,
    Filter,
    HeartFilled,
    CheckCircleRound,
    TelegramPlane,
    OpenInFullOutlined,
    BrickDetailDrawer,
  },
  setup() {
    const value = ref(1);

    return {
      value,
      parts: parts.parts,
      showBrickDetail: ref(false),
    };
  },
});
</script>
