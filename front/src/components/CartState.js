import { CartStateDetails, CartStateIcon } from "../constants.js";
import { getLocalStorage, getProductsData } from "../helpers.js";

const cart = getLocalStorage("cart");

if (cart) {
  const products = await getProductsData();
  CartStateIcon(cart.length, cart, products);

  const cartStateElement = document.querySelector("#cartState");

  cartStateElement.addEventListener("click", () => {
    cartStateElement.remove();

    CartStateDetails(cart, products);
  });
}
