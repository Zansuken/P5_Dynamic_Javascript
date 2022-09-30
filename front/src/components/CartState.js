import { CartStateDetails, CartStateIcon, URL } from "../constants.js";
import {
  cartStateSwitch,
  getLocalStorage,
  getProductsData,
} from "../helpers.js";

export const updateCartIcon = async () => {
  if (!URL.includes("cart")) {
    try {
      const products = await getProductsData();
      const cart = getLocalStorage("cart");
      CartStateIcon(cart.length, cart, products);

      const cartStateElement = document.querySelector("#cartState");
      const cartStateDetailsElement =
        document.querySelector("#cartStateDetails");

      cartStateSwitch({
        elementToHide: cartStateElement,
        elementToShow: cartStateDetailsElement,
        elementGenerator: CartStateDetails,
        cart: cart,
        products: products,
        isDefaultState: true,
      });

      cartStateSwitch({
        elementToHide: cartStateDetailsElement,
        elementToShow: cartStateElement,
        elementGenerator: CartStateIcon,
        cart: cart,
        products: products,
        isDefaultState: false,
      });
    } catch (error) {
      console.error(error.message);
    }
  }
};
