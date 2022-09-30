import CartList from "../components/CartList.js";
import { URL } from "../constants.js";
import {
  finishLoading,
  getLocalStorage,
  getProductsData,
  startLoading,
} from "../helpers.js";

if (URL.includes("cart")) {
  const cartContainer = document.querySelector("#cart__items");
  try {
    startLoading(cartContainer, true);

    const cart = getLocalStorage("cart");
    const products = await getProductsData();

    if (cart) {
      CartList({ cart, products });
    }
    finishLoading();
  } catch (error) {
    console.error(error);
  }
}
