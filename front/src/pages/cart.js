import CartList from "../components/CartList.js";
import { cartContainerNode, URL } from "../constants.js";
import {
  finishLoading,
  getLocalStorage,
  getProductsData,
  startLoading,
} from "../helpers.js";

if (URL.includes("cart")) {
  try {
    startLoading(cartContainerNode(), true);

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
