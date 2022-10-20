import CartItem from "../components/CartItem.js";
import {
  cartContainerNode,
  globalTotalPriceNode,
  globalTotalQuantityNode,
} from "../constants.js";
import { formatToEuro } from "../helpers/other.js";
import { getCartSummary } from "../helpers/requests.js";

const CartList = (props = { cart, products }) => {
  const { cart, products } = props;

  if (!cart) {
    return;
  }

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
        itemPrice: item.price,
        products,
        cart,
      });
      cartContainerNode().append(cartItem);
    }
  });

  const { totalQuantity, totalPrice } = getCartSummary();

  globalTotalPriceNode().innerText = formatToEuro(totalPrice);
  globalTotalQuantityNode().innerText = totalQuantity;
};

export default CartList;
