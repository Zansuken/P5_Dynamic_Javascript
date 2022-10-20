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

// Generate/update the updateCartIcon component.
// Steps:
// 1. Checks if we're not on the cart.js page.
// 2. Get all the products data from the API.
// 3. Get the cart from the local storage.
// 4. Checks if the cart exists.
// 5. Extracts the total
// 6. Builds the top right icon depending on how many products are in the cart.
// 7. Switch from the icon to the detailed view.
// 8. Switch from the detailed to the icon view.

export const updateCartIcon = async () => {
  // 1.
  if (!URL.includes("cart")) {
    try {
      // 2.
      const products = await getProductsData();
      // 3.
      const cart = getLocalStorage("cart");
      // 4.
      if (cart) {
        // 5.
        const { totalQuantity } = getCartSummary();

        // 6.
        CartStateIcon(totalQuantity, cart, products);

        // 7.
        cartStateSwitch({
          elementToHide: currentCartStateIconNode(),
          elementToShow: currentCartStateDetailsNode(),
          elementGenerator: CartStateDetails,
          cart: cart,
          products: products,
          isDefaultState: true,
        });

        // 8.
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
