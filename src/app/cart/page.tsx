import { CartItems } from "@/types/cart";
import CartClient from "./CartClient";

export const getCartFromServer = (): CartItems[] => {
	// call your internal API or DB here, e.g.
	// const res = await fetch(`api/cart`, { headers: {...} })
	// return res.json();
	// For now: return [] as placeholder
	return [];
};

const Cart = async () => {
	const serverCart = getCartFromServer();
	return <CartClient initialCart={serverCart} />;
};

export default Cart;
