import axios from "axios";
import {
  GetPaBPartsRequest,
  GetPaBPartsResponse,
  GetPartsRequest,
  GetPartsResponse,
} from "@/types/api-types";

const apiUrl = "https://brichunter-web-svc.azurewebsites.net";
//const apiUrl = "https://localhost:7141";

export class BrickTwoApi {
  // public static async convert(requestBody: Array<ConvertRequest>): Promise<Array<ConvertResponse>> {
  //     let response = await axios({
  //         method: 'post',
  //         url: "https://brickhunter.bricktwo.net/api/v2/convert.php",
  //         data: requestBody,
  //     });

  //     let resp: Array<ConvertResponse> = response.data.bricks;

  //     console.log("convert", resp);

  //     return resp;
  // }

  public static async getParts(
    requestBody: GetPartsRequest
  ): Promise<GetPartsResponse[]> {
    console.log("getPartsRequest", requestBody);

    const response = await axios({
      method: "post",
      url: apiUrl + "/parts",
      data: requestBody,
    });

    const resp: GetPartsResponse[] = response.data;

    console.log("getParts", resp);

    return resp;
  }

  public static async getPaBParts(
    requestBody: GetPaBPartsRequest
  ): Promise<GetPaBPartsResponse> {
    console.log("getPaBPartsRequest", requestBody);

    const response = await axios({
      method: "post",
      url: apiUrl + "/parts/pab",
      data: requestBody,
    });

    const resp: GetPaBPartsResponse = response.data;

    console.log("getPaBParts", resp);

    return resp;
  }
}
