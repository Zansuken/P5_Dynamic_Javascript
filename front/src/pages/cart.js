import CartItem from "../components/CartItem.js";
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
      cart.forEach((item) => {
        if (item.id) {
          const cartItem = CartItem({
            classes: {
              root: "cart__item",
              image: "cart__item__img",
              content: "cart__item__content",
              description: "cart__item__content__description",
              settings: "cart__item__content__settings",
              settingsQuantity: "cart__item__content__settings__quantity",
              quantity: "itemQuantity",
              settingsDelete: "cart__item__content__settings__delete",
              deleteButton: "deleteItem",
            },
            itemId: item.id,
            itemColor: item.color,
            itemQuantity: item.quantity,
            products,
          });
          cartContainer.append(cartItem);
        }
      });
    }
    finishLoading();
  } catch (error) {
    console.error(error);
  }
}
