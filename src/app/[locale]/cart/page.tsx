import CartClient from "./CartClient";
import { rootContainer } from "@/backend/config/container";
import UserController from "@/backend/features/user/user.controller";
import { getCurrentUser } from "@/backend/utils/authHelper";
import CartHero from "@/components/layout/cart/CartHero";
import { IProductCart } from "@/types/ProductType";

const getCartFromServer = async (): Promise<{
  success: boolean;
  items: IProductCart[];
}> => {
  // call your internal API or DB here, e.g.
  // const res = await fetch(`api/cart`, { headers: {...} })
  // return res.json();
  // For now: return [] as placeholder
  const user = await getCurrentUser();
  if (!user) return { success: true, items: [] };
  const data = await rootContainer.resolve(UserController).getUserCart(user.id);
  return data;
};

const Cart = async () => {
  const serverCart = await getCartFromServer();
  return (
    <>
      <CartHero />
      <CartClient initialCart={serverCart.items} />
    </>
  );
};

export default Cart;
