// import { reactive, readonly, watch, ref, Ref } from 'vue';
import { fileToString } from "./file-import";
import { XMLParser } from "fast-xml-parser";
import { BrickLinkItemModel } from "@/types/api-types";

interface WantedList {
  ITEMTYPE: unknown;
  ITEMID: unknown;
  COLOR: unknown;
  MAXPRICE: unknown;
  MINQTY: unknown;
  QTYFILLED: unknown;
  CONDITION: unknown;
  REMARKS: unknown;
  NOTIFY: unknown;
}

export class ImportBrickLink {
  public async parseFileToObject(
    fileName: File
  ): Promise<BrickLinkItemModel[]> {
    const xml = await fileToString(fileName);
    return this.parseXmlToObject(xml);
  }

  public parseXmlToObject(xml: string): Promise<BrickLinkItemModel[]> {
    return new Promise((resolve, reject) => {
      const parser = new XMLParser();
      const jObj = parser.parse(xml);

      const wantedList: BrickLinkItemModel[] = [];

      if (!jObj?.INVENTORY?.ITEM) resolve(wantedList);

      try {
        jObj.INVENTORY.ITEM.forEach((item: WantedList) => {
          const itemModel: BrickLinkItemModel = {
            itemType: item.ITEMTYPE as string,
            itemId: item.ITEMID as string,
            color: item.COLOR as number | undefined,
            maxPrice: item.MAXPRICE as number | undefined,
            minQty: item.MINQTY as number | undefined,
            qtyFilled: item.QTYFILLED as number | undefined,
            condition: item.CONDITION as string | undefined,
            remarks: item.REMARKS as string | undefined,
            notify: item.NOTIFY as string | undefined,
          };

          wantedList.push(itemModel);
        });
      } catch (error) {
        reject(error);
      }

      resolve(wantedList);
    });
  }
}
