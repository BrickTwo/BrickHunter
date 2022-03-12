<template>
  <n-space vertical size="large" style="width: 100%">
    <n-layout>
      <n-page-header>
        <template #title>Info</template>
        <template #avatar>
          <n-icon size="20"> <InfoOutlined /> </n-icon>
        </template>
      </n-page-header>
    </n-layout>
    <n-layout style="width: 100%">
      <n-card style="width: 100%">
        <n-h2>Donation</n-h2>
        <n-p>
          If you like BrickHunter I would appreciate a voluntary donation.
        </n-p>
        <n-p>
          <img
            alt=""
            border="0"
            src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif"
            style="cursor: pointer"
          />
        </n-p>

        <n-h2>Disclaimer</n-h2>
        <n-p>
          BrickHunter is a non LEGO authorized browser extension that assists
          the user with a Pick a Brick or Bricks & Pieces order. No liability is
          assumed for the execution of the order, this applies in particular to
          the correct finding and filling of the shopping cart of a part in
          shape, color, price or quantity. The user is requested to check the
          order before sending it to the LEGO Shop. BrickHunter is programmed to
          minimize the amount of automatic background interaction with both the
          LEGO and the BrickLink website. BrickHunter is not liable for possible
          errors or blockages caused by BrickHunter on the mentioned websites.
        </n-p>

        <n-h2>License</n-h2>
        <n-p>
          BrickHunter is developed under the GPL-3.0 License. Source code
          available on GitHub.
        </n-p>

        <n-h2>Affiliate Links</n-h2>
        <n-p>
          If available for your country, orders placed with BrickHunter will be
          processed with an affiliate link. There are no additional costs for
          you, but you support that BrickHunter can still be offered in this
          form. However, you can switch off the use of an affiliate link before
          you hand it over to LEGO.
        </n-p>

        <n-h2>BrickHunter Version</n-h2>
        <n-p> 1.6.4 </n-p>
      </n-card>
    </n-layout>
  </n-space>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { InfoOutlined } from "@vicons/material";

export default defineComponent({
  name: "InfoView",
  components: { InfoOutlined },
  setup() {
    return {};
  },
});
</script>
