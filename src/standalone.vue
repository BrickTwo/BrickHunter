<template>
  <n-config-provider :theme="theme">
    <n-space vertical>
      <n-layout has-sider>
        <n-layout-sider
          bordered
          collapse-mode="width"
          :collapsed-width="64"
          :width="240"
          :collapsed="collapsed"
          show-trigger
          @collapse="collapsed = true"
          @expand="collapsed = false"
        >
          <div
            role="menu"
            class="n-menu n-menu--vertical"
            :class="{ 'n-menu--collapsed': collapsed }"
            style="
              --bezier: cubic-bezier(0.4, 0, 0.2, 1);
              --font-size: 14px;
              --border-color-horizontal: #0000;
              --border-radius: 3px;
              --item-height: 42px;
              --group-text-color: rgb(158, 164, 170);
              --color: #0000;
              --item-text-color: rgb(51, 54, 57);
              --item-icon-color: rgb(31, 34, 37);
              --item-icon-color-collapsed: rgb(31, 34, 37);
              padding-top: 10px;
              padding-bottom: 40px;
            "
          >
            <div role="menuitem" class="n-menu-item">
              <div
                role="none"
                class="n-menu-item-content"
                style="cursor: default"
                :style="{ 'padding-left': bhIconPaddingLeft + 'px' }"
              >
                <div
                  class="n-menu-item-content__icon"
                  :class="{
                    'bh-icon': !collapsed,
                    'bh-icon-collapsed': collapsed,
                  }"
                  style="width: 22px; height: 22px"
                  :style="{
                    'font-size': bhIconFontSize + 'px',
                    'margin-right': bhIconMarginRight + 'px',
                  }"
                  role="none"
                >
                  <img
                    src="./assets/icon-trans48.png"
                    class="d-inline-block align-top"
                  />
                </div>
                <div class="n-menu-item-content-header" role="none">
                  <n-h2 style="margin: auto">BrickHunter</n-h2>
                </div>
              </div>
            </div>
          </div>

          <n-menu
            :collapsed="collapsed"
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="menuOptions"
            v-model:value="activeKey"
          />
        </n-layout-sider>
        <n-layout>
          <div
            class="doc"
            style="
              display: flex;
              flex-wrap: nowrap;
              padding: 32px 24px 24px 24px;
              height: calc(100vh - 56px);
            "
            id="content"
          >
            <div
              style="position: absolute; z-index: 99; top: 10px; right: 24px"
            >
              <LoadingShort />
            </div>
            <div
              style="position: absolute; z-index: 99; top: 10px; right: 150px"
            >
              <CartShort />
            </div>
            <router-view />
          </div>
        </n-layout>
      </n-layout>
    </n-space>
  </n-config-provider>
</template>

<script lang="ts">
import { defineComponent, h, ref } from "vue";
import { darkTheme } from "naive-ui";
import { NIcon } from "naive-ui";
import {
  FormatListBulletedOutlined,
  SettingsOutlined,
  ScreenSearchDesktopOutlined,
  HelpOutlineFilled,
  InfoOutlined,
  ShoppingCartOutlined,
} from "@vicons/material";

import LoadingShort from "./components/loading/LoadingShort.vue";
import CartShort from "./components/cart/CartShort.vue";
import { BuiltInGlobalTheme } from "naive-ui/lib/themes/interface";
import { RouterLink } from "vue-router";

// eslint-disable-next-line
function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const menuOptions = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "browseParts",
          },
        },
        { default: () => "Browse Parts" }
      ),
    key: "browseparts",
    icon: renderIcon(ScreenSearchDesktopOutlined),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "partsLists",
          },
        },
        { default: () => "Parts Lists" }
      ),
    key: "partslists",
    icon: renderIcon(FormatListBulletedOutlined),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "cart",
          },
        },
        { default: () => "Shopping Cart" }
      ),
    key: "cart",
    icon: renderIcon(ShoppingCartOutlined),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "settings",
          },
        },
        { default: () => "Settings" }
      ),
    key: "settings",
    icon: renderIcon(SettingsOutlined),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "help",
          },
        },
        { default: () => "Help" }
      ),
    key: "help",
    icon: renderIcon(HelpOutlineFilled),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "info",
          },
        },
        { default: () => "Info" }
      ),
    key: "info",
    icon: renderIcon(InfoOutlined),
  },
];

export default defineComponent({
  name: "App",
  components: {
    LoadingShort,
    CartShort,
  },
  data: () => ({
    page: "partslists",
    darkTheme,
    theme: ref(darkTheme),
    activeKey: ref(null),
    collapsed: ref(false),
    menuOptions,
    init: false,
  }),
  computed: {
    bhIconPaddingLeft() {
      if (!this.collapsed) return "32";
      return "21";
    },
    bhIconFontSize() {
      if (!this.collapsed) return "20";
      return "22";
    },
    bhIconMarginRight() {
      if (!this.collapsed) return "18";
      return "19";
    },
  },
  methods: {
    changeTheme(theme: BuiltInGlobalTheme) {
      this.theme = theme;
    },
  },
});
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.n-layout {
  height: 100vh;
}
</style>
