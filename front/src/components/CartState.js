import {
  currentCartStateDetailsNode,
  currentCartStateIconNode,
  URL,
} from "../constants.js";
import {
  CartStateDetails,
  CartStateIcon,
} from "./customComponents/customComponents.js";
import { cartStateSwitch } from "../helpers/builders.js";
import {
  getProductsData,
  getCartSummary,
  getLocalStorage,
} from "../helpers/requests.js";

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
