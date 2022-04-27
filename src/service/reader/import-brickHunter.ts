import { BrickHunterV1ListModel } from "@/types/api-types";

export class ImportBrickHunter {
  public parseJsonToObject(
    fileString: string
  ): BrickHunterV1ListModel | undefined {
    let fileContent = JSON.parse(fileString);

    if (!Object.prototype.hasOwnProperty.call(fileContent, "id"))
      return undefined;
    if (!Object.prototype.hasOwnProperty.call(fileContent, "name"))
      return undefined;
    if (!Object.prototype.hasOwnProperty.call(fileContent, "cart"))
      return undefined;
    if (!Object.prototype.hasOwnProperty.call(fileContent, "date"))
      return undefined;
    if (!Object.prototype.hasOwnProperty.call(fileContent, "source"))
      return undefined;
    if (!Object.prototype.hasOwnProperty.call(fileContent, "positions"))
      return undefined;

    fileContent = fileContent as BrickHunterV1ListModel;
    if (!fileContent.version) fileContent.version = "1.0";

    (fileContent as BrickHunterV1ListModel).positions.map((pos) => {
      pos.designId = pos.designId.toString();
      pos.itemNumber = pos.itemNumber
        ? parseInt(pos.itemNumber as unknown as string)
        : undefined;
    });

    return fileContent;
  }
}
