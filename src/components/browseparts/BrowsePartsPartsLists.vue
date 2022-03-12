<template>
  <n-h2>Parts Lists</n-h2>
  <n-list>
    <n-list-item>
      <n-space justify="space-between">
        <n-space size="small">
          <n-button text style="font-size: 18px" type="error">
            <n-icon>
              <HeartFilled />
            </n-icon>
          </n-button>
          <span>Wish list (5)</span>
        </n-space>
        <n-space size="small">
          <n-button text style="font-size: 14px">
            <n-icon>
              <ModeEditOutlined />
            </n-icon>
          </n-button>
          <n-button text style="font-size: 14px">
            <n-icon>
              <EyeInvisibleOutlined />
            </n-icon>
          </n-button>
        </n-space>
      </n-space>
    </n-list-item>
    <n-list-item>
      <n-space justify="space-between">
        <n-space size="small">
          <n-button text style="font-size: 18px" type="success">
            <n-icon>
              <CheckCircleRound />
            </n-icon>
          </n-button>
          <span>Have it (100)</span>
        </n-space>
        <n-space size="small">
          <n-button text style="font-size: 14px">
            <n-icon>
              <ModeEditOutlined />
            </n-icon>
          </n-button>
          <n-button text style="font-size: 14px">
            <n-icon>
              <EyeInvisibleOutlined />
            </n-icon>
          </n-button>
        </n-space>
      </n-space>
    </n-list-item>
    <n-list-item>
      <n-space justify="space-between">
        <n-space size="small">
          <n-button text style="font-size: 18px" type="info">
            <n-icon>
              <TelegramPlane />
            </n-icon>
          </n-button>
          <span>Notifications (4/3)</span>
        </n-space>
        <n-space size="small">
          <n-button text style="font-size: 14px">
            <n-icon>
              <ModeEditOutlined />
            </n-icon>
          </n-button>
          <n-button text style="font-size: 14px">
            <n-icon>
              <EyeInvisibleOutlined />
            </n-icon>
          </n-button>
        </n-space>
      </n-space>
    </n-list-item>
    <n-list-item>
      <n-space justify="space-between">
        <span>
          <n-radio :checked="true"> My First Parts List (32) </n-radio>
        </span>
        <n-space size="small">
          <n-button text style="font-size: 14px">
            <n-icon>
              <ModeEditOutlined />
            </n-icon>
          </n-button>
          <n-button text style="font-size: 14px">
            <n-icon>
              <EyeInvisibleOutlined />
            </n-icon>
          </n-button>
        </n-space>
      </n-space>
    </n-list-item>
    <n-list-item>
      <n-space justify="space-between" size="small">
        <span>
          <n-radio :checked="false">
            <n-ellipsis style="max-width: 120px">
              My Second Parts List
            </n-ellipsis>
            (42)
          </n-radio>
        </span>
        <n-space size="small">
          <n-button text style="font-size: 14px">
            <n-icon>
              <ModeEditOutlined />
            </n-icon>
          </n-button>
          <n-button text style="font-size: 14px">
            <n-icon>
              <EyeInvisibleOutlined />
            </n-icon>
          </n-button>
        </n-space>
      </n-space>
    </n-list-item>
    <n-list-item>
      <n-collapse>
        <n-collapse-item title="more" name="1">
          <template #header-extra>(3)</template>
          <n-list>
            <n-list-item>
              <n-space justify="space-between">
                <span>
                  <n-radio :checked="false"> Another Parts List (32) </n-radio>
                </span>
                <n-space size="small">
                  <n-button text style="font-size: 14px">
                    <n-icon>
                      <ModeEditOutlined />
                    </n-icon>
                  </n-button>
                  <n-button text style="font-size: 14px">
                    <n-icon>
                      <EyeInvisibleOutlined />
                    </n-icon>
                  </n-button>
                </n-space>
              </n-space>
            </n-list-item>
            <n-list-item>
              <n-space justify="space-between">
                <span>
                  <n-radio :checked="false">
                    <n-ellipsis style="max-width: 105px">
                      76139 - 1989 Batmobile
                    </n-ellipsis>
                    (499)
                  </n-radio>
                </span>
                <n-space size="small">
                  <n-button text style="font-size: 14px">
                    <n-icon>
                      <ModeEditOutlined />
                    </n-icon>
                  </n-button>
                  <n-button text style="font-size: 14px">
                    <n-icon>
                      <EyeInvisibleOutlined />
                    </n-icon>
                  </n-button>
                </n-space>
              </n-space>
            </n-list-item>
            <n-list-item>
              <n-space justify="space-between">
                <span>
                  <n-radio :checked="false"> Lose Parts (55) </n-radio>
                </span>
                <n-space size="small">
                  <n-button text style="font-size: 14px">
                    <n-icon>
                      <ModeEditOutlined />
                    </n-icon>
                  </n-button>
                  <n-button text style="font-size: 14px">
                    <n-icon>
                      <EyeInvisibleOutlined />
                    </n-icon>
                  </n-button>
                </n-space>
              </n-space>
            </n-list-item>
          </n-list>
        </n-collapse-item>
      </n-collapse>
    </n-list-item>
  </n-list>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ModeEditOutlined, CheckCircleRound } from "@vicons/material";
import { EyeInvisibleOutlined, HeartFilled } from "@vicons/antd";
import { TelegramPlane } from "@vicons/fa";

export default defineComponent({
  name: "BrowsePartsPartsLists",
  components: {
    ModeEditOutlined,
    EyeInvisibleOutlined,
    HeartFilled,
    CheckCircleRound,
    TelegramPlane,
  },
  setup() {
    return {};
  },
});
</script>
