/*
 * @Author: lee
 * @Date: 2021-05-10 11:45:50
 * @LastEditors: lee
 * @LastEditTime: 2021-05-20 15:41:51
 * @Description: file content
 */

import Print from "./printArea";
/**
 * @file printed
 * directive 'v-print', which prints the entire window by default
 * enter the parameter `v-print="'#id'"` to identify the box that needs to be printed locally.
 */
const addEvent = (
  element: Element,
  type: string,
  callback: EventListenerOrEventListenerObject
) => {
  element.addEventListener(type, callback, false);
  // if (element.addEventListener) {
  //   element.addEventListener(type, callback, false);
  // } else if (element.attachEvent) {
  //   element.attachEvent("on" + type, callback);
  // } else {
  //   element["on" + type] = callback;
  // }
};
export default {
  directiveName: "print",
  mounted(el: Element, binding: any) {
    const vue = binding.instance;
    let id = "";

    addEvent(el, "click", () => {
      if (typeof binding.value === "string") {
        // global printing
        id = binding.value;
      } else if (typeof binding.value === "object" && !!binding.value.id) {
        // local printing
        id = binding.value.id;
        const ids = id.replace(new RegExp("#", "g"), "");
        const elsdom = document.getElementById(ids);
        if (!elsdom) console.log("id in Error"), (id = "");
      } else {
        window.print();
        return;
      }
      localPrint();
    });
    const localPrint = () => {
      new Print({
        ids: id, // * local print must pass in id
        vue,
        url: binding.value.url, // prints the specified url, which cannot coexist with id if the priority of coexistence id will be higher
        standard: "", // document type, default is html5, optional html5, loose, strict
        extraHead: binding.value.extraHead, // an extra tag attached to the head tag, separated by commas
        extraCss: binding.value.extraCss, // extra css connections, multiple commas separated
        zIndex: binding.value.zIndex || 20002, // z-index of preview window
        previewTitle: binding.value.previewTitle || "BrickHunter Print Preview", // title of the print preview
        previewPrintBtnLabel: binding.value.previewPrintBtnLabel || "Print me", // title of the print preview
        popTitle: binding.value.popTitle, // the title of the title
        preview: binding.value.preview || false, // whether to start preview mode
        asyncUrl: binding.value.asyncUrl,
        previewBeforeOpenCallback() {
          // Callback before the preview window opens
          binding.value.previewBeforeOpenCallback &&
            binding.value.previewBeforeOpenCallback(vue);
        },
        previewOpenCallback() {
          // Callback after the preview window opens
          binding.value.previewOpenCallback &&
            binding.value.previewOpenCallback(vue);
        },
        openCallback() {
          // callback event after printing
          binding.value.openCallback && binding.value.openCallback(vue);
        },
        closeCallback() {
          binding.value.closeCallback && binding.value.closeCallback(vue);
        },
        beforeOpenCallback() {
          binding.value.beforeOpenCallback &&
            binding.value.beforeOpenCallback(vue);
        },
      });
    };
  },
};
