export const getProducts = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
}