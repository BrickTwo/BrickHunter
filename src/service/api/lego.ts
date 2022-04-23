import {
  PickABrickQueryRequest,
  PickABrickQueryResponse,
  ElementCartQueryRequest,
  ElementCartQueryResponse,
  AddToElementCartRequest,
  AddToElementCartResponse,
  RemoveAllElementsFromCartRequest,
  RemoveAllElementsFromCartResponse,
} from "@/types/api-types";

export class LegoApi {
  public static async pickABrickQuery(
    request: PickABrickQueryRequest
  ): Promise<PickABrickQueryResponse> {
    console.log("pickABrickQuery request", request);

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

    const resp = (await response.json()) as PickABrickQueryResponse;

    console.log("pickABrickQuery response", resp);
    //if (response.status) return response;
    return resp;
  }

  public static async elementCartQuery(
    request: ElementCartQueryRequest
  ): Promise<ElementCartQueryResponse> {
    console.log("elementCartQuery request", request);

    const ElementCartQuery = {
      operationName: "ElementCartQuery",
      variables: {
        cartTypes: [request.cartType],
      },
      query:
        "query ElementCartQuery($cartTypes: [CartType]) {\n  me {\n    ... on LegoUser {\n      elementCarts(types: $cartTypes) {\n        carts {\n          ...BrickCartData\n          type\n        }\n      }\n    }\n  }\n}\n\nfragment BrickCartData on BrickCart {\n  id\n  PABLineItems {\n    ...PABLineItemData\n  }\n}\n\nfragment PABLineItemData on PABCartLineItem {\n  id\n  quantity\n}\n",
    };

    const url = "https://www.lego.com/api/graphql/ElementCartQuery";

    const response = await fetch(url, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "x-locale": request.location,
        authorization: request.authorization,
      },
      body: JSON.stringify(ElementCartQuery),
    });

    const resp = (await response.json()) as ElementCartQueryResponse;

    console.log("elementCartQuery response", resp);
    //if (response.status) return response;
    return resp;
  }

  public static async addToElementCart(
    request: AddToElementCartRequest
  ): Promise<AddToElementCartResponse> {
    console.log("addToElementCart request", request);

    const AddToElementCart = {
      operationName: "AddToElementCart",
      variables: {
        items: request.items,
        cartType: request.cartType,
      },
      query:
        "mutation AddToElementCart($items: [ElementInput!]!, $cartType: CartType) {\n  addToElementCart(input: {items: $items, cartType: $cartType}) {\n    ...BrickCartData\n  }\n}\n\nfragment BrickCartData on BrickCart {\n  id\n}\n",
    };

    const url = "https://www.lego.com/api/graphql/AddToElementCart";

    const response = await fetch(url, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "x-locale": request.location,
        authorization: request.authorization,
      },
      body: JSON.stringify(AddToElementCart),
    });

    const resp = (await response.json()) as AddToElementCartResponse;

    console.log("addToElementCart response", resp);
    //if (response.status) return response;
    return resp;
  }

  public static async removeAllElementsFromCart(
    request: RemoveAllElementsFromCartRequest
  ): Promise<RemoveAllElementsFromCartResponse> {
    console.log("removeAllElementsFromCart request", request);

    const AddToElementCart = {
      operationName: "RemoveAllElementsFromCart",
      variables: {
        cartType: request.cartType,
      },
      query:
        "mutation RemoveAllElementsFromCart($cartType: CartType!) {\n  removeAllElementsFromCart(input: {cartType: $cartType}) {\n    ...BrickCartData\n  }\n}\n\nfragment BrickCartData on BrickCart {\n  id\n}\n",
    };

    const url = "https://www.lego.com/api/graphql/RemoveAllElementsFromCart";

    const response = await fetch(url, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "x-locale": request.location,
        authorization: request.authorization,
      },
      body: JSON.stringify(AddToElementCart),
    });

    const resp = (await response.json()) as RemoveAllElementsFromCartResponse;

    console.log("removeAllElementsFromCart response", resp);
    //if (response.status) return response;
    return resp;
  }
}
