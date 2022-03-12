export class FileImport {
  public static async fileToString(fileName: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onload = (e) => {
        let loadedString = "";
        if (fileReader?.result) loadedString = fileReader?.result?.toString();
        resolve(loadedString);
      };
      fileReader.onerror = reject;
      fileReader.readAsText(fileName);
    });
  }
}

export async function fileToString(fileName: File): Promise<string> {
  return FileImport.fileToString(fileName);
}
