import {
  GetPaBFindPartsRequest,
  GetPaBFindPartsResponse,
} from "@/types/api-types";

export class LegoApi {
  public static async getPaBParts(
    request: GetPaBFindPartsRequest
  ): Promise<GetPaBFindPartsResponse> {
    console.log("getPaBParts request", request);

    const PickABrickQuery = {
      operationName: "PickABrickQuery",
      variables: {
        page: request.page,
        perPage: request.perPage,
        includeOutOfStock: true,
        query: request.query,
        sort: {
          key: "RELEVANCE",
          direction: "ASC",
        },
      },
      query:
        "query PickABrickQuery($query: String, $page: Int, $perPage: Int, $sort: SortInput, $filters: [Filter!]) {            \n  __typename            \n  elements(query: $query, page: $page, perPage: $perPage, filters: $filters, sort: $sort) {            \n    count            \n    total            \n    results {            \n      ...ElementLeafData            \n    }            \n  }            \n}            \n            \nfragment ElementLeafData on Element {            \n  inStock            \n  ... on SingleVariantElement {            \n    variant {            \n      ...ElementLeafVariant            \n    }            \n  }            \n}            \n            \nfragment ElementLeafVariant on ElementVariant {            \n  id            \n  price {            \n    currencyCode            \n    formattedValue            \n  }            \n  attributes {            \n	colourId            \n    designNumber            \n    deliveryChannel            \n  }            \n}\n",
    };

    const url = "https://www.lego.com/api/graphql/PickABrickQuery";

    const response = await fetch(url, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "x-locale": request.location,
        "session-cookie-id": "OQk0HvZuZyIT5HsEh3fWd",
      },
      body: JSON.stringify(PickABrickQuery),
    });

    const resp = (await response.json()) as GetPaBFindPartsResponse;

    console.log("getPaBParts response", resp);
    //if (response.status) return response;
    return resp;
  }
}
