type GetProductsParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "price" | "title" | "itemRating" | "createdAt";
  sortOrder?: "asc" | "desc";
};

export const getProducts = async (params?: GetProductsParams) => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.set("page", params.page.toString());
  if (params?.limit) queryParams.set("limit", params.limit.toString());
  if (params?.search) queryParams.set("search", params.search);
  if (params?.sortBy) queryParams.set("sortBy", params.sortBy);
  if (params?.sortOrder) queryParams.set("sortOrder", params.sortOrder);

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
