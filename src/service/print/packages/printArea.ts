import { App } from "vue";
import axios from "axios";

export default class {
  standards: { strict: string; loose: string; html5: string };
  previewBody: HTMLDivElement | null;
  close: HTMLDivElement | null;
  previewBodyUtilPrintBtn: HTMLDivElement | null;
  selectArray: never[];
  counter: number;
  settings: {
    id?: string;
    ids?: string;
    vue?: App;
    url?: string;
    standard: string;
    extraHead?: string;
    extraCss?: string;
    zIndex?: number;
    previewTitle?: string;
    previewPrintBtnLabel?: string;
    popTitle?: string;
    preview?: boolean;
    asyncUrl?: any;
    elsdom?: unknown;
    previewBeforeOpenCallback?(): void;
    previewOpenCallback?(): void;
    openCallback?(): void;
    closeCallback?(): void;
    beforeOpenCallback?(): void;
  };
  elsdom: any;

  constructor(option: any) {
    this.standards = {
      strict: "strict",
      loose: "loose",
      html5: "html5",
    };
    this.previewBody = null;
    this.close = null;
    this.previewBodyUtilPrintBtn = null;
    this.selectArray = []; // select Store
    this.counter = 0;
    this.settings = {
      standard: this.standards.html5,
    };
    Object.assign(this.settings, option);
    this.init();
  }
  init() {
    this.counter++;
    this.settings.id = `printArea_${this.counter}`;
    let url = "";
    if (this.settings.url && !this.settings.asyncUrl) {
      url = this.settings.url;
    }

    // if it is asynchronous
    if (this.settings.asyncUrl) {
      this.settings.asyncUrl(async (url: string) => {
        const PrintAreaWindow = this.getPrintWindow(url); // create an iframe
        PrintAreaWindow.doc = await axios(url);
        if (this.settings.preview) {
          //  open the preview pop-up
          this.previewIfrmaeLoad();
        } else {
          // print directly
          this.print(PrintAreaWindow);
        }
      }, this.settings.vue);
      return;
    }
    const PrintAreaWindow = this.getPrintWindow(url); // create an iframe

    if (!this.settings.url) {
      this.write(PrintAreaWindow.doc); // Write content
    }

    if (this.settings.preview) {
      // open the preview pop-up
      this.previewIfrmaeLoad();
    } else {
      // print directly
      this.print(PrintAreaWindow);
    }
  }
  addEvent(element: any, type: any, callback: any) {
    if (element.addEventListener) {
      element.addEventListener(type, callback, false);
    } else if (element.attachEvent) {
      element.attachEvent("on" + type, callback);
    } else {
      element["on" + type] = callback;
    }
  }
  previewIfrmaeLoad() {
    const box = document.getElementById("vue-pirnt-nb-previewBox");

    if (box) {
      const iframe = box.querySelector("iframe");

      if (this.settings.previewBeforeOpenCallback)
        this.settings.previewBeforeOpenCallback();

      this.addEvent(iframe, "load", () => {
        this.previewBoxShow();
        this.removeCanvasImg();
        if (this.settings.previewOpenCallback)
          this.settings.previewOpenCallback();
      });

      this.addEvent(
        box.querySelector(".previewBodyUtilPrintBtn"),
        "click",
        () => {
          if (this.settings.beforeOpenCallback)
            this.settings.beforeOpenCallback();
          if (this.settings.openCallback) this.settings.openCallback();
          iframe?.contentWindow?.print();
          if (this.settings.closeCallback) this.settings.closeCallback();
        }
      );
    }
  }

  // delete all canvas converted pictures
  removeCanvasImg() {
    try {
      if (this.elsdom) {
        // remove the dom node of the canvas transformation picture
        const canvasList = this.elsdom.querySelectorAll(".canvasImg");
        for (let i = 0; i < canvasList.length; i++) {
          canvasList[i].remove();
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  print(ifrmae: any) {
    if (!this.settings.id) return;
    const iframe = document.getElementById(this.settings.id) || ifrmae.f;
    const iframeWin = iframe.contentWindow;

    const _loaded = () => {
      if (iframeWin) iframeWin.focus();
      if (this.settings.openCallback) this.settings.openCallback();
      if (iframeWin) iframeWin.print();
      iframe.remove(); // deletes the ifrmae element
      if (this.settings.closeCallback) this.settings.closeCallback();
      this.removeCanvasImg();
    };
    if (this.settings.beforeOpenCallback) this.settings.beforeOpenCallback();

    this.addEvent(iframe, "load", function () {
      _loaded();
    });
  }
  write(PADocument: any) {
    PADocument.open();
    PADocument.write(
      `${this.docType()}<html>${this.getHead()}${this.getBody()}</html>`
    );
    PADocument.close();
  }
  docType() {
    if (this.settings.standard === this.standards.html5) {
      return "<!DOCTYPE html>";
    }
    const transitional =
      this.settings.standard === this.standards.loose ? " Transitional" : "";
    const dtd =
      this.settings.standard === this.standards.loose ? "loose" : "strict";

    return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01${transitional}//EN" "http://www.w3.org/TR/html4/${dtd}.dtd">`;
  }
  getHead() {
    let extraHead = "";
    let links = "";
    let style = "";
    if (this.settings.extraHead) {
      this.settings.extraHead.replace(/([^,]+)/g, (m): string => {
        return (extraHead += m);
      });
    }
    // copy all link tags
    [].forEach.call(document.querySelectorAll("link"), function (item: any) {
      if (item.href.indexOf(".css") >= 0) {
        links += `<link type="text/css" rel="stylesheet" href="${item.href}" >`;
      }
    });
    // loop through the style of the style tag
    const domStyle = document.styleSheets;
    if (domStyle && domStyle.length > 0) {
      for (let i = 0; i < domStyle.length; i++) {
        try {
          if (domStyle[i].cssRules || domStyle[i].rules) {
            const rules = domStyle[i].cssRules || domStyle[i].rules;
            for (let b = 0; b < rules.length; b++) {
              style += rules[b].cssText;
            }
          }
        } catch (e: any) {
          console.log(domStyle[i]?.href + e);
        }
      }
    }

    if (this.settings.extraCss) {
      this.settings.extraCss.replace(/([^,\s]+)/g, (m): string => {
        return (links += `<link type="text/css" rel="stylesheet" href="${m}">`);
      });
    }

    return `<head><title>${this.settings.popTitle}</title>${extraHead}${links}<style type="text/css">${style}</style></head>`;
  }

  getBody() {
    let ids = this.settings.ids;
    ids = ids?.replace(new RegExp("#", "g"), "") || "";
    this.elsdom = this.beforeHanler(document.getElementById(ids));
    const ele = this.getFormData(this.elsdom);
    const htm = ele.outerHTML;
    return "<body>" + htm + "</body>";
  }
  // process canva into images
  beforeHanler(elsdom: any) {
    const canvasList = elsdom.querySelectorAll("canvas");
    // canvas converts png images
    for (let i = 0; i < canvasList.length; i++) {
      if (!canvasList[i].style.display) {
        const _parent = canvasList[i].parentNode;
        const _canvasUrl = canvasList[i].toDataURL("image/png");
        const _img = new Image();
        _img.className = "canvasImg";
        _img.style.display = "none";
        _img.src = _canvasUrl;
        _parent.appendChild(_img);
      }
    }
    return elsdom;
  }
  // process the form according to the type
  getFormData(ele: any) {
    const copy = ele.cloneNode(true);
    const copiedInputs = copy.querySelectorAll("input,select,textarea");
    const canvasImgList = copy.querySelectorAll(".canvasImg,canvas");
    let selectCount = -1;
    // handle all canvas
    for (let i = 0; i < canvasImgList.length; i++) {
      const _parent = canvasImgList[i].parentNode;
      const item = canvasImgList[i];
      // delete the cloned canvas node
      if (item.tagName.toLowerCase() === "canvas") {
        _parent.removeChild(item);
      } else {
        item.style.display = "block";
      }
    }
    // all input boxes are processed
    for (let i = 0; i < copiedInputs.length; i++) {
      const item = copiedInputs[i];
      let typeInput = item.getAttribute("type");
      const copiedInput = copiedInputs[i];
      // get the select tag
      if (!typeInput) {
        typeInput =
          item.tagName === "SELECT"
            ? "select"
            : item.tagName === "TEXTAREA"
            ? "textarea"
            : "";
      }
      // handle the input box
      if (item.tagName === "INPUT") {
        // in addition to single-choice boxes, multi-check boxes are more special
        if (typeInput === "radio" || typeInput === "checkbox") {
          if (item.checked) {
            copiedInput.setAttribute("checked", item.checked);
          }
        } else {
          copiedInput.value = item.value;
          copiedInput.setAttribute("value", item.value);
        }
        // process select
      } else if (typeInput === "select") {
        selectCount++;
        for (let b = 0; b < ele.querySelectorAll("select").length; b++) {
          const select = ele.querySelectorAll("select")[b]; // Gets each select of the original layer
          !select.getAttribute("newbs") && select.setAttribute("newbs", b); // add an identity
          if (select.getAttribute("newbs") == selectCount) {
            const opSelectedIndex =
              ele.querySelectorAll("select")[selectCount].selectedIndex;
            item.options[opSelectedIndex].setAttribute("selected", true);
          }
        }
        // handle textarea
      } else {
        copiedInput.innerHTML = item.value;
        copiedInput.setAttribute("html", item.value);
      }
    }

    return copy;
  }
  getPrintWindow(url: string) {
    const f = this.Iframe(url) as any;
    return {
      f: f,
      win: f.contentWindow || f,
      doc: f.doc,
    };
  }
  previewBoxShow() {
    const box = document.getElementById("vue-pirnt-nb-previewBox");
    if (box) {
      document.querySelector("html")?.setAttribute("style", "overflow: hidden");
      box.style.display = "block";
    }
  }
  previewBoxHide() {
    const box = document.getElementById("vue-pirnt-nb-previewBox");
    if (box) {
      document
        .querySelector("html")
        ?.setAttribute("style", "overflow: visible;");
      box.querySelector("iframe") && box.querySelector("iframe")?.remove();
      box.style.display = "none";
    }
  }
  previewBox() {
    const box = document.getElementById("vue-pirnt-nb-previewBox");
    const previewBodyClass = "previewBody";
    if (box) {
      box.querySelector("iframe") && box.querySelector("iframe")?.remove();
      return {
        close: box.querySelector(".previewClose"),
        previewBody: box.querySelector(`.${previewBodyClass}`),
      };
    }
    const previewContent = document.createElement("div");
    previewContent.setAttribute("id", "vue-pirnt-nb-previewBox");
    previewContent.setAttribute(
      "style",
      "position: fixed;top: 0px;left: 0px;width: 100%;height: 100%;background: white;display:none"
    );
    previewContent.style.zIndex = this.settings.zIndex?.toString() || "2";
    // print preview pop-up for the header
    const previewHeader = document.createElement("div");
    previewHeader.setAttribute("class", "previewHeader");
    previewHeader.setAttribute("style", "padding: 5px 20px;");
    previewHeader.innerHTML = this.settings.previewTitle || "";
    previewContent.appendChild(previewHeader);
    // close button
    this.close = document.createElement("div");
    const close = this.close;
    close.setAttribute("class", "previewClose");
    close.setAttribute(
      "style",
      "position: absolute;top: 5px;right: 20px;width: 25px;height: 20px;cursor: pointer;"
    );
    const closeBefore = document.createElement("div");
    const closeAfter = document.createElement("div");
    closeBefore.setAttribute("class", "closeBefore");
    closeBefore.setAttribute(
      "style",
      "position: absolute;width: 3px;height: 100%;background: #040404;transform: rotate(45deg); top: 0px;left: 50%;"
    );
    closeAfter.setAttribute("class", "closeAfter");
    closeAfter.setAttribute(
      "style",
      "position: absolute;width: 3px;height: 100%;background: #040404;transform: rotate(-45deg); top: 0px;left: 50%;"
    );
    close.appendChild(closeBefore);
    close.appendChild(closeAfter);
    previewHeader.appendChild(close);

    // print preview pop-up for the body
    this.previewBody = document.createElement("div");
    const previewBody = this.previewBody;
    previewBody.setAttribute("class", previewBodyClass);
    previewBody.setAttribute(
      "style",
      "display: flex;flex-direction: column; height: 100%;"
    );
    previewContent.appendChild(previewBody);
    // print preview pop-up in the body toolbar
    const previewBodyUtil = document.createElement("div");
    previewBodyUtil.setAttribute("class", "previewBodyUtil");
    previewBodyUtil.setAttribute(
      "style",
      "height: 32px;background: #474747;position: relative;"
    );
    previewBody.appendChild(previewBodyUtil);
    // print button
    this.previewBodyUtilPrintBtn = document.createElement("div");
    const previewBodyUtilPrintBtn = this.previewBodyUtilPrintBtn;
    previewBodyUtilPrintBtn.setAttribute("class", "previewBodyUtilPrintBtn");
    previewBodyUtilPrintBtn.innerHTML =
      this.settings.previewPrintBtnLabel || "";
    previewBodyUtilPrintBtn.setAttribute(
      "style",
      "position: absolute;padding: 2px 10px;margin-top: 3px;left: 24px;font-size: 14px;color: white;cursor: pointer;background-color: rgba(0,0,0,.12);background-image: linear-gradient(hsla(0,0%,100%,.05),hsla(0,0%,100%,0));background-clip: padding-box;border: 1px solid rgba(0,0,0,.35);border-color: rgba(0,0,0,.32) rgba(0,0,0,.38) rgba(0,0,0,.42);box-shadow: inset 0 1px 0 hsla(0,0%,100%,.05), inset 0 0 1px hsla(0,0%,100%,.15), 0 1px 0 hsla(0,0%,100%,.05);"
    );
    previewBodyUtil.appendChild(previewBodyUtilPrintBtn);

    // add the entire preview to the body
    document.body.appendChild(previewContent);

    return {
      close: this.close,
      previewBody: this.previewBody,
    };
  }
  iframeBox(frameId: string, url: string) {
    const iframe = document.createElement("iframe");
    iframe.style.border = "0px";
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.right = "0px";
    iframe.style.top = "0px";
    iframe.setAttribute("id", frameId);
    iframe.setAttribute("src", url);

    return iframe;
  }
  Iframe(url: string | number) {
    const frameId = this.settings.id || "";
    // local print does the url of ifrmae with the current time
    url = !url ? new Date().getTime() : url;

    const iframe = this.iframeBox(frameId, url.toString()) as any;

    // let that = this
    try {
      // print directly without preview
      if (!this.settings.preview) {
        document.body.appendChild(iframe);
      } else {
        iframe.setAttribute("style", "border: 0px;flex: 1;");
        // preview printing
        const previewBox = this.previewBox();
        const previewBody = previewBox.previewBody;
        const close = previewBox.close;
        // add ifrmae to the preview pop-up
        previewBody?.appendChild(iframe);

        this.addEvent(close, "click", () => {
          this.previewBoxHide();
        });
      }

      iframe.doc = "";
      iframe.doc = iframe.contentDocument
        ? iframe.contentDocument
        : iframe.contentWindow
        ? iframe.contentWindow.document
        : iframe.document;
    } catch (e) {
      throw new Error(e + ". iframes may not be supported in this browser.");
    }
    if (iframe.doc == null) {
      throw new Error("Cannot find document.");
    }

    return iframe;
  }
}
