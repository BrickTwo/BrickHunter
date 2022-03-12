<template>
  <n-drawer-content
    title="PUNCHING FOIL SHEET, NO. 40"
    closable
    :native-scrollbar="false"
  >
    <n-space>
      <n-image
        src="https://www.lego.com/cdn/product-assets/element.img.lod4photo.192x192/6341603.jpg"
        preview-disabled
      ></n-image>
      <n-tabs type="line">
        <n-tab-pane name="data" tab="Data">
          <n-table striped>
            <tbody>
              <tr>
                <td>Category</td>
                <td style="text-align: right">
                  Flags, Signs, Plastics and Cloth
                </td>
              </tr>
              <tr>
                <td>Element</td>
                <td style="text-align: right">6341603</td>
              </tr>
              <tr>
                <td>Design Number</td>
                <td style="text-align: right">78009</td>
              </tr>
              <tr>
                <td>Price S&T</td>
                <td style="text-align: right">
                  <n-space>
                    <div>2.72 CHF</div>
                    <div>27.12.2021, 22:39</div>
                  </n-space>
                </td>
              </tr>
              <tr>
                <td>Price PaB</td>
                <td style="text-align: right">-</td>
              </tr>
              <tr>
                <td>Color BrickLink</td>
                <td style="text-align: right">Trans-Clear</td>
              </tr>
              <tr>
                <td>Color LEGO</td>
                <td style="text-align: right">Transparent</td>
              </tr>
              <tr>
                <td>Max Amount</td>
                <td style="text-align: right">
                  <n-space>
                    <div>200</div>
                    <div>27.12.2021, 20:24</div>
                  </n-space>
                </td>
              </tr>
              <tr>
                <td>First Availability</td>
                <td style="text-align: right">13.11.2021, 09:21</td>
              </tr>
              <tr>
                <td>Last Availability</td>
                <td style="text-align: right">27.12.2021, 22:39</td>
              </tr>
              <tr>
                <td>Indexing</td>
                <td style="text-align: right">1.6.2021, 20:28</td>
              </tr>
            </tbody>
          </n-table>
        </n-tab-pane>
        <n-tab-pane name="chart" tab="Chart">
          <n-image src="chart.png" preview-disabled></n-image>
        </n-tab-pane>
      </n-tabs>
    </n-space>
  </n-drawer-content>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
// import {
//   UploadOutlined,
//   SaveAltOutlined,
//   ClearOutlined,
// } from "@vicons/material";

export default defineComponent({
  name: "BrowsePartsBrickDetailDrawer",
  components: {},
  setup() {
    return {};
  },
});
</script>
