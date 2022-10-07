import {
  CartStateDetails,
  CartStateIcon,
  currentCartStateDetailsNode,
  currentCartStateIconNode,
  URL,
} from "../constants.js";
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
      if (cart) {
        CartStateIcon(cart.length, cart, products);

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
