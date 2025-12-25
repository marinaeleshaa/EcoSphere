type GetProductsParams = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  category?: string;
};

export const getProducts = async (params?: GetProductsParams) => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.set("page", params.page.toString());
  if (params?.limit) queryParams.set("limit", params.limit.toString());
  if (params?.search) queryParams.set("search", params.search);
  if (params?.sort) queryParams.set("sort", params.sort);
  if (params?.category) queryParams.set("category", params.category);

  const queryString = queryParams.toString();
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/products${
    queryString ? `?${queryString}` : ""
  }`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};
