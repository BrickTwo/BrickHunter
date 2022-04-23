<template>
  <n-modal
    v-model:show="show"
    preset="card"
    style="width: 600px"
    :title="$t('cart.transferToLego.title')"
    :bordered="false"
    :mask-closable="false"
    :close-on-esc="false"
    size="huge"
    role="dialog"
    aria-modal="true"
  >
    <n-spin
      :size="80"
      :stroke-width="10"
      v-if="state < TransferState.TransferSuccessful"
    >
      <div style="width: 100%; height: 150px" />
      <template #description>
        <span v-if="state == TransferState.Loading">
          {{ $t("cart.transferToLego.states.loading") }}
        </span>
        <span v-if="state == TransferState.WaitingForLego">
          {{ $t("cart.transferToLego.states.WaitingForLego") }}
        </span>
        <span v-if="state == TransferState.GetAuthorization">
          {{ $t("cart.transferToLego.states.GetAuthorization") }}
        </span>
        <span v-if="state == TransferState.GetCart">
          {{ $t("cart.transferToLego.states.GetCart") }}
        </span>
        <span v-if="state == TransferState.CartNotEmptyRequest">
          {{ $t("cart.transferToLego.states.CartNotEmptyRequest") }}
        </span>
        <span v-if="state == TransferState.ClearCart">
          {{ $t("cart.transferToLego.states.ClearCart") }}
        </span>
        <span v-if="state == TransferState.AddToCart">
          {{ $t("cart.transferToLego.states.AddToCart") }}
        </span>
      </template>
    </n-spin>
    <span v-if="state == TransferState.CartNotEmptyRequest">
      {{
        $t("cart.transferToLego.states.CartNotEmptyRequestText", {
          cartType:
            $props.cartType == "pab"
              ? $t("general.names.pickABrickBestseller")
              : $t("general.names.pickABrickStandard"),
          foundItemQuantityInCart: foundItemQuantityInCart,
        })
      }}
    </span>
    <span v-if="state == TransferState.TransferSuccessful">
      {{ $t("cart.transferToLego.states.TransferSuccessfulText") }}
    </span>
    <span v-if="state == TransferState.Error">
      {{ $t("cart.transferToLego.states.ErrorText") }}
    </span>
    <template
      #footer
      v-if="
        state == TransferState.CartNotEmptyRequest ||
        state == TransferState.TransferSuccessful ||
        state == TransferState.Error
      "
    >
      <n-space justify="end" style="width: 100%">
        <n-button
          v-if="state == TransferState.TransferSuccessful"
          type="primary"
          @click="show = false"
          ghost
        >
          {{ $t("cart.transferToLego.states.TransferSuccessfulCloseButton") }}
        </n-button>
        <n-button
          v-if="state == TransferState.CartNotEmptyRequest"
          type="primary"
          @click="clearCart"
          ghost
        >
          {{
            $t("cart.transferToLego.states.CartNotEmptyRequestClearCartButton")
          }}
        </n-button>
        <n-button
          v-if="state == TransferState.CartNotEmptyRequest"
          type="warning"
          @click="addItemsToCart"
          ghost
        >
          {{
            $t("cart.transferToLego.states.CartNotEmptyRequestAddToCartButton")
          }}
        </n-button>
        <n-button
          v-if="state == TransferState.Error"
          type="error"
          @click="show = false"
          ghost
        >
          {{ $t("cart.transferToLego.states.ErrorTextCloseButton") }}
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import {
  BackgroundRequest,
  BackgroundRequestAction,
  BackgroundResponse,
  BackgroundResponseAction,
  IPartsList,
} from "@/types/types";
import browser from "webextension-polyfill";
import {
  AddToElementCartResponse,
  ElementCartQueryResponse,
} from "@/types/api-types";
import { sleep } from "@/utilities/general/sleep";
import { settingsStore } from "@/store/settings-store";

enum TransferState {
  Loading = 0,
  WaitingForLego = 1,
  GetAuthorization = 2,
  GetCart = 3,
  CartNotEmptyRequest = 4,
  ClearCart = 5,
  AddToCart = 6,
  TransferSuccessful = 7,
  Error = 99,
}

export default defineComponent({
  name: "TransferToLegoModal",
  props: {
    showModal: { type: Boolean, required: true },
    partsList: { type: Object, required: true },
    cartType: { type: String, required: true },
  },
  emits: ["update:showModal"],
  setup(prop, { emit }) {
    const show = ref(prop.showModal);
    const state = ref(0);
    const foundItemQuantityInCart = ref(0);
    let authorization = "";
    const location = `${settingsStore
      .getState()
      .language.toLowerCase()}-${settingsStore
      .getState()
      .country.toUpperCase()}`;

    const messageHandler = async (response: BackgroundResponse) => {
      console.log(response);

      switch (response.action) {
        case BackgroundResponseAction.Lego: {
          state.value = TransferState.WaitingForLego;
          await sleep(500);
          const authorizationRequest: BackgroundRequest = {
            action: BackgroundRequestAction.GetAuthorization,
            request: undefined,
          };

          authorization = await browser.runtime.sendMessage(
            authorizationRequest
          );
          if (!authorization) {
            state.value = TransferState.Error;
            return;
          }
          checkCart();
        }
      }

      return;
    };

    const checkCart = async () => {
      state.value = TransferState.GetCart;
      await sleep(500);

      const cartRequest: BackgroundRequest = {
        action: BackgroundRequestAction.GetCart,
        request: {
          authorization: authorization,
          cartType: prop.cartType,
          location: location,
        },
      };

      const elementCartQueryResponse = (await browser.runtime.sendMessage(
        cartRequest
      )) as ElementCartQueryResponse;

      if (elementCartQueryResponse.errors) {
        state.value = TransferState.Error;
        return;
      }

      if (
        elementCartQueryResponse.data.me.elementCarts.carts.length > 0 &&
        elementCartQueryResponse.data.me.elementCarts.carts[0].PABLineItems
          .length > 0
      ) {
        foundItemQuantityInCart.value =
          elementCartQueryResponse.data.me.elementCarts.carts[0].PABLineItems.length;
        state.value = TransferState.CartNotEmptyRequest;
      } else {
        addItemsToCart();
      }
    };

    const clearCart = async () => {
      state.value = TransferState.ClearCart;
      await sleep(500);

      const removeAllElementsRequest: BackgroundRequest = {
        action: BackgroundRequestAction.ClearCart,
        request: {
          authorization: authorization,
          cartType: prop.cartType,
          location: location,
        },
      };

      const AddToCartResponse = (await browser.runtime.sendMessage(
        removeAllElementsRequest
      )) as AddToElementCartResponse;

      if (AddToCartResponse.errors) {
        state.value = 99;
      } else {
        addItemsToCart();
      }
    };

    const addItemsToCart = async () => {
      state.value = TransferState.AddToCart;
      await sleep(500);

      const addToCartRequest: BackgroundRequest = {
        action: BackgroundRequestAction.AddToCart,
        request: {
          items: (prop.partsList as IPartsList).parts
            .slice(0, 170)
            //.slice(0, 178)
            .map((part) => ({
              sku: part.detail.lego.id,
              quantity: 1,
            })),
          authorization: authorization,
          cartType: prop.cartType,
          location: location,
        },
      };

      const AddToCartResponse = (await browser.runtime.sendMessage(
        addToCartRequest
      )) as AddToElementCartResponse;

      if (AddToCartResponse.errors) {
        state.value = TransferState.Error;
        return;
      }
      state.value = TransferState.TransferSuccessful;
      const request: BackgroundRequest = {
        action: BackgroundRequestAction.GoToPaB,
        request: {
          location: location,
        },
      };

      await browser.runtime.sendMessage(request);
    };

    watch(
      () => prop.showModal,
      () => {
        show.value = prop.showModal;
      }
    );

    watch(
      () => show.value,
      async () => {
        emit("update:showModal", show.value);
        if (show.value) {
          state.value = 1;
          await sleep(500);
          browser.runtime.onMessage.addListener(messageHandler);

          const request: BackgroundRequest = {
            action: BackgroundRequestAction.GetLegoTabId,
            request: {
              location: location,
            },
          };

          await browser.runtime.sendMessage(request);
        } else {
          browser.runtime.onMessage.removeListener(messageHandler);
        }
      }
    );

    return {
      show,
      state,
      foundItemQuantityInCart,
      clearCart,
      addItemsToCart,
      TransferState: TransferState,
    };
  },
});
</script>
