import CartItem from "../components/CartItem.js";
import { URL } from "../constants.js";
import { getLocalStorage, getSingleProductData } from "../helpers.js";

if (URL.includes("cart")) {
  try {
    const cart = getLocalStorage("cart");
    const cartContainer = document.querySelector("#cart__items");
    console.log("cart: ", cart);
    for (const item of cart) {
      if (item.id) {
        const relatedItem = await getSingleProductData(item.id);
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
          relatedItem,
        });
        cartContainer.append(cartItem);
      }
    }
    // cart.forEach((item) => {
    //   const cartItem = CartItem({
    //     classes: {
    //       root: "cart__item",
    //       image: "cart__item__img",
    //       content: "cart__item__content",
    //       description: "cart__item__content__description",
    //       settings: "cart__item__content__settings",
    //       settingsQuantity: "cart__item__content__settings__quantity",
    //       quantity: "itemQuantity",
    //       settingsDelete: "cart__item__content__settings__delete",
    //       deleteButton: "deleteItem",
    //     },
    //     item,
    //   });
    //   cartContainer.append(cartItem);
    // });
  } catch (error) {
    console.error(error);
  }
}
