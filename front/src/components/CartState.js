import {
  currentCartStateDetailsNode,
  currentCartStateIconNode,
  URL,
} from "../constants.js";
import { CartStateDetails, CartStateIcon } from "../customComponents.js";
import {
  cartStateSwitch,
  getCartSummary,
  getLocalStorage,
  getProductsData,
} from "../helpers.js";

export const updateCartIcon = async () => {
  if (!URL.includes("cart")) {
    try {
      const products = await getProductsData();
      const cart = getLocalStorage("cart");
      if (cart) {
        const { totalQuantity } = getCartSummary();

        CartStateIcon(totalQuantity, cart, products);

        cartStateSwitch({
          elementToHide: currentCartStateIconNode(),
          elementToShow: currentCartStateDetailsNode(),
          elementGenerator: CartStateDetails,
          cart: cart,
          products: products,
          isDefaultState: true,
        });

        cartStateSwitch({
          elementToHide: currentCartStateDetailsNode(),
          elementToShow: currentCartStateIconNode(),
          elementGenerator: CartStateIcon,
          cart: cart,
          products: products,
          isDefaultState: false,
        });
      }
    } catch (error) {
      console.error(error.message);
    }
  }
};
